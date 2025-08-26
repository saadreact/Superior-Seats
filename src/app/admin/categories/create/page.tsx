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
  Stack} from '@mui/material';
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
