'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import CustomerForm from '@/components/admin/CustomerForm';
import { useRouter } from 'next/navigation';
import { Customer, CustomerType } from '@/data/types';
import { apiService } from '@/utils/api';

interface EditCustomerPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCustomerPage = ({ params }: EditCustomerPageProps) => {
  const router = useRouter();
  const [customer, setCustomer] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCustomer(parseInt(resolvedParams.id));
        
        // The API returns nested data structure: response.data.data
        const customerData = response.data?.data || response.data;

        setCustomer(customerData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlert({ type: 'error', message: 'Failed to load customer data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleSubmit = async (updatedCustomer: any) => {
    try {
      await apiService.updateCustomer(parseInt(resolvedParams.id), updatedCustomer);
      router.push('/admin/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
      setAlert({ type: 'error', message: 'Failed to update customer' });
    }
  };

  const handleCancel = () => {
    router.push('/admin/customers');
  };



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
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontSize: { xs: '1.75rem', md: '2.125rem' }
        }}>
          Edit Customer: {customer?.name}
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
      ) : customer ? (
        <CustomerForm
          customer={customer}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
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
      )}
    </AdminLayout>
  );
};



export default EditCustomerPage; 