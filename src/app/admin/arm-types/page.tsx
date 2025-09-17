'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  TablePagination,
  Chip} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

// Helper function to convert cost/price to number
const parsePriceValue = (value: number | string | undefined): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

interface ArmType {
  id: number;
  name: string;
  description: string;
  image: string;
  cost?: number | string;
  price?: number | string;
  created_at: string;
  updated_at: string;
  price_tiers?: Array<{
    id: number;
    name: string;
    display_name: string;
    discount_off_retail_price: string;
    created_at: string;
    updated_at: string;
    pivot: {
      arm_type_id: number;
      price_tier_id: number;
      price_adjustment: number;
      created_at: string;
      updated_at: string;
    };
  }>;
}

const ArmTypesPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [armTypes, setArmTypes] = useState<ArmType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [armTypeToDelete, setArmTypeToDelete] = useState<ArmType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Helper function to get arm type image URL
  const getArmTypeImage = (armType: ArmType) => {
    if (armType.image) {
      return `https://superiorseats.ali-khalid.com/${armType.image}`;
    }
    return null;
  };

  // Helper function to get calculated price tiers for an arm type
  const getCalculatedPriceTiers = (armType: ArmType): CalculatedPriceTier[] => {
    const basePrice = typeof armType.price === 'string' ? parseFloat(armType.price) : armType.price;
    if (armType.price_tiers && armType.price_tiers.length > 0 && typeof basePrice === 'number' && basePrice > 0) {
      // Create calculated price tiers from existing data (show actual prices from API)
      return armType.price_tiers.map((tier: any) => {
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

  const loadArmTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getArmTypes(params);
      
      console.log('Arm types API response:', response);
      
      // Handle the response structure
      if (response && response.data) {
        setArmTypes(response.data);
      } else if (Array.isArray(response)) {
        setArmTypes(response);
      } else {
        setArmTypes([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load arm types. Please try again later.');
      }
      console.error('Error loading arm types:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadArmTypes();
  }, [loadArmTypes]);

  // Refresh data when page becomes visible (after navigation back from create/edit)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadArmTypes();
      }
    };

    const handleFocus = () => {
      loadArmTypes();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadArmTypes]);

  const handleAdd = () => {
    router.push('/admin/arm-types/create');
  };

  const handleEdit = (armType: ArmType) => {
    router.push(`/admin/arm-types/${armType.id}/edit`);
  };

  const handleDelete = (armType: ArmType) => {
    setArmTypeToDelete(armType);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (armTypeToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteArmType(armTypeToDelete.id);
        setArmTypes(prev => prev.filter(at => at.id !== armTypeToDelete.id));
        setAlert({ type: 'success', message: 'Arm type deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete arm type');
        console.error('Error deleting arm type:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setArmTypeToDelete(null);
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
    <AdminLayout title="Arm Types">
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
              placeholder="Search arm types..."
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

        {/* Arm Types Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : armTypes.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No arm types found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add Arm Type" to create your first arm type.'}
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
                    <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {armTypes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((armType) => (
                    <TableRow 
                      key={armType.id}
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
                          {getArmTypeImage(armType) ? (
                            <Box
                              component="img"
                              src={getArmTypeImage(armType)!}
                              alt={armType.name}
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
                              display: getArmTypeImage(armType) ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0',
                              position: getArmTypeImage(armType) ? 'absolute' : 'static',
                              top: 0,
                              left: 0
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {getArmTypeImage(armType) ? 'Error' : 'No Image'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {armType.name}
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
                          {armType.description || 'No description available'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                          ${parsePriceValue(armType.price).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const calculatedTiers = getCalculatedPriceTiers(armType);
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
                          {new Date(armType.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(armType)}
                            title="Edit"
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(armType)}
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
              count={armTypes.length}
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
              Are you sure you want to delete &quot;{armTypeToDelete?.name}&quot;? This action cannot be undone.
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

export default ArmTypesPage; 
