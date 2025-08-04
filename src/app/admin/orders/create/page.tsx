'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import OrderForm from '@/components/admin/OrderForm';
import { useRouter } from 'next/navigation';

// Mock data - replace with API calls
const mockCustomers = [
  {
    id: '1',
    customerTypeId: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'ABC Company',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    isActive: true,
    notes: 'Regular customer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    customerTypeId: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    company: 'XYZ Corporation',
    address: {
      street: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    isActive: true,
    notes: 'Wholesale customer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'Truck Seat - Standard',
    description: 'Standard truck seat with basic features',
    category: 'Seats',
    price: 299.99,
    isActive: true,
  },
  {
    id: '2',
    name: 'Truck Seat - Premium',
    description: 'Premium truck seat with advanced features',
    category: 'Seats',
    price: 499.99,
    isActive: true,
  },
  {
    id: '3',
    name: 'Seat Cover - Leather',
    description: 'High-quality leather seat cover',
    category: 'Accessories',
    price: 89.99,
    isActive: true,
  },
];

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
        customers={mockCustomers}
        products={mockProducts}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default CreateOrderPage; 