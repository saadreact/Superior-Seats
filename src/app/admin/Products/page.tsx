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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import { productApi } from '@/services/productapi';

interface Product {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
    description: string;
    slug: string;
    image_url: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
  } | null;
  price: string;
  stock: number;
  images?: string[];
  is_active: boolean;
  show_on_special_shop: boolean;
  created_at: string;
  updated_at: string;
  category_id?: number | null;
  primary_image?: {
    id: number;
    product_id: number;
    image_path: string;
    alt_text: string | null;
    caption: string | null;
    sort_order: number;
    set_primary: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  variations?: Array<{
    id: number;
    name: string;
    stitch_pattern?: string;
    arm_type: string;
    lumbar: string;
    recline_type: string;
    seat_type: string;
    material_type: string;
    heat_option: string;
    seat_item_type: string;
    color: string;
    price?: string;
    image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    pivot?: {
      product_id: number;
      variation_id: number;
    };
  }>;
  price_tiers?: Array<{
    id: number;
    price_adjustment: number;
    is_active: boolean;
  }>;
}

interface ProductsResponse {
  current_page: number;
  data: Product[];
  first_page_url: string;
  last_page: number;
  per_page: number;
  total: number;
}

// Helper function to truncate text to 3 words
const truncateToWords = (text: string, wordLimit: number = 3): string => {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
};

