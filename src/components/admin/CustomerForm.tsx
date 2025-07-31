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
  customer?: Customer | null;
  customerTypes: CustomerType[];
  isViewMode?: boolean;
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  customerTypes,
  isViewMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    customerTypeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    isActive: true,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        customerTypeId: customer.customerTypeId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || '',
        address: customer.address,
        isActive: customer.isActive,
        notes: customer.notes || '',
      });
    } else {
      // Set default customer type if available
      if (customerTypes.length > 0) {
        setFormData(prev => ({ ...prev, customerTypeId: customerTypes[0].id }));
      }
    }
  }, [customer, customerTypes]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerTypeId) {
      newErrors.customerTypeId = 'Customer type is required';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.street.trim()) {
      newErrors.addressStreet = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.addressCity = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.addressState = 'State is required';
    }

    if (!formData.address.zipCode.trim()) {
      newErrors.addressZipCode = 'ZIP code is required';
    }

    if (!formData.address.country.trim()) {
      newErrors.addressCountry = 'Country is required';
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

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
    // Clear error when user starts typing
    const errorKey = `address${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const customerTypeOptions = customerTypes.map(ct => ({
    value: ct.id,
    label: ct.name,
  }));

  return (
    <Box sx={{ pt: 2 }}>
      {/* Customer Type Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Customer Classification
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns="1fr"
          gap={3}
        >
          <SelectField
            name="customerTypeId"
            label="Customer Type"
            value={formData.customerTypeId}
            onChange={(value) => handleFieldChange('customerTypeId', value)}
            options={customerTypeOptions}
            required
            error={errors.customerTypeId}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      {/* Personal Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Personal Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
          gap={3}
          sx={{
            '& > *:nth-of-type(5)': {
              gridColumn: { xs: '1', sm: '1 / -1' }
            }
          }}
        >
          <FormField
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleFieldChange('firstName', value)}
            required
            error={errors.firstName}
            disabled={isViewMode}
          />

          <FormField
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleFieldChange('lastName', value)}
            required
            error={errors.lastName}
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
            name="company"
            label="Company Name (Optional)"
            value={formData.company}
            onChange={(value) => handleFieldChange('company', value)}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      {/* Address Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Address Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns="1fr"
          gap={3}
        >
          <AddressFields
            prefix="address"
            address={formData.address}
            onChange={handleAddressChange}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      {/* Additional Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Additional Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns="1fr"
          gap={3}
        >
          <FormField
            name="notes"
            label="Notes (Optional)"
            value={formData.notes}
            onChange={(value) => handleFieldChange('notes', value)}
            multiline
            rows={3}
            disabled={isViewMode}
          />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            pl: 2,
            pt: 1
          }}>
            <SwitchField
              name="isActive"
              label="Active Customer"
              checked={formData.isActive}
              onChange={(checked) => handleFieldChange('isActive', checked)}
              disabled={isViewMode}
            />
          </Box>
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