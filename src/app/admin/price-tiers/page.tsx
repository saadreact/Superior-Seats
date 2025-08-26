'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { PriceTier } from '@/data/types';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';



const PriceTiersPage = () => {
  const router = useRouter();
  
  // Price Tiers State
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPriceTierDeleteDialogOpen, setIsPriceTierDeleteDialogOpen] = useState(false);
  const [priceTierToDelete, setPriceTierToDelete] = useState<PriceTier | null>(null);
  
  // Alert State
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load Price Tiers on component mount
  useEffect(() => {
    loadPriceTiers();
  }, []);

  // Price Tiers Functions
  const loadPriceTiers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (error: any) {
      setAlert({ type: 'error', message: 'Failed to load price tiers' });
      console.error('Error loading price tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceTierAdd = () => {
    router.push('/admin/price-tiers/create');
  };

  const handlePriceTierView = (priceTier: PriceTier) => {
    router.push(`/admin/price-tiers/${priceTier.id}`);
  };

  const handlePriceTierEdit = (priceTier: PriceTier) => {
    router.push(`/admin/price-tiers/${priceTier.id}/edit`);
  };

  const handlePriceTierDelete = (priceTier: PriceTier) => {
    setPriceTierToDelete(priceTier);
    setIsPriceTierDeleteDialogOpen(true);
  };



  const confirmPriceTierDelete = async () => {
    if (priceTierToDelete) {
      try {
        setLoading(true);
        await apiService.deletePriceTier(priceTierToDelete.id);
        setPriceTiers(prev => prev.filter(pt => pt.id !== priceTierToDelete.id));
        setAlert({ type: 'success', message: 'Price tier deleted successfully' });
      } catch (error: any) {
        setAlert({ type: 'error', message: 'Failed to delete price tier' });
        console.error('Error deleting price tier:', error);
      } finally {
        setLoading(false);
      }
    }
    setIsPriceTierDeleteDialogOpen(false);
    setPriceTierToDelete(null);
  };

  return (
    <AdminLayout title="Price Tiers">
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
            onClick={handlePriceTierAdd}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Add Price Tier
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

        {/* Price Tiers Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Desktop Table View for Price Tiers */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <TableContainer component={Paper} sx={{ 
                borderRadius: 2, 
                overflow: 'auto',
                maxWidth: '100%',
                '& .MuiTable-root': {
                  minWidth: 650,
                },
              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Display Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Discount %</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Customers</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {priceTiers.map((priceTier) => (
                      <TableRow key={priceTier.id}>
                        <TableCell>{priceTier.name}</TableCell>
                        <TableCell>{priceTier.display_name || priceTier.name}</TableCell>
                        <TableCell>{priceTier.discount_off_retail_price}%</TableCell>
                        <TableCell>
                          <Chip
                            label={priceTier.customers_count || 0}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={priceTier.is_active !== false ? 'Active' : 'Inactive'}
                            color={priceTier.is_active !== false ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(priceTier.created_at).toLocaleDateString()}
                        </TableCell>
                                                    <TableCell align="center" sx={{ minWidth: 140 }}>
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handlePriceTierView(priceTier)}
                                  title="View"
                                  sx={{ color: 'primary.main' }}
                                >
                                  <ViewIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handlePriceTierEdit(priceTier)}
                                  title="Edit"
                                  sx={{ color: 'primary.main' }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handlePriceTierDelete(priceTier)}
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
            </Box>

            {/* Mobile Card View for Price Tiers */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Box sx={{ display: 'grid', gap: 2 }}>
                {priceTiers.map((priceTier) => (
                  <Paper key={priceTier.id} sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {priceTier.display_name || priceTier.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {priceTier.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={priceTier.is_active !== false ? 'Active' : 'Inactive'}
                        color={priceTier.is_active !== false ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Discount
                        </Typography>
                        <Typography variant="body2">
                          {priceTier.discount_off_retail_price}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Customers
                        </Typography>
                        <Typography variant="body2">
                          {priceTier.customers_count || 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={() => handlePriceTierView(priceTier)}
                        title="View"
                        sx={{ color: 'primary.main' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handlePriceTierEdit(priceTier)}
                        title="Edit"
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handlePriceTierDelete(priceTier)}
                        title="Delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            {priceTiers.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No price tiers found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click &quot;Add Price Tier&quot; to create your first price tier.
                </Typography>
              </Paper>
            )}
          </>
        )}



        {/* Delete Confirmation Dialog for Price Tiers */}
        <Dialog
          open={isPriceTierDeleteDialogOpen}
          onClose={() => setIsPriceTierDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{priceTierToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsPriceTierDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPriceTierDelete} color="error" variant="contained" disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default PriceTiersPage; 
