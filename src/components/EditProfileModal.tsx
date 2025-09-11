'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import { apiService } from '@/utils/api';
import { FormField, FormActions } from '@/components/common/FormComponents';

// Zod validation schema - only editable fields
const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
});

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any; // Pass the full user object with role data
  onProfileUpdated?: (updatedCustomer: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  open, 
  onClose, 
  user, 
  onProfileUpdated 
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customerId, setCustomerId] = useState<number | null>(null);
  
  // Store non-editable values from API response
  const [customerData, setCustomerData] = useState<{
    customer_type: string;
    price_tier_id: number;
    is_active: boolean;
  } | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Form state - only editable fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    company_name: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load customer profile data
  useEffect(() => {
    if (open && user && user.role) {
      loadCustomerFromAPI();
    }
  }, [open, user]);

  // Load customer data using the customer API
  const loadCustomerFromAPI = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading customer from API. User data:', user);
      console.log('🔍 User role data:', user.role);
      
      // First, we need to find the customer ID
      // The role object should have an ID field that represents the customer ID
      const customerId = user.role?.id;
      
      if (!customerId) {
        throw new Error('Customer ID not found in user role. Please contact support.');
      }
      
      console.log('🔍 Found customer ID:', customerId);
      setCustomerId(customerId);
      
      // Now call the customer API to get the full customer data
      console.log('🔍 Calling customer API for ID:', customerId);
      const response = await apiService.getCustomer(customerId);
      console.log('🔍 Customer API response:', response);
      
      // Handle the API response structure
      const customer = response.data?.data || response.data || response;
      console.log('🔍 Extracted customer data:', customer);
      
      // Store non-editable values from API response
      setCustomerData({
        customer_type: customer.customer_type || 'retail',
        price_tier_id: customer.price_tier_id || 1,
        is_active: customer.is_active !== undefined ? customer.is_active : true,
      });
      
      // Load the form data from the API response (only editable fields)
      const name = customer.name || '';
      const firstNameFromName = name.split(' ')[0] || '';
      const lastNameFromName = name.split(' ').slice(1).join(' ') || '';
      
      const formDataToSet = {
        first_name: customer.first_name || firstNameFromName || '',
        last_name: customer.last_name || lastNameFromName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        company_name: customer.company_name || '',
      };
      
      console.log('🔍 Setting form data from API:', formDataToSet);
      console.log('🔍 Storing non-editable data:', {
        customer_type: customer.customer_type || 'retail',
        price_tier_id: customer.price_tier_id || 1,
        is_active: customer.is_active !== undefined ? customer.is_active : true,
      });
      setFormData(formDataToSet);
      
    } catch (error: any) {
      console.error('❌ Error loading customer from API:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to load customer profile. Please contact support.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear errors for the field
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear errors for the field
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    try {
      profileSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.issues.forEach((err) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      console.log('Submitting customer data:', formData);
      
      // Convert form data to match the customer API structure (same as curl example)
      // Use stored non-editable values from the GET API response
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        company_name: formData.company_name,
        customer_type: customerData?.customer_type || 'retail',
        price_tier_id: customerData?.price_tier_id || 1,
        is_active: customerData?.is_active !== undefined ? customerData.is_active : true,
      };

      // Use the centralized API service
      if (!customerId) {
        throw new Error('Customer ID not found');
      }
      const updatedCustomer = await apiService.updateCustomer(customerId!, updateData);
      console.log('Customer updated successfully:', updatedCustomer);
      
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });

      // Call the callback to update parent component
      if (onProfileUpdated) {
        onProfileUpdated(updatedCustomer);
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating customer profile:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to update customer profile',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            minHeight: isMobile ? '90vh' : '600px',
            maxWidth: isMobile ? '100%' : '1200px',
            width: isMobile ? '100%' : '95%',
            maxHeight: isMobile ? '100vh' : '95vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 2.5, lg: 0, xl: 0},
            borderBottom: '1px solid',
            borderColor: 'divider',
            width: '100%',
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: '#DA291C',
              fontSize: { xs: '1.125rem', sm: '1.375rem', md: '1rem', lg: '1.3rem', xl: '1.4rem', xxl: '1.67rem' },
              textAlign: 'center',
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Edit Profile
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: 'grey.500',
              p: { xs: 0.75, sm: 1 },
              '&:hover': {
                color: 'grey.700',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ 
          p: 0, 
          flex: 1, 
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '400px' 
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ 
              py: { xs: 2, sm: 2.5, md: 2.5 , lg: 0, xl: 0},
              px: { xs: 3, sm: 4, md: 4 , lg: 0, xl: 0},
              maxWidth: '1100px',
              mx: 'auto',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflow: 'visible'
            }}>
              {/* Basic Information */}
              <Box sx={{ mb: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'black' }}>
                  Basic Information
                </Typography>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="first_name"
                    label="First Name"
                    value={formData.first_name}
                    onChange={(value) => handleFieldChange('first_name', value)}
                    required
                    error={errors.first_name}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        minWidth: '100px',
                        '& input': {
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '14px',
                        '&.MuiInputLabel-shrink': {
                          fontSize: '12px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '11px',
                        marginTop: '2px',
                        marginLeft: '0px',
                      },
                    }}
                  />

                  <FormField
                    name="last_name"
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(value) => handleFieldChange('last_name', value)}
                    required
                    error={errors.last_name}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        minWidth: '100px',
                        '& input': {
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '14px',
                        '&.MuiInputLabel-shrink': {
                          fontSize: '12px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '11px',
                        marginTop: '2px',
                        marginLeft: '0px',
                      },
                    }}
                  />

                  <FormField
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(value) => handleFieldChange('email', value)}
                    type="email"
                    required
                    error={errors.email}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        minWidth: '100px',
                        '& input': {
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '14px',
                        '&.MuiInputLabel-shrink': {
                          fontSize: '12px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '11px',
                        marginTop: '2px',
                        marginLeft: '0px',
                      },
                    }}
                  />
                </Grid>
              </Box>

              {/* Contact Information */}
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'black' }}>
                  Contact Information
                </Typography>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(value) => handleFieldChange('phone', value)}
                    required
                    error={errors.phone}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        minWidth: '100px',
                        '& input': {
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '14px',
                        '&.MuiInputLabel-shrink': {
                          fontSize: '12px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '11px',
                        marginTop: '2px',
                        marginLeft: '0px',
                      },
                    }}
                  />

                  <FormField
                    name="address"
                    label="Address"
                    value={formData.address}
                    onChange={(value) => handleFieldChange('address', value)}
                    required
                    error={errors.address}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        minWidth: '100px',
                        '& input': {
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '14px',
                        '&.MuiInputLabel-shrink': {
                          fontSize: '12px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '11px',
                        marginTop: '2px',
                        marginLeft: '0px',
                      },
                    }}
                  />

                  <FormField
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={(value) => handleFieldChange('city', value)}
                    error={errors.city}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        minWidth: '100px',
                        '& input': {
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '14px',
                        '&.MuiInputLabel-shrink': {
                          fontSize: '12px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '11px',
                        marginTop: '2px',
                        marginLeft: '0px',
                      },
                    }}
                  />

                  <FormField
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={(value) => handleFieldChange('state', value)}
                    error={errors.state}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        minWidth: '100px',
                        '& input': {
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '14px',
                        '&.MuiInputLabel-shrink': {
                          fontSize: '12px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '11px',
                        marginTop: '2px',
                        marginLeft: '0px',
                      },
                    }}
                  />
                </Grid>
              </Box>

              {/* Business Information */}
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'black' }}>
                  Business Information
                </Typography>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="company_name"
                    label="Company Name"
                    value={formData.company_name}
                    onChange={(value) => handleFieldChange('company_name', value)}
                    error={errors.company_name}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        minWidth: '100px',
                        '& input': {
                          fontSize: '14px',
                          padding: '8px 12px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '14px',
                        '&.MuiInputLabel-shrink': {
                          fontSize: '12px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '11px',
                        marginTop: '2px',
                        marginLeft: '0px',
                      },
                    }}
                  />
                </Grid>
              </Box>

              {/* Form Actions */}
              <Box sx={{ mt: -1 }}>
              <FormActions
                onSave={handleSubmit}
                onCancel={handleClose}
                loading={saving}
                saveText="Update Profile"
                cancelText="Cancel"
              />
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProfileModal;
