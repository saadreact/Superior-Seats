'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { useRouter } from 'next/navigation';

const categories = ['Seats', 'Accessories', 'Safety', 'Maintenance'];

const CreateProductPage = () => {
  const router = useRouter();

  const handleSubmit = (product: any) => {
    // Handle product creation
    console.log('Creating product:', product);
    // Add API call here
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <AdminLayout title="Create New Product">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/products')}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Product
        </Typography>
      </Box>
      
      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default CreateProductPage; 