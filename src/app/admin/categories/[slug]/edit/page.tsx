'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  CircularProgress,
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

const EditCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    image_url: '',
    is_active: true});

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const category = await apiService.getCategory(categorySlug);
        
        setFormData({
          name: category.name || '',
          description: category.description || '',
          slug: category.slug || '',
          image_url: category.image_url || '',
          is_active: category.is_active ?? true});
      } catch (err: any) {
        setError(err.message || 'Failed to load category');
        console.error('Error loading category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      loadCategory();
    }
  }, [categorySlug]);

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
      setSaving(true);
      setError(null);
      setSuccess(null);

      await apiService.updateCategory(categorySlug, formData);

      setSuccess('Category updated successfully!');
      setTimeout(() => {
        router.push('/admin/categories');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
      console.error('Error updating category:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/categories');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Category">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Category">
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
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={saving || !formData.name.trim()}
                  sx={{
                    backgroundColor: '#DA291C',
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditCategoryPage; 