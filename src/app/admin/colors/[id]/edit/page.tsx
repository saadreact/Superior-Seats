'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Chip,
  Divider,
  Switch,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '@/utils/api';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

interface Color {
  id: number;
  name: string;
  hex_code: string;
  description: string;
  color_vendor_id: number;
  is_active: boolean;
  price_tier_ids: number[];
  price_tiers?: any[];
  cost: number | null;
  price: number | null;
  created_at: string;
  updated_at: string;
}

interface ColorVendor {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
}

interface PriceTier {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  discount_off_retail_price: string;
  minimum_order_amount?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Helper functions for color validation and contrast
const isValidHexColor = (hex: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
};

const getContrastColor = (hexColor: string): string => {
  if (!isValidHexColor(hexColor)) {
    return '#000000';
  }
  
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const EditColorPage = () => {
  const router = useRouter();
  const params = useParams();
  const colorId = Number(params.id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [color, setColor] = useState<Color | null>(null);
  const [colorVendors, setColorVendors] = useState<ColorVendor[]>([]);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hex_code: '',
    description: '',
    color_vendor_id: 0,
    price: 0,
    is_active: true,
  });
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);

  const loadColor = useCallback(async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await apiService.getColor(colorId);
      setColor(response);
      
      // Parse price value
      const priceValue = typeof response.price === 'string' ? parseFloat(response.price) : (response.price || 0);
      
      // Extract price tier data from the response
      const colorPriceTiers = response.price_tiers || [];
      const priceTierIds = colorPriceTiers.map((tier: any) => tier.id);
      
      // Extract price adjustments from pivot data and determine which are truly overridden
      const priceAdjustments: Record<string, number> = {};
      const overriddenPrices: Record<string, number> = {};
      
      colorPriceTiers.forEach((tier: any) => {
        if (tier.pivot && tier.pivot.price_adjustment !== undefined) {
          const adjustmentValue = parseFloat(tier.pivot.price_adjustment);
          const discountPercentage = parseFloat(tier.discount_off_retail_price);
          const calculatedPrice = priceValue - (priceValue * discountPercentage / 100);
          
          // Check if the adjustment value is different from calculated price (indicating override)
          if (Math.abs(adjustmentValue - calculatedPrice) > 0.01) {
            overriddenPrices[tier.id.toString()] = adjustmentValue;
          }
          
          priceAdjustments[tier.id.toString()] = adjustmentValue;
        }
      });
      
      // Set enable price tiers based on existing tiers
      setEnablePriceTiers(priceTierIds.length > 0);
      
      // Create calculated price tiers if we have price and tiers
      if (priceValue > 0 && colorPriceTiers.length > 0) {
        const existingCalculatedTiers = VariantsCalculation.calculatePriceTiers(
          priceValue,
          colorPriceTiers,
          overriddenPrices // Only pass truly overridden prices
        );
        setCalculatedPriceTiers(existingCalculatedTiers);
        setPriceOverrides(overriddenPrices);
      }
      
      // Set form data
      setFormData({
        name: response.name,
        hex_code: response.hex_code,
        description: response.description,
        color_vendor_id: response.color_vendor_id,
        price: priceValue,
        is_active: response.is_active,
      });
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load color. Please try again later.');
      }
      console.error('Error loading color:', err);
    } finally {
      setInitialLoading(false);
    }
  }, [colorId, priceTiers]);

  const loadColorVendors = useCallback(async () => {
    try {
      const response = await apiService.getColorVendors();
      setColorVendors(response || []);
    } catch (err: any) {
      console.error('Error loading color vendors:', err);
      setColorVendors([]);
    }
  }, []);

  const loadPriceTiers = useCallback(async () => {
    try {
      const response = await apiService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err: any) {
      console.error('Error loading price tiers:', err);
      setPriceTiers([]);
    }
  }, []);

  useEffect(() => {
    if (colorId) {
      loadColorVendors();
      loadPriceTiers();
    }
  }, [colorId, loadColorVendors, loadPriceTiers]);

  useEffect(() => {
    if (colorId && priceTiers.length > 0) {
      loadColor();
    }
  }, [colorId, priceTiers, loadColor]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Recalculate price tiers when price changes
    if (field === 'price' && value > 0) {
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(
        value,
        priceTiers,
        priceOverrides
      );
      setCalculatedPriceTiers(newCalculatedTiers);
    }
  };

  const handleEnablePriceTiersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setEnablePriceTiers(checked);
    
    if (!checked) {
      // Clear price tier selections when disabled
      setPriceOverrides({});
      setCalculatedPriceTiers([]);
    } else if (formData.price > 0) {
      // Recalculate when enabled
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(
        formData.price,
        priceTiers,
        priceOverrides
      );
      setCalculatedPriceTiers(newCalculatedTiers);
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
    }
  };

  const handleResetPriceTiers = () => {
    setPriceOverrides({});
    if (formData.price > 0) {
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(
        formData.price,
        priceTiers,
        {}
      );
      setCalculatedPriceTiers(newCalculatedTiers);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Color name is required');
      return;
    }
    
    if (!formData.hex_code.trim()) {
      setError('Hex code is required');
      return;
    }
    
    // Ensure hex code has # prefix and validate format
    let hexCode = formData.hex_code.trim();
    if (!hexCode.startsWith('#')) {
      hexCode = '#' + hexCode;
    }
    
    // Validate hex code format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexCode)) {
      setError('Please enter a valid hex color code (e.g., 000000 or #000000)');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!formData.color_vendor_id) {
      setError('Color vendor is required');
      return;
    }
    
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        name: formData.name.trim(),
        hex_code: hexCode,
        description: formData.description.trim(),
        color_vendor_id: Number(formData.color_vendor_id),
        cost: 1, // Fixed cost value as per schema
        price: formData.price,
        is_active: formData.is_active,
        price_tier_ids: enablePriceTiers && calculatedPriceTiers.length > 0 ? calculatedPriceTiers.map((tier: CalculatedPriceTier) => tier.id) : [],
        price_adjustments: enablePriceTiers && calculatedPriceTiers.length > 0 ? Object.fromEntries(
          calculatedPriceTiers.map(tier => [
            tier.id.toString(), 
            VariantsCalculation.getFinalPrice(tier)
          ])
        ) : undefined
      };
      
      await apiService.updateColor(colorId, submitData);
      setSuccess('Color updated successfully!');
      
      // Redirect back to colors list after a short delay
      setTimeout(() => {
        router.push('/admin/colors');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update color');
      console.error('Error updating color:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/colors');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Color">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Color">
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
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 2, sm: 0 }
                }}>
                  <Typography variant="h5" sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Basic Information
                  </Typography>
                  
                  {/* Status Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }}>
                        {formData.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                    labelPlacement="start"
                    sx={{ 
                      gap: 1,
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '1rem', sm: '0.875rem' },
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 3 }} />
              
                <TextField
                  label="Color Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter color name"
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                />

                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="Hex Code"
                    value={formData.hex_code.replace('#', '')}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith('#')) {
                        value = '#' + value;
                      }
                      handleInputChange('hex_code', value);
                    }}
                    required
                    fullWidth
                    placeholder="000000"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" color="text.secondary">#</Typography>
                        </InputAdornment>
                      ),
                      sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                    }}
                    InputLabelProps={{
                      sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                    }}
                  />
                  
                  {/* Color Preview */}
                  {formData.hex_code && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 1,
                      backgroundColor: 'background.paper'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        {/* Color Square */}
                        <Box
                          sx={{
                            width: { xs: 60, sm: 80 },
                            height: { xs: 60, sm: 80 },
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            backgroundColor: formData.hex_code,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: { xs: 60, sm: 80 },
                            boxShadow: 1
                          }}
                        >
                          {formData.hex_code && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: getContrastColor(formData.hex_code),
                                fontWeight: 600,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}
                            >
                              {formData.hex_code.replace('#', '').toUpperCase()}
                            </Typography>
                          )}
                        </Box>
                        
                        {/* Color Information */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{
                            fontSize: { xs: '0.85rem', sm: '0.875rem' },
                            mb: 0.5
                          }}>
                            Color Preview
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '0.875rem' },
                            fontFamily: 'monospace'
                          }}>
                            {formData.hex_code.toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.75rem' }
                          }}>
                            {formData.hex_code && isValidHexColor(formData.hex_code) ? 'Valid color code' : 'Invalid color code'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter description (optional)"
                  InputProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                />
              </Box>

              {/* Color Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'text.primary', 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
                  Color Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControl fullWidth required sx={{ mb: 3 }}>
                  <InputLabel sx={{ fontSize: { xs: '1rem', sm: '0.875rem' } }}>Color Vendor</InputLabel>
                  <Select
                    value={formData.color_vendor_id}
                    onChange={(e) => handleInputChange('color_vendor_id', e.target.value)}
                    label="Color Vendor"
                    sx={{ 
                      '& .MuiSelect-select': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  >
                    <MenuItem value={0} disabled>
                      <em>Select a vendor</em>
                    </MenuItem>
                    {colorVendors.map((vendor) => (
                      <MenuItem key={vendor.id} value={vendor.id} sx={{ fontSize: { xs: '1rem', sm: '0.875rem' } }}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Box>

              {/* Pricing Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'text.primary', 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
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
                  placeholder="Enter in store price"
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
                  }}
                />
              </Box>

              {/* Price Tiers */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'text.primary', 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
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
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      mb: 2, 
                      color: 'text.primary',
                      fontSize: { xs: '1.1rem', sm: '1rem' }
                    }}>
                      Calculated Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      mb: 2, 
                      color: 'text.secondary',
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
                      Based on base price: ${VariantsCalculation.formatPrice(formData.price)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {VariantsCalculation.sortByDiscountPercentage(calculatedPriceTiers).map((tier) => (
                        <Paper key={tier.id} variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start', 
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' }
                          }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="subtitle2" sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '1rem', sm: '0.875rem' }
                              }}>
                                {tier.display_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ 
                                mb: 1,
                                fontSize: { xs: '0.95rem', sm: '0.875rem' }
                              }}>
                                {parseFloat(tier.discount_off_retail_price) > 0 
                                  ? `${tier.discount_off_retail_price}% discount` 
                                  : 'No discount'
                                }
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ 
                                fontSize: { xs: '0.95rem', sm: '0.875rem' }
                              }}>
                                Calculated: ${VariantsCalculation.formatPrice(tier.calculated_price)}
                              </Typography>
                              {tier.discount_amount > 0 && (
                                <Typography variant="caption" color="success.main" sx={{ 
                                  fontSize: { xs: '0.85rem', sm: '0.75rem' }
                                }}>
                                  Save: ${VariantsCalculation.formatPrice(tier.discount_amount)}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ 
                              minWidth: { xs: '100%', sm: 120 },
                              maxWidth: { xs: '100%', sm: 120 }
                            }}>
                              <TextField
                                label="Override Price"
                                type="number"
                                size="small"
                                value={tier.is_overridden ? tier.override_price || '' : ''}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  handlePriceOverrideChange(tier.id, value);
                                }}
                                placeholder={VariantsCalculation.formatPrice(tier.calculated_price)}
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{ 
                                  mb: 1,
                                  '& .MuiInputBase-input': {
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                  }
                                }}
                                fullWidth={isMobile}
                              />
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600, 
                                  color: tier.is_overridden ? 'warning.main' : 'primary.main',
                                  fontSize: { xs: '1.25rem', sm: '1.125rem' }
                                }}>
                                  ${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(tier))}
                                </Typography>
                                {tier.is_overridden && (
                                  <Typography variant="caption" color="warning.main" sx={{ 
                                    fontSize: { xs: '0.85rem', sm: '0.75rem' }
                                  }}>
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
                    backgroundColor: '#DA291C',
                    minHeight: { xs: 44, sm: 'auto' },
                    fontSize: { xs: '0.95rem', sm: '0.875rem' },
                    order: { xs: 1, sm: 2 },
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  {loading ? 'Updating...' : 'Update Color'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditColorPage;
