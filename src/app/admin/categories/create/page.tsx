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
    is_active: true,
    sort_order: 0,
  });

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
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Category
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
                <Button onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !formData.name.trim()}
                >
                  {loading ? 'Creating...' : 'Create Category'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateCategoryPage; 