'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import CustomerForm from '@/components/admin/CustomerForm';
import { useRouter } from 'next/navigation';
import { Customer } from '@/data/types';

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

// Mock customer data
const mockCustomer: Customer = {
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
};

interface EditCustomerPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCustomerPage = ({ params }: EditCustomerPageProps) => {
  const router = useRouter();
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    // Simulate API call to fetch customer
    setTimeout(() => {
      setCustomer(mockCustomer);
      setLoading(false);
    }, 500);
  }, [resolvedParams.id]);

  const handleSubmit = (updatedCustomer: any) => {
    // Handle customer update
    console.log('Updating customer:', updatedCustomer);
    // Add API call here
    router.push('/admin/customers');
  };

  const handleCancel = () => {
    router.push('/admin/customers');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Customer">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout title="Customer Not Found">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">
            Customer not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/customers')}
            sx={{ mt: 2 }}
          >
            Back to Customers
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Customer">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/customers')}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Customer: {customer.firstName} {customer.lastName}
        </Typography>
      </Box>
      
      <CustomerForm
        customer={customer}
        customerTypes={mockCustomerTypes}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};



export default EditCustomerPage; 