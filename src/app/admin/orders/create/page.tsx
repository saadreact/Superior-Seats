'use client';

import React, { useState } from 'react';
import { Typography, Alert, Box } from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import OrderForm from '@/components/admin/OrderForm';
import { apiService } from '@/utils/api';
import { useRouter } from 'next/navigation';

const CreateOrderPage = () => {
  const router = useRouter();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (orderData: any) => {
    try {
      const response = await apiService.createOrder(orderData);
      console.log('Order creation response:', response);
      
      // Check if the response indicates success
      if (!response || (response.status && response.status !== 'success')) {
        throw new Error('Order creation response indicates failure');
      }
      
      setAlert({ type: 'success', message: 'Order created successfully!' });
      
      // Extract order ID from response - try multiple possible locations
      let orderId = null;
      if (response.data?.id) {
        orderId = response.data.id;
      } else if (response.id) {
        orderId = response.id;
      } else if (response.data?.data?.id) {
        orderId = response.data.data.id;
      }
      
      console.log('Extracted order ID:', orderId);
      
      if (orderId) {
        console.log('Redirecting to order ID:', orderId);
        console.log('Redirect URL:', `/admin/orders/${orderId}`);
        // Redirect to the newly created order's view page after a short delay
        setTimeout(() => {
          router.push(`/admin/orders/${orderId}`);
        }, 1500);
      } else {
        console.error('Could not extract order ID from response');
        // Redirect to orders list instead
        setTimeout(() => {
          router.push('/admin/orders');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      console.error('Error response data:', error.response?.data);
      
      let errorMessage = 'Failed to create order. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        // Show first few validation errors
        const errorKeys = Object.keys(error.response.data.errors);
        if (errorKeys.length > 0) {
          const firstErrors = errorKeys.slice(0, 3).map(key => 
            `${key}: ${error.response.data.errors[key][0]}`
          ).join(', ');
          errorMessage = `Validation errors: ${firstErrors}`;
          if (errorKeys.length > 3) {
            errorMessage += ` (and ${errorKeys.length - 3} more...)`;
          }
        }
      }
      
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const handleCancel = () => {
    router.push('/admin/orders');
  };

  return (
    <AdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
            mb: 3,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Create New Order
        </Typography>

        <OrderForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Box>
    </AdminLayout>
  );
};

export default CreateOrderPage; 
