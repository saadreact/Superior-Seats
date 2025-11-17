'use client';

import React, { useState } from 'react';
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
  Divider} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

const CreateSeatStylePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [] as File[]
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value}));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...fileArray] }));
      
      // Create previews for new images
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input to allow selecting same file again
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
      
      // Step 1: Create seat style first (without images)
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };
      
      const createdSeatStyle = await apiService.createSeatStyle(submissionData);
      console.log('✅ Seat style created successfully:', createdSeatStyle);
      
      // Step 2: Extract seat style ID from response
      const seatStyleId = createdSeatStyle.id 
        || createdSeatStyle.data?.id 
        || createdSeatStyle.data?.seat_style?.id
        || createdSeatStyle.seat_style?.id;
      
      console.log('📋 Extracted seat style ID:', seatStyleId);
      console.log('📸 Images to upload:', formData.images.length);
      
      // Step 3: Upload images using the images API if any were selected
      if (formData.images.length > 0) {
        if (!seatStyleId) {
          setError('Seat style created but could not extract ID to upload images');
          console.error('❌ No seat style ID found in response:', createdSeatStyle);
          setTimeout(() => {
            router.push('/admin/seat-styles');
          }, 3000);
          return;
        }
        
        try {
          console.log('📤 Calling uploadSeatStyleImages API...');
          console.log('   - Seat Style ID:', seatStyleId);
          console.log('   - Image count:', formData.images.length);
          console.log('   - Set primary index: 0');
          
          await apiService.uploadSeatStyleImages(seatStyleId, {
            images: formData.images,
            set_primary: 0 // Set first image as primary
          });
          
          console.log('✅ Images uploaded successfully');
        } catch (imageError: any) {
          console.error('❌ Error uploading images:', imageError);
          console.error('❌ Error details:', {
            message: imageError.message,
            response: imageError.response?.data,
            status: imageError.response?.status
          });
          setError('Seat style created but failed to upload images: ' + (imageError.message || 'Unknown error'));
          setTimeout(() => {
            router.push('/admin/seat-styles');
          }, 3000);
          return;
        }
      }
      
      setSuccess('Seat Style created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/seat-styles');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create seat style');
      console.error('Error creating seat style:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/seat-styles');
  };

  return (
    <AdminLayout title="Create Seat Style">
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
                  placeholder="Enter seat style name"
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
                  Images
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{ mb: 2 }}
                    >
                      Upload Images
                    </Button>
                  </label>
                  
                  {formData.images.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {formData.images.length} image(s) selected
                    </Typography>
                  )}

                  {imagePreviews.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {imagePreviews.map((preview, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              maxWidth: '200px',
                              maxHeight: '200px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              minWidth: 'auto',
                              padding: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              }
                            }}
                          >
                            ×
                          </Button>
                          {index === 0 && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 8,
                                left: 8,
                                backgroundColor: 'primary.main',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.75rem'
                              }}
                            >
                              Primary
                            </Box>
                          )}
                        </Box>
                      ))}
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
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#DA291C',
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Seat Style'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateSeatStylePage; 