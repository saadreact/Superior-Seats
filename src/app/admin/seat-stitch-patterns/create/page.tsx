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
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface PriceTier {
  id: number;
  name: string;
  display_name: string;
}

const CreateSeatStitchPatternPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    price_tier_ids: [] as number[]
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      const priceTiersRes = await apiService.getPriceTiers();
      setPriceTiers(Array.isArray(priceTiersRes) ? priceTiersRes : []);
    } catch (err: any) {
      console.error('Error loading options:', err);
    } finally {
      setLoadingOptions(false);
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

    if (!formData.image) {
      setError('Image is required');
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

      console.log('Submitting data:', submissionData);
      
      await apiService.createSeatStitchPattern(submissionData);
      setSuccess('Seat Stitch Pattern created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/seat-stitch-patterns');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create seat stitch pattern');
      console.error('Error creating seat stitch pattern:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/seat-stitch-patterns');
  };

  return (
    <AdminLayout title="Create Seat Stitch Pattern">
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

                {/* Image Upload */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1, pt: 2 }}>
                  Image Upload
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
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      {formData.image ? formData.image.name : 'Upload Image'}
                    </Button>
                  </label>
                  
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Preview:
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
                    {loading ? 'Creating...' : 'Create Seat Stitch Pattern'}
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

export default CreateSeatStitchPatternPage; 