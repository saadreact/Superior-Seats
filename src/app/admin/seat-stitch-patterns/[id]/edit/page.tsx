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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { seatStitchPatternService } from '@/services/seat-stitch-pattern';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';
import { apiService } from '@/utils/api';

interface PriceTier {
  id: number;
  name: string;
  display_name: string;
  discount_off_retail_price: string;
  created_at: string;
  updated_at: string;
}

interface Color {
  id: number;
  name: string;
  hex_code: string;
  description?: string;
}

const EditSeatStitchPatternPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    static_pattern_id: '', // Format: "modelId-patternNum" (e.g., "1-2")
    image: null as File | null,
    price: 0,
    price_tier_ids: [] as number[],
    price_adjustments: {} as Record<string, number>,
    color_ids: [] as number[]
  });
  
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [overridePriceInputs, setOverridePriceInputs] = useState<Record<number, string>>({});
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);
  
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadOptions();
    loadSeatStitchPattern();
  }, [id]);

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
      setOverridePriceInputs(prev => ({ ...prev, ...initialInputs }));
    }
  }, [priceTiers, enablePriceTiers, formData.price, priceOverrides]);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      const [priceTiersRes, colorsRes] = await Promise.all([
        seatStitchPatternService.getPriceTiers(),
        apiService.getColors({ per_page: 1000 })
      ]);
      setPriceTiers(Array.isArray(priceTiersRes) ? priceTiersRes : []);
      setColors(colorsRes?.data || []);
    } catch (err: any) {
      console.error('Error loading options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadSeatStitchPattern = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const response = await seatStitchPatternService.getSeatStitchPattern(parseInt(id));
      console.log('Loaded seat stitch pattern response:', response);
      
      // Extract the data from the response
      const seatStitchPattern = response.data || response;
      console.log('Seat stitch pattern data:', seatStitchPattern);
      
      // Extract price tier IDs and adjustments from pivot.price_adjustment
      const priceTierIds = seatStitchPattern.price_tiers?.map((tier: any) => tier.id) || [];
      const priceAdjustments = seatStitchPattern.price_tiers?.reduce((acc: Record<string, number>, tier: any) => {
        if (tier.pivot?.price_adjustment && parseFloat(tier.pivot.price_adjustment) > 0) {
          acc[tier.id.toString()] = parseFloat(tier.pivot.price_adjustment);
        }
        return acc;
      }, {}) || {};
      
      // Extract color IDs from colors relationship
      const colorIds = seatStitchPattern.colors?.map((color: any) => color.id) || [];
      
      // Enable price tiers if there are any price tiers
      const hasPriceTiers = priceTierIds.length > 0;
      setEnablePriceTiers(hasPriceTiers);
      
      // Create calculated price tiers from existing data using multiplier logic
      if (hasPriceTiers && seatStitchPattern.price > 0) {
        const basePrice = typeof seatStitchPattern.price === 'string' ? parseFloat(seatStitchPattern.price) : seatStitchPattern.price;
        
        const existingCalculatedTiers: CalculatedPriceTier[] = seatStitchPattern.price_tiers?.map((tier: any) => {
          const multiplier = parseFloat(tier.discount_off_retail_price) || 1;
          const calculatedPrice = Math.round(basePrice * multiplier * 100) / 100;
          const actualPrice = tier.pivot?.price_adjustment ? parseFloat(tier.pivot.price_adjustment) : calculatedPrice;
          const isOverridden = actualPrice !== calculatedPrice;
          
          return {
            id: tier.id,
            name: tier.name,
            display_name: tier.display_name,
            discount_off_retail_price: tier.discount_off_retail_price,
            created_at: tier.created_at,
            updated_at: tier.updated_at,
            customers_count: 0,
            calculated_price: calculatedPrice,
            discount_amount: 0,
            override_price: isOverridden ? actualPrice : undefined,
            is_overridden: isOverridden
          };
        }) || [];
        
        setCalculatedPriceTiers(existingCalculatedTiers);
        
        // Initialize priceOverrides and overridePriceInputs from loaded data
        const loadedOverrides: Record<string, number> = {};
        const loadedInputs: Record<number, string> = {};
        existingCalculatedTiers.forEach(tier => {
          if (tier.is_overridden && tier.override_price !== undefined) {
            loadedOverrides[tier.id.toString()] = tier.override_price;
            loadedInputs[tier.id] = tier.override_price.toFixed(2);
          }
        });
        setPriceOverrides(loadedOverrides);
        setOverridePriceInputs(loadedInputs);
      }
      
      setFormData({
        name: seatStitchPattern.name || '',
        description: seatStitchPattern.description || '',
        static_pattern_id: seatStitchPattern.static_pattern_id || '',
        image: null,
        price: typeof seatStitchPattern.price === 'string' ? parseFloat(seatStitchPattern.price) : seatStitchPattern.price || 0,
        price_tier_ids: priceTierIds,
        price_adjustments: priceAdjustments,
        color_ids: colorIds
      });
      setCurrentImage(seatStitchPattern.image || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load seat stitch pattern');
      console.error('Error loading seat stitch pattern:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };
      return newFormData;
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
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
      setOverridePriceInputs({});
    }
  };

  const handlePriceOverrideChange = (tierId: number, overridePrice: number) => {
    setPriceOverrides(prev => ({
      ...prev,
      [tierId.toString()]: overridePrice
    }));
  };

  const handlePriceOverrideInputChange = (tierId: number, value: string) => {
    setOverridePriceInputs(prev => ({
      ...prev,
      [tierId]: value
    }));
  };

  const handlePriceOverrideBlur = (tierId: number) => {
    const inputValue = overridePriceInputs[tierId];
    if (inputValue === undefined || inputValue === '') {
      // Clear override if input is empty
      setPriceOverrides(prev => {
        const newOverrides = { ...prev };
        delete newOverrides[tierId.toString()];
        return newOverrides;
      });
      setOverridePriceInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[tierId];
        return newInputs;
      });
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue) && numValue >= 0) {
        const roundedValue = Math.round(numValue * 100) / 100;
        handlePriceOverrideChange(tierId, roundedValue);
        setOverridePriceInputs(prev => ({
          ...prev,
          [tierId]: roundedValue.toFixed(2)
        }));
      } else {
        // Reset to calculated price if invalid
        const tier = calculatedPriceTiers.find(t => t.id === tierId);
        if (tier) {
          setOverridePriceInputs(prev => {
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
    setOverridePriceInputs({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.price <= 0) {
      setError('In Store Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Validate static_pattern_id format
      if (!formData.static_pattern_id.trim()) {
        setError('Static Pattern ID is required (e.g., "1-2" for pattern 2 of model 1)');
        return;
      }

      // Validate format: should be "modelId-patternNum"
      const patternIdRegex = /^\d+-\d+$/;
      if (!patternIdRegex.test(formData.static_pattern_id.trim())) {
        setError('Static Pattern ID must be in format "modelId-patternNum" (e.g., "1-2", "2-3")');
        return;
      }

      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        static_pattern_id: formData.static_pattern_id.trim(), // Maps to static file path
        image: formData.image,
        cost: 0, // Fixed cost value
        price: formData.price,
        price_tier_ids: enablePriceTiers && calculatedPriceTiers.length > 0 ? calculatedPriceTiers.map(tier => tier.id) : [],
        price_adjustments: enablePriceTiers && calculatedPriceTiers.length > 0 ? Object.fromEntries(
          calculatedPriceTiers.map(tier => [
            tier.id.toString(), 
            VariantsCalculation.getFinalPrice(tier)
          ])
        ) : undefined,
        color_ids: formData.color_ids
      };

      // Debug: Log the data being sent
      console.log('Seat Stitch Pattern edit data being sent to API:', {
        ...submissionData,
        image: submissionData.image ? `File(${submissionData.image.name}, ${submissionData.image.size} bytes, ${submissionData.image.type})` : null
      });
      
      await seatStitchPatternService.updateSeatStitchPattern(parseInt(id), submissionData);
      setSuccess('Seat Stitch Pattern updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/seat-stitch-patterns');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update seat stitch pattern');
      console.error('Error updating seat stitch pattern:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/seat-stitch-patterns');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Seat Stitch Pattern">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Seat Stitch Pattern">
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
                  placeholder="Enter seat stitch pattern name"
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
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Static Pattern ID *"
                  value={formData.static_pattern_id}
                  onChange={(e) => handleInputChange('static_pattern_id', e.target.value)}
                  required
                  fullWidth
                  placeholder="e.g., 1-2 (for /assets/patterns/1/02.jpg)"
                  helperText="Format: modelId-patternNum (e.g., '1-2' maps to /assets/patterns/1/02.jpg and /assets/stitchings/1/2/1.png)"
                  sx={{ mb: 3 }}
                />

                {/* Colors Multiselect */}
                <FormControl fullWidth>
                  <InputLabel id="colors-label">Colors</InputLabel>
                  <Select
                    labelId="colors-label"
                    multiple
                    value={formData.color_ids}
                    onChange={(e) => handleInputChange('color_ids', e.target.value as number[])}
                    input={<OutlinedInput label="Colors" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as number[]).map((colorId) => {
                          const color = colors.find(c => c.id === colorId);
                          return (
                            <Chip
                              key={colorId}
                              label={color?.name || colorId}
                              size="small"
                              sx={{
                                backgroundColor: color?.hex_code,
                                color: color?.hex_code === '#ffffff' || color?.hex_code === '#fff' ? '#000' : '#fff'
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {colors.map((color) => (
                      <MenuItem key={color.id} value={color.id}>
                        <Checkbox checked={formData.color_ids.includes(color.id)} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 0.5,
                              backgroundColor: color.hex_code,
                              border: 1,
                              borderColor: 'divider',
                            }}
                          />
                          <ListItemText primary={color.name} />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Box>

                {/* Pricing Information */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                    Pricing Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="In Store Price"
                    type="number"
                    value={formData.price === 0 ? '0' : formData.price.toString()}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (inputValue === '0') {
                        handleInputChange('price', 0);
                      } else {
                        const numericValue = parseFloat(inputValue) || 0;
                        handleInputChange('price', numericValue);
                      }
                    }}
                    required
                    fullWidth
                    placeholder="Enter in Store price"
                    inputProps={{ min: 0, step: 0.01 }}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.select();
                      }
                    }}
                  />
                </Box>
                </Box>

                {/* Image Upload */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                    Image
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                <Box>
                  {/* Current Image */}
                  {currentImage && !formData.image && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Image:
                      </Typography>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/${currentImage}`}
                        alt="Current"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div style="padding: 16px; color: #666; text-align: center;">Image failed to load</div>';
                          }
                        }}
                      />
                    </Box>
                  )}

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
                      {formData.image ? `Image Selected: ${formData.image.name}` : (currentImage ? 'Change Image' : 'Upload Image')}
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                      size="small"
                      onClick={handleResetPriceTiers}
                      sx={{ ml: 1 }}
                    >
                      Reset
                    </Button>
                  )}
                </Box>

                {enablePriceTiers && calculatedPriceTiers.length > 0 && (
                  <Box sx={{ mt: 2 }}>
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
                                value={overridePriceInputs[tier.id] ?? (tier.is_overridden && tier.override_price !== undefined
                                  ? tier.override_price.toFixed(2)
                                  : tier.calculated_price !== undefined
                                  ? tier.calculated_price.toFixed(2)
                                  : '')}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setOverridePriceInputs(prev => ({
                                    ...prev,
                                    [tier.id]: value
                                  }));
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value.trim();
                                  if (value === '' || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
                                    // Clear override if invalid
                                    setOverridePriceInputs(prev => {
                                      const newInputs = { ...prev };
                                      delete newInputs[tier.id];
                                      return newInputs;
                                    });
                                    handlePriceOverrideChange(tier.id, 0);
                                  } else {
                                    const numValue = parseFloat(value);
                                    const roundedValue = Math.round(numValue * 100) / 100;
                                    setOverridePriceInputs(prev => ({
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
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Seat Stitch Pattern'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditSeatStitchPatternPage; 