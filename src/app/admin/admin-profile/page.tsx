'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Paper,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { 
  FormField, 
  SelectField, 
  FormActions,
  SwitchField
} from '@/components/common/FormComponents';
import { apiService } from '@/utils/api';

interface AdminFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  designation: string;
  permissions: string[];
  is_super_admin: boolean;
  is_active: boolean;
}

const AdminProfilePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  
  // Form data state
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    designation: '',
    permissions: [],
    is_super_admin: false,
    is_active: true,
  });

  // Available permissions
  const availablePermissions = [
    'manage_staff',
    'manage_customers',
    'manage_products',
    'manage_orders',
    'manage_categories',
    'manage_payments',
    'view_analytics',
    'manage_settings',
  ];

  // Available designations
  const designations = [
    'System Administrator',
    'Manager',
    'Supervisor',
    'Staff',
    'Support',
  ];

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setAlert(null);
      // Assuming we're updating admin with ID 1 as per the requirement
      const adminData = await apiService.getAdmin(1);
      
      setFormData({
        name: adminData.name || '',
        email: adminData.email || '',
        phone: adminData.phone || '',
        address: adminData.address || '',
        designation: adminData.designation || '',
        permissions: adminData.permissions || [],
        is_super_admin: adminData.is_super_admin || false,
        is_active: adminData.is_active !== undefined ? adminData.is_active : true,
      });
      
      setIsActive(adminData.is_active !== undefined ? adminData.is_active : true);
      setIsSuperAdmin(adminData.is_super_admin || false);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to load admin data' });
    } finally {
      setLoading(false);
    }
  };

  const getAllErrors = (): Record<string, string> => {
    return { ...serverErrors };
  };

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear server-side error for this field if provided
    if ((serverErrors as any)[field]) {
      setServerErrors(prev => {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePermissionChange = (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      permissions: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAlert(null);
    setServerErrors({});
    try {
      // Update form data with current switch states
      const updatedFormData = {
        ...formData,
        is_active: isActive,
        is_super_admin: isSuperAdmin,
      };
      
      // Assuming we're updating admin with ID 1 as per the requirement
      await apiService.updateAdmin(1, updatedFormData);
      setAlert({ type: 'success', message: 'Admin profile updated successfully!' });
    } catch (error: any) {
      const data = error?.response?.data;
      if (data?.status === 'error') {
        const fieldErrors: Record<string, string> = {};
        if (data?.errors && typeof data.errors === 'object') {
          Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
            const arr = Array.isArray(messages) ? messages : [String(messages)];
            if (arr.length > 0) {
              fieldErrors[field] = String(arr[0]);
            }
          });
        }
        setServerErrors(fieldErrors);
      } else {
        setAlert({ type: 'error', message: data?.message || 'Something went wrong while updating the admin profile.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  const clearServerError = (field: string) => {
    setServerErrors(prev => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Generate designation options for dropdown
  const designationOptions = designations.map(designation => ({
    value: designation,
    label: designation
  }));

  const allErrors = getAllErrors();

  const statusToggle = (
    <FormControlLabel
      control={
        <Switch
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          color="primary"
          size="small"
        />
      }
      label={
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          fontSize: { xs: '0.875rem', sm: '0.875rem' }
        }}>
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
      }
      labelPlacement="start"
      sx={{ 
        margin: 0,
        '& .MuiFormControlLabel-label': {
          fontSize: { xs: '0.875rem', sm: '0.875rem' },
          fontWeight: 500,
          marginLeft: { xs: 0.5, sm: 1 }
        },
        '& .MuiSwitch-root': {
          marginRight: { xs: 0.5, sm: 1 }
        }
      }}
    />
  );

  return (
    <AdminLayout title="Update Admin">
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          mb: { xs: 2, sm: 3 }, 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap'
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin')}
            sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minWidth: { xs: 'auto', sm: 'auto' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Back
          </Button>
        </Box>

        {/* Alerts */}
        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: { xs: '300px', sm: '400px' }
          }}>
            <CircularProgress size={isMobile ? 32 : 40} />
          </Box>
        ) : (
          <Paper sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 1, sm: 2 },
            boxShadow: { xs: 1, sm: 2 }
          }}>
            <Box sx={{ pt: { xs: 1, sm: 2 } }}>
              {/* Basic Information */}
              <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: { xs: 2, sm: 1 },
                  gap: { xs: 1, sm: 0 }
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Basic Information
                  </Typography>
                  {statusToggle && (
                    <Box sx={{ 
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '0.875rem', sm: '0.875rem' }
                      }
                    }}>
                      {statusToggle}
                    </Box>
                  )}
                </Box>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: { xs: 1.5, sm: 2 }
                }}>
                  <FormField
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={(value) => handleFieldChange('name', value)}
                    required
                    error={allErrors.name}
                  />

                  <FormField
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(value) => handleFieldChange('email', value)}
                    type="email"
                    required
                    error={allErrors.email}
                  />

                  <FormField
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(value) => handleFieldChange('phone', value)}
                    error={allErrors.phone}
                  />

                  <SelectField
                    name="designation"
                    label="Designation"
                    value={formData.designation}
                    onChange={(value) => handleFieldChange('designation', value)}
                    options={designationOptions}
                    error={allErrors.designation}
                  />
                </Box>
              </Box>

              {/* Address Information */}
              <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1.5, sm: 2 }, 
                  color: 'text.primary',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  Address Information
                </Typography>
                <FormField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={(value) => handleFieldChange('address', value)}
                  multiline
                  rows={isMobile ? 3 : 4}
                  error={allErrors.address}
                />
              </Box>

              {/* Permissions */}
              <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1.5, sm: 2 }, 
                  color: 'text.primary',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  Permissions
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Permissions
                  </InputLabel>
                  <Select
                    multiple
                    value={formData.permissions}
                    onChange={handlePermissionChange}
                    input={<OutlinedInput label="Permissions" />}
                    renderValue={(selected) => (
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5,
                        maxHeight: { xs: '60px', sm: '80px' },
                        overflow: 'auto'
                      }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={value.replace('_', ' ')} 
                            size="small"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              height: { xs: 24, sm: 28 }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        minHeight: { xs: '45px', sm: '50px' },
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: { xs: 300, sm: 400 },
                          '& .MuiMenuItem-root': {
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            py: { xs: 0.5, sm: 1 }
                          }
                        }
                      }
                    }}
                  >
                    {availablePermissions.map((permission) => (
                      <MenuItem key={permission} value={permission}>
                        <Checkbox 
                          checked={formData.permissions.indexOf(permission) > -1}
                          size="small"
                        />
                        <ListItemText 
                          primary={permission.replace('_', ' ')}
                          primaryTypographyProps={{
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Status Settings */}
              <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1.5, sm: 2 }, 
                  color: 'text.primary',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  Status Settings
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: { xs: 1.5, sm: 2 }
                }}>
                  <SwitchField
                    name="is_super_admin"
                    label="Super Administrator"
                    checked={isSuperAdmin}
                    onChange={(checked) => setIsSuperAdmin(checked)}
                  />
                </Box>
              </Box>

              <FormActions
                onSave={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
                saveText="Update"
              />
            </Box>
          </Paper>
        )}

      </Box>
    </AdminLayout>
  );
};

export default AdminProfilePage;