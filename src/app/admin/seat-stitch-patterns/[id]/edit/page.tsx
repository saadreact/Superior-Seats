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
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { seatStitchPatternService } from '@/services/seat-stitch-pattern';

interface PriceTier {
  id: number;
  name: string;
  display_name: string;
}

const EditSeatStitchPatternPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    price_tier_ids: [] as number[]
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadOptions();
    loadSeatStitchPattern();
  }, [id]);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      const priceTiersRes = await seatStitchPatternService.getPriceTiers();
      setPriceTiers(Array.isArray(priceTiersRes) ? priceTiersRes : []);
    } catch (err: any) {
      console.error('Error loading options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadSeatStitchPattern = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const seatStitchPattern = await seatStitchPatternService.getSeatStitchPattern(parseInt(id));
      
      setFormData({
        name: seatStitchPattern.name || '',
        description: seatStitchPattern.description || '',
        image: null,
        price_tier_ids: seatStitchPattern.price_tiers?.map((tier: any) => tier.id) || []
      });
      
      if (seatStitchPattern.image) {
        setCurrentImage(seatStitchPattern.image);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load seat stitch pattern');
      console.error('Error loading seat stitch pattern:', err);
    } finally {
      setInitialLoading(false);
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
      
      const submissionData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        price_tier_ids: formData.price_tier_ids
      };

      // Debug: Log the data being sent
      console.log('Seat Stitch Pattern edit data being sent to API:', {
        ...submissionData,
        image: submissionData.image ? `File(${submissionData.image.name}, ${submissionData.image.size} bytes, ${submissionData.image.type})` : null
      });
      
      await seatStitchPatternService.updateSeatStitchPattern(parseInt(id), submissionData);
      setSuccess('Seat Stitch Pattern updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/seat-stitch-patterns');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update seat stitch pattern');
      console.error('Error updating seat stitch pattern:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/seat-stitch-patterns');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Seat Stitch Pattern">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Seat Stitch Pattern">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Seat Stitch Patterns
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
                  placeholder="Enter seat stitch pattern name"
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
                  Image Management
                </Typography>

                {/* Current Image */}
                {currentImage && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Current Image:
                    </Typography>
                    <Box
                      component="img"
                      src={`https://superiorseats.ali-khalid.com/api/storage/${currentImage}`}
                      alt="Current"
                      sx={{
                        maxWidth: 200,
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </Box>
                )}

                {/* New Image Upload */}
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
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 2, mr: 2 }}
                    >
                      {formData.image ? formData.image.name : 'Upload New Image'}
                    </Button>
                  </label>
                  
                  {formData.image && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveImage}
                      sx={{ mb: 2 }}
                    >
                      Remove New Image
                    </Button>
                  )}
                  
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        New Image Preview:
                      </Typography>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Preview"
                        sx={{
                          maxWidth: 200,
                          maxHeight: 200,
                          objectFit: 'cover',
                          borderRadius: 1,
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
                            <Chip
                              key={value}
                              label={tier ? (tier.display_name || tier.name) : value}
                              size="small"
                            />
                          );
                        })}
                      </Box>
                    )}
                    disabled={loadingOptions}
                  >
                    {priceTiers.map((tier) => (
                      <MenuItem key={tier.id} value={tier.id}>
                        <Checkbox checked={formData.price_tier_ids.indexOf(tier.id) > -1} />
                        <ListItemText primary={tier.display_name || tier.name} />
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
                    disabled={loading || loadingOptions}
                    sx={{ minWidth: 150, py: 1.5 }}
                  >
                    {loading ? 'Updating...' : 'Update Seat Stitch Pattern'}
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

export default EditSeatStitchPatternPage; 