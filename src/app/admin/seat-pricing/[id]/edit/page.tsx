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
  CircularProgress} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

const EditSeatPricingPage = () => {
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
    price: ''});

  useEffect(() => {
    loadSeatPricing();
  }, [id]);

  const loadSeatPricing = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const seatPricing = await apiService.getSeatPrice(parseInt(id));
      setFormData({
        name: seatPricing.name || '',
        description: seatPricing.description || '',
        price: seatPricing.price ? seatPricing.price.toString() : ''});
    } catch (err: any) {
      setError(err.message || 'Failed to load seat pricing');
      console.error('Error loading seat pricing:', err);
    } finally {
      setInitialLoading(false);
    }
  };

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

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      await apiService.updateSeatPricing(parseInt(id), submitData);
      setSuccess('Seat Pricing updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/seat-pricing');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update seat pricing');
      console.error('Error updating seat pricing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/seat-pricing');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Seat Pricing">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Seat Pricing">
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, maxWidth: 800, width: '100%' }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Basic Information */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                  Basic Information
                </Typography>
                
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter seat pricing name"
                />

                <TextField
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                  fullWidth
                  placeholder="0.00"
                  inputProps={{ 
                    min: 0,
                    step: 0.01
                  }}
                  InputProps={{
                    startAdornment: '$'
                  }}
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

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, pt: 3, justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ minWidth: 150, py: 1.5 }}
                  >
                    {loading ? 'Updating...' : 'Update Seat Pricing'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                    sx={{ minWidth: 120, py: 1.5 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default EditSeatPricingPage; 