'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import CustomerForm from '@/components/admin/CustomerForm';
import { useRouter } from 'next/navigation';

// Mock data - replace with API calls
const mockCustomerTypes = [
  {
    id: '1',
    name: 'Retail',
    description: 'Individual customers',
    discountPercentage: 0,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Wholesale',
    description: 'Business customers',
    discountPercentage: 15,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const CreateCustomerPage = () => {
  const router = useRouter();

  const handleSubmit = (customer: any) => {
    // Handle customer creation
    console.log('Creating customer:', customer);
    // Add API call here
    router.push('/admin/customers');
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
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Customer
        </Typography>
      </Box>
      
      <CustomerForm
        customerTypes={mockCustomerTypes}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default CreateCustomerPage; 