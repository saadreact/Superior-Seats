'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress, 
  FormControlLabel, 
  Switch,
  Paper,
  useTheme,
  useMediaQuery,
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { 
  FormField, 
  SelectField, 
  FormActions,
  PhoneField
} from '@/components/common/FormComponents';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import { CustomerType } from '@/data/types';
import { US_STATES } from '@/api/customers';

const CreateCustomerPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState<boolean>(true);
  
  // Form data state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    company_name: '',
    price_tier_id: 1,
    is_active: true,
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
  const [priceTiers, setPriceTiers] = useState<any[]>([]);
  const [priceTiersLoading, setPriceTiersLoading] = useState(false);

  // Load price tiers from API
  const loadPriceTiers = async () => {
    try {
      setPriceTiersLoading(true);
      const response = await apiService.getPriceTiers();
      console.log('Price tiers loaded for customer form:', response);
      setPriceTiers(response || []);
    } catch (error) {
      console.error('Error loading price tiers:', error);
      setPriceTiers([]);
    } finally {
      setPriceTiersLoading(false);
    }
  };

  // Load price tiers on component mount
  useEffect(() => {
    loadPriceTiers();
  }, []);

  const getAllErrors = (): Record<string, string> => {
    return { ...serverErrors };
  };

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear server-side error for this field if provided
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
    setLoading(true);
    setAlert(null);
    setServerErrors({});
    try {
      // Create payload matching the backend schema exactly
      const customerData = {
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        email: formData.email || '',
        password: formData.password || '', // Include password for create
        phone: formData.phone || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        company_name: formData.company_name || '',
        customer_type: 'retail', // Hardcoded
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
      
      console.log('Creating customer with data:', customerData);
      await apiService.createCustomer(customerData);
      setAlert({ type: 'success', message: 'Customer created successfully' });
      router.push('/admin/customers');
    } catch (error: any) {
      const data = error?.response?.data;
      if (data?.status === 'error') {
        const fieldErrors: Record<string, string> = {};
        if (data?.errors && typeof data.errors === 'object') {
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
        }
        setServerErrors(fieldErrors);
      } else {
        setAlert({ type: 'error', message: data?.message || 'Something went wrong while creating the customer.' });
      }
    } finally {
      setLoading(false);
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

  // Generate price tier options for dropdown
  const priceTierOptions = priceTiers.map(tier => ({
    value: tier.id,
    label: `${tier.display_name || tier.name} (${tier.discount_off_retail_price}% discount)`
  }));

  const allErrors = getAllErrors();


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
    <AdminLayout title="Create Customer">
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
        ) : (
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
                    error={allErrors.first_name}
                  />

                  <FormField
                    name="last_name"
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(value) => handleFieldChange('last_name', value)}
                    required
                    error={allErrors.last_name}
                  />

                  <FormField
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(value) => handleFieldChange('email', value)}
                    type="email"
                    required
                    error={allErrors.email}
                  />

                  <FormField
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={(value) => handleFieldChange('password', value)}
                    type="password"
                    required
                    error={allErrors.password}
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
                    error={allErrors.phone}
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
                    error={allErrors.company_name}
                  />

                  <SelectField
                    name="price_tier_id"
                    label="Customer Price Tiers"
                    value={formData.price_tier_id.toString()}
                    onChange={(value) => handleFieldChange('price_tier_id', parseInt(value))}
                    options={priceTierOptions.map(option => ({
                      value: option.value.toString(),
                      label: option.label
                    }))}
                    required
                    error={allErrors.price_tier_id}
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
                    error={allErrors.shipping_address}
                  />
                  <FormField
                    name="shipping_address_line_2"
                    label="Address Line II"
                    value={formData.shipping_address_line_2}
                    onChange={(value) => handleFieldChange('shipping_address_line_2', value)}
                    error={allErrors.shipping_address_line_2}
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
                      error={allErrors.shipping_city}
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
                      error={allErrors.shipping_state}
                    />
                    <FormField
                      name="shipping_zip"
                      label="ZIP Code"
                      value={formData.shipping_zip}
                      onChange={(value) => handleFieldChange('shipping_zip', value)}
                      error={allErrors.shipping_zip}
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
                    error={allErrors.billing_address}
                  />

                  <FormField
                    name="billing_address_line_2"
                    label="Address Line II"
                    value={formData.billing_address_line_2}
                    onChange={(value) => handleFieldChange('billing_address_line_2', value)}
                    error={allErrors.billing_address_line_2}
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
                      error={allErrors.billing_city}
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
                      error={allErrors.billing_state}
                    />
                    <FormField
                      name="billing_zip"
                      label="ZIP Code"
                      value={formData.billing_zip}
                      onChange={(value) => handleFieldChange('billing_zip', value)}
                      error={allErrors.billing_zip}
                    />
                  </Grid>
                </Grid>
              </Box>

              <FormActions
                onSave={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
                saveText="Create"
              />
            </Box>
          </Paper>
        )}

      </Box>
    </AdminLayout>
  );
};

export default CreateCustomerPage; 
