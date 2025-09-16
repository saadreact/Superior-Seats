'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Chip,
  Divider,
  Switch,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';

interface Color {
  id: number;
  name: string;
  hex_code: string;
  description: string;
  color_vendor_id: number;
  is_active: boolean;
  price_tier_ids: number[];
  cost: number | null;
  price: number | null;
  created_at: string;
  updated_at: string;
}

interface ColorVendor {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
}

interface PriceTier {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  discount_off_retail_price: number;
  minimum_order_amount?: number;
  is_active: boolean;
}

const CreateColorPage = () => {
  const router = useRouter();
  const [colorVendors, setColorVendors] = useState<ColorVendor[]>([]);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hex_code: '',
    description: '',
    color_vendor_id: 0,
    cost: 0,
    price: 0,
    is_active: true,
    price_tier_ids: [] as number[],
  });
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);

  const loadColorVendors = useCallback(async () => {
    try {
      const response = await apiService.getColorVendors();
      setColorVendors(response || []);
    } catch (err: any) {
      console.error('Error loading color vendors:', err);
      setColorVendors([]);
    }
  }, []);

  const loadPriceTiers = useCallback(async () => {
    try {
      const response = await apiService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err: any) {
      console.error('Error loading price tiers:', err);
      setPriceTiers([]);
    }
  }, []);

  useEffect(() => {
    loadColorVendors();
    loadPriceTiers();
  }, [loadColorVendors, loadPriceTiers]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      price_tier_ids: typeof value === 'string' ? value.split(',').map(Number) : (value || []),
    }));
  };

  const handleEnablePriceTiersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setEnablePriceTiers(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Color name is required');
      return;
    }
    
    if (!formData.hex_code.trim()) {
      setError('Hex code is required');
      return;
    }
    
    // Ensure hex code has # prefix and validate format
    let hexCode = formData.hex_code.trim();
    if (!hexCode.startsWith('#')) {
      hexCode = '#' + hexCode;
    }
    
    // Validate hex code format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexCode)) {
      setError('Please enter a valid hex color code (e.g., 000000 or #000000)');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!formData.color_vendor_id) {
      setError('Color vendor is required');
      return;
    }
    
    if (formData.cost <= 0) {
      setError('Cost must be greater than 0');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        name: formData.name.trim(),
        hex_code: hexCode,
        description: formData.description.trim(),
        color_vendor_id: Number(formData.color_vendor_id),
        cost: formData.cost,
        price: formData.price,
        is_active: formData.is_active,
        price_tier_ids: enablePriceTiers ? (formData.price_tier_ids || []).map(id => Number(id)) : [],
      };
      
      await apiService.createColor(submitData);
      setSuccess('Color created successfully!');
      
      // Redirect back to colors list after a short delay
      setTimeout(() => {
        router.push('/admin/colors');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create color');
      console.error('Error creating color:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/colors');
  };

  return (
    <AdminLayout title="Create New Color">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Basic Information */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    Basic Information
                  </Typography>
                  
                  {/* Status Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formData.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                    labelPlacement="start"
                    sx={{ 
                      gap: 1,
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 3 }} />
              
                <TextField
                  label="Color Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter color name"
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Hex Code"
                  value={formData.hex_code.replace('#', '')}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!value.startsWith('#')) {
                      value = '#' + value;
                    }
                    handleInputChange('hex_code', value);
                  }}
                  required
                  fullWidth
                  placeholder="000000"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2" color="text.secondary">#</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter description (optional)"
                />
              </Box>

              {/* Color Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Color Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControl fullWidth required sx={{ mb: 3 }}>
                  <InputLabel>Color Vendor</InputLabel>
                  <Select
                    value={formData.color_vendor_id}
                    onChange={(e) => handleInputChange('color_vendor_id', e.target.value)}
                    label="Color Vendor"
                  >
                    <MenuItem value={0} disabled>
                      <em>Select a vendor</em>
                    </MenuItem>
                    {colorVendors.map((vendor) => (
                      <MenuItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Box>

              {/* Pricing Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Pricing Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Cost (Wholesale)"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                    placeholder="Enter wholesale cost"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                  <TextField
                    label="Price (Retail)"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                    placeholder="Enter retail price"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Box>
              </Box>

              {/* Price Tiers */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Price Tiers
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={enablePriceTiers}
                      onChange={handleEnablePriceTiersChange}
                      color="primary"
                    />
                  }
                  label="Enable Price Tiers"
                />

                {enablePriceTiers && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Tier Pricing
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel>Price Tiers</InputLabel>
                      <Select
                        multiple
                        value={formData.price_tier_ids}
                        onChange={handleMultiSelectChange}
                        input={<OutlinedInput label="Price Tiers" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as number[] || []).map((value) => {
                              const tier = priceTiers.find(t => t.id === value);
                              return (
                                <Chip key={value} label={tier?.name || value} size="small" />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {priceTiers.map((tier) => (
                          <MenuItem key={tier.id} value={tier.id}>
                            <Checkbox checked={(formData.price_tier_ids || []).indexOf(tier.id) > -1} />
                            <ListItemText
                              primary={tier.name}
                              secondary={`${tier.discount_off_retail_price}% off retail`}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#DA291C',
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Color'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateColorPage;
