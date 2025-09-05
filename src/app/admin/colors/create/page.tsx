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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';

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
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hex_code: '',
    description: '',
    color_vendor_id: 0,
    is_active: 'true' as string,
    price_tier_ids: [] as number[],
  });

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

  const handleFormChange = (field: string) => (event: any) => {
    let value = event.target.value;
    
    // Handle hex code input - ensure it has # prefix
    if (field === 'hex_code') {
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelectChange = (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      price_tier_ids: typeof value === 'string' ? value.split(',').map(Number) : (value || []),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setAlert({ type: 'error', message: 'Color name is required' });
      return;
    }
    
    if (!formData.hex_code.trim()) {
      setAlert({ type: 'error', message: 'Hex code is required' });
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
      setAlert({ type: 'error', message: 'Please enter a valid hex color code (e.g., 000000 or #000000)' });
      return;
    }
    
    if (!formData.description.trim()) {
      setAlert({ type: 'error', message: 'Description is required' });
      return;
    }
    
    if (!formData.color_vendor_id) {
      setAlert({ type: 'error', message: 'Color vendor is required' });
      return;
    }
    
    if (!formData.price_tier_ids || formData.price_tier_ids.length === 0) {
      setAlert({ type: 'error', message: 'At least one price tier is required' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert form data to match API schema exactly
      const submitData = {
        name: formData.name.trim(),
        hex_code: hexCode,
        description: formData.description.trim(),
        color_vendor_id: Number(formData.color_vendor_id),
        is_active: formData.is_active === 'true',
        price_tier_ids: (formData.price_tier_ids || []).map(id => Number(id)),
      };
      
      const result = await apiService.createColor(submitData);
      setAlert({ type: 'success', message: 'Color created successfully' });
      
      // Redirect back to colors list after a short delay
      setTimeout(() => {
        router.push('/admin/colors');
      }, 1500);
      
    } catch (err: any) {
      console.error('Error creating color:', err);
      setAlert({ type: 'error', message: err.message || 'Failed to create color' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    router.push('/admin/colors');
  };

  return (
    <AdminLayout title="Add New Color">
      <Box>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToList}
            sx={{ mb: 2 }}
          >
            Back to Colors
          </Button>
        
        </Box>

        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 3 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        <Paper sx={{ p: 4, maxWidth: 800 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Color Name"
                value={formData.name}
                onChange={handleFormChange('name')}
                fullWidth
                required
                placeholder="e.g. Midnight Black"
              />
              
              <TextField
                label="Hex Code"
                value={formData.hex_code.replace('#', '')}
                onChange={handleFormChange('hex_code')}
                fullWidth
                required
                placeholder="000000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body2" color="text.secondary">#</Typography>
                    </InputAdornment>
                  )}}
              />
              
              <TextField
                label="Description"
                value={formData.description}
                onChange={handleFormChange('description')}
                fullWidth
                multiline
                rows={3}
                required
                placeholder="e.g. Deep black color for luxury vehicles"
              />

              <FormControl fullWidth required>
                <InputLabel>Color Vendor</InputLabel>
                <Select
                  value={formData.color_vendor_id}
                  onChange={handleFormChange('color_vendor_id')}
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

              <FormControl fullWidth required>
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

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_active === 'true'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      is_active: e.target.checked ? 'true' : 'false'
                    }))}
                    color="primary"
                  />
                }
                label="Active"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Button onClick={handleBackToList} variant="outlined" size="large">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : 'Create Color'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateColorPage;
