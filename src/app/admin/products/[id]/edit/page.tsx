'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { useRouter } from 'next/navigation';

const categories = ['Seats', 'Accessories', 'Safety', 'Maintenance'];

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Truck Seat - Standard',
  description: 'Standard truck seat with basic features and comfort',
  category: 'Seats',
  price: 299.99,
  stock: 15,
  isActive: true,
  image: '/Truckimages/01.jpg',
  specifications: {
    material: 'Leather',
    color: 'Black',
    weight: '25 lbs',
    dimensions: '24" x 20" x 8"'
  }
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  return (
    <EditProductClient params={params} />
  );
};

const EditProductClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    // Simulate API call to fetch product
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  }, [resolvedParams.id]);

  const handleSubmit = (updatedProduct: any) => {
    // Handle product update
    console.log('Updating product:', updatedProduct);
    // Add API call here
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Product Not Found">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">
            Product not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/products')}
            sx={{ mt: 2 }}
          >
            Back to Products
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/products')}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Product: {product.name}
        </Typography>
      </Box>
      
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default EditProductPage; 