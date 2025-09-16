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
  FormControlLabel,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { heatOptionsService } from '@/services/heat-options';

const CreateHeatOptionPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);
  
  const [priceTiers, setPriceTiers] = useState<Array<{id: number, name: string, display_name: string}>>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    }
  };

  useEffect(() => {
    const loadPriceTiers = async () => {
      try {
        const response = await heatOptionsService.getPriceTiers();
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
        price_tier_ids: enablePriceTiers && formData.price_tier_ids.length > 0 ? formData.price_tier_ids : [],
        price_adjustments: enablePriceTiers && Object.keys(formData.price_adjustments).length > 0 ? formData.price_adjustments : undefined
      };
      
      console.log('Submitting heat option data:', submissionData);
      console.log('Image file details:', {
        name: formData.image?.name,
        size: formData.image?.size,
        type: formData.image?.type
      });
      
      const result = await heatOptionsService.createHeatOption(submissionData);
      console.log('API response:', result);
      
      setSuccess('Heat Option created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/heat-options');
      }, 1500);
      
    } catch (err: any) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      let errorMessage = 'Failed to create heat option';
      
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

  return (
    <AdminLayout title="Create Heat Option">
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
                  placeholder="Enter heat option name"
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
                    label="Price (Retail)"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                    placeholder="Enter retail price"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
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
                </Box>
                </Box>

                {/* Image Upload Field */}
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
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Tier Pricing
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Retail Price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        required
                        fullWidth
                        placeholder="Enter retail price"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                      <TextField
                        label="Wholesale Price"
                        type="number"
                        value={formData.cost}
                        onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                        required
                        fullWidth
                        placeholder="Enter wholesale price"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
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
                    {loading ? 'Creating...' : 'Create Heat Option'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateHeatOptionPage;
