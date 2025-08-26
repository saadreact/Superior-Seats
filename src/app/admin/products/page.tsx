'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  Alert,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ArrowBack,
  ArrowForward,
  ZoomIn,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import Image from 'next/image';

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
  created_at: string;
  updated_at: string;
  vehicle_trim_id?: number | null;
  category_id?: number | null;
  vehicle_trim?: any | null;
  primary_image?: {
    id: number;
    product_id: number;
    image_path: string;
    alt_text: string | null;
    caption: string | null;
    sort_order: number;
    is_primary: boolean;
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
}

interface ProductsResponse {
  current_page: number;
  data: Product[];
  first_page_url: string;
  last_page: number;
  per_page: number;
  total: number;
}

const ProductsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(products)
  // Product Details Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      if (currentPage > 1) params.page = currentPage;
      
      const response = await apiService.getProducts(params);
      
      // Handle the new response structure
      if (response && response.data) {debugger
        setProducts(response.data);
        // Extract pagination info if available
        if (response.meta) {
          setTotalPages(response.meta.last_page || 1);
        }
      } else if (Array.isArray(response)) {
        setProducts(response);
        setTotalPages(1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load products. Please try again later.');
      }
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAdd = () => {
    router.push('/admin/products/create');
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleView = (product: Product) => {
    router.push(`/admin/products/${product.id}`);
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
    setCurrentPage(1); // Reset to first page when searching
  };

  // Product Details Modal Functions
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalImageIndex(0);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    setModalImageIndex(0);
  };

  const getProductImages = (product: Product) => {
    // Handle both images array and primary_image object from API response
    const images = [];
    debugger
    if (product.primary_image?.image_path) {
      images.push(`https://superiorseats.ali-khalid.com${product.primary_image.image_path}`);
    }
    
    if (product.images && product.images.length > 0) {
      const additionalImages = product.images.map(img => `https://superiorseats.ali-khalid.com${img}`);
      images.push(...additionalImages);
    }
    
    // Remove duplicates and return, fallback to default image if none found
    const uniqueImages = [...new Set(images)];
    return uniqueImages.length > 0 ? uniqueImages : ['/TruckImages/01.jpg'];
  };

  const handleNextModalImage = () => {
    if (selectedProduct) {
      const productImages = getProductImages(selectedProduct);
      const nextIndex = (modalImageIndex + 1) % productImages.length;
      setModalImageIndex(nextIndex);
    }
  };

  const handlePrevModalImage = () => {
    if (selectedProduct) {
      const productImages = getProductImages(selectedProduct);
      const prevIndex = modalImageIndex === 0 ? productImages.length - 1 : modalImageIndex - 1;
      setModalImageIndex(prevIndex);
    }
  };

  // Touch/swipe functionality for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwipeActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsSwipeActive(false);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 30; // Reduced threshold for easier swiping
    const isRightSwipe = distance < -30;

    if (selectedProduct && getProductImages(selectedProduct).length > 1) {
      if (isLeftSwipe) {
        handleNextModalImage();
      }
      if (isRightSwipe) {
        handlePrevModalImage();
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedProduct || getProductImages(selectedProduct).length <= 1) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevModalImage();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextModalImage();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCloseProductModal();
    }
  };

  // Mouse wheel navigation for desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (!selectedProduct || getProductImages(selectedProduct).length <= 1) return;
    
    e.preventDefault();
    
    if (e.deltaY > 0) {
      // Scrolling down - next image
      handleNextModalImage();
    } else if (e.deltaY < 0) {
      // Scrolling up - previous image
      handlePrevModalImage();
    }
  };

  return (
    <AdminLayout title="Products">
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
            onClick={handleAdd}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Add Product
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
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

        {/* Products Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add Product" to create your first product.'}
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
            {products.map((product) => (
              <Box key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                      '& .card-media': {
                        transform: 'scale(1.05)',
                      },
                      '& .zoom-icon': {
                        opacity: 1,
                      },
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                      height="200"
                      image={getProductImages(product)[0]}
                    alt={product.name}
                      className="card-media"
                      sx={{
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5',
                        transition: 'transform 0.3s ease',
                        height: { xs: 180, sm: 200 },
                      }}
                    />
                    
                    {/* Zoom Icon Overlay */}
                    <Box
                      className="zoom-icon"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        backgroundColor: 'rgba(211, 47, 47, 0.9)',
                        borderRadius: '50%',
                        p: 1,
                        color: 'white',
                        display: { xs: 'none', sm: 'flex' },
                      }}
                    >
                      <ZoomIn sx={{ fontSize: 24 }} />
                    </Box>

                    {/* Status Chip */}
                    <Chip
                      label={product.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={product.is_active ? 'success' : 'default'}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        fontWeight: 'bold',
                      }}
                    />

                    {/* Price Chip */}
                    <Chip
                      label={`$${product.price}`}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '2.5rem',
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={product.category?.name || 'No Category'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Stock: {product.stock}
                      </Typography>
                    </Box>

                    {product.variations && product.variations.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {product.variations.length} variation{product.variations.length !== 1 ? 's' : ''}
                        </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(product);
                      }}
                      title="View Details"
                      sx={{ color: 'primary.main' }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                      title="Edit"
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product);
                      }}
                      title="Delete"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        {/* Product Details Modal */}
        <Dialog
          open={!!selectedProduct}
          onClose={handleCloseProductModal}
          maxWidth="lg"
          fullWidth
          onKeyDown={handleKeyDown}
          PaperProps={{
            sx: {
              backgroundColor: 'white',
              margin: { xs: 1, sm: 2, md: 3 },
              maxWidth: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)', md: '1200px' },
              borderRadius: 2,
              overflow: 'hidden',
            },
          }}
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={handleCloseProductModal}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'white',
                backgroundColor: 'primary.main',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                width: 40,
                height: 40,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <CloseIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {selectedProduct && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                minHeight: { xs: 'auto', md: '500px' },
              }}>
                {/* Left Side - Product Details */}
                <Box sx={{ 
                  flex: 1, 
                  p: { xs: 3, sm: 4, md: 5 },
                  pr: { md: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
                        lineHeight: 1.2,
                        color: 'text.primary',
                      }}
                    >
                      {selectedProduct.name}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3, 
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {selectedProduct.description}
                    </Typography>

                    {/* Product Details Grid */}
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: 3, 
                      mb: 3 
                    }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Category
                        </Typography>
                        <Chip 
                          label={selectedProduct.category?.name || 'No Category'} 
                          color="primary" 
                          size="small" 
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Price
                        </Typography>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          ${selectedProduct.price}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Stock
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="text.primary">
                          {selectedProduct.stock} units
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Status
                        </Typography>
                        <Chip 
                          label={selectedProduct.is_active ? 'Active' : 'Inactive'}
                          color={selectedProduct.is_active ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>

                    {/* Variations Section */}
                    {selectedProduct.variations && selectedProduct.variations.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          Variations ({selectedProduct.variations.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedProduct.variations.slice(0, 4).map((variation) => (
                            <Chip 
                              key={variation.id} 
                              label={`${variation.name} - $${variation.price || '0'}`} 
                              size="small" 
                              variant="outlined"
                              color="secondary"
                            />
                          ))}
                          {selectedProduct.variations.length > 4 && (
                            <Chip 
                              label={`+${selectedProduct.variations.length - 4} more`} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ mt: 'auto' }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleCloseProductModal();
                        handleView(selectedProduct);
                      }}
                      startIcon={<ViewIcon />}
                      sx={{ 
                        flex: 1,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleCloseProductModal();
                        handleEdit(selectedProduct);
                      }}
                      startIcon={<EditIcon />}
                      sx={{ 
                        flex: 1,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Edit Product
                    </Button>
                  </Stack>
                </Box>

                {/* Right Side - Product Images */}
                <Box 
                  sx={{ 
                    flex: 1,
                    position: 'relative',
                    minHeight: { xs: '300px', md: '500px' },
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: getProductImages(selectedProduct).length > 1 ? 'grab' : 'default',
                    userSelect: 'none',
                    transform: isSwipeActive ? 'scale(0.98)' : 'scale(1)',
                    transition: 'transform 0.1s ease',
                    '&:active': {
                      cursor: getProductImages(selectedProduct).length > 1 ? 'grabbing' : 'default',
                    }
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onWheel={handleWheel}
                >
                  <Image
                    src={getProductImages(selectedProduct)[modalImageIndex]}
                    alt={`${selectedProduct.name} - Image ${modalImageIndex + 1}`}
                    width={600}
                    height={500}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      maxHeight: '500px',
                      transition: 'transform 0.2s ease',
                    }}
                    draggable={false}
                  />

                  {/* Image Navigation Dots */}
                  {getProductImages(selectedProduct).length > 1 && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 1,
                      zIndex: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '20px',
                      p: 1,
                    }}>
                      {getProductImages(selectedProduct).map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => setModalImageIndex(index)}
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: index === modalImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: index === modalImageIndex ? 'white' : 'rgba(255, 255, 255, 0.8)',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Navigation Arrows */}
                  {getProductImages(selectedProduct).length > 1 && (
                    <>
                      <IconButton
                        onClick={handlePrevModalImage}
                        sx={{
                          position: 'absolute',
                          left: 16,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          width: 44,
                          height: 44,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            transform: 'translateY(-50%) scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ArrowBack sx={{ fontSize: 24 }} />
                      </IconButton>
                      
                      <IconButton
                        onClick={handleNextModalImage}
                        sx={{
                          position: 'absolute',
                          right: 16,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          width: 44,
                          height: 44,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            transform: 'translateY(-50%) scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ArrowForward sx={{ fontSize: 24 }} />
                      </IconButton>
                    </>
                  )}

                  {/* Image Counter */}
                  {getProductImages(selectedProduct).length > 1 && (
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}>
                      {modalImageIndex + 1} / {getProductImages(selectedProduct).length}
                    </Box>
                  )}

                  {/* Swipe Instruction (Mobile Only) */}
                  {getProductImages(selectedProduct).length > 1 && (
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      display: { xs: 'block', md: 'none' },
                      opacity: 0.8,
                    }}>
                      Swipe to navigate
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

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

export default ProductsPage; 
