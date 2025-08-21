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
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import Image from 'next/image';

interface Variation {
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
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
    description: string;
    slug: string;
    image_url: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
  } | null;
  price: string;
  stock: number;
  images?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variations: Variation[];
}

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProduct(parseInt(productId));
      console.log('Product view API response:', response);
      
      // Handle the new response structure
      let productData;
      if (response && response.data) {
        productData = response.data;
      } else if (response) {
        productData = response;
      } else {
        throw new Error('Invalid response structure');
      }
      
      setProduct(productData);
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

  const handleEdit = () => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <AdminLayout title="Product Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout title="Product Details">
        <Box>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Product not found'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Products
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Product Details">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Product Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Product
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Product Information */}
          <Box sx={{ flex: { xs: '1', md: '2' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={product.category?.name || 'No Category'} color="primary" />
                <Chip 
                  label={product.is_active ? 'Active' : 'Inactive'} 
                  color={product.is_active ? 'success' : 'default'} 
                />
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {product.description}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Stock
                  </Typography>
                  <Typography variant="h6">
                    {product.stock}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {new Date(product.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Updated
                  </Typography>
                  <Typography variant="body2">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {product.images && product.images.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  {product.images.map((image, index) => (
                    <Image
                      key={index}
                      src={`https://superiorseats.ali-khalid.com${image}`}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={200}
                      height={150}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  ))}
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No images available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Variations */}
          <Box sx={{ flex: { xs: '1', md: '1' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Associated Variations ({product.variations.length})
              </Typography>
              
              {product.variations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No variations associated with this product.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {product.variations.map((variation) => (
                    <Card key={variation.id} variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {variation.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {variation.stitch_pattern} - {variation.material_type} {variation.color}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={variation.seat_type} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={variation.arm_type} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={variation.heat_option} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Products
          </Button>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default ProductDetailPage; 