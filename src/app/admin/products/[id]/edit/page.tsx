'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { apiService } from '@/utils/api';

interface Product {
  id?: number;
  name: string;
  description: string;
  category_id?: number;
  vehicle_trim_id?: number;
  price: number;
  stock: number;
  images?: string[];
  is_active: boolean;
  variation_ids?: number[];
  variations?: Array<{
    id: number;
    name: string;
    stitch_pattern: string;
    arm_type: string;
    lumbar: string;
    recline_type: string;
    seat_type: string;
    material_type: string;
    heat_option: string;
    seat_item_type: string;
    color: string;
    price: string;
    image?: string;
    is_active: boolean;
    pivot: {
      product_id: number;
      variation_id: number;
    };
  }>;
}

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProduct(parseInt(productId));
      console.log('Product API response:', response);
      
      // Handle the new response structure
      let productData;
      if (response && response.data) {
        productData = response.data;
      } else if (response) {
        productData = response;
      } else {
        throw new Error('Invalid response structure');
      }
      
      // Extract variation_ids from the nested variations array
      const variationIds = productData.variations?.map((variation: any) => variation.id) || [];
      
      setProduct({
        ...productData,
        variation_ids: variationIds,
      });
    } catch (err: any) {
      if (err.message.includes('404') || err.message.includes('not found')) {
        setError('Product not found');
      } else {
        setError(err.message || 'Failed to load product');
      }
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleSubmit = async (productData: {
    name: string;
    description: string;
    category_id?: number;
    vehicle_trim_id?: number;
    price: number;
    stock: number;
    images?: string[];
    is_active: boolean;
    variation_ids?: number[];
    newImages?: File[];
  }) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Convert File[] to base64 strings for the API
      const images: Array<{
        file: string;
        alt_text: string;
        caption: string;
        set_primary: boolean;
      }> = [];

      if (productData.newImages && productData.newImages.length > 0) {
        for (let i = 0; i < productData.newImages.length; i++) {
          const file = productData.newImages[i];
          const base64 = await fileToBase64(file);

          images.push({
            file: base64 as string,
            alt_text: file.name,
            caption: '',
            set_primary: i === 0,
          });
        }
      }

      const apiData = {
        ...productData,
        images,
      };
      delete apiData.newImages;

      await apiService.updateProduct(parseInt(productId), apiData);
      
      setSuccess('Product updated successfully!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error && !product) {
    return (
      <AdminLayout title="Edit Product">
        <Box>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Product
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

        {product && (
          <Paper sx={{ p: 3 }}>
            <ProductForm
              product={product}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={saving}
            />
          </Paper>
        )}
      </Box>
    </AdminLayout>
  );
};

export default EditProductPage;

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