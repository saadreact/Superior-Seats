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
  Divider,
  useTheme,
  useMediaQuery} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

const EditItemTypePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null
  });
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadItemType();
  }, [id]);

  const loadItemType = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const itemtypes = await apiService.getItemType(parseInt(id));
      setFormData({
        name: itemtypes.name || '',
        description: itemtypes.description || '',
        image: null
      });
      setCurrentImage(itemtypes.image || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load item type');
      console.error('Error loading item type:', err);
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
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
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
      
      // Include image in payload (optional)
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image || undefined
      };
      
      await apiService.updateItemType(parseInt(id), submissionData);
      setSuccess('Seat Base updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/item-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update seat base');
      console.error('Error updating seat base:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/item-types');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Seat Base">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Seat Base">
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
                  placeholder="Enter Seat Base name"
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
                  sx={{ mb: 3 }}
                />
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
                        src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/${currentImage}`}
                        alt="Current"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
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
                      {formData.image ? `Image Selected: ${formData.image.name}` : (currentImage ? 'Change Image' : 'Upload Image')}
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
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  fullWidth={isMobile}
                  sx={{
                    backgroundColor: 'primary.main',
                    minHeight: { xs: 44, sm: 'auto' },
                    fontSize: { xs: '0.95rem', sm: '0.875rem' },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  {loading ? 'Updating...' : 'Update Seat Base'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditItemTypePage;