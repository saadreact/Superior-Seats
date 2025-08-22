'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
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
  product_images?: Array<{
    id: number;
    product_id: number;
    image_path: string;
    image_url: string;
    alt_text: string;
    caption: string | null;
    sort_order: number;
    is_primary: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
  primary_image?: {
    id: number;
    product_id: number;
    image_path: string;
    image_url: string;
    alt_text: string;
    caption: string | null;
    sort_order: number;
    is_primary: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
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
  const [dataLoaded, setDataLoaded] = useState(false);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

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
      
      // Convert product_images to images format for the form
      // Handle both old format (images array) and new format (product_images array)
      let images = [];
      if (productData.product_images && productData.product_images.length > 0) {
        // New format: product_images array with image_path
        images = productData.product_images.map((img: any) => img.image_path);
      } else if (productData.images && productData.images.length > 0) {
        // Old format: images array (could be strings or objects)
        images = productData.images.map((img: any) => 
          typeof img === 'string' ? img : img.image_path || img
        );
      }
      
      setProduct({
        ...productData,
        images: images, // Use the converted images array
        variation_ids: variationIds,
      });
      setOriginalImages(images); // Store original images
      setDataLoaded(true);
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
    primaryImageIndex?: number;
    removedImages?: string[];
  }) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Send new images only (existing images are preserved by backend)
      const images: Array<{
        file: string;
        alt_text: string;
        caption: string;
        set_primary: boolean;
      }> = [];

      // Add new images only
      if (productData.newImages && productData.newImages.length > 0) {
        for (let i = 0; i < productData.newImages.length; i++) {
          const file = productData.newImages[i];
          const base64 = await fileToBase64(file);
          
          // Calculate if this new image should be primary
          const totalImageIndex = (productData.images?.length || 0) + i;
          const isPrimary = totalImageIndex === (productData.primaryImageIndex || 0);

          images.push({
            file: base64 as string,
            alt_text: file.name,
            caption: '',
            set_primary: isPrimary,
          });
        }
      }

      // Ensure only one image is marked as primary
      let primaryFound = false;
      images.forEach((image, index) => {
        if (image.set_primary && !primaryFound) {
          primaryFound = true;
        } else if (image.set_primary && primaryFound) {
          images[index].set_primary = false;
        }
      });

      // Calculate which images should be kept (original - removed)
      const imagesToKeep = originalImages.filter(img => !productData.removedImages?.includes(img));
      
      const apiData = {
        ...productData,
        images,
        existing_images: imagesToKeep, // Send images that should be kept
        removed_images: productData.removedImages || [], // Send images that should be removed
        primary_image_index: productData.primaryImageIndex || 0,
      };
      delete apiData.newImages;
      delete apiData.primaryImageIndex;

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

  if (loading || !dataLoaded) {
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
            Edit Product
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