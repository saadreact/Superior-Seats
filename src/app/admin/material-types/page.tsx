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

interface MaterialType {
  id: number;
  name: string;
  description: string;
  image: string | null;
  is_active: boolean;
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
  price_tiers: Array<{
    id: number;
    name: string;
    display_name: string;
    discount_off_retail_price: string;
    created_at: string;
    updated_at: string;
  }>;
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

  const loadMaterialTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getMaterialTypes(params);
      
      console.log('Material Types API Response:', response);
      
      if (response && response.data) {
        console.log('Setting material types from response.data:', response.data);
        setMaterialTypes(response.data);
      } else if (Array.isArray(response)) {
        console.log('Setting material types from array response:', response);
        setMaterialTypes(response);
      } else {
        console.log('No valid data found, setting empty array');
        setMaterialTypes([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load material types. Please try again later.');
      }
      console.error('Error loading material types:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

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
        await apiService.deleteMaterialType(materialtypesToDelete.id);
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
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter and paginate data
  const filteredData = materialtypess.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <AdminLayout title="Material Types">
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'flex-end', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
        
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

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search material types..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )}}
            sx={{ maxWidth: 400 }}
          />
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

        {/* Material Types Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : materialtypess.length === 0 ? (
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
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price Tiers</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                                     {paginatedData.map((materialtypes) => {
                     console.log(`Material Type ${materialtypes.id}:`, {
                       name: materialtypes.name,
                       image: materialtypes.image,
                       apiUrl: process.env.NEXT_PUBLIC_API_URL,
                       imageUrl: materialtypes.image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${materialtypes.image}` : 'No image'
                     });
                     return (
                    <TableRow key={materialtypes.id} hover>
                      <TableCell>
                                                 {materialtypes.image ? (
                           <Box
                             component="img"
                             src={`https://superiorseats.ali-khalid.com/api/storage/${materialtypes.image}`}
                             alt={materialtypes.name}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              backgroundColor: '#f5f5f5',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
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
                        <Chip
                          label={materialtypes.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          color={materialtypes.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {materialtypes.price_tiers?.length > 0 ? (
                            materialtypes.price_tiers.map((tier) => (
                              <Chip
                                key={tier.id}
                                label={tier.display_name}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No price tiers
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(materialtypes.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
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
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
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
              Are you sure you want to delete &quot;{materialtypesToDelete?.name}&quot;? This action cannot be undone.
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

export default MaterialTypesPage;
