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
  city?: string;
  state?: string;
  company_name?: string;
  tax_id?: string;
  price_tier_id: number;
  credit_limit: string;
  outstanding_balance: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Shipping Address Fields
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
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
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/customers')}
            sx={{ 
              color: 'text.secondary',
              alignSelf: { xs: 'flex-start', sm: 'auto' }
            }}
          >
            Back
          </Button>
       
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              minHeight: { xs: 44, sm: 'auto' },
              fontSize: { xs: '0.95rem', sm: '0.875rem' }
            }}
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
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Name
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {customer.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Email
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {customer.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {customer.phone}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Address
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {customer.address}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Company Name
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {customer.company_name || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Customer Price Tiers
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {customer.price_tier?.display_name || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Status
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 300 } }}>
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: { xs: '0.95rem', sm: '0.875rem' }
                    }}>
                      ID
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
                      {customer.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: { xs: '0.95rem', sm: '0.875rem' }
                    }}>
                      Created Date
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
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
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: { xs: '0.95rem', sm: '0.875rem' }
                    }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
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
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: { xs: '1rem', sm: '0.875rem' } }}>
            Are you sure you want to delete &quot;{customer?.name}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ 
              width: '100%',
              '& .MuiButton-root': {
                minHeight: { xs: 44, sm: 'auto' },
                fontSize: { xs: '0.95rem', sm: '0.875rem' }
              }
            }}
          >
            <Button 
              onClick={() => setIsDeleteDialogOpen(false)}
              fullWidth={isMobile}
              variant={isMobile ? 'outlined' : 'text'}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained"
              fullWidth={isMobile}
            >
              Delete
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default ViewCustomerPage; 