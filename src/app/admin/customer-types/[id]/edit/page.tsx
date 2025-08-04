'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import CustomerTypeForm from '@/components/admin/CustomerTypeForm';
import { useRouter } from 'next/navigation';

// Mock customer type data
const mockCustomerType = {
  id: '1',
  name: 'Retail',
  description: 'Individual customers',
  discountPercentage: 0,
  isActive: true,
};

interface EditCustomerTypePageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCustomerTypePage = ({ params }: EditCustomerTypePageProps) => {
  const router = useRouter();
  const [customerType, setCustomerType] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    // Simulate API call to fetch customer type
    setTimeout(() => {
      setCustomerType(mockCustomerType);
      setLoading(false);
    }, 500);
  }, [resolvedParams.id]);

  const handleSubmit = (updatedCustomerType: any) => {
    // Handle customer type update
    console.log('Updating customer type:', updatedCustomerType);
    // Add API call here
    router.push('/admin/customer-types');
  };

  const handleCancel = () => {
    router.push('/admin/customer-types');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Customer Type">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!customerType) {
    return (
      <AdminLayout title="Customer Type Not Found">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">
            Customer type not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/customer-types')}
            sx={{ mt: 2 }}
          >
            Back to Customer Types
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Customer Type">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/customer-types')}
          sx={{ mb: 2 }}
        >
          Back to Customer Types
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Customer Type: {customerType.name}
        </Typography>
      </Box>
      
      <CustomerTypeForm
        customerType={customerType}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};



export default EditCustomerTypePage; 