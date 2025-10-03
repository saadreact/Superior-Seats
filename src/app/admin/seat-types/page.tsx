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
import { apiService } from '@/utils/api';

interface SeatType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const SeatTypesPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [seatTypeToDelete, setSeatTypeToDelete] = useState<SeatType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadSeatTypes = useCallback(async () => {
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
      
      console.log('🔍 Loading seat types with params:', params);
      
      const response = await apiService.getSeatTypes(params);
      console.log('🔍 API Response:', response);
      
      // Handle the API response structure
      if (response && response.data) {
        setSeatTypes(response.data);
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
        setSeatTypes(response);
        setTotalCount(response.length);
      } else {
        setSeatTypes([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error('Error loading seat types:', err);
      
      if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication required. You will be redirected to the login page in 3 seconds.');
        // Redirect to home page where user can login
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view seat types.');
      } else if (err.response?.status === 404) {
        setError('Seat types endpoint not found. Please contact support.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to load seat types. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, router]);

  useEffect(() => {
    loadSeatTypes();
  }, [loadSeatTypes]);

  const handleAdd = () => {
    router.push('/admin/seat-types/create');
  };

  const handleEdit = (seatType: SeatType) => {
    router.push(`/admin/seat-types/${seatType.id}/edit`);
  };

  const handleDelete = (seatType: SeatType) => {
    setSeatTypeToDelete(seatType);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (seatTypeToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteSeatType(seatTypeToDelete.id);
        setSeatTypes(prev => prev.filter(item => item.id !== seatTypeToDelete.id));
        setAlert({ type: 'success', message: 'Seat Type deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete seat type');
        console.error('Error deleting seat type:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setSeatTypeToDelete(null);
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
    <AdminLayout title="Seat Types">
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
              placeholder="Search seat types..."
              value={searchTerm}
              onChange={handleSearch}
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
            className="gradient-style"
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
                  loadSeatTypes();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Seat Types Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : totalCount === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No seat types found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : `Click "Add Seat Type" to create your first seat type.`}
            </Typography>
          </Paper>
        ) : (
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
                  {seatTypes.map((seatType) => (
                    <TableRow 
                      key={seatType.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {seatType.name}
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
                          {seatType.description || 'No description available'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(seatType)}
                            title="Edit"
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(seatType)}
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
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} seat types
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
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} seat types
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Confirm Delete
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to delete &quot;{seatTypeToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </Stack>
          </Box>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default SeatTypesPage; 