'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { Customer, CustomerType } from '@/data/types';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';

const CustomersPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCustomers();
        
        console.log('API Response:', response);
        
        // The API returns paginated data, so we need to access response.data.data
        const customersData = response.data?.data || [];
        
        console.log('Customers Data:', customersData);
        
        // Transform API data to match our interface
        const transformedCustomers = customersData.map((customer: any) => ({
          id: customer.id.toString(),
          customerTypeId: customer.customer_type || 'retail',
          firstName: customer.name.split(' ')[0] || customer.name,
          lastName: customer.name.split(' ').slice(1).join(' ') || '',
          email: customer.email,
          phone: customer.phone,
          company: customer.company_name,
          address: {
            street: customer.address,
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          isActive: customer.is_active,
          notes: '',
          createdAt: new Date(customer.created_at),
          updatedAt: new Date(customer.updated_at),
        }));

        setCustomers(transformedCustomers);
        setCustomerTypes([]); // No customer types available
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlert({ type: 'error', message: 'Failed to load customers data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCustomerTypeName = (customerTypeId: string) => {
    const customerType = customerTypes.find(ct => ct.id === customerTypeId);
    return customerType?.name || 'Standard';
  };

  const handleAdd = () => {
    router.push('/admin/customers/create');
  };

  const handleEdit = (customer: Customer) => {
    router.push(`/admin/customers/${customer.id}/edit`);
  };

  const handleView = (customer: Customer) => {
    router.push(`/admin/customers/${customer.id}`);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await apiService.deleteCustomer(parseInt(customerToDelete.id));
        setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
        setAlert({ type: 'success', message: 'Customer deleted successfully' });
      } catch (error) {
        console.error('Error deleting customer:', error);
        setAlert({ type: 'error', message: 'Failed to delete customer' });
      }
    }
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };



  return (
    <AdminLayout title="Customers">
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', md: 'center' },
          gap: { xs: 2, md: 0 }
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Customers
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ alignSelf: { xs: 'stretch', md: 'auto' } }}
          >
            Add Customer
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
          <>
            {/* Desktop Table View */}
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <TableContainer component={Paper} sx={{ 
            borderRadius: 2, 
            overflow: 'auto',
            maxWidth: '100%',
            '& .MuiTable-root': {
              minWidth: 650,
            },
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.company || '-'}</TableCell>
                    <TableCell>{getCustomerTypeName(customer.customerTypeId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={customer.isActive ? 'Active' : 'Inactive'}
                        color={customer.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {customer.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(customer)}
                          title="View"
                          sx={{ color: 'primary.main' }}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(customer)}
                          title="Edit"
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(customer)}
                          title="Delete"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Mobile Card View */}
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {customers.map((customer) => (
              <Paper key={customer.id} sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {customer.firstName} {customer.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {customer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.phone}
                    </Typography>
                  </Box>
                  <Chip
                    label={customer.isActive ? 'Active' : 'Inactive'}
                    color={customer.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Company
                    </Typography>
                    <Typography variant="body2">
                      {customer.company || '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Customer Type
                    </Typography>
                    <Typography variant="body2">
                      {getCustomerTypeName(customer.customerTypeId)}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {customer.createdAt.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleView(customer)}
                    title="View"
                    sx={{ color: 'primary.main' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(customer)}
                    title="Edit"
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(customer)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>



        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{customerToDelete?.firstName} {customerToDelete?.lastName}&quot;? This action cannot be undone.
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
          </>
        )}
      </Box>
    </AdminLayout>
  );
};

export default CustomersPage; 