'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { Button } from '@mui/material';
import { Customer, CustomerType } from '@/data/types';
import { 
  FormField, 
  SelectField, 
  SwitchField, 
  FormActions,
  AddressFields,
  PhoneField 
} from '@/components/common/FormComponents';
import { apiService } from '@/utils/api';
import { US_STATES } from '@/api/customers';

interface CustomerFormProps {
  customer?: any;
  isViewMode?: boolean;
  onSubmit: (customer: any) => void;
  onCancel: () => void;
  serverErrors?: Record<string, string>;
  onClearServerError?: (field: string) => void;
  statusToggle?: React.ReactNode;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  isViewMode = false,
  onSubmit,
  onCancel,
  serverErrors = {},
  onClearServerError,
  statusToggle,
}) => {
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
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    // Billing Address Fields
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_zip: '',
  });
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (customer) {
      console.log('Customer data for form:', customer);
      console.log('Shipping address data:', customer.shipping_address);
      console.log('Billing address data:', customer.billing_address);
      const name: string = customer.name || '';
      const firstNameFromName = name.split(' ')[0] || '';
      const lastNameFromName = name.split(' ').slice(1).join(' ') || '';
      setFormData({
        first_name: customer.first_name || firstNameFromName,
        last_name: customer.last_name || lastNameFromName,
        email: customer.email || '',
        password: '', // Don't populate password for edit
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        company_name: customer.company_name || '',
        price_tier_id: customer.price_tier_id || 1,
        is_active: customer.is_active !== undefined ? customer.is_active : true,
        // Shipping Address Fields - extract from nested object or use direct properties
        shipping_address: customer.shipping_address?.street || customer.shipping_address || '',
        shipping_city: customer.shipping_address?.city || customer.shipping_city || '',
        shipping_state: customer.shipping_address?.state || customer.shipping_state || '',
        shipping_zip: customer.shipping_address?.postal_code || customer.shipping_zip || '',
        // Billing Address Fields - extract from nested object or use direct properties
        billing_address: customer.billing_address?.street || customer.billing_address || '',
        billing_city: customer.billing_address?.city || customer.billing_city || '',
        billing_state: customer.billing_address?.state || customer.billing_state || '',
        billing_zip: customer.billing_address?.postal_code || customer.billing_zip || '',
      });
      
      // Log the form data to see what's being set
      console.log('Form data being set:', {
        shipping_address: customer.shipping_address?.street || customer.shipping_address || '',
        shipping_city: customer.shipping_address?.city || customer.shipping_city || '',
        shipping_state: customer.shipping_address?.state || customer.shipping_state || '',
        shipping_zip: customer.shipping_address?.postal_code || customer.shipping_zip || '',
        billing_address: customer.billing_address?.street || customer.billing_address || '',
        billing_city: customer.billing_address?.city || customer.billing_city || '',
        billing_state: customer.billing_address?.state || customer.billing_state || '',
        billing_zip: customer.billing_address?.postal_code || customer.billing_zip || '',
      });
    }
  }, [customer]);

  const getAllErrors = (): Record<string, string> => {
    return { ...serverErrors };
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear server-side error for this field if provided
    if (onClearServerError && (serverErrors as any)[field]) {
      onClearServerError(field);
    }
  };


  // Generate price tier options for dropdown
  const priceTierOptions = priceTiers.map(tier => ({
    value: tier.id,
    label: `${tier.display_name || tier.name} (${tier.discount_off_retail_price}% discount)`
  }));

  const allErrors = getAllErrors();

  return (
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
            disabled={isViewMode}
               
          />

          <FormField
            name="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={(value) => handleFieldChange('last_name', value)}
            required
            error={allErrors.last_name}
            disabled={isViewMode}
          />

          <FormField
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            type="email"
            required
            error={allErrors.email}
            disabled={isViewMode}
          />

          <FormField
            name="password"
            label="Update Password"
            value={formData.password}
            onChange={(value) => handleFieldChange('password', value)}
            type="password"
            error={allErrors.password}
            disabled={isViewMode}
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
            disabled={isViewMode}
          />

          <FormField
            name="address"
            label="Address"
            value={formData.address}
            onChange={(value) => handleFieldChange('address', value)}
            required
            error={allErrors.address}
            disabled={isViewMode}
          />

          <FormField
            name="city"
            label="City"
            value={formData.city}
            onChange={(value) => handleFieldChange('city', value)}
            error={allErrors.city}
            disabled={isViewMode}
          />

          <SelectField
            name="state"
            label="State"
            value={formData.state}
            onChange={(value) => handleFieldChange('state', value)}
            options={US_STATES.map(state => ({
              value: state.value,
              label: state.label
            }))}
            error={allErrors.state}
            disabled={isViewMode}
         
          />
        </Grid>
      </Box>

      {/* Business Information */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
          Business Information
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
            disabled={isViewMode}
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
            disabled={isViewMode || priceTiersLoading}
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
            label="Address"
            value={formData.shipping_address}
            onChange={(value) => handleFieldChange('shipping_address', value)}
            error={allErrors.shipping_address}
            disabled={isViewMode}
          />

          <FormField
            name="shipping_city"
            label="City"
            value={formData.shipping_city}
            onChange={(value) => handleFieldChange('shipping_city', value)}
            error={allErrors.shipping_city}
            disabled={isViewMode}
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
            disabled={isViewMode}
          />

          <FormField
            name="shipping_zip"
            label="ZIP Code"
            value={formData.shipping_zip}
            onChange={(value) => handleFieldChange('shipping_zip', value)}
            error={allErrors.shipping_zip}
            disabled={isViewMode}
          />
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
          {!isViewMode && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  billing_address: prev.shipping_address,
                  billing_city: prev.shipping_city,
                  billing_state: prev.shipping_state,
                  billing_zip: prev.shipping_zip
                }));
              }}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                textTransform: 'none',
                minWidth: { xs: 'auto', sm: '140px' },
                height: { xs: 32, sm: 36 },
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.main',
                },
              }}
            >
              Copy from Shipping
            </Button>
          )}
        </Box>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={{ xs: 1, md: 1.5 }}
        >
          <FormField
            name="billing_address"
            label="Address"
            value={formData.billing_address}
            onChange={(value) => handleFieldChange('billing_address', value)}
            error={allErrors.billing_address}
            disabled={isViewMode}
          />

          <FormField
            name="billing_city"
            label="City"
            value={formData.billing_city}
            onChange={(value) => handleFieldChange('billing_city', value)}
            error={allErrors.billing_city}
            disabled={isViewMode}
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
            disabled={isViewMode}
          />

          <FormField
            name="billing_zip"
            label="ZIP Code"
            value={formData.billing_zip}
            onChange={(value) => handleFieldChange('billing_zip', value)}
            error={allErrors.billing_zip}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      {!isViewMode && (
        <FormActions
          onSave={handleSubmit}
          onCancel={onCancel}
          loading={loading}
          saveText={customer ? 'Update' : 'Create'}
        />
      )}

      {isViewMode && (
        <FormActions
          onSave={() => {}} // No-op for view mode
          onCancel={onCancel}
          saveText="Close"
          showDelete={false}
        />
      )}
    </Box>
  );
};

export default CustomerForm; 