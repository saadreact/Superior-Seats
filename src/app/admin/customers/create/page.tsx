'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  List, 
  ListItem, 
  ListItemText, 
  FormControlLabel, 
  Switch,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import CustomerForm from '@/components/admin/CustomerForm';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import { CustomerType } from '@/data/types';

const CreateCustomerPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState<string>('');
  const [errorDialogMessage, setErrorDialogMessage] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  const handleSubmit = async (customer: any) => {
    setAlert(null);
    setServerErrors({});
    try {
      const customerData = { 
        ...customer, 
        customer_type: 'retail',
        is_active: isActive 
      };
      await apiService.createCustomer(customerData);
      setAlert({ type: 'success', message: 'Customer created successfully' });
      router.push('/admin/customers');
    } catch (error: any) {
      const data = error?.response?.data;
      if (data?.status === 'error') {
        const fieldErrors: Record<string, string> = {};
        if (data?.errors && typeof data.errors === 'object') {
          Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
            const arr = Array.isArray(messages) ? messages : [String(messages)];
            if (arr.length > 0) fieldErrors[field] = String(arr[0]);
          });
        }
        setServerErrors(fieldErrors);
        setErrorDialogTitle(data.message || 'Validation failed');
        setErrorDialogMessage('Please review the highlighted fields below.');
        setErrorDialogOpen(true);
      } else {
        setErrorDialogTitle('Request failed');
        setErrorDialogMessage(data?.message || 'Something went wrong while creating the customer.');
        setErrorDialogOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/customers');
  };

  const clearServerError = (field: string) => {
    setServerErrors(prev => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const statusToggle = (
    <FormControlLabel
      control={
        <Switch
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          color="primary"
        />
      }
      label={
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          fontSize: { xs: '1rem', sm: '0.875rem' }
        }}>
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
      }
      labelPlacement="start"
      sx={{ 
        '& .MuiFormControlLabel-label': {
          fontSize: { xs: '1rem', sm: '0.875rem' },
          fontWeight: 500
        }
      }}
    />
  );

  return (
    <AdminLayout title="Create Customer">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/customers')}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
        </Box>

        {/* Alerts */}
        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 3 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <CustomerForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              serverErrors={serverErrors}
              onClearServerError={clearServerError}
              statusToggle={statusToggle}
            />
          </Paper>
        )}

        <Dialog 
          open={errorDialogOpen} 
          onClose={handleCloseErrorDialog} 
          fullWidth 
          maxWidth="sm"
          PaperProps={{
            sx: {
              mx: { xs: 2, sm: 'auto' },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' }
            }
          }}
        >
          <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            {errorDialogTitle}
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ 
              mb: 2,
              fontSize: { xs: '1rem', sm: '0.875rem' }
            }}>
              {errorDialogMessage}
            </Typography>
            {Object.keys(serverErrors).length > 0 && (
              <List dense>
                {Object.entries(serverErrors).map(([field, message]) => (
                  <ListItem key={field} disableGutters>
                    <ListItemText
                      primary={message}
                      secondary={field.replace(/_/g, ' ')}
                      primaryTypographyProps={{ 
                        color: 'error',
                        fontSize: { xs: '0.95rem', sm: '0.875rem' }
                      }}
                      secondaryTypographyProps={{
                        fontSize: { xs: '0.85rem', sm: '0.75rem' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseErrorDialog} 
              variant="contained"
              sx={{
                minHeight: { xs: 44, sm: 'auto' },
                fontSize: { xs: '0.95rem', sm: '0.875rem' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default CreateCustomerPage; 
