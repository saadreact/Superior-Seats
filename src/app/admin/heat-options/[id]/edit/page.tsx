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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { heatOptionsService } from '@/services/heat-options';

const EditHeatOptionPage = () => {
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
    cost: 0,
    price: 0,
    price_tier_ids: [] as number[],
    price_adjustments: {} as Record<string, number>
  });
  
  const [priceTiers, setPriceTiers] = useState<Array<{id: number, name: string, display_name: string}>>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    loadHeatOption();
    loadPriceTiers();
  }, [id]);

  const loadPriceTiers = async () => {
    try {
      const response = await heatOptionsService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err) {
      console.error('Error loading price tiers:', err);
    }
  };

  const loadHeatOption = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const heatOption = await heatOptionsService.getHeatOption(parseInt(id));
      setFormData({
        name: heatOption.name || '',
        description: heatOption.description || '',
        image: null,
        cost: heatOption.cost || 0,
        price: heatOption.price || 0,
        price_tier_ids: heatOption.price_tiers?.map((tier: any) => tier.id) || [],
        price_adjustments: heatOption.price_adjustments || {}
      });
      setCurrentImage(heatOption.image || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load heat option');
      console.error('Error loading heat option:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value}));
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
    const value = event.target.value as number[];
    setFormData(prev => ({ ...prev, price_tier_ids: value }));
  };

  const handlePriceAdjustmentChange = (tierId: number, adjustment: number) => {
    setFormData(prev => ({
      ...prev,
      price_adjustments: {
        ...prev.price_adjustments,
        [tierId.toString()]: adjustment
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.cost <= 0) {
      setError('Cost must be greater than 0');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create the data object that matches the backend schema
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image,
        cost: formData.cost,
        price: formData.price,
        price_tier_ids: formData.price_tier_ids.length > 0 ? formData.price_tier_ids : undefined,
        price_adjustments: Object.keys(formData.price_adjustments).length > 0 ? formData.price_adjustments : undefined
      };
      
      console.log('Updating heat option data:', submissionData);
      if (formData.image) {
        console.log('New image file details:', {
          name: formData.image.name,
          size: formData.image.size,
          type: formData.image.type
        });
      }
      
      const result = await heatOptionsService.updateHeatOption(parseInt(id), submissionData);
      console.log('API response:', result);
      
      setSuccess('Heat Option updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/heat-options');
      }, 1500);
      
    } catch (err: any) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      let errorMessage = 'Failed to update heat option';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/heat-options');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Heat Option">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Heat Option">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Heat Options
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, maxWidth: 800, width: '100%' }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Basic Information */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                  Basic Information
                </Typography>
                
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter heat option name"
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

                {/* Pricing Information */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1, pt: 2 }}>
                  Pricing Information
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Cost (Wholesale)"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                    placeholder="Enter wholesale cost"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                  <TextField
                    label="Price (Retail)"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                    placeholder="Enter retail price"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Box>

                {/* Image Upload */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1, pt: 2 }}>
                  Image
                </Typography>

                <Box>
                  {/* Current Image Display */}
                  {currentImage && !imagePreview && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        Current Image:
                      </Typography>
                      <img
                        src={`https://superiorseats.ali-khalid.com/${currentImage}`}
                        alt="Current"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
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
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Price Tiers */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1, pt: 2 }}>
                  Price Tiers
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Select Price Tiers</InputLabel>
                  <Select
                    multiple
                    value={formData.price_tier_ids}
                    onChange={handlePriceTierChange}
                    input={<OutlinedInput label="Select Price Tiers" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const tier = priceTiers.find(t => t.id === value);
                          return (
                            <Chip key={value} label={tier?.display_name || value} size="small" />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {priceTiers.map((tier) => (
                      <MenuItem key={tier.id} value={tier.id}>
                        <Checkbox checked={formData.price_tier_ids.indexOf(tier.id) > -1} />
                        <ListItemText primary={tier.display_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Price Adjustments for Selected Tiers */}
                {formData.price_tier_ids.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Price Adjustments by Tier
                    </Typography>
                    <Stack spacing={2}>
                      {formData.price_tier_ids.map((tierId) => {
                        const tier = priceTiers.find(t => t.id === tierId);
                        return (
                          <Box key={tierId} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 500 }}>
                              {tier?.display_name}:
                            </Typography>
                            <TextField
                              label="Price Adjustment"
                              type="number"
                              size="small"
                              value={formData.price_adjustments[tierId.toString()] || 0}
                              onChange={(e) => handlePriceAdjustmentChange(tierId, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              inputProps={{ step: 0.01 }}
                              sx={{ maxWidth: 150 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              (Additional amount for this tier)
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, pt: 3, justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ minWidth: 150, py: 1.5 }}
                  >
                    {loading ? 'Updating...' : 'Update Heat Option'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                    sx={{ minWidth: 120, py: 1.5 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default EditHeatOptionPage;