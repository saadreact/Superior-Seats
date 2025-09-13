'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15); // Match API default
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadVehicleTrims = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {
        page: page + 1, // API uses 1-based pagination
        per_page: rowsPerPage
      };
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      
      console.log('🚗 Vehicle Trims - API call params:', params);
      const response = await vehicleTrimsApiService.getVehicleTrims(params);
      console.log('🚗 Vehicle Trims - API Response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        setVehicleTrims(response.data);
        // Extract total count from meta object
        const total = response.meta?.total || 
                     response.meta?.pagination?.total || 
                     response.meta?.last_page * rowsPerPage || 
                     response.data.length;
        setTotalCount(total);
        console.log('📊 Setting total count:', total);
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
  }, [page, rowsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    loadVehicleTrims();
  }, [loadVehicleTrims]);

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
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
    // Clear debounced search to trigger immediate reload
    setDebouncedSearchTerm(searchTerm);
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
            Add Vehicle Trim
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
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
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
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(vehicleTrim.created_at).toLocaleDateString()}
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
            
            <TablePagination
              rowsPerPageOptions={[10, 15, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: 1,
                borderColor: 'divider',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }
              }}
            />
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
