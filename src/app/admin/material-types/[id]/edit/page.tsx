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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { materialTypesService } from '@/services/material-types';
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

const EditMaterialTypePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    cost: 0,
    price: 0,
    price_tier_ids: [] as number[],
    price_adjustments: {} as Record<string, number>,
    color_ids: [] as number[],
    vendor_name: '',
    vendor_email: '',
    vendor_website: '',
    vendor_description: ''
  });
  
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);
  
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);

  useEffect(() => {
    loadOptions();
    loadMaterialType();
  }, [id]);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      const [priceTiersRes, colorsRes] = await Promise.all([
        materialTypesService.getPriceTiers(),
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

  const loadMaterialType = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const response = await materialTypesService.getMaterialType(parseInt(id));
      console.log('Loaded material type response:', response);
      
      // Extract the data from the response
      const materialType = response.data || response;
      console.log('Material type data:', materialType);
      
      // Extract price tier IDs and adjustments from pivot.price_adjustment
      const priceTierIds = materialType.price_tiers?.map((tier: any) => tier.id) || [];
      const priceAdjustments = materialType.price_tiers?.reduce((acc: Record<string, number>, tier: any) => {
        if (tier.pivot?.price_adjustment !== undefined) {
          acc[tier.id.toString()] = parseFloat(tier.pivot.price_adjustment);
        }
        return acc;
      }, {}) || {};
      
      // Extract color IDs from colors relationship
      const colorIds = materialType.colors?.map((color: any) => color.id) || [];
      
      // Enable price tiers if there are any price tiers
      const hasPriceTiers = priceTierIds.length > 0;
      setEnablePriceTiers(hasPriceTiers);
      
      // Create calculated price tiers from existing data
      let existingCalculatedTiers: CalculatedPriceTier[] = [];
      if (hasPriceTiers && materialType.price > 0) {
        const basePrice = typeof materialType.price === 'string' ? parseFloat(materialType.price) : materialType.price;
        
        existingCalculatedTiers = materialType.price_tiers?.map((tier: any) => {
          const existingPrice = parseFloat(tier.pivot?.price_adjustment) || 0;
          const calculatedPrice = VariantsCalculation.calculatePriceAdjustment(
            basePrice, 
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
            discount_amount: (basePrice * parseFloat(tier.discount_off_retail_price)) / 100,
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
        name: materialType.name || '',
        description: materialType.description || '',
        image: null,
        cost: typeof materialType.cost === 'string' ? parseFloat(materialType.cost) : materialType.cost || 0,
        price: typeof materialType.price === 'string' ? parseFloat(materialType.price) : materialType.price || 0,
        price_tier_ids: priceTierIds,
        price_adjustments: finalPriceAdjustments,
        color_ids: colorIds,
        vendor_name: materialType.vendor_name || '',
        vendor_email: materialType.vendor_email || '',
        vendor_website: materialType.vendor_website || '',
        vendor_description: materialType.vendor_description || ''
      });
      setCurrentImage(materialType.image || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load material type');
      console.error('Error loading material type:', err);
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

    if (formData.cost <= 0) {
      setError('Cost must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image,
        cost: formData.cost,
        price: formData.price,
        price_tier_ids: enablePriceTiers && calculatedPriceTiers.length > 0 ? calculatedPriceTiers.map(tier => tier.id) : [],
        price_adjustments: enablePriceTiers && calculatedPriceTiers.length > 0 ? Object.fromEntries(
          calculatedPriceTiers.map(tier => [
            tier.id.toString(), 
            VariantsCalculation.getFinalPrice(tier)
          ])
        ) : undefined,
        color_ids: formData.color_ids,
        vendor_name: formData.vendor_name.trim() || undefined,
        vendor_email: formData.vendor_email.trim() || undefined,
        vendor_website: formData.vendor_website.trim() || undefined,
        vendor_description: formData.vendor_description.trim() || undefined,
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
      
      await materialTypesService.updateMaterialType(parseInt(id), submissionData);
      setSuccess('Material Type updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/material-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update material type');
      console.error('Error updating material type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/material-types');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Material Type">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Material Type">
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
                  <Typography variant="h5" gutterBottom sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter material type name"
                  sx={{ 
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter description (optional)"
                  sx={{
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
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
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
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
                  <Typography variant="h5" gutterBottom sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Pricing Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    label="Cost"
                    type="number"
                    value={formData.cost === 0 ? '0' : formData.cost.toString()}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (inputValue === '0') {
                        handleInputChange('cost', 0);
                      } else {
                        const numericValue = parseFloat(inputValue) || 0;
                        handleInputChange('cost', numericValue);
                      }
                    }}
                    required
                    fullWidth
                    placeholder="Enter cost price"
                    inputProps={{ min: 0, step: 0.01 }}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.select();
                      }
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  />
                  
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
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  />
                </Box>
                </Box>

                {/* Image Management */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Image
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                
                <Box>
                  {/* Current Image */}
                  {currentImage && !imagePreview && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Image: {currentImage}
                      </Typography>
                      <Box
                        component="img"
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${currentImage}`}
                        alt="Current"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          borderRadius: 1,
                          border: '1px solid #e0e0e0',
                          display: 'block'
                        }}
                        onError={(e: any) => {
                          console.error('Failed to load image:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/${currentImage}`);
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <Box sx={{ 
                        display: 'none',
                        maxWidth: '100%',
                        maxHeight: 200,
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                        bgcolor: '#f5f5f5',
                        color: '#666',
                        p: 2.5,
                        textAlign: 'center'
                      }}>
                        Image not available
                      </Box>
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
                      sx={{ 
                        mb: 2,
                        minHeight: { xs: 44, sm: 'auto' },
                        fontSize: { xs: '0.95rem', sm: '0.875rem' },
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      {formData.image ? `Change Image: ${formData.image.name}` : 'Upload New Image'}
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

                {/* Vendor Information */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Vendor Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                <TextField
                  label="Vendor Name"
                  value={formData.vendor_name}
                  onChange={(e) => handleInputChange('vendor_name', e.target.value)}
                  fullWidth
                  placeholder="Enter vendor name (optional)"
                  sx={{ 
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />

                <TextField
                  label="Vendor Email"
                  type="email"
                  value={formData.vendor_email}
                  onChange={(e) => handleInputChange('vendor_email', e.target.value)}
                  fullWidth
                  placeholder="Enter vendor email (optional)"
                  sx={{ 
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />

                <TextField
                  label="Vendor Website"
                  type="url"
                  value={formData.vendor_website}
                  onChange={(e) => handleInputChange('vendor_website', e.target.value)}
                  fullWidth
                  placeholder="Enter vendor website (optional)"
                  sx={{ 
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />

                <TextField
                  label="Vendor Description"
                  value={formData.vendor_description}
                  onChange={(e) => handleInputChange('vendor_description', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Enter vendor description (optional)"
                  sx={{
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
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
                    label={
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }}>
                        Enable Price Tiers
                      </Typography>
                    }
                    sx={{ 
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '1rem', sm: '0.875rem' },
                        fontWeight: 500
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
                        fontSize: { xs: '0.9rem', sm: '0.75rem' }
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </Box>

                {enablePriceTiers && calculatedPriceTiers.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      mb: 2, 
                      color: 'text.primary',
                      fontSize: { xs: '1.1rem', sm: '1rem' }
                    }}>
                      Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      mb: 2, 
                      color: 'text.secondary',
                      fontSize: { xs: '0.9rem', sm: '0.875rem' }
                    }}>
                      Base price: ${VariantsCalculation.formatPrice(formData.price)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {calculatedPriceTiers.map((tier) => (
                        <Paper key={tier.id} variant="outlined" sx={{ 
                          p: { xs: 2, sm: 2 }
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start', 
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' }
                          }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '1rem', sm: '0.875rem' }
                              }}>
                                {tier.display_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ 
                                mb: 1,
                                fontSize: { xs: '0.9rem', sm: '0.75rem' }
                              }}>
                                {parseFloat(tier.discount_off_retail_price) > 0 
                                  ? `${tier.discount_off_retail_price}% discount` 
                                  : 'No discount'
                                }
                              </Typography>
                              {tier.is_overridden && (
                                <Typography variant="body2" color="text.secondary" sx={{
                                  fontSize: { xs: '0.9rem', sm: '0.75rem' }
                                }}>
                                  Calculated: ${VariantsCalculation.formatPrice(tier.calculated_price)}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ 
                              minWidth: { xs: '100%', sm: 120 },
                              width: { xs: '100%', sm: 'auto' }
                            }}>
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
                                sx={{ 
                                  mb: 1,
                                  '& .MuiInputBase-input': {
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                  },
                                  '& .MuiInputLabel-root': {
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                  }
                                }}
                              />
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600, 
                                  color: tier.is_overridden ? 'warning.main' : 'primary.main',
                                  fontSize: { xs: '1.2rem', sm: '1.125rem' }
                                }}>
                                  ${VariantsCalculation.formatPrice(tier.is_overridden ? tier.override_price : tier.calculated_price)}
                                </Typography>
                                {tier.is_overridden && (
                                  <Typography variant="caption" color="warning.main" sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.75rem' }
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
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.95rem', sm: '0.875rem' },
                      order: { xs: 1, sm: 2 }
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Material Type'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditMaterialTypePage;