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

interface SeatPricing {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

const SeatPricingPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [seatPricing, setSeatPricing] = useState<SeatPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [seatPricingToDelete, setSeatPricingToDelete] = useState<SeatPricing | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSeatPricing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getSeatPricing(params);
      
      if (response && response.data) {
        setSeatPricing(response.data);
      } else if (Array.isArray(response)) {
        setSeatPricing(response);
      } else {
        setSeatPricing([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load seat pricing. Please try again later.');
      }
      console.error('Error loading seat pricing:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadSeatPricing();
  }, [loadSeatPricing]);

  const handleAdd = () => {
    router.push('/admin/seat-pricing/create');
  };

  const handleEdit = (seatPricingItem: SeatPricing) => {
    router.push(`/admin/seat-pricing/${seatPricingItem.id}/edit`);
  };

  const handleView = (seatPricingItem: SeatPricing) => {
    router.push(`/admin/seat-pricing/${seatPricingItem.id}`);
  };

  const handleDelete = (seatPricingItem: SeatPricing) => {
    setSeatPricingToDelete(seatPricingItem);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (seatPricingToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteSeatPricing(seatPricingToDelete.id);
        setSeatPricing(prev => prev.filter(item => item.id !== seatPricingToDelete.id));
        setAlert({ type: 'success', message: 'Seat Pricing deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete seat pricing');
        console.error('Error deleting seat pricing:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setSeatPricingToDelete(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <AdminLayout title="Seat Pricing">
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
            Seat Pricing
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
            Add Seat Pricing
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search seat pricing..."
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

        {/* Seat Pricing Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : seatPricing.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No seat pricing found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : `Click "Add Seat Pricing" to create your first seat pricing.`}
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
            {seatPricing.map((seatPricingItem) => (
              <Card 
                key={seatPricingItem.id}
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
                      mb: 1}}
                  >
                    {seatPricingItem.name}
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    color="primary.main" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 2}}
                  >
                    {formatPrice(seatPricingItem.price)}
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
                    {seatPricingItem.description || 'No description available'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleView(seatPricingItem)}
                    title="View Details"
                    sx={{ color: 'primary.main' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(seatPricingItem)}
                    title="Edit"
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(seatPricingItem)}
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
              Are you sure you want to delete &quot;{seatPricingToDelete?.name}&quot;? This action cannot be undone.
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

export default SeatPricingPage; 