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
  file: File;         // File object for multipart upload
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

      // Convert File[] -> ProductImage[] (no base64 conversion needed)
      const images: ProductImage[] = [];

      if (productData.newImages && productData.newImages.length > 0) {
        for (let i = 0; i < productData.newImages.length; i++) {
          const file = productData.newImages[i];

          images.push({
            file: file,               // Pass File object directly
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

      // Debug: Log the data being sent
      console.log('Product data being sent to API:', {
        ...apiData,
        images: apiData.images?.map(img => ({
          file: `File(${img.file.name}, ${img.file.size} bytes)`,
          alt_text: img.alt_text,
          caption: img.caption,
          set_primary: img.set_primary
        }))
      });

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

