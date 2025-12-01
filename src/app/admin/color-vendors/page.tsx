'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';

interface ColorVendor {
  id: number;
  name: string;
  code: string;
  description: string;
  website: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

const ColorVendorsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [colorVendors, setColorVendors] = useState<ColorVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorVendorToDelete, setColorVendorToDelete] = useState<ColorVendor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [totalCount, setTotalCount] = useState(0);

  // Ref to track debounce timer
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if page reset is due to search change
  const isSearchResettingPage = useRef(false);
  // Ref to track if component has mounted
  const isMounted = useRef(false);

  const loadColorVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {
        page: page + 1, // API uses 1-based pagination
        per_page: rowsPerPage
      };
      if (searchTerm) params.search = searchTerm;
      
      console.log('🎨 Color Vendors - API call params:', params);
      const response = await apiService.getColorVendors(params);
      console.log('🎨 Color Vendors - API Response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        setColorVendors(response.data);
        // Extract total count from meta object
        const total = response.meta?.total || 
                     response.meta?.pagination?.total || 
                     response.meta?.last_page * rowsPerPage || 
                     response.data.length;
        setTotalCount(total);
        console.log('📊 Setting total count:', total);
      } else if (Array.isArray(response)) {
        setColorVendors(response);
        setTotalCount(response.length);
      } else {
        setColorVendors([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setColorVendors([]);
      setTotalCount(0);
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load color vendors. Please try again later.');
      }
      console.error('❌ Error loading color vendors:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

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
    
    // Reset to page 0 when search changes
    setPage(0);
    
    // Set up new debounce timer - fetch after 300ms delay
    searchDebounceRef.current = setTimeout(async () => {
      // Fetch with current search term and page 0
      try {
        setLoading(true);
        setError(null);
        
        const params: Record<string, any> = {
          page: 1, // Page 1 for API (0-based converted to 1-based)
          per_page: rowsPerPage
        };
        
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        
        const response = await apiService.getColorVendors(params);
        
        if (response && response.data && Array.isArray(response.data)) {
          setColorVendors(response.data);
          const total = response.meta?.total || 
                       response.meta?.pagination?.total || 
                       response.meta?.last_page * rowsPerPage || 
                       response.data.length;
          setTotalCount(total);
        } else if (Array.isArray(response)) {
          setColorVendors(response);
          setTotalCount(response.length);
        } else {
          setColorVendors([]);
          setTotalCount(0);
        }
      } catch (err: any) {
        setColorVendors([]);
        setTotalCount(0);
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError('Please log in to access this page');
        } else {
          setError(err.message || 'Failed to load color vendors. Please try again later.');
        }
        console.error('❌ Error loading color vendors:', err);
      } finally {
        setLoading(false);
      }
      
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
  }, [searchTerm]);

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
    loadColorVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleAdd = () => {
    router.push('/admin/color-vendors/create');
  };

  const handleEdit = (colorVendor: ColorVendor) => {
    router.push(`/admin/color-vendors/${colorVendor.id}/edit`);
  };


  const handleDelete = (colorVendor: ColorVendor) => {
    setColorVendorToDelete(colorVendor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (colorVendorToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteColorVendor(colorVendorToDelete.id);
        setColorVendors(prev => prev.filter(cv => cv.id !== colorVendorToDelete.id));
        setAlert({ type: 'success', message: 'Color vendor deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete color vendor');
        console.error('Error deleting color vendor:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setColorVendorToDelete(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Page reset is handled by the debounce effect
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  return (
    <AdminLayout title="Color Vendors">
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
              placeholder="Search color vendors..."
              value={searchTerm}
              onChange={handleSearch}
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
            {isMobile && totalCount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
                {totalCount} vendor{totalCount !== 1 ? 's' : ''} found
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
            {isMobile ? 'Add Color Vendor' : 'Add'}
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

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                  loadColorVendors();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Color Vendors Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : totalCount === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No color vendors found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add Color Vendor" to create your first color vendor.'}
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Mobile Card View */}
            {isMobile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {colorVendors.map((colorVendor) => (
                    <Paper key={colorVendor.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        {/* Vendor Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
                              {colorVendor.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(colorVendor)}
                                title="Edit"
                                sx={{ color: 'primary.main', p: 0.5 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(colorVendor)}
                                title="Delete"
                                color="error"
                                sx={{ p: 0.5 }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Code: {colorVendor.code}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          >
                            {colorVendor.description || 'No description available'}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Website: {colorVendor.website || 'N/A'}
                          </Typography>
                          
                          {(colorVendor.contact_email || colorVendor.contact_phone) && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Contact: {colorVendor.contact_email || colorVendor.contact_phone}
                            </Typography>
                          )}
                          
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
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Website</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {colorVendors.map((colorVendor) => (
                        <TableRow 
                          key={colorVendor.id}
                          sx={{ 
                            '&:hover': { backgroundColor: 'action.hover' },
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {colorVendor.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {colorVendor.code}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                maxWidth: 300,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {colorVendor.description || 'No description available'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {colorVendor.website || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {colorVendor.contact_email && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  {colorVendor.contact_email}
                                </Typography>
                              )}
                              {colorVendor.contact_phone && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  {colorVendor.contact_phone}
                                </Typography>
                              )}
                              {!colorVendor.contact_email && !colorVendor.contact_phone && (
                                <Typography variant="body2" color="text.secondary">
                                  N/A
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(colorVendor)}
                                title="Edit"
                                sx={{ color: 'primary.main' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(colorVendor)}
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
                
                {/* Desktop Pagination */}
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
                          setPage(0);
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
                    Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} color vendors
                  </Typography>
                  
                  {/* Right side - Navigation controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={page === 0}
                      onClick={() => handleChangePage({} as any, page - 1)}
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
                      Page {page + 1} of {Math.ceil(totalCount / rowsPerPage)}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
                      onClick={() => handleChangePage({} as any, page + 1)}
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
                
                {/* Mobile Pagination - shown only on mobile */}
                {isMobile && totalCount > 0 && (
                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {/* Pagination Info */}
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} color vendors
                    </Typography>
                    
                    {/* Navigation Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={page === 0}
                        onClick={() => handleChangePage({} as any, page - 1)}
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
                        Page {page + 1} of {Math.ceil(totalCount / rowsPerPage)}
                      </Typography>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
                        onClick={() => handleChangePage({} as any, page + 1)}
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
                            setPage(0);
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
                )}
              </Paper>
            )}
          </>
        )}

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
              Are you sure you want to delete &quot;{colorVendorToDelete?.name}&quot;? This action cannot be undone.
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
                disabled={deleting}
                fullWidth={isMobile}
                variant={isMobile ? 'outlined' : 'text'}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                color="error" 
                variant="contained" 
                disabled={deleting}
                fullWidth={isMobile}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default ColorVendorsPage; 
