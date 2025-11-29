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
import { reclineTypesService } from '@/services/recline-types';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

const CreateReclineTypePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
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
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState<string>('');
  const [overridePriceInputs, setOverridePriceInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    loadPriceTiers();
  }, []);

  const loadPriceTiers = async () => {
    try {
      const response = await reclineTypesService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err: any) {
      console.error('Error loading price tiers:', err);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };
      
      // Sync priceInput state with formData.price
      if (field === 'price') {
        setPriceInput(value > 0 ? value.toString() : '');
      }
      
      // Recalculate price tiers when base price changes
      if (field === 'price' && calculatedPriceTiers.length > 0) {
        const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(value, priceTiers, priceOverrides);
        setCalculatedPriceTiers(newCalculatedTiers);
        
        // Update price_adjustments with new calculated prices
        const newPriceAdjustments = Object.fromEntries(
          newCalculatedTiers.map(tier => [
            tier.id.toString(), 
            VariantsCalculation.getFinalPrice(tier)
          ])
        );
        newFormData.price_adjustments = newPriceAdjustments;
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
    
    // Calculate price tiers when enabled
    if (checked && formData.price > 0) {
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
    }
    
    // Clear price tiers and adjustments when disabled
    if (!checked) {
      setFormData(prev => ({
        ...prev,
        price_tier_ids: [],
        price_adjustments: {}
      }));
      setCalculatedPriceTiers([]);
      setPriceOverrides({});
    }
  };

  const handlePriceOverrideChange = (tierId: number, overridePrice: number) => {
    setPriceOverrides(prev => ({
      ...prev,
      [tierId.toString()]: overridePrice
    }));
    
    // Recalculate price tiers with new override
    if (formData.price > 0) {
      const newOverrides = {
        ...priceOverrides,
        [tierId.toString()]: overridePrice
      };
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(formData.price, priceTiers, newOverrides);
      setCalculatedPriceTiers(newCalculatedTiers);
      
      // Update price_adjustments with new calculated prices
      const newPriceAdjustments = Object.fromEntries(
        newCalculatedTiers.map(tier => [
          tier.id.toString(), 
          VariantsCalculation.getFinalPrice(tier)
        ])
      );
      setFormData(prev => ({
        ...prev,
        price_adjustments: newPriceAdjustments
      }));
    }
  };

  const handleResetPriceTiers = () => {
    if (formData.price > 0) {
      // Clear all overrides
      setPriceOverrides({});
      
      // Recalculate price tiers without overrides
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(formData.price, priceTiers, {});
      setCalculatedPriceTiers(newCalculatedTiers);
      
      // Update price_adjustments with calculated prices
      const newPriceAdjustments = Object.fromEntries(
        newCalculatedTiers.map(tier => [
          tier.id.toString(), 
          tier.calculated_price
        ])
      );
      setFormData(prev => ({
        ...prev,
        price_adjustments: newPriceAdjustments
      }));
    }
  };

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
      setError('Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submissionData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        cost: 0, // Fixed cost value as requested
        price: formData.price,
        price_tier_ids: enablePriceTiers && formData.price_tier_ids.length > 0 ? formData.price_tier_ids : [],
        price_adjustments: enablePriceTiers && formData.price_adjustments ? formData.price_adjustments : {}
      };

      console.log('=== RECLINE TYPE CREATION DEBUG ===');
      console.log('Form Data:', submissionData);
      console.log('Image File Details:', {
        name: formData.image?.name,
        size: formData.image?.size,
        type: formData.image?.type,
        lastModified: formData.image?.lastModified
      });
      console.log('Price Tier IDs:', formData.price_tier_ids);
      
      // Create FormData manually to see exactly what's being sent
      const testFormData = new FormData();
      testFormData.append('name', formData.name);
      if (formData.description) testFormData.append('description', formData.description);
      testFormData.append('image', formData.image);
      testFormData.append('cost', '0'); // Fixed cost value
      testFormData.append('price', formData.price.toString());
      if (formData.price_tier_ids && formData.price_tier_ids.length > 0) {
        formData.price_tier_ids.forEach(id => testFormData.append('price_tier_ids[]', id.toString()));
      }
      if (formData.price_adjustments && Object.keys(formData.price_adjustments).length > 0) {
        Object.entries(formData.price_adjustments).forEach(([tierId, price]) => {
          testFormData.append(`price_adjustments[${tierId}]`, price.toString());
        });
      }
      
      // Log FormData contents
      console.log('=== FORMDATA CONTENTS ===');
      for (let [key, value] of testFormData.entries()) {
        console.log(`${key}:`, value);
      }
      console.log('=== END FORMDATA CONTENTS ===');
      
      await reclineTypesService.createReclineType(submissionData);
      setSuccess('Recline Type created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/recline-types');
      }, 1500);
      
    } catch (err: any) {
      console.error('=== RECLINE TYPE CREATION ERROR ===');
      console.error('Error details:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        console.error('Response headers:', err.response.headers);
      }
      setError(err.message || 'Failed to create recline type');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/recline-types');
  };

  return (
    <AdminLayout title="Create Recline Type">
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
                      Calculated Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Based on base price: ${VariantsCalculation.formatPrice(formData.price)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {VariantsCalculation.sortByDiscountPercentage(calculatedPriceTiers).map((tier) => (
                        <Paper key={tier.id} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {tier.display_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {parseFloat(tier.discount_off_retail_price) > 0 
                                  ? `${tier.discount_off_retail_price}% discount` 
                                  : 'No discount'
                                }
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Calculated: ${VariantsCalculation.formatPrice(tier.calculated_price)}
                              </Typography>
                              {tier.discount_amount > 0 && (
                                <Typography variant="caption" color="success.main">
                                  Save: ${VariantsCalculation.formatPrice(tier.discount_amount)}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ minWidth: 120 }}>
                              <TextField
                                label="Override Price"
                                type="number"
                                size="small"
                                value={overridePriceInputs[tier.id] ?? (tier.is_overridden ? (tier.override_price?.toString() || '') : '')}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setOverridePriceInputs(prev => ({
                                    ...prev,
                                    [tier.id]: value
                                  }));
                                  
                                  // Only update when we have a valid numeric value
                                  if (value !== '' && value !== '-' && value !== '.' && !value.endsWith('.')) {
                                    const numValue = parseFloat(value);
                                    if (!isNaN(numValue)) {
                                      handlePriceOverrideChange(tier.id, numValue);
                                    }
                                  } else if (value === '') {
                                    // If empty, reset the override
                                    handlePriceOverrideChange(tier.id, 0);
                                  }
                                }}
                                onBlur={(e) => {
                                  // When field loses focus, finalize the value
                                  const value = e.target.value.trim();
                                  if (value === '' || value === '-' || isNaN(parseFloat(value))) {
                                    // If invalid or empty, clear override
                                    setOverridePriceInputs(prev => {
                                      const newInputs = { ...prev };
                                      delete newInputs[tier.id];
                                      return newInputs;
                                    });
                                    handlePriceOverrideChange(tier.id, 0);
                                  } else {
                                    const numValue = parseFloat(value);
                                    const finalValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;
                                    setOverridePriceInputs(prev => ({
                                      ...prev,
                                      [tier.id]: finalValue.toString()
                                    }));
                                    handlePriceOverrideChange(tier.id, finalValue);
                                  }
                                }}
                                placeholder={VariantsCalculation.formatPrice(tier.calculated_price)}
                                inputProps={{ min: 0, step: 0.01 }}
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
                    {loading ? 'Creating...' : 'Create Recline Type'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateReclineTypePage; 