const Products2Page = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showShopSpecialOnly, setShowShopSpecialOnly] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);


  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build API parameters for server-side pagination
      const params: Record<string, any> = {
        page: page + 1, // API uses 1-based pagination, but MUI uses 0-based
        limit: rowsPerPage
      };
      
      // Add optional search parameter
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      
       console.log('🔍 Loading products with params:', params);
       
       const response = await apiService.getProducts(params);
       console.log('🔍 API Response:', response);
      
      // Handle the API response structure
      if (response && response.data) {
        setProducts(response.data);
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
        setProducts(response);
        setTotalCount(response.length);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
      
      if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication required. You will be redirected to the login page in 3 seconds.');
        // Redirect to home page where user can login
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view products.');
      } else if (err.response?.status === 404) {
        setError('Products endpoint not found. Please contact support.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to load products. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, router]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAdd = () => {
    router.push('/admin/Products/create');
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/Products/${product.id}/edit`);
  };


  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteProduct(productToDelete.id);
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        setAlert({ type: 'success', message: 'Product deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete product');
        console.error('Error deleting product:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
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

  const getProductImage = (product: Product) => {
    // Handle both images array and primary_image object from API response
    if (product.primary_image?.image_path) {
      return `https://superiorseats.ali-khalid.com${product.primary_image.image_path}`;
    }
    
    if (product.images && product.images.length > 0) {
      return `https://superiorseats.ali-khalid.com${product.images[0]}`;
    }
    
    return null; // No fallback image
  };


  // Filter products based on shop special toggle
  const filteredProducts = showShopSpecialOnly 
    ? products.filter(product => product.show_on_special_shop === true)
    : products;

  return (
    <AdminLayout title="Products">
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', md: 'flex-start' },
          gap: { xs: 2, md: 0 }
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
           
            {/* Search Bar positioned at top-left */}
            <TextField
              placeholder="Search products..."
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
                width: '100%'
              }}
              size="small"
            />

            {/* Special Products Filter */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              gap: { xs: 1, sm: 2 }
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showShopSpecialOnly}
                    onChange={(e) => {
                      setShowShopSpecialOnly(e.target.checked);
                      setPage(0); // Reset to first page when filtering
                    }}
                    color="primary"
                    size="small"
                  />
                }
                label="Shop Special Only"
                sx={{ 
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }
                }}
              />
              
              {/* Product count indicator */}
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  ml: { xs: 0, sm: 2 },
                  mt: { xs: 1, sm: 0 },
                  alignSelf: { xs: 'flex-start', sm: 'center' }
                }}
              >
                Showing {filteredProducts.length} of {totalCount} products
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
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
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                  loadProducts();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Products Display */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No products found matching your search' : 
               'No products found'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 
               'Click "Add Product" to create your first product.'}
            </Typography>
          </Paper>
        ) : isMobile ? (
          /* Mobile Card Layout */
          <Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2 
            }}>
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: { xs: 180, sm: 200 },
                    overflow: 'hidden',
                    borderRadius: '8px 8px 0 0',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getProductImage(product) ? (
                      <Box
                        component="img"
                        src={getProductImage(product)!}
                        alt={product.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          transition: 'transform 0.3s ease',
                          borderRadius: '4px',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        textAlign: 'center',
                        p: 2
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 1 }}>
                          No Image
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Subtle border for better definition */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: '8px 8px 0 0',
                      pointerEvents: 'none'
                    }} />
                  </Box>
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: { xs: 1.5, sm: 2 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    {/* Top Section - Title and Description */}
                    <Box sx={{ mb: 2 }}>
                      <Tooltip title={product.name} arrow placement="top">
                        <Typography variant="h6" component="h2" sx={{ 
                          fontWeight: 600, 
                          mb: 1,
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          lineHeight: 1.3,
                          color: 'text.primary',
                          cursor: 'help'
                        }}>
                          {truncateToWords(product.name)}
                        </Typography>
                      </Tooltip>
                      
                      <Tooltip title={product.description || 'No description available'} arrow placement="top">
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '2.5em',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            cursor: 'help'
                          }}
                        >
                          {truncateToWords(product.description || 'No description available')}
                        </Typography>
                      </Tooltip>
                    </Box>
                    
                    {/* Middle Section - Chips */}
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip
                        label={typeof product.category === 'string' ? product.category : ((product.category as any)?.name || 'No Category')}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                      <Chip
                        label={product.show_on_special_shop ? 'Shop Special' : 'Regular'}
                        size="small"
                        color={product.show_on_special_shop ? 'primary' : 'default'}
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                      <Chip
                        label={product.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        color={product.is_active ? 'success' : 'default'}
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                    </Box>
                    
                    {/* Bottom Section - Price, Stock, and Actions */}
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: 'primary.main',
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }}>
                          ${product.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {product.stock} units
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(product)}
                          title="Edit"
                          sx={{ 
                            color: 'primary.main',
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            '&:hover': { 
                              bgcolor: 'primary.main', 
                              color: 'white',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(product)}
                          title="Delete"
                          sx={{ 
                            color: 'error.main',
                            bgcolor: 'rgba(211, 47, 47, 0.1)',
                            '&:hover': { 
                              bgcolor: 'error.main', 
                              color: 'white',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {/* Mobile Pagination */}
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {/* Pagination Info */}
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} products
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
              
              {/* Items per page input */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Items per page:
                </Typography>
                <TextField
                  type="number"
                  value={rowsPerPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 10;
                    if (value > 0 && value <= 100) {
                      setRowsPerPage(value);
                      setPage(0);
                    }
                  }}
                  size="small"
                  sx={{ 
                    minWidth: 80,
                    maxWidth: 100,
                    '& .MuiInputBase-input': {
                      textAlign: 'center'
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: 100,
                    step: 1
                  }}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          /* Desktop Table Layout */
          <Paper sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Shop Special</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow 
                      key={product.id}
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
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5',
                          borderRadius: 1,
                          border: '1px solid #e0e0e0'
                        }}>
                          {getProductImage(product) && (
                            <Box
                              component="img"
                              src={getProductImage(product)!}
                              alt={product.name}
                              sx={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                borderRadius: 1
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
                          )}
                          
                          {/* Fallback for when image is missing or fails to load */}
                          <Box
                            className="image-fallback"
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: 'grey.200',
                              display: getProductImage(product) ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0',
                              position: 'absolute',
                              top: 0,
                              left: 0
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              No Image
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={product.name} arrow placement="top">
                          <Typography variant="body1" sx={{ fontWeight: 500, cursor: 'help' }}>
                            {truncateToWords(product.name)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={product.description || 'No description available'} arrow placement="top">
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              maxWidth: 300,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              cursor: 'help'
                            }}
                          >
                            {truncateToWords(product.description || 'No description available')}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={typeof product.category === 'string' ? product.category : ((product.category as any)?.name || 'No Category')}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          ${product.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {product.stock} units
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          color={product.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.show_on_special_shop ? 'Shop Special' : 'Regular Product'}
                          size="small"
                          color={product.show_on_special_shop ? 'primary' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(product)}
                            title="Edit"
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(product)}
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
              {/* Left side - Items per page input */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Items per page:
                </Typography>
                <TextField
                  type="number"
                  value={rowsPerPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 10;
                    if (value > 0 && value <= 100) {
                      setRowsPerPage(value);
                      setPage(0);
                    }
                  }}
                  size="small"
                  sx={{ 
                    minWidth: 80,
                    maxWidth: 100,
                    '& .MuiInputBase-input': {
                      textAlign: 'center'
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: 100,
                    step: 1
                  }}
                />
              </Box>
              
              {/* Center - Page info */}
              <Typography variant="body2" color="text.secondary">
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} products
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
              Are you sure you want to delete &quot;{productToDelete?.name}&quot;? This action cannot be undone.
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

export default Products2Page;