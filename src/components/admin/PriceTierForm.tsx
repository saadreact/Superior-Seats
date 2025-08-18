'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { PriceTier } from '@/data/types';
import { FormField, SwitchField, FormActions } from '@/components/common/FormComponents';

interface PriceTierFormData {
  name: string;
  display_name: string;
  description?: string;
  discount_off_retail_price: number;
  minimum_order_amount?: number;
  is_active: boolean;
}

interface PriceTierFormProps {
  priceTier?: PriceTier | null;
  isViewMode?: boolean;
  onSubmit: (priceTier: PriceTierFormData) => void;
  onCancel: () => void;
}

const PriceTierForm: React.FC<PriceTierFormProps> = ({
  priceTier,
  isViewMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<PriceTierFormData>({
    name: '',
    display_name: '',
    description: '',
    discount_off_retail_price: 0,
    minimum_order_amount: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (priceTier) {
      setFormData({
        name: priceTier.name,
        display_name: priceTier.display_name || priceTier.name,
        description: priceTier.description || '',
        discount_off_retail_price: typeof priceTier.discount_off_retail_price === 'string' 
          ? parseFloat(priceTier.discount_off_retail_price) 
          : priceTier.discount_off_retail_price,
        minimum_order_amount: priceTier.minimum_order_amount || 0,
        is_active: priceTier.is_active !== false,
      });
    }
  }, [priceTier]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.discount_off_retail_price < 0 || formData.discount_off_retail_price > 100) {
      newErrors.discount_off_retail_price = 'Discount must be between 0 and 100';
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
    if (field === 'name') {
      // Auto-sync display_name with name
      setFormData(prev => ({ 
        ...prev, 
        name: value as string,
        display_name: value as string
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
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
            label="Price Tier Name"
            value={formData.name}
            onChange={(value) => handleFieldChange('name', value)}
            required
            error={errors.name}
            disabled={isViewMode}
          />

          <FormField
            name="description"
            label="Description"
            value={formData.description || ''}
            onChange={(value) => handleFieldChange('description', value)}
            multiline
            rows={3}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Pricing Settings
        </Typography>
                <Grid
          display="grid"
          gridTemplateColumns="1fr"
          gap={3}
        >
          <FormField
            name="discount_off_retail_price"
            label="Discount Off Retail Price (%)"
            value={formData.discount_off_retail_price}
            onChange={(value) => handleFieldChange('discount_off_retail_price', parseFloat(value) || 0)}
            type="number"
            error={errors.discount_off_retail_price}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Status
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns="1fr"
          gap={3}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            height: '100%',
            pl: 2,
            pt: 1
          }}>
            <SwitchField
              name="is_active"
              label="Active Status"
              checked={formData.is_active}
              onChange={(checked) => handleFieldChange('is_active', checked)}
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
          saveText={priceTier ? 'Update Price Tier' : 'Create Price Tier'}
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

export default PriceTierForm; 