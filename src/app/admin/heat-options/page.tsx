'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
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
  TablePagination,
  Dialog,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { heatOptionsService } from '@/services/heat-options';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

interface HeatOption {
  id: number;
  name: string;
  description: string;
  image: string;
  cost: number | string;
  price: number | string;
  price_adjustments?: Record<string, number | string>;
  created_by: number;
  created_at: string;
  updated_at: string;
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
  };
  price_tiers: Array<{
    id: number;
    name: string;
    display_name: string;
    discount_off_retail_price: string;
    created_at: string;
    updated_at: string;
    pivot: {
      heat_option_id: number;
      price_tier_id: number;
      created_at: string;
      updated_at: string;
    };
  }>;
}

const HeatOptionsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [heatoptionss, setHeatOptions] = useState<HeatOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [heatoptionsToDelete, setHeatOptionToDelete] = useState<HeatOption | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Helper function to get heat option image URL
  const getHeatOptionImage = (heatOption: HeatOption) => {
    if (heatOption.image) {
      return `https://superiorseats.ali-khalid.com/${heatOption.image}`;
    }
    return null;
  };

  // Helper function to safely format numbers
  const formatPrice = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  // Helper function to get calculated price tiers for a heat option
  const getCalculatedPriceTiers = (heatOption: HeatOption): CalculatedPriceTier[] => {
    const basePrice = typeof heatOption.price === 'string' ? parseFloat(heatOption.price) : heatOption.price;
    if (heatOption.price_tiers && heatOption.price_tiers.length > 0 && typeof basePrice === 'number' && basePrice > 0) {
      // Create calculated price tiers from existing data (show actual prices from API)
      return heatOption.price_tiers.map((tier: any) => {
        const discountPercentage = parseFloat(tier.discount_off_retail_price) || 0;
        const discountAmount = (basePrice * discountPercentage) / 100;
        const calculatedPrice = basePrice - discountAmount;
        const actualPrice = tier.pivot?.price_adjustment ? parseFloat(tier.pivot.price_adjustment) : calculatedPrice;
        const isOverridden = actualPrice !== calculatedPrice;
        
        return {
          id: tier.id,
          name: tier.name,
          display_name: tier.display_name,
          discount_off_retail_price: tier.discount_off_retail_price,
          created_at: tier.created_at,
          updated_at: tier.updated_at,
          customers_count: 0,
          calculated_price: calculatedPrice,
          discount_amount: discountAmount,
          override_price: isOverridden ? actualPrice : undefined,
          is_overridden: isOverridden
        };
      });
    }
    return [];
  };

  const loadHeatOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug environment variable
      console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'https://superiorseats.ali-khalid.com/api');
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await heatOptionsService.getHeatOptions(params);
      
      if (response && response.data) {
        setHeatOptions(response.data);
      } else if (Array.isArray(response)) {
        setHeatOptions(response);
      } else {
        setHeatOptions([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load heat options. Please try again later.');
      }
      console.error('Error loading heat options:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadHeatOptions();
  }, [loadHeatOptions]);

  const handleAdd = () => {
    router.push('/admin/heat-options/create');
  };

  const handleEdit = (heatoptions: HeatOption) => {
    router.push(`/admin/heat-options/${heatoptions.id}/edit`);
  };



  const handleDelete = (heatoptions: HeatOption) => {
    setHeatOptionToDelete(heatoptions);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (heatoptionsToDelete) {
      try {
        setDeleting(true);
        await heatOptionsService.deleteHeatOption(heatoptionsToDelete.id);
        setHeatOptions(prev => prev.filter(item => item.id !== heatoptionsToDelete.id));
        setAlert({ type: 'success', message: 'Heat Option deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete heat option');
        console.error('Error deleting heat option:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setHeatOptionToDelete(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <AdminLayout title="Heat Options">
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
              placeholder="Search heat options..."
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
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Heat Options Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : heatoptionss.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No heat options found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add Heat Option" to create your first heat option.'}
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>In Store Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price Tiers</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {heatoptionss
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((heatOption) => (
                    <TableRow 
                      key={heatOption.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getHeatOptionImage(heatOption) ? (
                            <Box
                              component="img"
                              src={getHeatOptionImage(heatOption)!}
                              alt={heatOption.name}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                                maxWidth: 60,
                                maxHeight: 60
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                // Show fallback when image fails to load
                                const fallback = target.parentElement?.querySelector('.image-fallback');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback for when image is missing or fails to load */}
                          <Box
                            className="image-fallback"
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: 'grey.200',
                              display: getHeatOptionImage(heatOption) ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0',
                              position: getHeatOptionImage(heatOption) ? 'absolute' : 'static',
                              top: 0,
                              left: 0
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {getHeatOptionImage(heatOption) ? 'Error' : 'No Image'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {heatOption.name}
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
                          {heatOption.description || 'No description available'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                          ${formatPrice(heatOption.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const calculatedTiers = getCalculatedPriceTiers(heatOption);
                          if (calculatedTiers.length > 0) {
                            return (
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                  {calculatedTiers.length} tier{calculatedTiers.length > 1 ? 's' : ''}
                                </Typography>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                  {calculatedTiers.slice(0, 2).map((tier) => (
                                    <Chip
                                      key={tier.id}
                                      label={`${tier.display_name}: $${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(tier))}`}
                                      size="small"
                                      variant="outlined"
                                      sx={{ 
                                        fontSize: '0.7rem',
                                        height: 20,
                                        borderColor: tier.is_overridden ? 'warning.main' : undefined,
                                        color: tier.is_overridden ? 'warning.main' : undefined,
                                        '& .MuiChip-label': {
                                          px: 0.5
                                        }
                                      }}
                                    />
                                  ))}
                                  {calculatedTiers.length > 2 && (
                                    <Chip
                                      label={`+${calculatedTiers.length - 2} more`}
                                      size="small"
                                      variant="outlined"
                                      sx={{ 
                                        fontSize: '0.7rem',
                                        height: 20,
                                        '& .MuiChip-label': {
                                          px: 0.5
                                        }
                                      }}
                                    />
                                  )}
                                </Stack>
                              </Box>
                            );
                          }
                          return (
                            <Typography variant="body2" color="text.secondary">
                              No tiers
                            </Typography>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {heatOption.creator?.username || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(heatOption.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(heatOption)}
                            title="Edit"
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(heatOption)}
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
            
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={heatoptionss.length}
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
              Are you sure you want to delete &quot;{heatoptionsToDelete?.name}&quot;? This action cannot be undone.
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

export default HeatOptionsPage;
