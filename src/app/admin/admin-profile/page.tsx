'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { 
  FormField, 
  SelectField, 
  FormActions,
} from '@/components/common/FormComponents';
import { apiService } from '@/utils/api';

interface AdminFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  designation: string;
}

const AdminProfilePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  
  // Form data state
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    designation: '',
  });

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
      });
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

  const handleSubmit = async () => {
    setLoading(true);
    setAlert(null);
    setServerErrors({});
    try {
      // Update form data with hardcoded values for permissions, is_active, and is_super_admin
      const updatedFormData = {
        ...formData,
        permissions: [], // Hardcoded: empty permissions array
        is_active: true, // Hardcoded: always active
        is_super_admin: false, // Hardcoded: not super admin
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
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  mb: { xs: 2, sm: 1 }
                }}>
                  Basic Information
                </Typography>
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