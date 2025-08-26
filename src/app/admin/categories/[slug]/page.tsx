'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CategoryDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const loadCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getCategory(categorySlug);
      setCategory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load category');
      console.error('Error loading category:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      loadCategory();
    }
  }, [categorySlug]);

  const handleEdit = () => {
    router.push(`/admin/categories/${categorySlug}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/categories');
  };

  if (loading) {
    return (
      <AdminLayout title="Category Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !category) {
    return (
      <AdminLayout title="Category Details">
        <Box>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ color: 'text.secondary' }}
            >
              Back to Categories
            </Button>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Category not found'}
          </Alert>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Category Details">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Categories
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Category Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Category
          </Button>
        </Box>

        {/* Content */}
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {category.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {category.description || 'No description available'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Status
                  </Typography>
                  <Chip
                    label={category.is_active ? 'Active' : 'Inactive'}
                    color={category.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        Slug
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        {category.slug || 'No slug set'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        ID
                      </Typography>
                      <Typography variant="body1">
                        {category.id}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Timestamps
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {new Date(category.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(category.updated_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Box>

            {category.image_url && (
              <Box sx={{ width: { xs: '100%', md: 300 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Image
                </Typography>
                <Box
                  component="img"
                  src={category.image_url}
                  alt={category.name}
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    height: 'auto',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CategoryDetailPage; 