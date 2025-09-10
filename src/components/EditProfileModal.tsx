'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { customerAPI } from '@/api/customers';

// Zod validation schema - matching the specified fields
const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
});

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  customerId: number;
  onProfileUpdated?: (updatedCustomer: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  open, 
  onClose, 
  customerId, 
  onProfileUpdated 
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

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

  // Form state - matching the specified fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
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
    if (open && customerId && customerId > 0) {
      loadCustomerProfile();
    }
  }, [open, customerId]);

  const loadCustomerProfile = async () => {
    try {
      setLoading(true);
      console.log('Loading customer profile for ID:', customerId);
      
      // Validate customer ID
      if (!customerId || customerId <= 0) {
        throw new Error('Invalid customer ID');
      }
      
      // Use the existing customer API
      const customerData = await customerAPI.getCustomerById(customerId.toString());
      console.log('Customer data loaded:', customerData);
      
      setFormData({
        first_name: customerData.firstName || '',
        last_name: customerData.lastName || '',
        email: customerData.email || '',
        password: '', // Don't load password for security
        phone: customerData.phone || '',
        address: customerData.address?.street || '',
        city: customerData.address?.city || '',
        state: customerData.address?.state || '',
        company_name: customerData.company || '',
      });
    } catch (error: any) {
      console.error('Error loading customer profile:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to load customer profile';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Customer profile not found.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view this profile.';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
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
      
      // Convert form data to match the Customer type structure
      const updateData = {
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: '', // Not provided in form
          country: 'USA', // Default
        },
        company: formData.company_name,
      };

      // Use the existing customer API
      const updatedCustomer = await customerAPI.updateCustomer(customerId.toString(), updateData);
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

  // Common field styles - matching AuthModal exactly
  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      height: '35px',
      backgroundColor: 'rgba(255,255,255,0.8)',
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: 2,
      },
      '&.Mui-focused': {
        backgroundColor: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      transform: 'translate(14px, 8px) scale(1)',
      '&.Mui-focused': {
        color: 'primary.main',
        transform: 'translate(14px, -9px) scale(0.75)',
      },
      '&.MuiFormLabel-filled': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            minHeight: isMobile ? '100vh' : 'auto',
            maxWidth: isMobile ? '100%' : '450px',
            width: isMobile ? '100%' : '90%',
            maxHeight: isMobile ? '100vh' : '90vh',
            overflow: 'hidden',
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
            pt: { xs: 2, sm: 2.5 },
            borderBottom: '1px solid',
            borderColor: 'divider',
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

        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
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
              py: { xs: 3, sm: 4, md: 5, lg: 0.1, xl: 0.8, xxl: 1},
              pb: { xs: 4, sm: 5, md: 6, lg: 3, xl: 4, xxl: 5},
              maxWidth: '400px',
              mx: 'auto',
              width: '100%'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  textAlign: 'center',
                  color: 'text.primary',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                Update your profile information
              </Typography>

              <TextField
                fullWidth
                label="First Name"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange('first_name')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.first_name}
                helperText={errors.first_name}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Last Name"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange('last_name')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.last_name}
                helperText={errors.last_name}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.phone}
                helperText={errors.phone}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Address"
                type="text"
                value={formData.address}
                onChange={handleInputChange('address')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.address}
                helperText={errors.address}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="City"
                type="text"
                value={formData.city}
                onChange={handleInputChange('city')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.city}
                helperText={errors.city}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="State"
                type="text"
                value={formData.state}
                onChange={handleInputChange('state')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.state}
                helperText={errors.state}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Company Name"
                type="text"
                value={formData.company_name}
                onChange={handleInputChange('company_name')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                error={!!errors.company_name}
                helperText={errors.company_name}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  ...commonTextFieldStyles,
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginLeft: 0,
                  },
                }}
              />


              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={saving}
                  size="medium"
                  disableRipple={false}
                  TouchRippleProps={{
                    center: true,
                    color: 'rgba(255, 255, 255, 0.3)',
                  }}
                  sx={{
                    px: { xs: 4, sm: 6 },
                    py: { xs: 1, sm: 1.5, lg: 1, md: 1.2 },
                    borderRadius: 2,
                    textTransform: 'none',
                    letterSpacing: 0.5,
                    transition: 'all 0.3s ease',
                    minWidth: { xs: 160, sm: 180 },
                    width: { xs: '100%', sm: 'auto' },
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                    },
                    '& .MuiTouchRipple-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  {saving ? <CircularProgress size={20} color="inherit" /> : 'Update Profile'}
                </Button>
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
