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
import { vehicleTrimsApiService } from '@/services/vehicleTrimsApi';

const EditVehicleTrimPage = () => {
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
    vehicle_model_id: 1,
    is_active: true
  });

  useEffect(() => {
    loadVehicleTrim();
  }, [id]);

  const loadVehicleTrim = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const vehicleTrim = await vehicleTrimsApiService.getVehicleTrim(parseInt(id));
      
      // Ensure we have valid data before setting form
      if (vehicleTrim) {
        setFormData({
          name: vehicleTrim.name || '',
          description: vehicleTrim.description || '',
          vehicle_model_id: vehicleTrim.vehicle_model_id || 1,
          is_active: vehicleTrim.is_active !== undefined ? vehicleTrim.is_active : true
        });
      } else {
        setError('No vehicle trim data received');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load vehicle trim');
      console.error('Error loading vehicle trim:', err);
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

    if (!formData.vehicle_model_id) {
      setError('Vehicle Model ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await vehicleTrimsApiService.updateVehicleTrim(parseInt(id), formData);
      setSuccess('Vehicle Trim updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/vehicle-trims');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update vehicle trim');
      console.error('Error updating vehicle trim:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/vehicle-trims');
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Vehicle Trim">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Vehicle Trim">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Vehicle Trims
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
                  placeholder="Enter vehicle trim name"
                />

                <TextField
                  label="Vehicle Model ID"
                  type="number"
                  value={formData.vehicle_model_id}
                  onChange={(e) => handleInputChange('vehicle_model_id', parseInt(e.target.value) || 1)}
                  required
                  fullWidth
                  placeholder="Enter vehicle model ID"
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
                    {loading ? 'Updating...' : 'Update Vehicle Trim'}
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

export default EditVehicleTrimPage;
