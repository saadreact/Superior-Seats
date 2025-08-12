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

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await apiService.deleteCustomer(Number(params.id));
        router.push('/admin/customers');
      } catch (error) {
        console.error('Failed to delete customer:', error);
        setError('Failed to delete customer');
      }
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
            Back to Customers
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
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/admin/customers')}
              sx={{ color: 'text.secondary' }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" sx={{ 
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}>
              View Customer
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              fullWidth={isMobile}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              fullWidth={isMobile}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Content */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header Info */}
            <Box>
              <Typography variant="h5" gutterBottom sx={{ 
                color: 'primary.main', 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}>
                {customer.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={customer.is_active ? 'Active' : 'Inactive'}
                  color={customer.is_active ? 'success' : 'default'}
                  size="small"
                />
                <Chip
                  label={customer.customer_type}
                  color="primary"
                  size="small"
                />
              </Box>
            </Box>

            <Divider />

            {/* Basic Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main', 
                fontWeight: 600,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}>
                Basic Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderField('Full Name', customer.name)}
                {renderField('Email', customer.email)}
                {renderField('Phone', customer.phone)}
                {renderField('Address', customer.address)}
              </Box>
            </Box>

            {/* Business Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main', 
                fontWeight: 600,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}>
                Business Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderField('Company Name', customer.company_name)}
                {renderField('Tax ID', customer.tax_id)}
                {renderField('Customer Type', customer.customer_type)}
                {renderField('Price Tier ID', customer.price_tier_id)}
                {renderField('Price Tier', customer.price_tier?.display_name)}
              </Box>
            </Box>

            {/* Financial Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main', 
                fontWeight: 600,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}>
                Financial Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderField('Credit Limit', `$${customer.credit_limit}`)}
                {renderField('Outstanding Balance', `$${customer.outstanding_balance}`)}
              </Box>
            </Box>

            {/* Account Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main', 
                fontWeight: 600,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}>
                Account Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderField('Username', customer.user?.username)}
                {renderField('User Status', customer.user?.is_active)}
                {renderField('Status', customer.is_active)}
                {renderField('Created At', new Date(customer.created_at).toLocaleDateString())}
                {renderField('Updated At', new Date(customer.updated_at).toLocaleDateString())}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default ViewCustomerPage; 