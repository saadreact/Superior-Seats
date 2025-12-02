'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { reclineTypesService } from '@/services/recline-types';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

const EditReclineTypePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [priceTiers, setPriceTiers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    cost: 0,
    price: 0,
    price_tier_ids: [] as number[],
    price_adjustments: {} as Record<string, number>
  });
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [priceOverrideInputs, setPriceOverrideInputs] = useState<Record<number, string>>({});

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    loadReclineType();
    loadPriceTiers();
  }, [id]);

  const loadReclineType = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const reclineType = await reclineTypesService.getReclineType(parseInt(id));
      const priceTierIds = reclineType.price_tiers?.map((tier: any) => tier.id) || [];
      
      // Initialize calculated price tiers from existing data using multiplier logic
      const basePrice = typeof reclineType.price === 'string' ? parseFloat(reclineType.price) : (reclineType.price || 0);
      const initialCalculatedTiers: CalculatedPriceTier[] = reclineType.price_tiers?.map((tier: any) => {
        const multiplier = parseFloat(tier.discount_off_retail_price) || 1;
        const calculatedPrice = Math.round(basePrice * multiplier * 100) / 100;
        const actualPrice = tier.pivot?.price_adjustment ? parseFloat(tier.pivot.price_adjustment) : calculatedPrice;
        const isOverridden = actualPrice !== calculatedPrice;
        
        return {
          id: tier.id,
          name: tier.name,
          display_name: tier.display_name,
          discount_off_retail_price: tier.discount_off_retail_price,
          calculated_price: calculatedPrice,
          discount_amount: 0,
          override_price: isOverridden ? actualPrice : undefined,
          is_overridden: isOverridden
        };
      }) || [];
      
      // Initialize price adjustments from existing data
      const initialPriceAdjustments: Record<string, number> = {};
      initialCalculatedTiers.forEach((tier) => {
        initialPriceAdjustments[tier.id.toString()] = VariantsCalculation.getFinalPrice(tier);
      });
      
      setFormData({
        name: reclineType.name || '',
        description: reclineType.description || '',
        image: null,
        cost: reclineType.cost || 0,
        price: reclineType.price || 0,
        price_tier_ids: priceTierIds,
        price_adjustments: initialPriceAdjustments
      });
      setEnablePriceTiers(priceTierIds.length > 0);
      setCalculatedPriceTiers(initialCalculatedTiers);
      setCurrentImage(reclineType.image);
      
      // Set up price overrides and inputs from calculated tiers
      const priceOverrides: Record<string, number> = {};
      const initialInputs: Record<number, string> = {};
      initialCalculatedTiers.forEach((tier) => {
        if (tier.is_overridden && tier.override_price !== undefined) {
          priceOverrides[tier.id.toString()] = tier.override_price;
          initialInputs[tier.id] = tier.override_price.toFixed(2);
        }
      });
      setPriceOverrides(priceOverrides);
      setPriceOverrideInputs(initialInputs);
    } catch (err: any) {
      setError(err.message || 'Failed to load recline type');
      console.error('Error loading recline type:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadPriceTiers = async () => {
    try {
      const response = await reclineTypesService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err: any) {
      console.error('Error loading price tiers:', err);
    }
  };

  // Automatic price tier calculation
  useEffect(() => {
    if (enablePriceTiers && formData.price > 0 && priceTiers.length > 0) {
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(formData.price, priceTiers, priceOverrides);
      setCalculatedPriceTiers(newCalculatedTiers);
      
      // Update price_adjustments with calculated prices
      const newPriceAdjustments = Object.fromEntries(
        newCalculatedTiers.map(tier => [
          tier.id.toString(), 
          VariantsCalculation.getFinalPrice(tier)
        ])
      );
      setFormData(prev => ({
        ...prev,
        price_tier_ids: newCalculatedTiers.map(tier => tier.id),
        price_adjustments: newPriceAdjustments
      }));

      // Initialize overridePriceInputs for all tiers
      const initialInputs: Record<number, string> = {};
      newCalculatedTiers.forEach(tier => {
        if (tier.is_overridden && tier.override_price !== undefined) {
          initialInputs[tier.id] = tier.override_price.toFixed(2);
        }
      });
      setPriceOverrideInputs(prev => ({ ...prev, ...initialInputs }));
    }
  }, [priceTiers, enablePriceTiers, formData.price, priceOverrides]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceTierChange = (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      price_tier_ids: typeof value === 'string' ? [] : value
    }));
  };

  const handleEnablePriceTiersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setEnablePriceTiers(checked);
    
    // Clear price tiers and adjustments when disabled
    if (!checked) {
      setFormData(prev => ({
        ...prev,
        price_tier_ids: [],
        price_adjustments: {}
      }));
      setCalculatedPriceTiers([]);
      setPriceOverrides({});
      setPriceOverrideInputs({});
    }
  };

  const handlePriceOverrideChange = (tierId: number, overridePrice: number) => {
    setPriceOverrides(prev => ({
      ...prev,
      [tierId.toString()]: overridePrice
    }));
  };

  const handlePriceOverrideInputChange = (tierId: number, value: string) => {
    setPriceOverrideInputs(prev => ({
      ...prev,
      [tierId]: value
    }));
  };

  const handlePriceOverrideBlur = (tierId: number) => {
    const inputValue = priceOverrideInputs[tierId];
    if (inputValue === undefined || inputValue === '') {
      // Clear override if input is empty
      setPriceOverrides(prev => {
        const newOverrides = { ...prev };
        delete newOverrides[tierId.toString()];
        return newOverrides;
      });
      setPriceOverrideInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[tierId];
        return newInputs;
      });
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue) && numValue >= 0) {
        const roundedValue = Math.round(numValue * 100) / 100;
        handlePriceOverrideChange(tierId, roundedValue);
        setPriceOverrideInputs(prev => ({
          ...prev,
          [tierId]: roundedValue.toFixed(2)
        }));
      } else {
        // Reset to calculated price if invalid
        const tier = calculatedPriceTiers.find(t => t.id === tierId);
        if (tier) {
          setPriceOverrideInputs(prev => {
            const newInputs = { ...prev };
            delete newInputs[tierId];
            return newInputs;
          });
          setPriceOverrides(prev => {
            const newOverrides = { ...prev };
            delete newOverrides[tierId.toString()];
            return newOverrides;
          });
        }
      }
    }
  };

  const handleResetPriceTiers = () => {
    setPriceOverrides({});
    setPriceOverrideInputs({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }


    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Only include image if a new one is uploaded
      const submissionData: any = {
        name: formData.name,
        description: formData.description,
        cost: 1, // Fixed cost value as requested
        price: formData.price,
        price_tier_ids: enablePriceTiers && formData.price_tier_ids.length > 0 ? formData.price_tier_ids : [],
        price_adjustments: enablePriceTiers && formData.price_adjustments ? formData.price_adjustments : {}
      };

      // Only add image to submission data if a new image is selected
      if (formData.image) {
        submissionData.image = formData.image;
      }

      console.log('Submitting recline type update data:', submissionData);
      
      await reclineTypesService.updateReclineType(parseInt(id), submissionData);
      setSuccess('Recline Type updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/recline-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update recline type');
      console.error('Error updating recline type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/recline-types');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Recline Type">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Recline Type">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
        </Box>

      

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Basic Information */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter recline type name"
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter description (optional)"
                />
                </Box>

                {/* Pricing Information */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                    Pricing Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <TextField
                  label="In Store Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                  placeholder="Enter shop price"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Box>

                {/* Image Upload */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                    Image
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                <Box>
                  {/* Current Image */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Image:
                      </Typography>
                    {currentImage ? (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-start',
                        gap: 1
                      }}>
                        <Box sx={{ 
                          border: '2px solid #e0e0e0', 
                          borderRadius: 2, 
                          p: 1,
                          backgroundColor: '#fafafa'
                        }}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/${currentImage}`}
                            alt="Current recline type"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                              borderRadius: '8px',
                              display: 'block'
                            }}
                            onError={(e) => {
                              
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Image not available</div>';
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Current image path: {currentImage}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        border: '2px dashed #ccc', 
                        borderRadius: 2, 
                        p: 3, 
                        textAlign: 'center',
                        backgroundColor: '#fafafa'
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          No current image
                        </Typography>
                    </Box>
                  )}
                  </Box>

                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{ mb: 2 }}
                    >
                      {formData.image ? `Image Selected: ${formData.image.name}` : 'Upload Image'}
                    </Button>
                  </label>
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  )}
                </Box>
                </Box>

                {/* Price Tiers */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                    Price Tiers
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={enablePriceTiers}
                      onChange={handleEnablePriceTiersChange}
                      color="primary"
                    />
                  }
                  label="Enable Price Tiers"
                />
                  {enablePriceTiers && (
                    <Button
                      variant="outlined"
                      onClick={handleResetPriceTiers}
                      disabled={calculatedPriceTiers.length === 0}
                      sx={{ ml: 2 }}
                    >
                      Reset
                    </Button>
                  )}
                </div>

                {enablePriceTiers && calculatedPriceTiers.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Base price: ${VariantsCalculation.formatPrice(formData.price)}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                      gap: 2 
                    }}>
                      {calculatedPriceTiers.map((tier) => (
                        <Paper key={tier.id} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {tier.display_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Multiplier: {parseFloat(tier.discount_off_retail_price) || 1} × Base Price
                              </Typography>
                              {tier.is_overridden && (
                                <Typography variant="body2" color="text.secondary">
                                  Calculated: ${VariantsCalculation.formatPrice(tier.calculated_price)}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ minWidth: 120 }}>
                              <TextField
                                label="Price"
                                type="text"
                                size="small"
                                value={priceOverrideInputs[tier.id] ?? (tier.is_overridden && tier.override_price !== undefined
                                  ? tier.override_price.toFixed(2)
                                  : tier.calculated_price !== undefined
                                  ? tier.calculated_price.toFixed(2)
                                  : '')}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setPriceOverrideInputs(prev => ({
                                    ...prev,
                                    [tier.id]: value
                                  }));
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value.trim();
                                  if (value === '' || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
                                    // Clear override if invalid
                                    setPriceOverrideInputs(prev => {
                                      const newInputs = { ...prev };
                                      delete newInputs[tier.id];
                                      return newInputs;
                                    });
                                    handlePriceOverrideChange(tier.id, 0);
                                  } else {
                                    const numValue = parseFloat(value);
                                    const roundedValue = Math.round(numValue * 100) / 100;
                                    setPriceOverrideInputs(prev => ({
                                      ...prev,
                                      [tier.id]: roundedValue.toFixed(2)
                                    }));
                                    handlePriceOverrideChange(tier.id, roundedValue);
                                  }
                                }}
                                inputProps={{ 
                                  inputMode: 'decimal',
                                  pattern: '[0-9]*\\.?[0-9]*'
                                }}
                                sx={{ mb: 1 }}
                              />
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600, 
                                  color: tier.is_overridden ? 'warning.main' : 'primary.main'
                                }}>
                                  ${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(tier))}
                                </Typography>
                                {tier.is_overridden && (
                                  <Typography variant="caption" color="warning.main">
                                    Overridden
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-end',
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                    fullWidth={isMobile}
                    sx={{
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.95rem', sm: '0.875rem' }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    fullWidth={isMobile}
                    sx={{
                      backgroundColor: 'primary.main',
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.95rem', sm: '0.875rem' },
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Recline Type'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditReclineTypePage; 