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
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-based for API
  const [rowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Filters & sorting state
  const [filters, setFilters] = useState({
    search: '',
    is_active: '', // '' | 'true' | 'false'
    company_name: '',
    sort_by: 'created_at' as 'name' | 'email' | 'created_at' | 'city' | 'state',
    sort_order: 'desc' as 'asc' | 'desc',
  });

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCustomers(1, rowsPerPage);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      is_active: '',
      company_name: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    setCurrentPage(1);
    fetchCustomers(1, rowsPerPage);
  };

  const handleSort = (column: 'name' | 'email' | 'created_at' | 'city' | 'state') => {
    const newOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
    setFilters(prev => ({
      ...prev,
      sort_by: column as 'name' | 'email' | 'created_at' | 'city' | 'state',
      sort_order: newOrder,
    }));
    setCurrentPage(1);
    // Trigger fetch with new sort parameters
    setTimeout(() => {
      fetchCustomers(1, rowsPerPage);
    }, 0);
  };

  const fetchCustomers = async (page: number, perPage: number) => {
    try {
      setLoading(true);
      const response = await apiService.getCustomers({
        page,
        per_page: perPage,
        search: filters.search || undefined,
        is_active: filters.is_active === '' ? undefined : filters.is_active === 'true',
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
        customerTypeId: 'retail',
        customerType: '',
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

  const SortableHeader = ({ 
    column, 
    children, 
    sortKey 
  }: { 
    column: 'name' | 'email' | 'created_at' | 'city' | 'state';
    children: React.ReactNode;
    sortKey: string;
  }) => {
    const isActive = filters.sort_by === sortKey;
    const isAsc = filters.sort_order === 'asc';
    
    return (
      <TableCell 
        sx={{ 
          fontWeight: 600, 
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          position: 'relative',
          padding: '16px',
        }}
        onClick={() => handleSort(column)}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          width: '100%'
        }}>
          {children}
          {isActive && (
            <Box sx={{ ml: 0.5 }}>
              {isAsc ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
            </Box>
          )}
        </Box>
      </TableCell>
    );
  };



  return (
    <AdminLayout title="Customers">
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        
            {/* Search Bar positioned at top-left */}
            <TextField
              placeholder="Search customers..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )}}
              sx={{ maxWidth: 400 }}
              size="small"
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ 
              alignSelf: { xs: 'stretch', sm: 'auto' },
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            Add
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Desktop Table View */}
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Paper sx={{ overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <SortableHeader column="name" sortKey="name">Name</SortableHeader>
                      <SortableHeader column="email" sortKey="email">Email</SortableHeader>
                      <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <SortableHeader column="created_at" sortKey="created_at">Created Date</SortableHeader>
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
              </Paper>
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
                      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                        <Typography variant="caption" color="text.secondary">
                          Created Date
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

          </>
        )}
      </Box>
    </AdminLayout>
  );
};

export default CustomersPage; 
