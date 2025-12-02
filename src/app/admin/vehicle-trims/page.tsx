'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
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
import { vehicleTrimsApiService } from '@/services/vehicleTrimsApi';

interface VehicleTrim {
  id: number;
  name: string;
  description: string;
  vehicle_model_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  model?: {
    id: number;
    name: string;
    description: string;
    vehicle_make_id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    make?: {
      id: number;
      name: string;
      description: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

const VehicleTrimsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [vehicleTrims, setVehicleTrims] = useState<VehicleTrim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleTrimToDelete, setVehicleTrimToDelete] = useState<VehicleTrim | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15); // Match API default
  const [totalCount, setTotalCount] = useState(0);

  // Ref to track debounce timer
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if page reset is due to search change
  const isSearchResettingPage = useRef(false);
  // Ref to track if component has mounted
  const isMounted = useRef(false);

  const loadVehicleTrims = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {
        page: page + 1, // API uses 1-based pagination
        per_page: rowsPerPage
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      
      const response = await vehicleTrimsApiService.getVehicleTrims(params);
      
      if (response && response.data && Array.isArray(response.data)) {
        setVehicleTrims(response.data);
        // Extract total count from meta object
        const total = response.meta?.total || 
                     response.meta?.pagination?.total || 
                     response.meta?.last_page * rowsPerPage || 
                     response.data.length;
        setTotalCount(total);
      } else if (Array.isArray(response)) {
        setVehicleTrims(response);
        setTotalCount(response.length);
      } else {
        setVehicleTrims([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setVehicleTrims([]);
      setTotalCount(0);
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load vehicle trims. Please try again later.');
      }
      console.error('❌ Error loading vehicle trims:', err);
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
          page: 1, // API uses 1-based pagination
          per_page: rowsPerPage
        };
        if (searchTerm.trim()) params.search = searchTerm.trim();
        
        const response = await vehicleTrimsApiService.getVehicleTrims(params);
        
        if (response && response.data && Array.isArray(response.data)) {
          setVehicleTrims(response.data);
          const total = response.meta?.total || 
                       response.meta?.pagination?.total || 
                       response.meta?.last_page * rowsPerPage || 
                       response.data.length;
          setTotalCount(total);
        } else if (Array.isArray(response)) {
          setVehicleTrims(response);
          setTotalCount(response.length);
        } else {
          setVehicleTrims([]);
          setTotalCount(0);
        }
        
        // Reset the flag after fetch completes
        isSearchResettingPage.current = false;
      } catch (err: any) {
        console.error('Error loading vehicle trims:', err);
        isSearchResettingPage.current = false;
        
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError('Please log in to access this page');
        } else {
          setError(err.message || 'Failed to load vehicle trims. Please try again later.');
        }
      } finally {
        setLoading(false);
        searchDebounceRef.current = null;
      }
    }, 300);
    
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, [searchTerm, rowsPerPage]);

  // Effect for page and rowsPerPage changes (only when not resetting due to search)
  useEffect(() => {
    // Skip if this is triggered by search reset
    if (isSearchResettingPage.current) {
      isSearchResettingPage.current = false; // Reset flag for next time
      return;
    }
    
    loadVehicleTrims();
  }, [page, rowsPerPage, loadVehicleTrims]);

  const handleAdd = () => {
    router.push('/admin/vehicle-trims/create');
  };

  const handleEdit = (vehicleTrim: VehicleTrim) => {
    router.push(`/admin/vehicle-trims/${vehicleTrim.id}/edit`);
  };

  const handleDelete = (vehicleTrim: VehicleTrim) => {
    setVehicleTrimToDelete(vehicleTrim);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (vehicleTrimToDelete) {
      try {
        setDeleting(true);
        await vehicleTrimsApiService.deleteVehicleTrim(vehicleTrimToDelete.id);
        setVehicleTrims(prev => prev.filter(item => item.id !== vehicleTrimToDelete.id));
        setAlert({ type: 'success', message: 'Vehicle Trim deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete vehicle trim');
        console.error('Error deleting vehicle trim:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setVehicleTrimToDelete(null);
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

  // Remove client-side filtering since we're using server-side pagination
  const filteredData = vehicleTrims || [];

  return (
    <AdminLayout title="Vehicle Trims">
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
              placeholder="Search vehicle trims..."
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
                  loadVehicleTrims();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Vehicle Trims Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No vehicle trims found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : `Click "Add Vehicle Trim" to create your first vehicle trim.`}
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Model</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Make</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((vehicleTrim) => (
                    <TableRow 
                      key={vehicleTrim.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {vehicleTrim.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {vehicleTrim.model?.name || 'Unknown Model'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {vehicleTrim.model?.make?.name || 'Unknown Make'}
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
                          {vehicleTrim.description || 'No description available'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(vehicleTrim)}
                            title="Edit"
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(vehicleTrim)}
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
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} vehicle trims
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
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} vehicle trims
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
              Are you sure you want to delete &quot;{vehicleTrimToDelete?.name}&quot;? This action cannot be undone.
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

export default VehicleTrimsPage;
