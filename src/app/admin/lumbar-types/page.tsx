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
  TablePagination,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { lumbarTypesService } from '@/services/lumbar-types';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

interface LumbarType {
  id: number;
  name: string;
  description: string;
  image: string;
  cost: number;
  price: number;
  is_active: boolean;
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
      lumbar_type_id: number;
      price_tier_id: number;
      created_at: string;
      updated_at: string;
    };
  }>;
}

const LumbarTypesPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [lumbartypess, setLumbarTypes] = useState<LumbarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lumbartypesToDelete, setLumbarTypeToDelete] = useState<LumbarType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Helper function to get lumbar type image URL
  const getLumbarTypeImage = (lumbarType: LumbarType) => {
    if (lumbarType.image) {
      return `https://superiorseats.ali-khalid.com/${lumbarType.image}`;
    }
    return null;
  };

  // Helper function to get calculated price tiers for a lumbar type
  const getCalculatedPriceTiers = (lumbarType: LumbarType): CalculatedPriceTier[] => {
    const basePrice = typeof lumbarType.price === 'string' ? parseFloat(lumbarType.price) : lumbarType.price;
    if (lumbarType.price_tiers && lumbarType.price_tiers.length > 0 && typeof basePrice === 'number' && basePrice > 0) {
      // Create calculated price tiers from existing data (show actual prices from API)
      return lumbarType.price_tiers.map((tier: any) => {
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

  const loadLumbarTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await lumbarTypesService.getLumbarTypes(params);
      
      if (response && response.data) {
        setLumbarTypes(response.data);
      } else if (Array.isArray(response)) {
        setLumbarTypes(response);
      } else {
        setLumbarTypes([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load lumbar types. Please try again later.');
      }
      console.error('Error loading lumbar types:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadLumbarTypes();
  }, [loadLumbarTypes]);

  const handleAdd = () => {
    router.push('/admin/lumbar-types/create');
  };

  const handleEdit = (lumbartypes: LumbarType) => {
    router.push(`/admin/lumbar-types/${lumbartypes.id}/edit`);
  };

  const handleDelete = (lumbartypes: LumbarType) => {
    setLumbarTypeToDelete(lumbartypes);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (lumbartypesToDelete) {
      try {
        setDeleting(true);
        await lumbarTypesService.deleteLumbarType(lumbartypesToDelete.id);
        setLumbarTypes(prev => prev.filter(item => item.id !== lumbartypesToDelete.id));
        setAlert({ type: 'success', message: 'Lumbar Type deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete lumbar type');
        console.error('Error deleting lumbar type:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setLumbarTypeToDelete(null);
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

  // Filter and paginate data
  const filteredData = lumbartypess.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <AdminLayout title="Lumbar Types">
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: { xs: 2, sm: 3 }, 
            flex: 1,
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            {/* Search Bar */}
            <TextField
              placeholder="Search lumbar types..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )}}
              sx={{ 
                maxWidth: { xs: '100%', sm: 400 },
                minWidth: { xs: '100%', sm: 250 }
              }}
              size="small"
              fullWidth={isMobile}
            />
            
            {/* Results count for mobile */}
            {isMobile && lumbartypess.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
                {lumbartypess.length} lumbar type{lumbartypess.length !== 1 ? 's' : ''} found
              </Typography>
            )}
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            className="gradient-style"
            sx={{ 
              alignSelf: { xs: 'stretch', sm: 'auto' },
              minWidth: { xs: '100%', sm: 'auto' },
              height: { xs: 44, sm: 'auto' },
              fontSize: { xs: '0.95rem', sm: '0.875rem' },
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            {isMobile ? 'Add Lumbar Type' : 'Add'}
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
                  loadLumbarTypes();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Lumbar Types Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : lumbartypess.length === 0 ? (
          <Paper sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No lumbar types found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add Lumbar Type" to create your first lumbar type.'}
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Mobile Card View */}
            {isMobile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {paginatedData.map((lumbartypes) => (
                  <Paper key={lumbartypes.id} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {/* Image */}
                      <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        flexShrink: 0,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getLumbarTypeImage(lumbartypes) ? (
                          <Box
                            component="img"
                            src={getLumbarTypeImage(lumbartypes)!}
                            alt={lumbartypes.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.image-fallback');
                              if (fallback) {
                                (fallback as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        
                        <Box
                          className="image-fallback"
                          sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: 'grey.200',
                            display: getLumbarTypeImage(lumbartypes) ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                            position: getLumbarTypeImage(lumbartypes) ? 'absolute' : 'static',
                            top: 0,
                            left: 0
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {getLumbarTypeImage(lumbartypes) ? 'Error' : 'No Image'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
                            {lumbartypes.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(lumbartypes)}
                              title="Edit"
                              sx={{ color: 'primary.main', p: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(lumbartypes)}
                              title="Delete"
                              color="error"
                              sx={{ p: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {lumbartypes.description || 'No description available'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                          ${lumbartypes.price || 0}
                        </Typography>
                        
                        {(() => {
                          const calculatedTiers = getCalculatedPriceTiers(lumbartypes);
                          if (calculatedTiers.length > 0) {
                            const firstTier = calculatedTiers[0];
                            const allTiersText = calculatedTiers.map(tier => 
                              `${tier.display_name}: $${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(tier))}`
                            ).join('\n');
                            
                            return (
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                  {calculatedTiers.length} tier{calculatedTiers.length > 1 ? 's' : ''}
                                </Typography>
                                <Tooltip 
                                  title={
                                    <Box sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                                      {allTiersText}
                                    </Box>
                                  }
                                  arrow
                                  placement="top"
                                >
                                  <Box sx={{ display: 'inline-block', cursor: 'pointer' }}>
                                    <Chip
                                      label={`${firstTier.display_name}: $${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(firstTier))}`}
                                      size="small"
                                      variant="outlined"
                                      sx={{ 
                                        fontSize: '0.65rem',
                                        height: 18,
                                        borderColor: firstTier.is_overridden ? 'warning.main' : undefined,
                                        color: firstTier.is_overridden ? 'warning.main' : undefined,
                                        '& .MuiChip-label': {
                                          px: 0.5
                                        }
                                      }}
                                    />
                                    {calculatedTiers.length > 1 && (
                                      <Chip
                                        label={`+${calculatedTiers.length - 1} more`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ 
                                          fontSize: '0.65rem',
                                          height: 18,
                                          ml: 0.5,
                                          '& .MuiChip-label': {
                                            px: 0.5
                                          }
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Tooltip>
                              </Box>
                            );
                          }
                          return (
                            <Typography variant="caption" color="text.secondary">
                              No tiers
                            </Typography>
                          );
                        })()}
                        
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              /* Desktop Table View */
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
                        <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((lumbartypes) => (
                        <TableRow 
                          key={lumbartypes.id}
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
                              {getLumbarTypeImage(lumbartypes) ? (
                                <Box
                                  component="img"
                                  src={getLumbarTypeImage(lumbartypes)!}
                                  alt={lumbartypes.name}
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
                                  display: getLumbarTypeImage(lumbartypes) ? 'none' : 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 1,
                                  border: '1px solid #e0e0e0',
                                  position: getLumbarTypeImage(lumbartypes) ? 'absolute' : 'static',
                                  top: 0,
                                  left: 0
                                }}
                              >
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                  {getLumbarTypeImage(lumbartypes) ? 'Error' : 'No Image'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {lumbartypes.name}
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
                              {lumbartypes.description || 'No description available'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              ${lumbartypes.price || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const calculatedTiers = getCalculatedPriceTiers(lumbartypes);
                              if (calculatedTiers.length > 0) {
                                const firstTier = calculatedTiers[0];
                                const allTiersText = calculatedTiers.map(tier => 
                                  `${tier.display_name}: $${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(tier))}`
                                ).join('\n');
                                
                                return (
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                      {calculatedTiers.length} tier{calculatedTiers.length > 1 ? 's' : ''}
                                    </Typography>
                                    <Tooltip 
                                      title={
                                        <Box sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                                          {allTiersText}
                                        </Box>
                                      }
                                      arrow
                                      placement="top"
                                    >
                                      <Box sx={{ display: 'inline-block', cursor: 'pointer' }}>
                                        <Chip
                                          label={`${firstTier.display_name}: $${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(firstTier))}`}
                                          size="small"
                                          variant="outlined"
                                          sx={{ 
                                            fontSize: '0.7rem',
                                            height: 20,
                                            borderColor: firstTier.is_overridden ? 'warning.main' : undefined,
                                            color: firstTier.is_overridden ? 'warning.main' : undefined,
                                            '& .MuiChip-label': {
                                              px: 0.5
                                            }
                                          }}
                                        />
                                        {calculatedTiers.length > 1 && (
                                          <Chip
                                            label={`+${calculatedTiers.length - 1} more`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ 
                                              fontSize: '0.7rem',
                                              height: 20,
                                              ml: 0.5,
                                              '& .MuiChip-label': {
                                                px: 0.5
                                              }
                                            }}
                                          />
                                        )}
                                      </Box>
                                    </Tooltip>
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
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(lumbartypes)}
                                title="Edit"
                                sx={{ color: 'primary.main' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(lumbartypes)}
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
              </Paper>
            )}
            
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: 1,
                borderColor: 'divider',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: 'text.secondary',
                  fontSize: isMobile ? '0.75rem' : '0.875rem'
                },
                '& .MuiTablePagination-toolbar': {
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                  gap: isMobile ? 1 : 0
                }
              }}
            />
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              mx: { xs: 2, sm: 'auto' },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' }
            }
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Confirm Delete
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to delete &quot;{lumbartypesToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="flex-end"
              sx={{ 
                '& .MuiButton-root': {
                  minHeight: { xs: 44, sm: 'auto' },
                  fontSize: { xs: '0.95rem', sm: '0.875rem' }
                }
              }}
            >
              <Button 
                onClick={() => setIsDeleteDialogOpen(false)} 
                disabled={deleting}
                fullWidth={isMobile}
                variant={isMobile ? 'outlined' : 'text'}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                color="error" 
                variant="contained" 
                disabled={deleting}
                fullWidth={isMobile}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </Stack>
          </Box>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default LumbarTypesPage;
