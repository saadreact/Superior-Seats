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
import { vehicleModelApiService } from '@/services/vehicleModelApi';

interface VehicleModel {
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
}

const VehicleModelsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleModelToDelete, setVehicleModelToDelete] = useState<VehicleModel | null>(null);
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

  const loadVehicleModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {
        page: page + 1, // API uses 1-based pagination
        per_page: rowsPerPage
      };
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      
      console.log('🚗 Vehicle Models - API call params:', params);
      const response = await vehicleModelApiService.getVehicleModels(params);
      console.log('🚗 Vehicle Models - API Response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        setVehicleModels(response.data);
        // Extract total count from meta object
        const total = response.meta?.total || 
                     response.meta?.pagination?.total || 
                     response.meta?.last_page * rowsPerPage || 
                     response.data.length;
        setTotalCount(total);
        console.log('📊 Setting total count:', total);
      } else if (Array.isArray(response)) {
        setVehicleModels(response);
        setTotalCount(response.length);
      } else {
        setVehicleModels([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setVehicleModels([]);
      setTotalCount(0);
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load vehicle models. Please try again later.');
      }
      console.error('❌ Error loading vehicle models:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    loadVehicleModels();
  }, [loadVehicleModels]);

  const handleAdd = () => {
    router.push('/admin/vehicle-models/create');
  };

  const handleEdit = (vehicleModel: VehicleModel) => {
    router.push(`/admin/vehicle-models/${vehicleModel.id}/edit`);
  };

  const handleDelete = (vehicleModel: VehicleModel) => {
    setVehicleModelToDelete(vehicleModel);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (vehicleModelToDelete) {
      try {
        setDeleting(true);
        await vehicleModelApiService.deleteVehicleModel(vehicleModelToDelete.id);
        setVehicleModels(prev => prev.filter(item => item.id !== vehicleModelToDelete.id));
        setAlert({ type: 'success', message: 'Vehicle Model deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete vehicle model');
        console.error('Error deleting vehicle model:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setVehicleModelToDelete(null);
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
  const filteredData = vehicleModels || [];

  return (
    <AdminLayout title="Vehicle Models">
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
              placeholder="Search vehicle models..."
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
                  loadVehicleModels();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Vehicle Models Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No vehicle models found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : `Click "Add Vehicle Model" to create your first vehicle model.`}
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Make</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((vehicleModel) => (
                    <TableRow 
                      key={vehicleModel.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {vehicleModel.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {vehicleModel.make?.name || 'Unknown Make'}
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
                          {vehicleModel.description || 'No description available'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(vehicleModel.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(vehicleModel)}
                            title="Edit"
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(vehicleModel)}
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
              Are you sure you want to delete &quot;{vehicleModelToDelete?.name}&quot;? This action cannot be undone.
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

export default VehicleModelsPage;
