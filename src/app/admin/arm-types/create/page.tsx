'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

const CreateArmTypePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    price: 0,
    price_tier_ids: [] as number[],
    price_adjustments: {} as Record<string, number>
  });
  
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);
  
  const [priceTiers, setPriceTiers] = useState<any[]>([]);
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState<string>('');
  const [overridePriceInputs, setOverridePriceInputs] = useState<Record<number, string>>({});

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };
      
      // Sync priceInput state with formData.price
      if (field === 'price') {
        setPriceInput(value > 0 ? value.toString() : '');
      }
      
      return newFormData;
    });
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

  useEffect(() => {
    const loadPriceTiers = async () => {
      try {
        const response = await apiService.getPriceTiers();
        setPriceTiers(response || []);
      } catch (err) {
        console.error('Error loading price tiers:', err);
      }
    };
    loadPriceTiers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.image) {
      setError('Image is required');
      return;
    }

    if (formData.price <= 0) {
      setError('In Store Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image,
        cost: 1, // Fixed cost value
        price: formData.price,
        price_tier_ids: enablePriceTiers && calculatedPriceTiers.length > 0 ? calculatedPriceTiers.map(tier => tier.id) : [],
        price_adjustments: enablePriceTiers && calculatedPriceTiers.length > 0 ? Object.fromEntries(
          calculatedPriceTiers.map(tier => [
            tier.id.toString(), 
            VariantsCalculation.getFinalPrice(tier)
          ])
        ) : undefined
      };
      
      console.log('Creating arm type with data:', submissionData);
      const result = await apiService.createArmType(submissionData);
      console.log('Create arm type result:', result);
      setSuccess('Arm Type created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/arm-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create arm type');
      console.error('Error creating arm type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/arm-types');
  };

  return (
    <AdminLayout title="Create Arm Type">
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4 } }}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
              
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter arm type name"
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={3}
                  placeholder="Enter description (optional)"
                  InputProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                />
              </Box>

              {/* Pricing Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Pricing Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="In Store Price"
                    type="number"
                    value={priceInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPriceInput(value);
                      
                      // Only update formData when we have a valid numeric value
                      if (value !== '' && value !== '-' && value !== '.' && !value.endsWith('.')) {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          handleInputChange('price', numValue);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // When field loses focus, finalize the value
                      const value = e.target.value.trim();
                      if (value === '' || value === '-' || isNaN(parseFloat(value))) {
                        // If invalid or empty, clear and set to 0
                        setPriceInput('');
                        handleInputChange('price', 0);
                      } else {
                        const numValue = parseFloat(value);
                        const finalValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;
                        setPriceInput(finalValue.toString());
                        handleInputChange('price', finalValue);
                      }
                    }}
                    required
                    fullWidth
                    placeholder="Enter in Store price"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                    }}
                    InputLabelProps={{
                      sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                    }}
                  />
                </Box>
              </Box>

              {/* Image Upload Field */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Image
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box>
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
                      sx={{ 
                        mb: 2,
                        minHeight: { xs: 44, sm: 'auto' },
                        fontSize: { xs: '0.95rem', sm: '0.875rem' },
                        width: { xs: '100%', sm: 'auto' }
                      }}
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
                          maxWidth: '100%',
                          maxHeight: isMobile ? 150 : 200,
                          borderRadius: 8,
                          border: '1px solid #e0e0e0',
                          width: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Price Tiers */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Price Tiers
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={enablePriceTiers}
                        onChange={handleEnablePriceTiersChange}
                        color="primary"
                      />
                    }
                    label="Enable Price Tiers"
                    sx={{ 
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  />
                  {enablePriceTiers && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleResetPriceTiers}
                      sx={{ 
                        ml: { xs: 0, sm: 1 },
                        mt: { xs: 1, sm: 0 },
                        minHeight: { xs: 36, sm: 'auto' },
                        fontSize: { xs: '0.9rem', sm: '0.875rem' }
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </Box>

                {enablePriceTiers && calculatedPriceTiers.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary', fontSize: { xs: '1.1rem', sm: '1rem' } }}>
                      Calculated Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontSize: { xs: '1rem', sm: '0.875rem' } }}>
                      Based on base price: ${VariantsCalculation.formatPrice(formData.price)}
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
                  sx={{
                    minHeight: { xs: 44, sm: 'auto' },
                    fontSize: { xs: '0.95rem', sm: '0.875rem' },
                    order: { xs: 2, sm: 1 }
                  }}
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
                    minHeight: { xs: 44, sm: 'auto' },
                    fontSize: { xs: '0.95rem', sm: '0.875rem' },
                    order: { xs: 1, sm: 2 },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Arm Type'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateArmTypePage; 
