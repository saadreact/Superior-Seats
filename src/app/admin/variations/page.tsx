'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface Variation {
  id: number;
  name: string;
  price: number;
  stitch_pattern: string;
  arm_type: string;
  lumbar: string;
  recline_type: string;
  seat_type: string;
  material_type: string;
  heat_option: string;
  seat_item_type: string;
  color: string;
  is_active: boolean;
  image?: string;
  created_at: string;
  updated_at: string;
}

const VariationsPage = () => {
  const router = useRouter();
  const [variations, setVariations] = useState<Variation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState<Variation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Debug authentication state
    apiService.debugAuthState();
    
    if (!apiService.isAuthenticated()) {
      setError('Please log in to access this page');
      return;
    }
    
    loadVariations();
  }, []);

  const loadVariations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getVariations();
      setVariations(response || []);
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError('Failed to load variations. Please try again later.');
      }
      console.error('Error loading variations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariation = () => {
    router.push('/admin/variations/create');
  };

  const handleEditVariation = (variation: Variation) => {
    router.push(`/admin/variations/${variation.id}/edit`);
  };

  const handleViewVariation = (variation: Variation) => {
    router.push(`/admin/variations/${variation.id}`);
  };

  const handleDeleteVariation = (variation: Variation) => {
    setVariationToDelete(variation);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (variationToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteVariation(variationToDelete.id);
        setVariations(variations.filter(v => v.id !== variationToDelete.id));
        setIsDeleteDialogOpen(false);
        setVariationToDelete(null);
      } catch (err: any) {
        setError(err.message || 'Failed to delete variation');
        console.error('Error deleting variation:', err);
      } finally {
        setDeleting(false);
      }
    }
  };

  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
                  <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Seat Type</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {variations.map((variation) => (
            <TableRow key={variation.id}>
              <TableCell>
                {variation.image ? (
                  <Image
                    src={`https://superiorseats.ali-khalid.com${variation.image}`}
                    alt={variation.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: 4 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      No Image
                    </Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell>{variation.name}</TableCell>
              <TableCell>${variation.price}</TableCell>
              <TableCell>{variation.seat_type}</TableCell>
              <TableCell>{variation.material_type}</TableCell>
              <TableCell>{variation.color}</TableCell>
              <TableCell>
                <Chip
                  label={variation.is_active ? 'Active' : 'Inactive'}
                  color={variation.is_active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={() => handleViewVariation(variation)}
                  color="primary"
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleEditVariation(variation)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteVariation(variation)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {variations.map((variation) => (
        <Card key={variation.id}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {variation.image ? (
                <Image
                                              src={`https://superiorseats.ali-khalid.com${variation.image}`}
                  alt={variation.name}
                  width={80}
                  height={80}
                  style={{ borderRadius: 8 }}
                />
              ) : (
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    No Image
                  </Typography>
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {variation.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Price: ${variation.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Seat Type: {variation.seat_type}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Material: {variation.material_type}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Color: {variation.color}
                </Typography>
                <Chip
                  label={variation.is_active ? 'Active' : 'Inactive'}
                  color={variation.is_active ? 'success' : 'default'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
            <Button
              size="small"
              startIcon={<ViewIcon />}
              onClick={() => handleViewVariation(variation)}
            >
              View
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => handleEditVariation(variation)}
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => handleDeleteVariation(variation)}
            >
              Delete
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
  );

  return (
    <AdminLayout title="Variations">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Variations
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddVariation}
            sx={{
              backgroundColor: '#DA291C',
              '&:hover': {
                backgroundColor: '#B71C1C',
              },
            }}
          >
            Add Variation
          </Button>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : variations.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No variations found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click &quot;Add Variation&quot; to create your first variation.
            </Typography>
          </Paper>
        ) : (
          <Box>
            {isMobile ? renderMobileView() : renderDesktopView()}
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{variationToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default VariationsPage; 