'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress, Alert, FormControlLabel, Switch } from '@mui/material';
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
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCustomer(parseInt(resolvedParams.id));
        
        // The API returns nested data structure: response.data.data
        const customerData = response.data?.data || response.data;

        setCustomer(customerData);
        setIsActive(customerData.is_active !== undefined ? customerData.is_active : true);
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
      const customerData = { ...updatedCustomer, is_active: isActive };
      await apiService.updateCustomer(parseInt(resolvedParams.id), customerData);
      router.push('/admin/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
      setAlert({ type: 'error', message: 'Failed to update customer' });
    }
  };

  const handleCancel = () => {
    router.push('/admin/customers');
  };

  const statusToggle = (
    <FormControlLabel
      control={
        <Switch
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          color="primary"
        />
      }
      label={
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
      }
      labelPlacement="start"
    />
  );

  return (
    <AdminLayout title="Edit Customer">
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/customers')}
        >
          Back to Customers
        </Button>
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
          statusToggle={statusToggle}
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