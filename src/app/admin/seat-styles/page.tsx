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

interface SeatStyle {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const SeatStylesPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [seatStyles, setSeatStyles] = useState<SeatStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [seatStyleToDelete, setSeatStyleToDelete] = useState<SeatStyle | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSeatStyles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getSeatStyles(params);
      
      if (response && response.data) {
        setSeatStyles(response.data);
      } else if (Array.isArray(response)) {
        setSeatStyles(response);
      } else {
        setSeatStyles([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load seat styles. Please try again later.');
      }
      console.error('Error loading seat styles:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadSeatStyles();
  }, [loadSeatStyles]);

  const handleAdd = () => {
    router.push('/admin/seat-styles/create');
  };

  const handleEdit = (seatStyle: SeatStyle) => {
    router.push(`/admin/seat-styles/${seatStyle.id}/edit`);
  };

  const handleView = (seatStyle: SeatStyle) => {
    router.push(`/admin/seat-styles/${seatStyle.id}`);
  };

  const handleDelete = (seatStyle: SeatStyle) => {
    setSeatStyleToDelete(seatStyle);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (seatStyleToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteSeatStyle(seatStyleToDelete.id);
        setSeatStyles(prev => prev.filter(item => item.id !== seatStyleToDelete.id));
        setAlert({ type: 'success', message: 'Seat Style deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete seat style');
        console.error('Error deleting seat style:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setSeatStyleToDelete(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <AdminLayout title="Seat Styles">
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
            Seat Styles
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Add Seat Style
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search seat styles..."
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

        {/* Seat Styles Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : seatStyles.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No seat styles found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : `Click "Add Seat Style" to create your first seat style.`}
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
            {seatStyles.map((seatStyle) => (
              <Card 
                key={seatStyle.id}
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
                    {seatStyle.name}
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
                    {seatStyle.description || 'No description available'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleView(seatStyle)}
                    title="View Details"
                    sx={{ color: 'primary.main' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(seatStyle)}
                    title="Edit"
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(seatStyle)}
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
              Are you sure you want to delete &quot;{seatStyleToDelete?.name}&quot;? This action cannot be undone.
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

export default SeatStylesPage; 