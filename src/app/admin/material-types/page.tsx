'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { materialTypesService } from '@/services/material-types';

interface MaterialType {
  id: number;
  name: string;
  description: string;
  image: string | null;
  cost: number;
  price: number;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  creator: {
    id: number;
    email: string;
    username: string;
    role_id: number;
    role_type: string;
    email_verified_at: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  } | null;
}

const MaterialTypesPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [materialtypess, setMaterialTypes] = useState<MaterialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [materialtypesToDelete, setMaterialTypeToDelete] = useState<MaterialType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Helper function to get material type image URL
  const getMaterialTypeImage = (materialType: MaterialType) => {
    if (materialType.image) {
      return `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/${materialType.image}`;
    }
    return null;
  };

  // Helper function to safely format price values
  const formatPrice = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  const loadMaterialTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build API parameters for server-side pagination
      const params: Record<string, any> = {
        page: page + 1, // API uses 1-based pagination, but MUI uses 0-based
        per_page: rowsPerPage
      };
      
      // Add optional search parameter
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      console.log('🔍 Loading material types with params:', params);
      
      const response = await materialTypesService.getMaterialTypes(params);
      console.log('🔍 API Response:', response);
      
      // Handle the API response structure
      if (response && response.data) {
        setMaterialTypes(response.data);
        // Update total count for pagination from the meta.pagination object
        if (response.meta && response.meta.pagination && response.meta.pagination.total) {
          setTotalCount(response.meta.pagination.total);
        } else if (response.meta && response.meta.total) {
          setTotalCount(response.meta.total);
        } else if (response.total !== undefined) {
          setTotalCount(response.total);
        } else if (response.data && Array.isArray(response.data)) {
          // If no total count provided, use the length of current data
          // This is not ideal for server-side pagination but prevents errors
          setTotalCount(response.data.length);
        }
      } else if (Array.isArray(response)) {
        setMaterialTypes(response);
        setTotalCount(response.length);
      } else {
        setMaterialTypes([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error('Error loading material types:', err);
      
      if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication required. You will be redirected to the login page in 3 seconds.');
        // Redirect to home page where user can login
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view material types.');
      } else if (err.response?.status === 404) {
        setError('Material types endpoint not found. Please contact support.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to load material types. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, router]);

  useEffect(() => {
    loadMaterialTypes();
  }, [loadMaterialTypes]);

  const handleAdd = () => {
    router.push('/admin/material-types/create');
  };

  const handleEdit = (materialtypes: MaterialType) => {
    router.push(`/admin/material-types/${materialtypes.id}/edit`);
  };

  const handleDelete = (materialtypes: MaterialType) => {
    setMaterialTypeToDelete(materialtypes);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (materialtypesToDelete) {
      try {
        setDeleting(true);
        await materialTypesService.deleteMaterialType(materialtypesToDelete.id);
        setMaterialTypes(prev => prev.filter(item => item.id !== materialtypesToDelete.id));
        setAlert({ type: 'success', message: 'Material Type deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete material type');
        console.error('Error deleting material type:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setMaterialTypeToDelete(null);
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
    <AdminLayout title="Material Types">
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
              placeholder="Search material types..."
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
                {totalCount} type{totalCount !== 1 ? 's' : ''} found
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
            {isMobile ? 'Add Material Type' : 'Add'}
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
                  loadMaterialTypes();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Material Types Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : totalCount === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No material types found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : `Click "Add Material Type" to create your first material type.`}
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Mobile Card View */}
            {isMobile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {materialtypess.map((materialtypes) => (
                  <Paper key={materialtypes.id} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {/* Image */}
                      <Box sx={{ 
                        width: 60, 
                        height: 60, 
                        flexShrink: 0,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getMaterialTypeImage(materialtypes) ? (
                          <Box
                            component="img"
                            src={getMaterialTypeImage(materialtypes)!}
                            alt={materialtypes.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.image-fallback');
                              if (fallback) {
                                (fallback as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        
                        <Box
                          className="image-fallback"
                          sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: 'grey.200',
                            display: getMaterialTypeImage(materialtypes) ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                            position: getMaterialTypeImage(materialtypes) ? 'absolute' : 'static',
                            top: 0,
                            left: 0
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {getMaterialTypeImage(materialtypes) ? 'Error' : 'No Image'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
                            {materialtypes.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(materialtypes)}
                              title="Edit"
                              sx={{ color: 'primary.main', p: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(materialtypes)}
                              title="Delete"
                              color="error"
                              sx={{ p: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {materialtypes.description || 'No description available'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main', mb: 1 }}>
                          ${formatPrice(materialtypes.price)}
                        </Typography>
                        
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
                        <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>In Store Price</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {materialtypess.map((materialtypes) => (
                        <TableRow 
                          key={materialtypes.id}
                          sx={{ 
                            '&:hover': { backgroundColor: 'action.hover' },
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <TableCell>
                            <Box sx={{ 
                              width: 60, 
                              height: 60, 
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {getMaterialTypeImage(materialtypes) ? (
                                <Box
                                  component="img"
                                  src={getMaterialTypeImage(materialtypes)!}
                                  alt={materialtypes.name}
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: '1px solid #e0e0e0',
                                    maxWidth: 60,
                                    maxHeight: 60
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.parentElement?.querySelector('.image-fallback');
                                    if (fallback) {
                                      (fallback as HTMLElement).style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              
                              <Box
                                className="image-fallback"
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  bgcolor: 'grey.200',
                                  display: getMaterialTypeImage(materialtypes) ? 'none' : 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 1,
                                  border: '1px solid #e0e0e0',
                                  position: getMaterialTypeImage(materialtypes) ? 'absolute' : 'static',
                                  top: 0,
                                  left: 0
                                }}
                              >
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                  {getMaterialTypeImage(materialtypes) ? 'Error' : 'No Image'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {materialtypes.name}
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
                              {materialtypes.description || 'No description available'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              ${formatPrice(materialtypes.price)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(materialtypes)}
                                title="Edit"
                                sx={{ color: 'primary.main' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(materialtypes)}
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
                    Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} material types
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
                      Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} material types
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
              Are you sure you want to delete &quot;{materialtypesToDelete?.name}&quot;? This action cannot be undone.
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

export default MaterialTypesPage;
