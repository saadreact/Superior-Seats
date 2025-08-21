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
} from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
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
    is_active: true,
    sort_order: 0,
  });

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
          is_active: category.is_active ?? true,
          sort_order: category.sort_order || 0,
        });
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
      [field]: field === 'sort_order' ? parseInt(value as string) || 0 : value,
    }));
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
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Category
        </Typography>

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

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                error={!formData.name.trim() && formData.name !== ''}
                helperText={!formData.name.trim() && formData.name !== '' ? 'Category name is required' : ''}
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={3}
              />

              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={handleChange('slug')}
                helperText="URL-friendly version of the category name (optional)"
              />

              <TextField
                fullWidth
                label="Image URL"
                value={formData.image_url}
                onChange={handleChange('image_url')}
                helperText="URL to category image (optional)"
              />

              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sort_order}
                onChange={handleChange('sort_order')}
                helperText="Display order (lower numbers appear first)"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleChange('is_active')}
                  />
                }
                label="Active"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={saving || !formData.name.trim()}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditCategoryPage; 