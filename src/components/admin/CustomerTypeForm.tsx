'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { CustomerType } from '@/data/types';
import { FormField, SelectField, SwitchField, FormActions } from '@/components/common/FormComponents';

interface CustomerTypeFormProps {
  customerType?: CustomerType | null;
  isViewMode?: boolean;
  onSubmit: (customerType: Omit<CustomerType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CustomerTypeForm: React.FC<CustomerTypeFormProps> = ({
  customerType,
  isViewMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountPercentage: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerType) {
      setFormData({
        name: customerType.name,
        description: customerType.description || '',
        discountPercentage: customerType.discountPercentage || 0,
        isActive: customerType.isActive,
      });
    }
  }, [customerType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = 'Discount percentage must be between 0 and 100';
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

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Basic Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns="1fr"
          gap={3}
        >
          <FormField
            name="name"
            label="Customer Type Name"
            value={formData.name}
            onChange={(value) => handleFieldChange('name', value)}
            required
            error={errors.name}
            disabled={isViewMode}
          />

          <FormField
            name="description"
            label="Description"
            value={formData.description}
            onChange={(value) => handleFieldChange('description', value)}
            multiline
            rows={3}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Settings
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
          gap={3}
        >
          <FormField
            name="discountPercentage"
            label="Discount Percentage"
            value={formData.discountPercentage}
            onChange={(value) => handleFieldChange('discountPercentage', parseFloat(value) || 0)}
            type="number"
            error={errors.discountPercentage}
            disabled={isViewMode}
          />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            height: '100%',
            pl: 2,
            pt: 2
          }}>
            <SwitchField
              name="isActive"
              label="Active Status"
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
          saveText={customerType ? 'Update' : 'Create'}
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

export default CustomerTypeForm; 