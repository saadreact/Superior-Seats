'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { Customer, CustomerType } from '@/data/types';
import { 
  FormField, 
  SelectField, 
  SwitchField, 
  FormActions,
  AddressFields 
} from '@/components/common/FormComponents';
import { apiService } from '@/utils/api';

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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!customer && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAllErrors = (): Record<string, string> => {
    return { ...errors, ...serverErrors };
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
    // Clear client-side error when user starts typing
    if ((errors as any)[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
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
          gap={{ xs: 2, md: 3 }}
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

          {!customer && (
            <>
              <FormField
                name="password"
                label="Password"
                value={formData.password}
                onChange={(value) => handleFieldChange('password', value)}
                type="password"
                required
                error={allErrors.password}
                disabled={isViewMode}
              />
            </>
          )}
        </Grid>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Contact Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={{ xs: 2, md: 3 }}
        >
          <FormField
            name="phone"
            label="Phone Number"
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

          <FormField
            name="state"
            label="State"
            value={formData.state}
            onChange={(value) => handleFieldChange('state', value)}
            error={allErrors.state}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      {/* Business Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Business Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={{ xs: 2, md: 3 }}
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