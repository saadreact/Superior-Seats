'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
  CircularProgress,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-based for API
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  // Ref to track debounce timer
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if page reset is due to search change
  const isSearchResettingPage = useRef(false);
  // Ref to track if component has mounted
  const isMounted = useRef(false);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

  // Debounced search effect - triggers search after user stops typing
  useEffect(() => {
    // On initial mount, skip debounce (let pagination effect handle initial fetch)
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    
    // Clear any existing debounce timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    
    // Mark that we're resetting page due to search
    isSearchResettingPage.current = true;
    
    // Reset to page 1 when search changes
    setCurrentPage(1);
    
    // Set up new debounce timer - fetch after 300ms delay
    searchDebounceRef.current = setTimeout(() => {
      fetchCustomers(1, rowsPerPage);
      searchDebounceRef.current = null;
      isSearchResettingPage.current = false;
    }, 300); // 300ms delay after user stops typing

    // Cleanup function to clear timer if user types again before delay completes
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    // Skip if page change is due to search reset (debounce effect will handle the fetch)
    if (isSearchResettingPage.current) {
      isSearchResettingPage.current = false; // Reset the flag
      return;
    }
    
    // Skip if there's an active search debounce timer
    if (searchDebounceRef.current) {
      return;
    }
    
    // Fetch immediately when pagination changes
    fetchCustomers(currentPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);


  const handleAdd = () => {
    router.push('/admin/customers/create');
  };

  const handleEdit = (customer: Customer) => {
    router.push(`/admin/customers/${customer.id}/edit`);
  };


  const handleDelete = async (customer: Customer) => {
    if (!customer.isActive) {
      setAlert({ type: 'error', message: 'Customer is already inactive' });
      return;
    }
    
    try {
      // Send all customer data with is_active set to false
      await apiService.updateCustomer(parseInt(customer.id), {
        first_name: customer.firstName,
        last_name: customer.lastName,
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        phone: customer.phone,
        address: customer.address.street,
        city: customer.address.city,
        state: customer.address.state,
        company_name: customer.company,
        customer_type: 'retail',
        is_active: false
      });
      // Update the customer in the local state
      setCustomers(prev => prev.map(c => 
        c.id === customer.id 
          ? { ...c, isActive: false }
          : c
      ));
      setAlert({ type: 'success', message: 'Customer deleted successfully' });
      // Optionally refetch to refresh totals
      fetchCustomers(currentPage, rowsPerPage);
    } catch (error) {
      console.error('Error deleting customer:', error);
      setAlert({ type: 'error', message: 'Failed to delete customer' });
    }
  };

  const handleChangePage = (_: unknown, newPageZeroBased: number) => {
    setCurrentPage(newPageZeroBased + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (newRowsPerPage > 0 && newRowsPerPage <= 100) {
      setRowsPerPage(newRowsPerPage);
      setCurrentPage(1);
    }
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
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: { xs: 2, sm: 3 }, 
            flex: 1,
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            {/* Search Bar */}
            <TextField
              placeholder="Search customers..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )}}
              sx={{ 
                maxWidth: { xs: '100%', sm: 400 },
                minWidth: { xs: '100%', sm: 250 }
              }}
              size="small"
              fullWidth={isMobile}
            />
            
            {/* Results count for mobile */}
            {isMobile && customers.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
                {customers.length} customer{customers.length !== 1 ? 's' : ''} found
              </Typography>
            )}
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            className="gradient-style"
            sx={{ 
              alignSelf: { xs: 'stretch', sm: 'auto' },
              minWidth: { xs: '100%', sm: 'auto' },
              height: { xs: 44, sm: 'auto' },
              fontSize: { xs: '0.95rem', sm: '0.875rem' },
              backgroundColor: 'primary.main',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: 'none',
              }
            }}
          >
            {isMobile ? 'Add Customer' : 'Add'}
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
            {/* Mobile Card View */}
            {isMobile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {customers.map((customer) => (
                  <Paper key={customer.id} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {/* Customer Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
                            {customer.firstName} {customer.lastName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(customer)}
                              title="Edit"
                              sx={{ color: 'primary.main', p: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(customer)}
                              title="Delete"
                              color="error"
                              disabled={!customer.isActive}
                              sx={{ p: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {customer.email}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {customer.phone}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Company: {customer.company || 'N/A'}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Chip
                            label={customer.isActive ? 'Active' : 'Inactive'}
                            color={customer.isActive ? 'success' : 'default'}
                            size="small"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {customer.createdAt.toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              /* Desktop Table View */
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
                      <TableRow 
                        key={customer.id}
                        sx={{ 
                          '&:hover': { backgroundColor: 'action.hover' },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {customer.firstName} {customer.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {customer.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {customer.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              maxWidth: 150,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {customer.company || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={customer.isActive ? 'Active' : 'Inactive'}
                            color={customer.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {customer.createdAt.toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: 100 }}>
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
                              disabled={!customer.isActive}
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
            )}

            {/* Pagination Controls */}
            <Box sx={{ mt: 2 }}>
              {isMobile ? (
                /* Mobile Pagination */
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  {/* Pagination Info */}
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Showing {Math.max(1, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} customers
                  </Typography>
                  
                  {/* Navigation Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      Previous
                    </Button>
                    
                    <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                      Page {currentPage} of {lastPage}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={currentPage >= lastPage}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                  
                  {/* Items per page select dropdown */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Items per page:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80, maxWidth: 100 }}>
                      <Select
                        value={rowsPerPage.toString()}
                        onChange={(event: any) => {
                          const value = parseInt(event.target.value, 10);
                          setRowsPerPage(value);
                          setCurrentPage(1);
                        }}
                        sx={{
                          '& .MuiSelect-select': {
                            textAlign: 'center',
                            padding: '8px 12px',
                          },
                        }}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              ) : (
                /* Desktop Pagination */
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  {/* Left side - Items per page select dropdown */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Items per page:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80, maxWidth: 100 }}>
                      <Select
                        value={rowsPerPage.toString()}
                        onChange={(event: any) => {
                          const value = parseInt(event.target.value, 10);
                          setRowsPerPage(value);
                          setCurrentPage(1);
                        }}
                        sx={{
                          '& .MuiSelect-select': {
                            textAlign: 'center',
                            padding: '8px 12px',
                          },
                        }}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* Center - Page info */}
                  <Typography variant="body2" color="text.secondary">
                    Showing {Math.max(1, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} customers
                  </Typography>
                  
                  {/* Right side - Navigation controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      Previous
                    </Button>
                    
                    <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                      Page {currentPage} of {lastPage}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={currentPage >= lastPage}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>


          </>
        )}
      </Box>
    </AdminLayout>
  );
};

export default CustomersPage; 
