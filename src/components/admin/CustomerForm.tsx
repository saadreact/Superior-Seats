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

interface CustomerFormProps {
  customer?: any;
  isViewMode?: boolean;
  onSubmit: (customer: any) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  isViewMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    customer_type: 'retail',
    phone: '',
    address: '',
    company_name: '',
    tax_id: '',
    price_tier_id: 1,
    credit_limit: 5000,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      console.log('Customer data for form:', customer);
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        username: customer.user?.username || '',
        password: '', // Don't populate password for edit
        customer_type: customer.customer_type || 'retail',
        phone: customer.phone || '',
        address: customer.address || '',
        company_name: customer.company_name || '',
        tax_id: customer.tax_id || '',
        price_tier_id: customer.price_tier_id || 1,
        credit_limit: customer.credit_limit || 5000,
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!customer && !formData.username.trim()) {
      newErrors.username = 'Username is required';
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const customerTypeOptions = [
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
  ];

  return (
    <Box sx={{ pt: 2 }}>
      {/* Basic Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Basic Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={{ xs: 2, md: 3 }}
        >
          <FormField
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={(value) => handleFieldChange('name', value)}
            required
            error={errors.name}
            disabled={isViewMode}
          />

          <FormField
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            type="email"
            required
            error={errors.email}
            disabled={isViewMode}
          />

          {!customer && (
            <>
              <FormField
                name="username"
                label="Username"
                value={formData.username}
                onChange={(value) => handleFieldChange('username', value)}
                required
                error={errors.username}
                disabled={isViewMode}
              />

              <FormField
                name="password"
                label="Password"
                value={formData.password}
                onChange={(value) => handleFieldChange('password', value)}
                type="password"
                required
                error={errors.password}
                disabled={isViewMode}
              />
            </>
          )}
        </Grid>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
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
            error={errors.phone}
            disabled={isViewMode}
          />

          <FormField
            name="address"
            label="Address"
            value={formData.address}
            onChange={(value) => handleFieldChange('address', value)}
            required
            error={errors.address}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      {/* Business Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
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
            disabled={isViewMode}
          />

          <FormField
            name="tax_id"
            label="Tax ID"
            value={formData.tax_id}
            onChange={(value) => handleFieldChange('tax_id', value)}
            disabled={isViewMode}
          />

          <SelectField
            name="customer_type"
            label="Customer Type"
            value={formData.customer_type}
            onChange={(value) => handleFieldChange('customer_type', value)}
            options={customerTypeOptions}
            required
            error={errors.customer_type}
            disabled={isViewMode}
          />

          <FormField
            name="price_tier_id"
            label="Price Tier ID"
            value={formData.price_tier_id}
            onChange={(value) => handleFieldChange('price_tier_id', parseInt(value))}
            type="number"
            disabled={isViewMode}
          />

          <FormField
            name="credit_limit"
            label="Credit Limit"
            value={formData.credit_limit}
            onChange={(value) => handleFieldChange('credit_limit', parseInt(value))}
            type="number"
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