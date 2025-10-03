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
  const [serverErrors, setServerErrors] = React.useState<Record<string, string>>({});
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCustomer(parseInt(resolvedParams.id));
        
        // The API returns nested data structure: response.data.data
        const customerData = response.data?.data || response.data;
        
        // Extract addresses from the addresses array and add them as direct properties
        if (customerData.addresses && Array.isArray(customerData.addresses)) {
          const shippingAddress = customerData.addresses.find((addr: any) => addr.type === 'shipping');
          const billingAddress = customerData.addresses.find((addr: any) => addr.type === 'billing');
          
          // Add address data as direct properties for the form
          customerData.shipping_address = shippingAddress?.street || '';
          customerData.shipping_city = shippingAddress?.city || '';
          customerData.shipping_state = shippingAddress?.state || '';
          customerData.shipping_zip = shippingAddress?.postal_code || '';
          
          customerData.billing_address = billingAddress?.street || '';
          customerData.billing_city = billingAddress?.city || '';
          customerData.billing_state = billingAddress?.state || '';
          customerData.billing_zip = billingAddress?.postal_code || '';
        }

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
      // Clear previous errors
      setAlert(null);
      setServerErrors({});
      
      // Create payload matching the backend schema exactly
      const customerData = {
        first_name: updatedCustomer.first_name || '',
        last_name: updatedCustomer.last_name || '',
        email: updatedCustomer.email || '',
        phone: updatedCustomer.phone || '',
        address: updatedCustomer.address || '',
        city: updatedCustomer.city || '',
        state: updatedCustomer.state || '',
        company_name: updatedCustomer.company_name || '',
        customer_type: 'retail', // Hardcoded like in create page
        price_tier_id: Number(updatedCustomer.price_tier_id) || 1,
        is_active: Boolean(isActive),
        // Shipping Address Object
        shipping_address: {
          street: updatedCustomer.shipping_address || '',
          city: updatedCustomer.shipping_city || '',
          state: updatedCustomer.shipping_state || '',
          postal_code: updatedCustomer.shipping_zip || '',
          country: 'US',
          phone: updatedCustomer.phone || '',
          is_default: true
        },
        // Billing Address Object
        billing_address: {
          street: updatedCustomer.billing_address || '',
          city: updatedCustomer.billing_city || '',
          state: updatedCustomer.billing_state || '',
          postal_code: updatedCustomer.billing_zip || '',
          country: 'US',
          phone: updatedCustomer.phone || '',
          is_default: true
        }
      };
      
      console.log('Sending customer data:', customerData);
      await apiService.updateCustomer(parseInt(resolvedParams.id), customerData);
      setAlert({ type: 'success', message: 'Customer updated successfully' });
      router.push('/admin/customers');
    } catch (error: any) {
      console.error('Error updating customer:', error);
      console.error('Error response:', error?.response?.data);
      
      const data = error?.response?.data;
      
      // Handle validation errors (422 status) with field-specific errors
      if (error.response?.status === 422 && data?.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
          const arr = Array.isArray(messages) ? messages : [String(messages)];
          if (arr.length > 0) fieldErrors[field] = String(arr[0]);
        });
        setServerErrors(fieldErrors);
      } 
      // Handle backend error response with status: "error"
      else if (data?.status === 'error' && data?.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
          const arr = Array.isArray(messages) ? messages : [String(messages)];
          if (arr.length > 0) {
            // Map backend field names to frontend field names
            let frontendFieldName = field;
            
            // Handle nested address field errors
            if (field === 'billing_address.street') frontendFieldName = 'billing_address';
            else if (field === 'billing_address.city') frontendFieldName = 'billing_city';
            else if (field === 'billing_address.state') frontendFieldName = 'billing_state';
            else if (field === 'billing_address.postal_code') frontendFieldName = 'billing_zip';
            else if (field === 'shipping_address.street') frontendFieldName = 'shipping_address';
            else if (field === 'shipping_address.city') frontendFieldName = 'shipping_city';
            else if (field === 'shipping_address.state') frontendFieldName = 'shipping_state';
            else if (field === 'shipping_address.postal_code') frontendFieldName = 'shipping_zip';
            
            fieldErrors[frontendFieldName] = String(arr[0]);
          }
        });
        setServerErrors(fieldErrors);
      }
      // Handle other error responses
      else {
        let errorMessage = 'Failed to update customer';
        
        if (data) {
          if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (typeof data === 'string') {
            errorMessage = data;
          }
        }
        
        setAlert({ type: 'error', message: errorMessage });
      }
    }
  };

  const handleCancel = () => {
    router.push('/admin/customers');
  };

  const clearServerError = (field: string) => {
    setServerErrors(prev => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
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
              serverErrors={serverErrors}
              onClearServerError={clearServerError}
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