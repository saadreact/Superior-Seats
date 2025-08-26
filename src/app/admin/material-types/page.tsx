'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
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
  useMediaQuery} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';

interface MaterialType {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
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

  const loadMaterialTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getMaterialTypes(params);
      
      if (response && response.data) {
        setMaterialTypes(response.data);
      } else if (Array.isArray(response)) {
        setMaterialTypes(response);
      } else {
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

  const handleView = (materialtypes: MaterialType) => {
    router.push(`/admin/material-types/${materialtypes.id}`);
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
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Material Types
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Add Material Type
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

        {/* Material Types Grid */}
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
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }, 
            gap: 3 
          }}>
            {materialtypess.map((materialtypes) => (
              <Card 
                key={materialtypes.id}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'},
                  transition: 'all 0.3s ease-in-out'}}
              >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      mb: 2}}
                  >
                    {materialtypes.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '3rem'}}
                  >
                    {materialtypes.description || 'No description available'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={materialtypes.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={materialtypes.is_active ? 'success' : 'default'}
                    />
                    <Typography variant="body2" color="text.secondary">
                      
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleView(materialtypes)}
                    title="View Details"
                    sx={{ color: 'primary.main' }}
                  >
                    <ViewIcon />
                  </IconButton>
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
                </CardActions>
              </Card>
            ))}
          </Box>
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
