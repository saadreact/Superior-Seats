'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { apiService } from '@/utils/api';

interface ProductImage {
  file: string;       // base64 string or URL
  alt_text: string;
  caption: string;
  set_primary: boolean;
}

interface Product {
  name: string;
  description: string;
  category_id?: number;
  vehicle_trim_id?: number;
  price: number;
  stock: number;
  is_active: boolean;
  variation_ids?: number[];
  images: ProductImage[];
}

const CreateProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (productData: {
    name: string;
    description: string;
    category_id?: number;
    vehicle_trim_id?: number;
    price: number;
    stock: number;
    is_active: boolean;
    variation_ids?: number[];
    newImages?: File[];   // comes from form
  }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Convert File[] -> ProductImage[]
      const images: ProductImage[] = [];

      if (productData.newImages && productData.newImages.length > 0) {
        for (let i = 0; i < productData.newImages.length; i++) {
          const file = productData.newImages[i];
          const base64 = await fileToBase64(file);

          images.push({
            file: base64 as string,
            alt_text: file.name,      // placeholder, can be replaced in ProductForm
            caption: '',
            set_primary: i === 0,     // first one primary by default
          });
        }
      }

      const apiData: Product = {
        name: productData.name,
        description: productData.description,
        category_id: productData.category_id,
        vehicle_trim_id: productData.vehicle_trim_id,
        price: productData.price,
        stock: productData.stock,
        is_active: productData.is_active,
        variation_ids: productData.variation_ids,
        images,
      };

      await apiService.createProduct(apiData);

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
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/products')}
            sx={{ mb: 2 }}
          >
            Back to Products
          </Button>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}>
            Create New Product
          </Typography>
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

/**
 * Helper: convert File -> base64 string
 */
const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
