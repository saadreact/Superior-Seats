'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import CustomerForm from '@/components/admin/CustomerForm';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import { CustomerType } from '@/data/types';

const CreateCustomerPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);



  const handleSubmit = async (customer: any) => {
    try {
      await apiService.createCustomer(customer);
      router.push('/admin/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      setAlert({ type: 'error', message: 'Failed to create customer' });
    }
  };

  const handleCancel = () => {
    router.push('/admin/customers');
  };

  return (
    <AdminLayout title="Create New Customer">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/customers')}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontSize: { xs: '1.75rem', md: '2.125rem' }
        }}>
          Create New Customer
        </Typography>
      </Box>

      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 2 }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </AdminLayout>
  );
};

export default CreateCustomerPage; 