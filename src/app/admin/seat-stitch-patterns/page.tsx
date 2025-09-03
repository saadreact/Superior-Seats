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

interface SeatStitchPattern {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const SeatStitchPatternsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [seatStitchPatterns, setSeatStitchPatterns] = useState<SeatStitchPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [seatStitchPatternToDelete, setSeatStitchPatternToDelete] = useState<SeatStitchPattern | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSeatStitchPatterns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getSeatStitchPatterns(params);
      
      if (response && response.data) {
        setSeatStitchPatterns(response.data);
      } else if (Array.isArray(response)) {
        setSeatStitchPatterns(response);
      } else {
        setSeatStitchPatterns([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load seat stitch patterns. Please try again later.');
      }
      console.error('Error loading seat stitch patterns:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadSeatStitchPatterns();
  }, [loadSeatStitchPatterns]);

  const handleAdd = () => {
    router.push('/admin/seat-stitch-patterns/create');
  };

  const handleEdit = (seatStitchPattern: SeatStitchPattern) => {
    router.push(`/admin/seat-stitch-patterns/${seatStitchPattern.id}/edit`);
  };

  const handleView = (seatStitchPattern: SeatStitchPattern) => {
    router.push(`/admin/seat-stitch-patterns/${seatStitchPattern.id}`);
  };

  const handleDelete = (seatStitchPattern: SeatStitchPattern) => {
    setSeatStitchPatternToDelete(seatStitchPattern);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (seatStitchPatternToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteSeatStitchPattern(seatStitchPatternToDelete.id);
        setSeatStitchPatterns(prev => prev.filter(item => item.id !== seatStitchPatternToDelete.id));
        setAlert({ type: 'success', message: 'Seat Stitch Pattern deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete seat stitch pattern');
        console.error('Error deleting seat stitch pattern:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setSeatStitchPatternToDelete(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <AdminLayout title="Seat Stitch Patterns">
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
            Seat Stitch Patterns
          </Typography>
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
            Add Seat Stitch Pattern
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search seat stitch patterns..."
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

        {/* Seat Stitch Patterns Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : seatStitchPatterns.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No seat stitch patterns found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : `Click "Add Seat Stitch Pattern" to create your first seat stitch pattern.`}
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
            {seatStitchPatterns.map((seatStitchPattern) => (
              <Card 
                key={seatStitchPattern.id}
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
                    {seatStitchPattern.name}
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
                    {seatStitchPattern.description || 'No description available'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleView(seatStitchPattern)}
                    title="View Details"
                    sx={{ color: 'primary.main' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(seatStitchPattern)}
                    title="Edit"
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(seatStitchPattern)}
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
              Are you sure you want to delete &quot;{seatStitchPatternToDelete?.name}&quot;? This action cannot be undone.
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

export default SeatStitchPatternsPage; 