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
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

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
    price_tier_ids: [] as number[]
  });

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
      
      const reclineType = await apiService.getReclineType(parseInt(id));
      setFormData({
        name: reclineType.name || '',
        description: reclineType.description || '',
        image: null,
        price_tier_ids: reclineType.price_tiers?.map((tier: any) => tier.id) || []
      });
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
      const response = await apiService.getPriceTiers();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Only include image if a new one is uploaded
      const submissionData: any = {
        name: formData.name,
        description: formData.description,
        price_tier_ids: formData.price_tier_ids
      };

      // Only add image to submission data if a new image is selected
      if (formData.image) {
        submissionData.image = formData.image;
      }

      console.log('Submitting recline type update data:', submissionData);
      
      await apiService.updateReclineType(parseInt(id), submissionData);
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
            Back to Recline Types
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
                  placeholder="Enter recline type name"
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

                {/* Image Management */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1, pt: 2 }}>
                  Image
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {currentImage 
                    ? 'Current image will be kept unless you upload a new one or remove it.' 
                    : 'No current image. Upload an image to add one.'
                  }
                </Typography>

                <Box>
                  {/* Current Image */}
                  {currentImage && !formData.image && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Image:
                      </Typography>
                      <img
                        src={`https://superiorseats.ali-khalid.com/api/storage/${currentImage}`}
                        alt="Current"
                        style={{
                          width: 200,
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #e0e0e0'
                        }}
                      />
                    </Box>
                  )}

                  {/* New Image Upload */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                      >
                        {formData.image ? `Change Image: ${formData.image.name}` : 'Upload New Image'}
                      </Button>
                    </label>
                    
                    {/* Clear Image Button */}
                    {(formData.image || currentImage) && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: null }));
                          setImagePreview(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    )}
                  </Box>
                  
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        New Image Preview:
                      </Typography>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: 200,
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #e0e0e0'
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
                            <Chip key={value} label={tier?.display_name || `Tier ${value}`} size="small" />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {priceTiers.map((tier) => (
                      <MenuItem key={tier.id} value={tier.id}>
                        <Checkbox checked={formData.price_tier_ids.indexOf(tier.id) > -1} />
                        <ListItemText primary={tier.display_name} secondary={tier.description} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Update Summary */}
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: 1, borderColor: 'grey.200' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Update Summary:</strong> 
                    {formData.image 
                      ? ' New image will be uploaded and replace current image.' 
                      : currentImage 
                        ? ' Current image will be kept.' 
                        : ' No image will be set.'
                    }
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, pt: 3, justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ minWidth: 150, py: 1.5 }}
                  >
                    {loading ? 'Updating...' : 'Update Recline Type'}
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

export default EditReclineTypePage; 