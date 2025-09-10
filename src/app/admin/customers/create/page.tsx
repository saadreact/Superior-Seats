'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import CustomerForm from '@/components/admin/CustomerForm';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import { CustomerType } from '@/data/types';

const CreateCustomerPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState<string>('');
  const [errorDialogMessage, setErrorDialogMessage] = useState<string>('');

  const handleSubmit = async (customer: any) => {
    setAlert(null);
    setServerErrors({});
    try {
      await apiService.createCustomer(customer);
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

  return (
    <AdminLayout title="Create New Customer">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/customers')}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>
    
      </Box>

      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 2 }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          serverErrors={serverErrors}
          onClearServerError={clearServerError}
        />
      )}

      <Dialog open={errorDialogOpen} onClose={handleCloseErrorDialog} fullWidth maxWidth="sm">
        <DialogTitle>{errorDialogTitle}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {errorDialogMessage}
          </Typography>
          {Object.keys(serverErrors).length > 0 && (
            <List dense>
              {Object.entries(serverErrors).map(([field, message]) => (
                <ListItem key={field} disableGutters>
                  <ListItemText
                    primary={message}
                    secondary={field.replace(/_/g, ' ')}
                    primaryTypographyProps={{ color: 'error' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default CreateCustomerPage; 
