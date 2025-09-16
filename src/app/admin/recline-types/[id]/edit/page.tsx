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
import { reclineTypesService } from '@/services/recline-types';

const EditReclineTypePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
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
    price_tier_ids: [] as number[]
  });
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);

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
      setFormData({
        name: reclineType.name || '',
        description: reclineType.description || '',
        image: null,
        cost: reclineType.cost || 0,
        price: reclineType.price || 0,
        price_tier_ids: priceTierIds
      });
      setEnablePriceTiers(priceTierIds.length > 0);
      setCurrentImage(reclineType.image);
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
    
    // Clear price tiers when disabled
    if (!checked) {
      setFormData(prev => ({
        ...prev,
        price_tier_ids: []
      }));
    }
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
      
      // Only include image if a new one is uploaded
      const submissionData: any = {
        name: formData.name,
        description: formData.description,
        cost: formData.cost,
        price: formData.price,
        price_tier_ids: enablePriceTiers && formData.price_tier_ids.length > 0 ? formData.price_tier_ids : []
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
                        src={`https://superiorseats.ali-khalid.com/${currentImage}`}
                        alt="Current"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
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