'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
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
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';

interface ItemType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const ItemTypesPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [itemtypess, setItemTypes] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemtypesToDelete, setItemTypeToDelete] = useState<ItemType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadItemTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getItemTypes(params);
      
      if (response && response.data) {
        setItemTypes(response.data);
      } else if (Array.isArray(response)) {
        setItemTypes(response);
      } else {
        setItemTypes([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load item types. Please try again later.');
      }
      console.error('Error loading item types:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadItemTypes();
  }, [loadItemTypes]);

  const handleAdd = () => {
    router.push('/admin/item-types/create');
  };

  const handleEdit = (itemtypes: ItemType) => {
    router.push(`/admin/item-types/${itemtypes.id}/edit`);
  };

  const handleDelete = (itemtypes: ItemType) => {
    setItemTypeToDelete(itemtypes);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (itemtypesToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteItemType(itemtypesToDelete.id);
        setItemTypes(prev => prev.filter(item => item.id !== itemtypesToDelete.id));
        setAlert({ type: 'success', message: 'Item Type deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete item type');
        console.error('Error deleting item type:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setItemTypeToDelete(null);
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
    <AdminLayout title="Item Types">
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
              placeholder="Search item types..."
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
            {isMobile && itemtypess.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
                {itemtypess.length} item type{itemtypess.length !== 1 ? 's' : ''} found
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
            {isMobile ? 'Add Item Type' : 'Add'}
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
                  loadItemTypes();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Item Types Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : itemtypess.length === 0 ? (
          <Paper sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No item types found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add Item Type" to create your first item type.'}
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Mobile Card View */}
            {isMobile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {itemtypess
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((itemtypes) => (
                    <Paper key={itemtypes.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
                              {itemtypes.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(itemtypes)}
                                title="Edit"
                                sx={{ color: 'primary.main', p: 0.5 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(itemtypes)}
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
                            {itemtypes.description || 'No description available'}
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
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itemtypess
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((itemtypes) => (
                        <TableRow 
                          key={itemtypes.id}
                          sx={{ 
                            '&:hover': { backgroundColor: 'action.hover' },
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {itemtypes.name}
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
                              {itemtypes.description || 'No description available'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(itemtypes)}
                                title="Edit"
                                sx={{ color: 'primary.main' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(itemtypes)}
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
            )}
            
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
              component="div"
              count={itemtypess.length}
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
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Confirm Delete
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to delete &quot;{itemtypesToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="flex-end"
              sx={{ 
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
          </Box>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default ItemTypesPage;
