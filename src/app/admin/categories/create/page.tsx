'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Alert,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Divider} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  
}

const CreateCategoryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    image_url: '',
    is_active: true});

  const handleChange = (field: keyof CategoryFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value}));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await apiService.createCategory(formData);

      setSuccess('Category created successfully!');
      setTimeout(() => {
        router.push('/admin/categories');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      console.error('Error creating category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/categories');
  };

  return (
    <AdminLayout title="Create Category">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/categories')}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
        </Box>

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

        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* Basic Information */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    Basic Information
                  </Typography>
                  
                  {/* Status Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={handleChange('is_active')}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formData.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                    labelPlacement="start"
                    sx={{ 
                      gap: 1,
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Category Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    placeholder="Enter category name"
                    error={!!error && !formData.name.trim()}
                    helperText={!formData.name.trim() && error ? 'Category name is required' : ''}
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    placeholder="Enter category description"
                    multiline
                    rows={4}
                  />
                </Stack>
              </Box>

              {/* Additional Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Slug"
                    value={formData.slug}
                    onChange={handleChange('slug')}
                    placeholder="Enter category slug (e.g., truck-seats)"
                    helperText="URL-friendly version of the name (lowercase, hyphens instead of spaces)"
                  />

                  <TextField
                    fullWidth
                    label="Image URL"
                    value={formData.image_url}
                    onChange={handleChange('image_url')}
                    placeholder="Enter image URL"
                    helperText="Optional: URL to category image"
                  />
                </Stack>
              </Box>

              {/* Actions */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !formData.name.trim()}
                  sx={{
                    backgroundColor: '#DA291C',
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Category'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateCategoryPage; 
