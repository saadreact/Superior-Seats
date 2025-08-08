'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { apiService } from '@/utils/api';

interface Product {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images?: string[];
  is_active: boolean;
  variation_ids?: number[];
}

const CreateProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (productData: Product & { newImages?: File[] }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await apiService.createProduct(productData);
      
      setSuccess('Product created successfully!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <AdminLayout title="Create Product">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Product
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
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateProductPage; 