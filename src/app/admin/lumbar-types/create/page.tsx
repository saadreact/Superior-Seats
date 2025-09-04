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
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

const CreateLumbarTypePage = () => {
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
    price_tier_ids: [] as number[]
  });

  useEffect(() => {
    loadPriceTiers();
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

  const loadPriceTiers = async () => {
    try {
      const response = await apiService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err) {
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

  const handlePriceTierChange = (event: any) => {
    const value = event.target.value;
    console.log('handlePriceTierChange - Raw value:', value);
    console.log('handlePriceTierChange - Value type:', typeof value);
    console.log('handlePriceTierChange - Is array:', Array.isArray(value));
    
    // Ensure we always get an array of numbers
    let numericIds: number[] = [];
    if (Array.isArray(value)) {
      numericIds = value.map(id => {
        const numId = Number(id);
        console.log(`Converting id "${id}" to number: ${numId}`);
        return numId;
      });
    } else if (value !== null && value !== undefined) {
      // Handle single value case
      const numId = Number(value);
      console.log(`Converting single value "${value}" to number: ${numId}`);
      numericIds = [numId];
    }
    
    console.log('handlePriceTierChange - Final numeric IDs:', numericIds);
    
    setFormData(prev => ({
      ...prev,
      price_tier_ids: numericIds
    }));
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

    try {
      setLoading(true);
      setError(null);
      
      const submissionData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        price_tier_ids: formData.price_tier_ids
      };

      // Additional debugging for submission data
      console.log('=== SUBMISSION DEBUG ===');
      console.log('FormData.image type:', typeof formData.image);
      console.log('FormData.image value:', formData.image);
      console.log('FormData.image instanceof File:', formData.image instanceof File);
      console.log('FormData.price_tier_ids type:', typeof formData.price_tier_ids);
      console.log('FormData.price_tier_ids value:', formData.price_tier_ids);
      console.log('FormData.price_tier_ids isArray:', Array.isArray(formData.price_tier_ids));
      console.log('SubmissionData.image type:', typeof submissionData.image);
      console.log('SubmissionData.image value:', submissionData.image);
      console.log('SubmissionData.price_tier_ids type:', typeof submissionData.price_tier_ids);
      console.log('SubmissionData.price_tier_ids value:', submissionData.price_tier_ids);
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
      if (submissionData.price_tier_ids && submissionData.price_tier_ids.length > 0) {
        submissionData.price_tier_ids.forEach(id => debugFormData.append('price_tier_ids[]', id.toString()));
      }

      // Log FormData contents
      console.log('Debug FormData entries:');
      for (let [key, value] of debugFormData.entries()) {
        console.log(`${key}:`, value);
      }
      
      await apiService.createLumbarType(submissionData);
      setSuccess('Lumbar Type created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/lumbar-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create lumbar type');
      console.error('Error creating lumbar type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/lumbar-types');
  };

  return (
    <AdminLayout title="Create Lumbar Type">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Lumbar Types
          </Button>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Create New Lumbar Type
        </Typography>

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
                  placeholder="Enter lumbar type name"
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

                {/* Image Upload Field */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1, mt: 2 }}>
                  Image
                </Typography>
                
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

                {/* Price Tiers */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1, mt: 2 }}>
                  Price Tiers
                </Typography>
                
                <FormControl fullWidth>
                  <InputLabel>Select Price Tiers</InputLabel>
                  <Select
                    multiple
                    value={formData.price_tier_ids}
                    onChange={handlePriceTierChange}
                    input={<OutlinedInput label="Select Price Tiers" />}
                    onOpen={() => {
                      console.log('Select opened - current value:', formData.price_tier_ids);
                      console.log('Select opened - current value type:', typeof formData.price_tier_ids);
                      console.log('Select opened - current value is array:', Array.isArray(formData.price_tier_ids));
                    }}
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

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, pt: 3, justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ minWidth: 150, py: 1.5 }}
                  >
                    {loading ? 'Creating...' : 'Create Lumbar Type'}
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

export default CreateLumbarTypePage;
