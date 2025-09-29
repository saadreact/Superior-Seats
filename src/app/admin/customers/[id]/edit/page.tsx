'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert, 
  FormControlLabel, 
  Switch,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
      // Remove empty password field for updates
      const { password, ...customerDataWithoutPassword } = updatedCustomer;
      
      // Create payload matching the backend schema exactly
      const customerData = {
        first_name: customerDataWithoutPassword.first_name || '',
        last_name: customerDataWithoutPassword.last_name || '',
        email: customerDataWithoutPassword.email || '',
        phone: customerDataWithoutPassword.phone || '',
        address: customerDataWithoutPassword.address || '',
        city: customerDataWithoutPassword.city || '',
        state: customerDataWithoutPassword.state || '',
        company_name: customerDataWithoutPassword.company_name || '',
        customer_type: 'retail', // Hardcoded like in create page
        price_tier_id: Number(customerDataWithoutPassword.price_tier_id) || 1,
        is_active: Boolean(isActive),
        // Shipping Address Fields
        shipping_address: customerDataWithoutPassword.shipping_address || '',
        shipping_city: customerDataWithoutPassword.shipping_city || '',
        shipping_state: customerDataWithoutPassword.shipping_state || '',
        shipping_zip: customerDataWithoutPassword.shipping_zip || '',
        // Billing Address Fields
        billing_address: customerDataWithoutPassword.billing_address || '',
        billing_city: customerDataWithoutPassword.billing_city || '',
        billing_state: customerDataWithoutPassword.billing_state || '',
        billing_zip: customerDataWithoutPassword.billing_zip || ''
      };
      
      console.log('Sending customer data:', customerData);
      await apiService.updateCustomer(parseInt(resolvedParams.id), customerData);
      setAlert({ type: 'success', message: 'Customer updated successfully' });
      router.push('/admin/customers');
    } catch (error: any) {
      console.error('Error updating customer:', error);
      console.error('Error response:', error?.response?.data);
      
      // Show more detailed error message
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          'Failed to update customer';
      setAlert({ type: 'error', message: errorMessage });
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
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          fontSize: { xs: '1rem', sm: '0.875rem' }
        }}>
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
      }
      labelPlacement="start"
      sx={{ 
        '& .MuiFormControlLabel-label': {
          fontSize: { xs: '1rem', sm: '0.875rem' },
          fontWeight: 500
        }
      }}
    />
  );

  return (
    <AdminLayout title="Edit Customer">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/customers')}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
        </Box>

        {/* Alerts */}
        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 3 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : customer ? (
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <CustomerForm
              customer={customer}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              statusToggle={statusToggle}
            />
          </Paper>
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
              Back
            </Button>
          </Box>
        )}
      </Box>
    </AdminLayout>
  );
};



export default EditCustomerPage; 