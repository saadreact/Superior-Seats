'use client';

import React, { useState, useEffect } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';
import OrderWizardEdit from '@/components/admin/OrderWizardEdit';

const EditOrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiService.getOrder(parseInt(orderId));
        const orderData = response.data || response;
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setAlert({ type: 'error', message: 'Failed to load order data' });
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', p: { xs: 2, md: 3 } }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="error">Order not found or failed to load.</Alert>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}

        <OrderWizardEdit order={order} />
      </Box>
    </AdminLayout>
  );
};

export default EditOrderPage; 