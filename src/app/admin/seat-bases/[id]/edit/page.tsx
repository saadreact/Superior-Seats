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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Save as SaveIcon, 
  Delete as DeleteIcon, 
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { seatBaseApi, SeatBaseImage } from '@/services/seatbaseApi';

const EditSeatBasePage = () => {
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
  });
  
  const [existingImages, setExistingImages] = useState<SeatBaseImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<SeatBaseImage | null>(null);

  useEffect(() => {
    loadSeatBase();
    loadImages();
  }, [id]);

  const loadSeatBase = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const response = await seatBaseApi.getSeatBase(parseInt(id));
      console.log('📥 Seat base response:', response);
      
      // Handle nested response structure: data.seat_base
      const seatBase = response.seat_base || response.data?.seat_base || response;
      
      setFormData({
        name: seatBase.name || '',
        description: seatBase.description || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load seat base');
      console.error('Error loading seat base:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadImages = async () => {
    try {
      const images = await seatBaseApi.getSeatBaseImages(parseInt(id));
      console.log('📸 Loaded images:', images);
      
      // Handle different response structures
      const imageArray = Array.isArray(images) ? images : (images.data || images.images || []);
      setExistingImages(imageArray);
    } catch (err: any) {
      console.error('Error loading images:', err);
      // Don't show error for images, just log it
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value}));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setNewImages(prev => [...prev, ...fileArray]);
      
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

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = (image: SeatBaseImage) => {
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteImage = async () => {
    if (imageToDelete) {
      try {
        setDeletingImageId(imageToDelete.id);
        await seatBaseApi.deleteSeatBaseImage(parseInt(id), imageToDelete.id);
        await loadImages(); // Reload images after deletion
        setDeleteDialogOpen(false);
        setImageToDelete(null);
      } catch (err: any) {
        setError(err.message || 'Failed to delete image');
        console.error('Error deleting image:', err);
      } finally {
        setDeletingImageId(null);
      }
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      await seatBaseApi.setPrimarySeatBaseImage(parseInt(id), imageId);
      await loadImages(); // Reload images to update primary status
    } catch (err: any) {
      setError(err.message || 'Failed to set primary image');
      console.error('Error setting primary image:', err);
    }
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
      
      // Step 1: Update basic seat base info (without images)
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };
      
      await seatBaseApi.updateSeatBase(parseInt(id), submissionData);
      console.log('✅ Seat base updated successfully');
      
      // Step 2: Upload new images if any were selected
      if (newImages.length > 0) {
        try {
          console.log('📤 Uploading new images:', newImages.length);
          await seatBaseApi.uploadSeatBaseImages(parseInt(id), {
            images: newImages,
          });
          console.log('✅ New images uploaded successfully');
        } catch (imageError: any) {
          console.error('❌ Error uploading new images:', imageError);
          setError('Seat base updated but failed to upload new images: ' + (imageError.message || 'Unknown error'));
          setTimeout(() => {
            router.push('/admin/seat-bases');
          }, 3000);
          return;
        }
      }
      
      setSuccess('Seat Base updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/seat-bases');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update seat base');
      console.error('Error updating seat base:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/seat-bases');
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
                  placeholder="Enter seat base name"
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

              {/* Images Section */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Images
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Existing Images:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {existingImages.map((image) => (
                        <Box key={image.id} sx={{ position: 'relative' }}>
                          <Box
                            sx={{
                              width: 200,
                              height: 200,
                              position: 'relative',
                              border: image.is_primary ? '3px solid #DA291C' : '1px solid #e0e0e0',
                              borderRadius: 1,
                              overflow: 'hidden'
                            }}
                          >
                            <img
                              src={image.image_url}
                              alt={image.alt_text || 'Seat base image'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            {image.is_primary && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  left: 8,
                                  backgroundColor: 'primary.main',
                                  color: 'white',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}
                              >
                                Primary
                              </Box>
                            )}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                display: 'flex',
                                gap: 0.5
                              }}
                            >
                              {!image.is_primary && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleSetPrimary(image.id)}
                                  sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                                    padding: '4px'
                                  }}
                                  title="Set as primary"
                                >
                                  <StarBorderIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteImage(image)}
                                disabled={deletingImageId === image.id}
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  color: 'error.main',
                                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                                  padding: '4px'
                                }}
                                title="Delete image"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Upload New Images */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Upload New Images:
                  </Typography>
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
                  
                  {newImages.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {newImages.length} new image(s) selected
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
                            onClick={() => handleRemoveNewImage(index)}
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
                    backgroundColor: 'primary.main',
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

        {/* Delete Image Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setImageToDelete(null);
          }}
        >
          <DialogTitle>Confirm Delete Image</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this image? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setDeleteDialogOpen(false);
                setImageToDelete(null);
              }} 
              disabled={deletingImageId !== null}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDeleteImage} 
              color="error" 
              variant="contained" 
              disabled={deletingImageId !== null}
            >
              {deletingImageId !== null ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default EditSeatBasePage;

