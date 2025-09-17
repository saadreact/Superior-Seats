'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
  CircularProgress,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

const CreatePriceTierPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    discount_off_retail_price: 0,
    is_active: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.discount_off_retail_price < 0 || formData.discount_off_retail_price > 100) {
      setError('Discount must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submissionData = {
        name: formData.name.trim(),
        display_name: formData.display_name.trim() || formData.name.trim(),
        description: formData.description.trim() || undefined,
        discount_off_retail_price: formData.discount_off_retail_price,
        is_active: formData.is_active
      };
      
      console.log('Creating price tier:', submissionData);
      await apiService.createPriceTier(submissionData);
      
      setSuccess('Price Tier created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/price-tiers');
      }, 1500);
      
    } catch (err: any) {
      console.error('Error creating price tier:', err);
      
      let errorMessage = 'Failed to create price tier';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/price-tiers');
  };

  return (
    <AdminLayout title="Create Price Tier">
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
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter price tier name"
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Display Name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  fullWidth
                  placeholder="Enter display name (optional)"
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

                <TextField
                  label="Discount Off Retail Price (%)"
                  type="number"
                  value={formData.discount_off_retail_price}
                  onChange={(e) => handleInputChange('discount_off_retail_price', parseFloat(e.target.value) || 0)}
                  required
                  fullWidth
                  placeholder="Enter discount percentage"
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
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
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{
                      backgroundColor: '#DA291C',
                      '&:hover': {
                        backgroundColor: '#B71C1C',
                      },
                    }}
                  >
                    {loading ? 'Creating...' : 'Create Price Tier'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreatePriceTierPage; 
