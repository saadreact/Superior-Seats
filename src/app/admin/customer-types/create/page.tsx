'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import CustomerTypeForm from '@/components/admin/CustomerTypeForm';
import { useRouter } from 'next/navigation';

const CreateCustomerTypePage = () => {
  const router = useRouter();

  const handleSubmit = (customerType: any) => {
    // Handle customer type creation
    console.log('Creating customer type:', customerType);
    // Add API call here
    router.push('/admin/customer-types');
  };

  const handleCancel = () => {
    router.push('/admin/customer-types');
  };

  return (
    <AdminLayout title="Create New Customer Type">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/customer-types')}
          sx={{ mb: 2 }}
        >
          Back to Customer Types
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Customer Type
        </Typography>
      </Box>
      
      <CustomerTypeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default CreateCustomerTypePage; 