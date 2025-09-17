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
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

// Helper function to convert cost/price to number
const parsePriceValue = (value: number | string | undefined): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

const EditArmTypePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
  
  const [priceTiers, setPriceTiers] = useState<any[]>([]);
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    loadArmType();
    loadPriceTiers();
  }, [id]);

  const loadPriceTiers = async () => {
    try {
      const response = await apiService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err) {
      console.error('Error loading price tiers:', err);
    }
  };

  const loadArmType = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const armType = await apiService.getArmType(parseInt(id));
      console.log('Loaded arm type data:', armType);
      
      const priceValue = parsePriceValue(armType.price);
      
      // Extract price tier IDs and adjustments from pivot.price_adjustment
      const priceTierIds = armType.price_tiers?.map((tier: any) => tier.id) || [];
      const priceAdjustments = armType.price_tiers?.reduce((acc: Record<string, number>, tier: any) => {
        if (tier.pivot?.price_adjustment !== undefined) {
          acc[tier.id.toString()] = parseFloat(tier.pivot.price_adjustment);
        }
        return acc;
      }, {}) || {};
      
      // Enable price tiers if there are any price tiers
      const hasPriceTiers = priceTierIds.length > 0;
      setEnablePriceTiers(hasPriceTiers);
      
      // Create calculated price tiers from existing data
      let existingCalculatedTiers: CalculatedPriceTier[] = [];
      if (hasPriceTiers && armType.price > 0) {
        existingCalculatedTiers = armType.price_tiers?.map((tier: any) => {
          const existingPrice = parseFloat(tier.pivot?.price_adjustment) || 0;
          const calculatedPrice = VariantsCalculation.calculatePriceAdjustment(
            armType.price || 0, 
            parseFloat(tier.discount_off_retail_price)
          ).calculatedPrice;
          
          // Check if this is an override
          const isOverridden = Math.abs(existingPrice - calculatedPrice) > 0.01;
          
          return {
            id: tier.id,
            name: tier.name,
            display_name: tier.display_name,
            discount_off_retail_price: tier.discount_off_retail_price,
            created_at: tier.created_at,
            updated_at: tier.updated_at,
            customers_count: 0,
            calculated_price: calculatedPrice,
            discount_amount: (armType.price * parseFloat(tier.discount_off_retail_price)) / 100,
            override_price: isOverridden ? existingPrice : undefined,
            is_overridden: isOverridden
          };
        }) || [];
        
        setCalculatedPriceTiers(existingCalculatedTiers);
        
        // Set up price overrides from calculated tiers
        const priceOverrides: Record<string, number> = {};
        existingCalculatedTiers.forEach((tier: CalculatedPriceTier) => {
          if (tier.is_overridden && tier.override_price !== undefined) {
            priceOverrides[tier.id.toString()] = tier.override_price;
          }
        });
        setPriceOverrides(priceOverrides);
      }
      
      // Initialize price adjustments from calculated tiers if available, otherwise use existing data
      const finalPriceAdjustments = hasPriceTiers && existingCalculatedTiers.length > 0 
        ? Object.fromEntries(
            existingCalculatedTiers.map((tier: CalculatedPriceTier) => [
              tier.id.toString(), 
              VariantsCalculation.getFinalPrice(tier)
            ])
          )
        : priceAdjustments;

      setFormData({
        name: armType.name || '',
        description: armType.description || '',
        image: null,
        price: priceValue,
        price_tier_ids: priceTierIds,
        price_adjustments: finalPriceAdjustments
      });
      setCurrentImage(armType.image || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load arm type');
      console.error('Error loading arm type:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };
      
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
    
    // Update the calculated price tiers with the new override
    setCalculatedPriceTiers(prev => prev.map(tier => {
      if (tier.id === tierId) {
        const isOverridden = overridePrice > 0 && overridePrice !== tier.calculated_price;
        return {
          ...tier,
          override_price: overridePrice,
          is_overridden: isOverridden
        };
      }
      return tier;
    }));
    
    // Update price_adjustments with the new price
    setFormData(prev => ({
      ...prev,
      price_adjustments: {
        ...prev.price_adjustments,
        [tierId.toString()]: overridePrice
      }
    }));
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

    if (formData.price <= 0) {
      setError('In Shop Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submissionData: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
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

      // Only include image if a new one is selected
      if (formData.image) {
        submissionData.image = formData.image;
      }
      
      console.log('Updating arm type with data:', submissionData);
      const result = await apiService.updateArmType(parseInt(id), submissionData);
      console.log('Update arm type result:', result);
      setSuccess('Arm Type updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/arm-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update arm type');
      console.error('Error updating arm type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/arm-types');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Arm Type">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Arm Type">
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
                  placeholder="Enter arm type name"
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

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="In Shop Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                    placeholder="Enter in shop price"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Box>
              </Box>

              {/* Image Upload Field */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Image
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box>
                  {/* Current Image Display */}
                  {!imagePreview && (
                    <Box sx={{ mb: 2 }}>
                      {currentImage ? (
                        <>
                          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            Current Image:
                          </Typography>
                          <Box sx={{ 
                            maxWidth: 300, 
                            maxHeight: 200, 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <img
                              src={`https://superiorseats.ali-khalid.com/${currentImage}`}
                              alt="Current arm type image"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
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
                        </>
                      ) : (
                        <Box sx={{ 
                          maxWidth: 300, 
                          maxHeight: 200, 
                          border: '2px dashed #e0e0e0', 
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 3
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            No current image
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload-edit"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload-edit">
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{ mb: 2 }}
                    >
                      {currentImage ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </label>
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        New Image Preview:
                      </Typography>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #e0e0e0'
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
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Base price: ${VariantsCalculation.formatPrice(formData.price)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {calculatedPriceTiers.map((tier) => (
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
                              {tier.is_overridden && (
                                <Typography variant="body2" color="text.secondary">
                                  Calculated: ${VariantsCalculation.formatPrice(tier.calculated_price)}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ minWidth: 120 }}>
                              <TextField
                                label="Price"
                                type="number"
                                size="small"
                                value={tier.is_overridden ? tier.override_price || '' : tier.calculated_price || ''}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  handlePriceOverrideChange(tier.id, value);
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{ mb: 1 }}
                              />
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600, 
                                  color: tier.is_overridden ? 'warning.main' : 'primary.main'
                                }}>
                                  ${VariantsCalculation.formatPrice(tier.is_overridden ? tier.override_price : tier.calculated_price)}
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
                    backgroundColor: '#DA291C',
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  {loading ? 'Updating...' : 'Update Arm Type'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditArmTypePage; 