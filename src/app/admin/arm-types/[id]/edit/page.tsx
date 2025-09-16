'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
  Divider,
  FormControlLabel,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

// Helper function to convert cost/price to number
const parsePriceValue = (value: number | string | undefined): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

const EditArmTypePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: 0,
    price: 0
  });
  
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);

  useEffect(() => {
    loadArmType();
  }, [id]);

  const loadArmType = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const armType = await apiService.getArmType(parseInt(id));
      console.log('Loaded arm type data:', armType);
      
      const costValue = parsePriceValue(armType.cost);
      const priceValue = parsePriceValue(armType.price);
      
      setFormData({
        name: armType.name || '',
        description: armType.description || '',
        cost: costValue,
        price: priceValue
      });
      
      // Enable price tiers if cost or price is set
      setEnablePriceTiers(costValue > 0 || priceValue > 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load arm type');
      console.error('Error loading arm type:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'cost' || field === 'price' ? (typeof value === 'number' ? value : 0) : value
    }));
  };

  const handleEnablePriceTiersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setEnablePriceTiers(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.cost < 0) {
      setError('Cost cannot be negative');
      return;
    }

    if (formData.price < 0) {
      setError('Price cannot be negative');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submissionData = {
        name: formData.name,
        description: formData.description,
        cost: formData.cost,
        price: formData.price,
        price_tier_ids: [],
        price_adjustments: undefined
      };
      
      console.log('Updating arm type with data:', submissionData);
      const result = await apiService.updateArmType(parseInt(id), submissionData);
      console.log('Update arm type result:', result);
      setSuccess('Arm Type updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/arm-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update arm type');
      console.error('Error updating arm type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/arm-types');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Arm Type">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Arm Type">
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
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
              
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter arm type name"
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
                    value={formData.cost ?? 0}
                    onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                    fullWidth
                    placeholder="Enter wholesale cost"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                  <TextField
                    label="Price (Retail)"
                    type="number"
                    value={formData.price ?? 0}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
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
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Retail Price"
                        type="number"
                        value={formData.price ?? 0}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        fullWidth
                        placeholder="Enter retail price"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                      <TextField
                        label="Wholesale Price"
                        type="number"
                        value={formData.cost ?? 0}
                        onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                        fullWidth
                        placeholder="Enter wholesale price"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Box>
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
                  {loading ? 'Updating...' : 'Update Arm Type'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditArmTypePage; 