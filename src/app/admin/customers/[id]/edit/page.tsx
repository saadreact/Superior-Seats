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
  useMediaQuery,
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { 
  FormField, 
  SelectField, 
  FormActions,
  PhoneField
} from '@/components/common/FormComponents';
import { useRouter } from 'next/navigation';
import { Customer, CustomerType } from '@/data/types';
import { apiService } from '@/utils/api';
import { US_STATES } from '@/api/customers';

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
  const [priceTiers, setPriceTiers] = React.useState<any[]>([]);
  const [priceTiersLoading, setPriceTiersLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    company_name: '',
    price_tier_id: 1,
    // Shipping Address Fields
    shipping_address: '',
    shipping_address_line_2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    // Billing Address Fields
    billing_address: '',
    billing_address_line_2: '',
    billing_city: '',
    billing_state: '',
    billing_zip: '',
  });
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
        // Initialize local form state mirroring create page
        setFormData(prev => ({
          ...prev,
          first_name: customerData.first_name || '',
          last_name: customerData.last_name || '',
          email: customerData.email || '',
          phone: customerData.phone || '',
          address: customerData.address || '',
          city: customerData.city || '',
          state: customerData.state || '',
          company_name: customerData.company_name || '',
          price_tier_id: Number(customerData.price_tier_id) || 1,
          shipping_address: customerData.shipping_address || '',
          shipping_address_line_2: customerData.shipping_address_line_2 || '',
          shipping_city: customerData.shipping_city || '',
          shipping_state: customerData.shipping_state || '',
          shipping_zip: customerData.shipping_zip || '',
          billing_address: customerData.billing_address || '',
          billing_address_line_2: customerData.billing_address_line_2 || '',
          billing_city: customerData.billing_city || '',
          billing_state: customerData.billing_state || '',
          billing_zip: customerData.billing_zip || '',
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlert({ type: 'error', message: 'Failed to load customer data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  // Load price tiers
  React.useEffect(() => {
    const loadPriceTiers = async () => {
      try {
        setPriceTiersLoading(true);
        const response = await apiService.getPriceTiers();
        setPriceTiers(response || []);
      } catch (error) {
        console.error('Error loading price tiers:', error);
        setPriceTiers([]);
      } finally {
        setPriceTiersLoading(false);
      }
    };
    loadPriceTiers();
  }, []);

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if ((serverErrors as any)[field]) {
      setServerErrors(prev => {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Clear previous errors
      setAlert(null);
      setServerErrors({});
      
      // Create payload matching the backend schema exactly
      const customerData = {
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        company_name: formData.company_name || '',
        customer_type: 'retail', // Hardcoded like in create page
        price_tier_id: Number(formData.price_tier_id) || 1,
        is_active: Boolean(isActive),
        // Shipping Address Object
        shipping_address: {
          street: formData.shipping_address || '',
          street_2: formData.shipping_address_line_2 || '',
          city: formData.shipping_city || '',
          state: formData.shipping_state || '',
          postal_code: formData.shipping_zip || '',
          country: 'US',
          phone: formData.phone || '',
          is_default: true
        },
        // Billing Address Object
        billing_address: {
          street: formData.billing_address || '',
          street_2: formData.billing_address_line_2 || '',
          city: formData.billing_city || '',
          state: formData.billing_state || '',
          postal_code: formData.billing_zip || '',
          country: 'US',
          phone: formData.phone || '',
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
            else if (field === 'billing_address.street_2') frontendFieldName = 'billing_address_line_2';
            else if (field === 'billing_address.city') frontendFieldName = 'billing_city';
            else if (field === 'billing_address.state') frontendFieldName = 'billing_state';
            else if (field === 'billing_address.postal_code') frontendFieldName = 'billing_zip';
            else if (field === 'shipping_address.street') frontendFieldName = 'shipping_address';
            else if (field === 'shipping_address.street_2') frontendFieldName = 'shipping_address_line_2';
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
            <Box sx={{ pt: 2 }}>
              {/* Basic Information */}
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1 
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Basic Information
                  </Typography>
                  {statusToggle && (
                    <Box sx={{ marginRight: 2 }}>
                      {statusToggle}
                    </Box>
                  )}
                </Box>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="first_name"
                    label="First Name"
                    value={formData.first_name}
                    onChange={(value) => handleFieldChange('first_name', value)}
                    required
                    error={serverErrors.first_name}
                  />

                  <FormField
                    name="last_name"
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(value) => handleFieldChange('last_name', value)}
                    required
                    error={serverErrors.last_name}
                  />

                  <FormField
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(value) => handleFieldChange('email', value)}
                    type="email"
                    required
                    error={serverErrors.email}
                  />
                </Grid>
              </Box>

              {/* Contact Information */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Contact Information
                </Typography>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <PhoneField
                    name="phone"
                    value={formData.phone}
                    onChange={(value) => handleFieldChange('phone', value)}
                    required
                    error={serverErrors.phone}
                  />
                </Grid>
              </Box>

              {/* Business Information */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Business Name
                </Typography>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="company_name"
                    label="Company Name"
                    value={formData.company_name}
                    onChange={(value) => handleFieldChange('company_name', value)}
                    error={serverErrors.company_name}
                  />

                  <SelectField
                    name="price_tier_id"
                    label="Customer Price Tiers"
                    value={formData.price_tier_id.toString()}
                    onChange={(value) => handleFieldChange('price_tier_id', parseInt(value))}
                    options={priceTiers.map(tier => ({
                      value: String(tier.id),
                      label: `${tier.display_name || tier.name} (${tier.discount_off_retail_price}% discount)`
                    }))}
                    required
                    error={serverErrors.price_tier_id}
                    disabled={priceTiersLoading}
                  />
                </Grid>
              </Box>

              {/* Shipping Address */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Shipping Address
                </Typography>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="shipping_address"
                    label="Address Line I"
                    value={formData.shipping_address}
                    onChange={(value) => handleFieldChange('shipping_address', value)}
                    error={serverErrors.shipping_address}
                  />
                  <FormField
                    name="shipping_address_line_2"
                    label="Address Line II"
                    value={formData.shipping_address_line_2}
                    onChange={(value) => handleFieldChange('shipping_address_line_2', value)}
                    error={serverErrors.shipping_address_line_2}
                  />

                  <Grid
                    display="grid"
                    gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
                    gap={{ xs: 1, md: 1.5 }}
                    sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                  >
                    <FormField
                      name="shipping_city"
                      label="City"
                      value={formData.shipping_city}
                      onChange={(value) => handleFieldChange('shipping_city', value)}
                      error={serverErrors.shipping_city}
                    />
                    <SelectField
                      name="shipping_state"
                      label="State"
                      value={formData.shipping_state}
                      onChange={(value) => handleFieldChange('shipping_state', value)}
                      options={US_STATES.map(state => ({
                        value: state.value,
                        label: state.label
                      }))}
                      error={serverErrors.shipping_state}
                    />
                    <FormField
                      name="shipping_zip"
                      label="ZIP Code"
                      value={formData.shipping_zip}
                      onChange={(value) => handleFieldChange('shipping_zip', value)}
                      error={serverErrors.shipping_zip}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Billing Address */}
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1 
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Billing Address
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        billing_address: prev.shipping_address,
                        billing_address_line_2: prev.shipping_address_line_2,
                        billing_city: prev.shipping_city,
                        billing_state: prev.shipping_state,
                        billing_zip: prev.shipping_zip
                      }));
                    }}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      textTransform: 'none',
                      minWidth: { xs: 'auto', sm: '140px' },
                      height: { xs: 32, sm: 36 },
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    Copy from Shipping
                  </Button>
                </Box>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="billing_address"
                    label="Address Line I"
                    value={formData.billing_address}
                    onChange={(value) => handleFieldChange('billing_address', value)}
                    error={serverErrors.billing_address}
                  />

                  <FormField
                    name="billing_address_line_2"
                    label="Address Line II"
                    value={formData.billing_address_line_2}
                    onChange={(value) => handleFieldChange('billing_address_line_2', value)}
                    error={serverErrors.billing_address_line_2}
                  />

                  <Grid
                    display="grid"
                    gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
                    gap={{ xs: 1, md: 1.5 }}
                    sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                  >
                    <FormField
                      name="billing_city"
                      label="City"
                      value={formData.billing_city}
                      onChange={(value) => handleFieldChange('billing_city', value)}
                      error={serverErrors.billing_city}
                    />
                    <SelectField
                      name="billing_state"
                      label="State"
                      value={formData.billing_state}
                      onChange={(value) => handleFieldChange('billing_state', value)}
                      options={US_STATES.map(state => ({
                        value: state.value,
                        label: state.label
                      }))}
                      error={serverErrors.billing_state}
                    />
                    <FormField
                      name="billing_zip"
                      label="ZIP Code"
                      value={formData.billing_zip}
                      onChange={(value) => handleFieldChange('billing_zip', value)}
                      error={serverErrors.billing_zip}
                    />
                  </Grid>
                </Grid>
              </Box>

              <FormActions
                onSave={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
                saveText="Update"
              />
            </Box>
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