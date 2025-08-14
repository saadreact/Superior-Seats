'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import OrderForm from '@/components/admin/OrderForm';
import { useRouter } from 'next/navigation';



const CreateOrderPage = () => {
  const router = useRouter();

  const handleSubmit = (order: any) => {
    // Handle order creation
    console.log('Creating order:', order);
    // Add API call here
    router.push('/admin/orders');
  };

  const handleCancel = () => {
    router.push('/admin/orders');
  };

  return (
    <AdminLayout title="Create New Order">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/orders')}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Order
        </Typography>
      </Box>
      
      <OrderForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default CreateOrderPage; 