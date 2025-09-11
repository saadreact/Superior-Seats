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
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
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
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-based for API
  const [rowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Filters & sorting state
  const [filters, setFilters] = useState({
    search: '',
    customer_type: '', // retail | wholesale
    is_active: '', // '' | 'true' | 'false'
    city: '',
    state: '',
    company_name: '',
    sort_by: 'created_at' as 'name' | 'email' | 'created_at' | 'customer_type' | 'city' | 'state',
    sort_order: 'desc' as 'asc' | 'desc',
  });

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCustomers(1, rowsPerPage);
    setFilterDialogOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      customer_type: '',
      is_active: '',
      city: '',
      state: '',
      company_name: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    setCurrentPage(1);
    fetchCustomers(1, rowsPerPage);
  };

  const fetchCustomers = async (page: number, perPage: number) => {
    try {
      setLoading(true);
      const response = await apiService.getCustomers({
        page,
        per_page: perPage,
        search: filters.search || undefined,
        customer_type: filters.customer_type || undefined,
        is_active: filters.is_active === '' ? undefined : filters.is_active === 'true',
        city: filters.city || undefined,
        state: filters.state || undefined,
        company_name: filters.company_name || undefined,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      });

      // The API returns pagination payload at the top level
      // Fallbacks included for safety in case of structure variations
      const payload: any = response || {};
      const customersData: any[] = Array.isArray(payload.data)
        ? payload.data
        : (payload.data?.data || []);

      const total = payload.total ?? payload.data?.total ?? 0;
      const apiPerPage = payload.per_page ?? perPage;
      const apiCurrentPage = payload.current_page ?? page;
      const apiLastPage = payload.last_page ?? (apiPerPage ? Math.ceil(total / apiPerPage) : 1);

      const transformedCustomers: Customer[] = customersData.map((customer: any) => ({
        id: String(customer.id),
        customerTypeId: customer.customer_type || 'retail',
        customerType: customer.customer_type || '',
        firstName: (customer.first_name || (customer.name || '').split(' ')[0] || (customer.name || '')),
        lastName: (customer.last_name || (customer.name || '').split(' ').slice(1).join(' ') || ''),
        email: customer.email,
        phone: customer.phone,
        company: customer.company_name,
        address: {
          street: customer.address,
          city: customer.city || '',
          state: customer.state || '',
          zipCode: '',
          country: 'USA',
        },
        isActive: customer.is_active,
        notes: '',
        createdAt: new Date(customer.created_at),
        updatedAt: new Date(customer.updated_at),
      }));

      setCustomers(transformedCustomers);
      setTotalItems(Number(total) || 0);
      setLastPage(Number(apiLastPage) || 1);
      setCustomerTypes([]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlert({ type: 'error', message: 'Failed to load customers data' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    fetchCustomers(currentPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);

  const getCustomerTypeName = (type: string) => {
    if (!type) return '-';
    const t = String(type).toLowerCase();
    if (t === 'retail' || t === 'retail_customer') return 'Retail';
    if (t === 'wholesale' || t === 'wholesale_customer') return 'Wholesale';
    return t.charAt(0).toUpperCase() + t.slice(1);
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
        // Optionally refetch to refresh totals
        fetchCustomers(currentPage, rowsPerPage);
      } catch (error) {
        console.error('Error deleting customer:', error);
        setAlert({ type: 'error', message: 'Failed to delete customer' });
      }
    }
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleChangePage = (_: unknown, newPageZeroBased: number) => {
    setCurrentPage(newPageZeroBased + 1);
  };



  return (
    <AdminLayout title="Customers">
      <Box>
        {/* Header Row with Filters button (left) and Add Customer (right) */}
        <Box sx={{ 
          mb: 1, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', md: 'center' },
          gap: { xs: 1, md: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDialogOpen(true)}
              sx={{ boxShadow: 'none' }}
            >
              Filters
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            className="gradient-style"
            sx={{ 
              alignSelf: { xs: 'stretch', md: 'auto' },
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
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

            {/* Pagination Controls */}
            <Box sx={{ mt: 2 }}>
              <TablePagination
                component="div"
                count={totalItems}
                page={Math.max(0, currentPage - 1)}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
              />
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

            {/* Filters Dialog */}
            <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="lg" fullWidth>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Filter Customers
                <IconButton
                  onClick={() => setFilterDialogOpen(false)}
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr 1fr' }, gap: 2 }}>
                  <TextField
                    placeholder="Search (name, email, company)"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Customer Type</InputLabel>
                    <Select
                      value={filters.customer_type}
                      label="Customer Type"
                      onChange={(e) => handleFilterChange('customer_type', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="retail">Retail</MenuItem>
                      <MenuItem value="wholesale">Wholesale</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Active</InputLabel>
                    <Select
                      value={filters.is_active}
                      label="Active"
                      onChange={(e) => handleFilterChange('is_active', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr auto auto' }, gap: 2 }}>
                  <TextField label="Company" value={filters.company_name} onChange={(e) => handleFilterChange('company_name', e.target.value)} />
                  <TextField label="City" value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} />
                  <TextField label="State" value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)} />
                  <FormControl fullWidth sx={{ minWidth: { md: 160 }, maxWidth: { md: 220 } }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sort_by}
                      label="Sort By"
                      onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    >
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="created_at">Created</MenuItem>
                      <MenuItem value="customer_type">Customer Type</MenuItem>
                      <MenuItem value="city">City</MenuItem>
                      <MenuItem value="state">State</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ minWidth: { md: 140 }, maxWidth: { md: 180 } }}>
                    <InputLabel>Sort Order</InputLabel>
                    <Select
                      value={filters.sort_order}
                      label="Sort Order"
                      onChange={(e) => handleFilterChange('sort_order', e.target.value)}
                    >
                      <MenuItem value="asc">Asc</MenuItem>
                      <MenuItem value="desc">Desc</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={resetFilters}>Clear</Button>
                <Button onClick={handleSearch} variant="contained" startIcon={<SearchIcon />}>
                  Search
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
