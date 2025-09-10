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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { materialTypesService } from '@/services/material-types';

const CreateMaterialTypePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [priceTiers, setPriceTiers] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    cost: 0,
    price: 0
  });
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);

  useEffect(() => {
    // No need to load price tiers for simplified pricing
  }, []);

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

  // Removed loadPriceTiers function as we're using simplified pricing

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

    // Additional validation to ensure image is a File object
    if (!(formData.image instanceof File)) {
      console.error('Image is not a File object:', formData.image);
      setError('Invalid image file. Please select a valid image.');
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
      
      const submissionData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        cost: formData.cost,
        price: formData.price,
        price_tier_ids: [],
        price_adjustments: undefined
      };

      // Additional debugging for submission data
      console.log('=== SUBMISSION DEBUG ===');
      console.log('FormData.image type:', typeof formData.image);
      console.log('FormData.image value:', formData.image);
      console.log('FormData.image instanceof File:', formData.image instanceof File);
      console.log('SubmissionData.image type:', typeof submissionData.image);
      console.log('SubmissionData.image value:', submissionData.image);
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
      debugFormData.append('name', submissionData.name);
      if (submissionData.description) debugFormData.append('description', submissionData.description);
      if (submissionData.image) debugFormData.append('image', submissionData.image);
      debugFormData.append('cost', submissionData.cost.toString());
      debugFormData.append('price', submissionData.price.toString());

      // Log FormData contents
      console.log('Debug FormData entries:');
      for (let [key, value] of debugFormData.entries()) {
        console.log(`${key}:`, value);
      }
      
      await materialTypesService.createMaterialType(submissionData);
      setSuccess('Material Type created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/material-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create material type');
      console.error('Error creating material type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/material-types');
  };

  return (
    <AdminLayout title="Create New Material Type">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Material Types
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
                  placeholder="Enter material type name"
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
                    {loading ? 'Creating...' : 'Create Material Type'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateMaterialTypePage;
