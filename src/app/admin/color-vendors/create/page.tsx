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
  FormControlLabel,
  Switch,
  Stack,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

const CreateColorVendorPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    website: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    is_active: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.code.trim()) {
      setError('Code is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await apiService.createColorVendor(formData);
      setSuccess('Color vendor created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/color-vendors');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create color vendor');
      console.error('Error creating color vendor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/color-vendors');
  };

  return (
    <AdminLayout title="Create Color Vendor">
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
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 2, sm: 0 }
                }}>
                  <Typography variant="h5" sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
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
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }}>
                        {formData.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                    labelPlacement="start"
                    sx={{ 
                      gap: 1,
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '1rem', sm: '0.875rem' },
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
                  placeholder="Enter color vendor name"
                  sx={{ 
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />

                <TextField
                  label="Code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter vendor code (e.g., SW001)"
                  sx={{ 
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
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
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />
              </Box>

              {/* Contact Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'text.primary', 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <TextField
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  fullWidth
                  placeholder="https://www.example.com"
                  sx={{ 
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <TextField
                    label="Contact Email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    fullWidth
                    placeholder="contact@example.com"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  />

                  <TextField
                    label="Contact Phone"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    fullWidth
                    placeholder="+1-800-123-4567"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  />
                </Box>

                <TextField
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Enter full address"
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
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
                  sx={{
                    minHeight: { xs: 44, sm: 'auto' },
                    fontSize: { xs: '0.95rem', sm: '0.875rem' },
                    order: { xs: 2, sm: 1 }
                  }}
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
                    minHeight: { xs: 44, sm: 'auto' },
                    fontSize: { xs: '0.95rem', sm: '0.875rem' },
                    order: { xs: 1, sm: 2 },
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Color Vendor'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateColorVendorPage; 
