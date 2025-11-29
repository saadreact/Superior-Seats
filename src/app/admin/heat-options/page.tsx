'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
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
  const [totalCount, setTotalCount] = useState(0);

  // Ref to track debounce timer
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if page reset is due to search change
  const isSearchResettingPage = useRef(false);
  // Ref to track if component has mounted
  const isMounted = useRef(false);

  // Helper function to get heat option image URL
  const getHeatOptionImage = (heatOption: HeatOption) => {
    if (heatOption.image) {
      return `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/${heatOption.image}`;
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
      
      // Build API parameters for server-side pagination
      const params: Record<string, any> = {
        page: page + 1, // API uses 1-based pagination, but MUI uses 0-based
        per_page: rowsPerPage
      };
      
      // Add optional search parameter
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      console.log('🔍 Loading heat options with params:', params);
      
      const response = await heatOptionsService.getHeatOptions(params);
      console.log('🔍 API Response:', response);
      
      // Handle the API response structure
      if (response && response.data) {
        setHeatOptions(response.data);
        // Update total count for pagination from the meta.pagination object
        if (response.meta && response.meta.pagination && response.meta.pagination.total) {
          setTotalCount(response.meta.pagination.total);
        } else if (response.meta && response.meta.total) {
          setTotalCount(response.meta.total);
        } else if (response.total !== undefined) {
          setTotalCount(response.total);
        } else if (response.data && Array.isArray(response.data)) {
          // If no total count provided, use the length of current data
          // This is not ideal for server-side pagination but prevents errors
          setTotalCount(response.data.length);
        }
      } else if (Array.isArray(response)) {
        setHeatOptions(response);
        setTotalCount(response.length);
      } else {
        setHeatOptions([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error('Error loading heat options:', err);
      
      if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication required. You will be redirected to the login page in 3 seconds.');
        // Redirect to home page where user can login
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view heat options.');
      } else if (err.response?.status === 404) {
        setError('Heat options endpoint not found. Please contact support.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to load heat options. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, router]);

  // Debounced search effect - triggers search after user stops typing
  useEffect(() => {
    // On initial mount, skip debounce (let pagination effect handle initial fetch)
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    
    // Clear any existing debounce timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    
    // Mark that we're resetting page due to search
    isSearchResettingPage.current = true;
    
    // Reset to page 0 when search changes
    setPage(0);
    
    // Set up new debounce timer - fetch after 300ms delay
    searchDebounceRef.current = setTimeout(async () => {
      // Fetch with current search term and page 0
      try {
        setLoading(true);
        setError(null);
        
        const params: Record<string, any> = {
          page: 1, // Page 1 for API (0-based converted to 1-based)
          per_page: rowsPerPage
        };
        
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        
        const response = await heatOptionsService.getHeatOptions(params);
        
        if (response && response.data) {
          setHeatOptions(response.data);
          if (response.meta && response.meta.pagination && response.meta.pagination.total) {
            setTotalCount(response.meta.pagination.total);
          } else if (response.meta && response.meta.total) {
            setTotalCount(response.meta.total);
          } else if (response.total !== undefined) {
            setTotalCount(response.total);
          } else if (response.data && Array.isArray(response.data)) {
            setTotalCount(response.data.length);
          }
        } else if (Array.isArray(response)) {
          setHeatOptions(response);
          setTotalCount(response.length);
        } else {
          setHeatOptions([]);
          setTotalCount(0);
        }
      } catch (err: any) {
        console.error('Error loading heat options:', err);
        
        if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError('Authentication required. You will be redirected to the login page in 3 seconds.');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view heat options.');
        } else if (err.response?.status === 404) {
          setError('Heat options endpoint not found. Please contact support.');
        } else if (err.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.message || 'Failed to load heat options. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
      
      searchDebounceRef.current = null;
      isSearchResettingPage.current = false;
    }, 300); // 300ms delay after user stops typing

    // Cleanup function to clear timer if user types again before delay completes
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    // Skip if page change is due to search reset (debounce effect will handle the fetch)
    if (isSearchResettingPage.current) {
      isSearchResettingPage.current = false; // Reset the flag
      return;
    }
    
    // Skip if there's an active search debounce timer
    if (searchDebounceRef.current) {
      return;
    }
    
    // Fetch immediately when pagination changes
    loadHeatOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

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
    // Page reset is handled by the debounce effect
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
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: { xs: 2, sm: 3 }, 
            flex: 1,
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            {/* Search Bar */}
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
              sx={{ 
                maxWidth: { xs: '100%', sm: 400 },
                minWidth: { xs: '100%', sm: 250 }
              }}
              size="small"
              fullWidth={isMobile}
            />
            
            {/* Results count for mobile */}
            {isMobile && totalCount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
                {totalCount} option{totalCount !== 1 ? 's' : ''} found
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
            {isMobile ? 'Add Heat Option' : 'Add'}
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
                  loadHeatOptions();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Heat Options Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : totalCount === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No heat options found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add Heat Option" to create your first heat option.'}
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Mobile Card View */}
            {isMobile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {heatoptionss.map((heatOption) => (
                    <Paper key={heatOption.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        {/* Image */}
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          flexShrink: 0,
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

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
                              {heatOption.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(heatOption)}
                                title="Edit"
                                sx={{ color: 'primary.main', p: 0.5 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(heatOption)}
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
                            {heatOption.description || 'No description available'}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main', mb: 1 }}>
                            ${formatPrice(heatOption.price)}
                          </Typography>
                          
                          
                          {(() => {
                            const calculatedTiers = getCalculatedPriceTiers(heatOption);
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
                      {heatoptionss.map((heatOption) => (
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
                
                {/* Desktop Pagination */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  {/* Left side - Items per page select dropdown */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Items per page:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80, maxWidth: 100 }}>
                      <Select
                        value={rowsPerPage.toString()}
                        onChange={(event: any) => {
                          const value = parseInt(event.target.value, 10);
                          setRowsPerPage(value);
                          setPage(0);
                        }}
                        sx={{
                          '& .MuiSelect-select': {
                            textAlign: 'center',
                            padding: '8px 12px',
                          },
                        }}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* Center - Page info */}
                  <Typography variant="body2" color="text.secondary">
                    Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} heat options
                  </Typography>
                  
                  {/* Right side - Navigation controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={page === 0}
                      onClick={() => handleChangePage({} as any, page - 1)}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      Previous
                    </Button>
                    
                    <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                      Page {page + 1} of {Math.ceil(totalCount / rowsPerPage)}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
                      onClick={() => handleChangePage({} as any, page + 1)}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}
            
            {/* Mobile Pagination - shown only on mobile */}
            {isMobile && totalCount > 0 && (
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {/* Pagination Info */}
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} heat options
                </Typography>
                
                {/* Navigation Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page === 0}
                    onClick={() => handleChangePage({} as any, page - 1)}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      '&:disabled': {
                        opacity: 0.5
                      }
                    }}
                  >
                    Previous
                  </Button>
                  
                  <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                    Page {page + 1} of {Math.ceil(totalCount / rowsPerPage)}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
                    onClick={() => handleChangePage({} as any, page + 1)}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      '&:disabled': {
                        opacity: 0.5
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
                
                {/* Items per page select dropdown */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Items per page:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 80, maxWidth: 100 }}>
                    <Select
                      value={rowsPerPage.toString()}
                      onChange={(event: any) => {
                        const value = parseInt(event.target.value, 10);
                        setRowsPerPage(value);
                        setPage(0);
                      }}
                      sx={{
                        '& .MuiSelect-select': {
                          textAlign: 'center',
                          padding: '8px 12px',
                        },
                      }}
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={15}>15</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
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
          <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: { xs: '1rem', sm: '0.875rem' } }}>
              Are you sure you want to delete &quot;{heatoptionsToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ 
                width: '100%',
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
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default HeatOptionsPage;
