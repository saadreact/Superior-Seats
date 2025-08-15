'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Alert, Box, CircularProgress } from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import OrderForm from '@/components/admin/OrderForm';
import { apiService } from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';

const EditOrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  // Helper function to safely parse order ID
  const getOrderIdNum = () => {
    const num = parseInt(orderId);
    if (isNaN(num)) {
      throw new Error(`Invalid order ID: ${orderId}`);
    }
    return num;
  };
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiService.getOrder(getOrderIdNum());
        console.log('Edit page - API response:', response);
        const orderData = response.data || response;
        console.log('Edit page - Order data for form:', orderData);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setAlert({ type: 'error', message: 'Failed to load order data' });
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleSubmit = async (orderData: any) => {
    try {
      await apiService.updateOrder(getOrderIdNum(), orderData);
      setAlert({ type: 'success', message: 'Order updated successfully!' });
      
      // Redirect to the order's view page after a short delay
      setTimeout(() => {
        router.push(`/admin/orders/${orderId}`);
      }, 1500);
    } catch (error: any) {
      console.error('Error updating order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update order. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const handleCancel = () => {
    router.push(`/admin/orders/${orderId}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          p: { xs: 2, md: 3 }
        }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="error">
            Order not found or failed to load.
          </Alert>
        </Box>
      </AdminLayout>
    );
  }

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
          Edit Order #{order.order_number}
        </Typography>

        <OrderForm
          order={order}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Box>
    </AdminLayout>
  );
};

export default EditOrderPage; 