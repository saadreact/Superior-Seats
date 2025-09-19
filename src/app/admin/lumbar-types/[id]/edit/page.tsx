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
  FormControlLabel,
  Switch,
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { lumbarTypesService } from '@/services/lumbar-types';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

const EditLumbarTypePage = () => {
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
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    cost: 0,
    price: 0,
    price_tier_ids: [] as number[],
    price_adjustments: {} as Record<string, number>
  });
  
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);

  useEffect(() => {
    loadLumbarType();
    loadPriceTiers();
  }, [id]);

  const loadPriceTiers = async () => {
    try {
      const response = await lumbarTypesService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err) {
      console.error('Error loading price tiers:', err);
    }
  };

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
    console.log('Image field type:', typeof formData.image);
    console.log('Image field value:', formData.image);
    if (formData.image) {
      console.log('Image is File:', formData.image instanceof File);
      console.log('Image constructor:', formData.image.constructor?.name);
    }
  }, [formData]);

  const loadLumbarType = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const lumbarType = await lumbarTypesService.getLumbarType(parseInt(id));
      console.log('Loaded lumbar type:', lumbarType);
      console.log('Current image path:', lumbarType.image);
      
      // Extract price tier IDs and adjustments from pivot.price_adjustment
      const priceTierIds = lumbarType.price_tiers?.map((tier: any) => tier.id) || [];
      const priceAdjustments = lumbarType.price_tiers?.reduce((acc: Record<string, number>, tier: any) => {
        if (tier.pivot?.price_adjustment) {
          acc[tier.id.toString()] = parseFloat(tier.pivot.price_adjustment);
        }
        return acc;
      }, {}) || {};
      
      // Enable price tiers if there are any price tiers
      const hasPriceTiers = priceTierIds.length > 0;
      setEnablePriceTiers(hasPriceTiers);
      
      // Create calculated price tiers from existing data (don't recalculate)
      if (hasPriceTiers && lumbarType.price > 0) {
        const existingCalculatedTiers = lumbarType.price_tiers?.map((tier: any) => {
          const discountPercentage = parseFloat(tier.discount_off_retail_price) || 0;
          const discountAmount = (lumbarType.price * discountPercentage) / 100;
          const calculatedPrice = lumbarType.price - discountAmount;
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
            discount_amount: discountAmount,
            override_price: isOverridden ? actualPrice : undefined,
            is_overridden: isOverridden
          };
        }) || [];
        
        setCalculatedPriceTiers(existingCalculatedTiers);
      }
      
      setFormData({
        name: lumbarType.name || '',
        description: lumbarType.description || '',
        image: null,
        cost: 0, // Not used anymore, will be set to 0 in submission
        price: lumbarType.price || 0,
        price_tier_ids: priceTierIds,
        price_adjustments: priceAdjustments
      });
      setCurrentImage(lumbarType.image || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load lumbar type');
      console.error('Error loading lumbar type:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  // Removed loadPriceTiers function as we're using simplified pricing

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
      console.log('Image file selected:', file);
      console.log('File type:', typeof file);
      console.log('File instanceof File:', file instanceof File);
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Verify the state was updated correctly
      setTimeout(() => {
        console.log('FormData after image update:', formData);
      }, 0);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Removed handlePriceTierChange function as we're using simplified pricing

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

    // Additional validation to ensure image is a File object if provided
    if (formData.image && !(formData.image instanceof File)) {
      console.error('Image is not a File object:', formData.image);
      setError('Invalid image file. Please select a valid image.');
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
        ) : undefined,
        // Include current image path if no new image is selected
        current_image: !formData.image && currentImage ? currentImage : undefined
      };

      // Additional debugging for submission data
      console.log('=== SUBMISSION DEBUG ===');
      console.log('FormData.image type:', typeof formData.image);
      console.log('FormData.image value:', formData.image);
      console.log('FormData.image instanceof File:', formData.image instanceof File);
      console.log('SubmissionData.image type:', typeof submissionData.image);
      console.log('SubmissionData.image value:', submissionData.image);
      console.log('Current image path:', currentImage);
      console.log('=== END SUBMISSION DEBUG ===');

      // Debug logging
      console.log('Form Data:', formData);
      console.log('Image File:', formData.image);
      console.log('Image File Name:', formData.image?.name);
      console.log('Image File Size:', formData.image?.size);
      console.log('Image File Type:', formData.image?.type);
      console.log('Image instanceof File:', formData.image instanceof File);
      console.log('Image constructor:', formData.image?.constructor?.name);
      console.log('Submission Data:', submissionData);

      // Create FormData manually to debug
      const debugFormData = new FormData();
      if (submissionData.name) debugFormData.append('name', submissionData.name);
      if (submissionData.description) debugFormData.append('description', submissionData.description);
      if (submissionData.image) debugFormData.append('image', submissionData.image);
      if (submissionData.current_image) debugFormData.append('current_image', submissionData.current_image);
      debugFormData.append('cost', submissionData.cost.toString());
      debugFormData.append('price', submissionData.price.toString());

      // Log FormData contents
      console.log('Debug FormData entries:');
      for (let [key, value] of debugFormData.entries()) {
        console.log(`${key}:`, value);
      }
      
      await lumbarTypesService.updateLumbarType(parseInt(id), submissionData);
      setSuccess('Lumbar Type updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/lumbar-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update lumbar type');
      console.error('Error updating lumbar type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/lumbar-types');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Lumbar Type">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Lumbar Type">
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
                  placeholder="Enter lumbar type name"
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
                    label="In Store Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                    placeholder="Enter in Store price"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Box>
                </Box>

                {/* Image Management */}
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
                              alt="Current lumbar type image"
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

                  {/* New Image Upload */}
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
                      {currentImage ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </label>
                  
                  {/* New Image Preview */}
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        New Image Preview:
                      </Typography>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 200,
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
                  <Box sx={{ mt: 2 }}>
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
                      backgroundColor: '#DA291C',
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.95rem', sm: '0.875rem' },
                      '&:hover': {
                        backgroundColor: '#B71C1C',
                      },
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Lumbar Type'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditLumbarTypePage;