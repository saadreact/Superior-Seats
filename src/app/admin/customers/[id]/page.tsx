'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company_name?: string;
  tax_id?: string;
  customer_type: string;
  price_tier_id: number;
  credit_limit: string;
  outstanding_balance: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    username: string;
    is_active: boolean;
  };
  price_tier?: {
    id: number;
    name: string;
    display_name: string;
    discount_off_retail_price: string;
  };
}

const ViewCustomerPage = () => {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const customerId = Number(params.id);
        const response = await apiService.getCustomer(customerId);
        const customerData = response.data?.data || response.data;
        
        if (!customerData) {
          setNotFound(true);
          return;
        }

        setCustomer(customerData);
      } catch (error: any) {
        console.error('Failed to load customer:', error);
        setError(error.message || 'Failed to load customer');
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin/customers/${params.id}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteCustomer(Number(params.id));
      router.push('/admin/customers');
    } catch (error) {
      console.error('Failed to delete customer:', error);
      setError('Failed to delete customer');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const renderField = (label: string, value: string | boolean | number | undefined) => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', sm: 'center' },
      py: 1,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}>
      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
        {label}:
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : value || 'N/A'}
      </Typography>
    </Box>
  );

  const getCustomerTypeName = (type?: string) => {
    if (!type) return 'N/A';
    const t = String(type).toLowerCase();
    if (t === 'retail' || t === 'retail_customer') return 'Retail';
    if (t === 'wholesale' || t === 'wholesale_customer') return 'Wholesale';
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  if (loading) {
    return (
      <AdminLayout title="View Customer">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout title="Customer Not Found">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Customer Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The customer you&apos;re looking for doesn&apos;t exist.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/admin/customers')}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <AdminLayout title="View Customer">
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
       
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Customer
          </Button>
        </Box>

        {/* Content */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {customer.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customer.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customer.phone}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Address
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customer.address}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Company Name
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customer.company_name || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Customer Type
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {getCustomerTypeName(customer.customer_type)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Price Tier
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customer.price_tier?.display_name || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Status
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 300 } }}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {customer.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(customer.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(customer.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{customer?.name}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default ViewCustomerPage; 