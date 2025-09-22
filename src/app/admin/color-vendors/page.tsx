'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadColorVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getColorVendors(params);
      
      if (response && response.data) {
        setColorVendors(response.data);
      } else if (Array.isArray(response)) {
        setColorVendors(response);
      } else {
        setColorVendors([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load color vendors. Please try again later.');
      }
      console.error('Error loading color vendors:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadColorVendors();
  }, [loadColorVendors]);

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
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            {isMobile && colorVendors.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
                {colorVendors.length} vendor{colorVendors.length !== 1 ? 's' : ''} found
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
              boxShadow: 'none',
              '&:hover': {
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
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Color Vendors Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : colorVendors.length === 0 ? (
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
                {colorVendors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((colorVendor) => (
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
                      {colorVendors
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((colorVendor) => (
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
                
                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={colorVendors.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: 1,
                    borderColor: 'divider',
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      color: 'text.secondary',
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    },
                    '& .MuiTablePagination-toolbar': {
                      flexWrap: isMobile ? 'wrap' : 'nowrap',
                      gap: isMobile ? 1 : 0
                    }
                  }}
                />
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
