'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Pagination,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ArrowBack,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import Header from '@/components/Header';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';
import Footer from '@/components/Footer';
import { mainCategories } from '@/data/ShopGallery';
import { apiService, Product, ProductsParams, processImageUrl } from '@/services/api';
import { useSelectedItem } from '@/contexts/SelectedItemContext';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { RootState } from '@/store/store';

const ShopGallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { setSelectedItem } = useSelectedItem();
  const router = useRouter();
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const { token: userToken } = useSelector((state: RootState) => state.auth);
  
  // State for API data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug error state changes
  useEffect(() => {
    if (error) {
      console.log('🚨 Error state set:', error);
    }
  }, [error]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  // State for lightbox
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // State for notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

    // Fetch products from API
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔄 useEffect triggered at ${timestamp} with dependencies:`, { currentPage, itemsPerPage, userToken: userToken ? 'present' : 'not present' });
    
    let isMounted = true;
    let abortController = new AbortController();

    const fetchProducts = async () => {
      // Don't show loading if we already have products (for better UX)
      if (products.length === 0) {
        setLoading(true);
      }
      setError(null);
      
      try {
        const params: ProductsParams = {
          page: currentPage,
          limit: itemsPerPage,
        };
        
        const response = await apiService.getProducts(params, userToken || undefined);
        
        // Check if component is still mounted before updating state
        if (!isMounted) return;
        
        if (response.success) {
          const timestamp = new Date().toLocaleTimeString();
          console.log(`✅ API call completed successfully at ${timestamp}, setting products`);
          setProducts(response.data);
          setTotalProducts(response.total);
          setTotalPages(response.totalPages);
          setError(null);
        } else {
          console.log('❌ API call failed:', response.error);
          if (isMounted) {
            // Only show error if we don't have any products
            if (products.length === 0) {
              setError(response.error || 'Failed to fetch products');
              setProducts([]);
              setTotalProducts(0);
              setTotalPages(0);
            } else {
              // If we have existing products, just log the error but don't show it to user
              console.warn('⚠️ API error but keeping existing products:', response.error);
            }
          }
        }
      } catch (err: any) {
        console.error('API Error in ShopGallery:', err);
        // Check if component is still mounted before updating state
        if (!isMounted) return;
        
        // Only show error if we don't have any products
        if (products.length === 0) {
          setError(err.message || 'Failed to fetch products. Please try again later.');
          setProducts([]);
          setTotalProducts(0);
          setTotalPages(0);
        } else {
          // If we have existing products, just log the error but don't show it to user
          console.warn('⚠️ Fetch error but keeping existing products:', err.message);
        }
      } finally {
        // Check if component is still mounted before updating state
        if (isMounted) {
          const timestamp = new Date().toLocaleTimeString();
          console.log(`✅ Setting loading to false at ${timestamp} - API call completed`);
          setLoading(false);
        } else {
          const timestamp = new Date().toLocaleTimeString();
          console.log(`⚠️ Component unmounted at ${timestamp}, not setting loading to false`);
        }
      }
    };

    fetchProducts();

    return () => {
      console.log('🧹 useEffect cleanup - component unmounting or dependencies changed');
      isMounted = false;
      abortController.abort();
    };
  }, [currentPage, itemsPerPage, userToken]);

  // Calculate pagination info
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);



  const handleImageClick = (image: Product, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % products.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(products[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = currentImageIndex === 0 ? products.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(products[prevIndex]);
  };

  const handleAddToCart = (item: Product) => {
    const processedImageUrl = processImageUrl(item.image || item.images?.[0] || '');
    const formattedPrice = item.price.startsWith('$') ? item.price : `$${item.price}`;
    
    console.log('Adding item to cart:', {
      id: item.id,
      title: item.title || item.name,
      originalImage: item.image || item.images?.[0] || '',
      processedImage: processedImageUrl,
      price: formattedPrice,
      description: item.description
    });
    
    dispatch(addItem({
      id: item.id,
      title: item.title || item.name,
      price: formattedPrice,
      image: processedImageUrl,
      description: item.description,
      category: item.category,
      subCategory: item.subCategory || '',
      mainCategory: item.mainCategory || '',
    }));
    
    // Show success notification
    setSnackbar({
      open: true,
      message: `${item.title || item.name} added to cart!`,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCustomize = (item: Product) => {
    setSelectedItem({
      id: item.id,
      title: item.title || item.name,
      category: item.category,
      subCategory: item.subCategory || '',
      mainCategory: item.mainCategory || '',
      image: item.image || item.images?.[0] || '',
      description: item.description,
      price: item.price,
    });
    router.push('/customize-your-seat');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      <HeroSectionCommon
        title="Shop Specials"
        description="Discover our exclusive collection of premium seats with special pricing and unique features"
        height={{
          xs: '18vh',
          sm: '20vh',
          md: '18vh',
          lg: '20vh'
        }}
      />



      {/* Gallery Grid */}
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Container maxWidth="lg">
          {/* Gallery Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: { xs: 2, sm: 3, md: 4 },
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 0 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
                textAlign: { xs: 'center', sm: 'left' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              All Products
            </Typography>
                <Typography 
      variant="body2" 
      sx={{ 
        color: 'text.secondary',
        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
        textAlign: { xs: 'center', sm: 'right' },
        width: { xs: '100%', sm: 'auto' },
      }}
    >
      {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
    </Typography>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6, md: 8 } }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h5" sx={{ 
                color: 'text.secondary', 
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
              }}>
                Loading products...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && products.length === 0 && (
            <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6, md: 8 } }}>
              <Typography variant="h5" sx={{ 
                color: 'error.main', 
                mb: 2,
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
              }}>
                Unable to Load Products
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                mb: 3,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                maxWidth: '600px',
                mx: 'auto',
              }}>
                {error}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setError(null);
                    setCurrentPage(1);
                  }}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.75, sm: 1, md: 1.5 },
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/')}
                  sx={{ 
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.75, sm: 1, md: 1.5 },
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  Go to Home
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/gallery')}
                  sx={{ 
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.75, sm: 1, md: 1.5 },
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  View Gallery
                </Button>
              </Box>
            </Box>
          )}

          {/* Non-blocking Error Message (when we have products but API fails) */}
          {error && !loading && products.length > 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 1, 
              mb: 2,
              backgroundColor: 'warning.light',
              borderRadius: 1,
              mx: 2
            }}>
              <Typography variant="body2" sx={{ 
                color: 'warning.dark',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}>
                ⚠️ Some products may not be up to date. Showing cached results.
              </Typography>
            </Box>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: { xs: 1.5, sm: 2, md: 3, lg: 4 },
              justifyContent: 'center',
              width: '100%'
            }}>
              {products.map((item: Product, index: number) => (
                <Box key={item.id} sx={{ width: '100%' }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-8px)' },
                        boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.1)', sm: '0 12px 40px rgba(211, 47, 47, 0.25)' },
                        '& .zoom-icon': {
                          opacity: 1,
                        },
                        '& .card-media': {
                          transform: { xs: 'none', sm: 'scale(1.05)' },
                        },
                      },
                    }}
                    onClick={() => handleImageClick(item, index)}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      {(item.image || item.images?.[0]) && (item.image || item.images?.[0]).trim() !== '' ? (
                        <CardMedia
                          component="img"
                          height="250"
                          image={processImageUrl(item.image || item.images?.[0] || '')}
                          alt={item.title || item.name}
                          className="card-media"
                          sx={{
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            objectFit: 'contain',
                            width: '100%',
                            height: { xs: '180px', sm: '200px', md: '220px', lg: '250px' },
                            backgroundColor: '#f5f5f5',
                          }}
                          onError={(e) => {
                            console.error('ShopGallery image failed to load:', item.image || item.images?.[0]);
                            console.error('Processed URL:', processImageUrl(item.image || item.images?.[0] || ''));
                          }}
                          onLoad={() => {
                            console.log('ShopGallery image loaded successfully:', processImageUrl(item.image || item.images?.[0] || ''));
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: { xs: '180px', sm: '200px', md: '220px', lg: '250px' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            color: 'text.secondary',
                          }}
                        >
                          <Typography variant="body2">No image</Typography>
                        </Box>
                      )}
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
                          p: { xs: 0.5, sm: 1 },
                          color: 'white',
                          display: { xs: 'none', sm: 'flex' },
                        }}
                      >
                        <ZoomIn sx={{ fontSize: { xs: 18, sm: 24 } }} />
                      </Box>
                      <Chip
                        label={`$${item.price}`}
                        sx={{
                          position: 'absolute',
                          top: { xs: 8, sm: 12, md: 16 },
                          right: { xs: 8, sm: 12, md: 16 },
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                          height: { xs: 20, sm: 24, md: 28, lg: 32 },
                          '& .MuiChip-label': {
                            px: { xs: 1, sm: 1.5 },
                          },
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 } }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                          color: 'text.primary',
                          lineHeight: { xs: 1.3, sm: 1.4 },
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {item.title || item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.5,
                          mb: 2,
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                          display: { xs: '-webkit-box', sm: 'block' },
                          WebkitLineClamp: { xs: 2, sm: 'none' },
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={{ xs: 1, sm: 1 }}
                        sx={{ flexWrap: 'wrap', gap: { xs: 1, sm: 1 } }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomize(item);
                          }}
                          sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                            py: { xs: 0.5, sm: 0.75, md: 1 },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                            },
                          }}
                        >
                          Customize
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                            py: { xs: 0.5, sm: 0.75, md: 1 },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}

          {/* No Products Found */}
          {products.length === 0 && !loading && !error && (
            <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6, md: 8 } }}>
              <Typography variant="h5" sx={{ 
                color: 'text.secondary', 
                mb: 2,
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}>
                No Products Available
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                mb: 3,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                maxWidth: '600px',
                mx: 'auto',
              }}>
                No products are currently available. Please check back later or try refreshing the page.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCurrentPage(1);
                  }}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.75, sm: 1, md: 1.5 },
                  }}
                >
                  Refresh Products
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/')}
                  sx={{ 
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.75, sm: 1, md: 1.5 },
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  Go to Home
                </Button>
              </Box>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && !error && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: { xs: 3, sm: 4, md: 5 },
              gap: { xs: 2, sm: 0 }
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Showing {startIndex + 1} to {endIndex} of {totalProducts} products
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', sm: 'auto' },
              }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange({} as any, currentPage - 1)}
                  startIcon={<KeyboardArrowLeft />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                    '&:disabled': {
                      borderColor: 'grey.300',
                      color: 'grey.400',
                    },
                  }}
                >
                  Previous
                </Button>
                
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      minWidth: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    },
                  }}
                />
                
                <Button
                  variant="outlined"
                  size="small"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange({} as any, currentPage + 1)}
                  endIcon={<KeyboardArrowRight />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                    '&:disabled': {
                      borderColor: 'grey.300',
                      color: 'grey.400',
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: 'black',
            margin: { xs: 1, sm: 2, md: 4 },
            maxWidth: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 12, md: 16 },
              right: { xs: 8, sm: 12, md: 16 },
              color: 'white',
              backgroundColor: 'primary.main',
              zIndex: 1,
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
              width: { xs: 28, sm: 32, md: 40 },
              height: { xs: 28, sm: 32, md: 40 },
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Close sx={{ fontSize: { xs: 16, sm: 18, md: 24 } }} />
          </IconButton>

          {selectedImage && (
            <Box sx={{ position: 'relative' }}>
              {(selectedImage.image || selectedImage.images?.[0]) && (selectedImage.image || selectedImage.images?.[0]).trim() !== '' ? (
                <Image
                  src={processImageUrl(selectedImage.image || selectedImage.images?.[0] || '')}
                  alt={selectedImage.title || selectedImage.name}
                  width={800}
                  height={600}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: isSmallMobile ? '50vh' : isMobile ? '60vh' : '80vh',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: isSmallMobile ? '50vh' : isMobile ? '60vh' : '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="h6">No image available</Typography>
                </Box>
              )}
              
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: { xs: 16, sm: 24, md: 32 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                  width: { xs: 28, sm: 32, md: 40 },
                  height: { xs: 28, sm: 32, md: 40 },
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowBack sx={{ fontSize: { xs: 16, sm: 18, md: 24 } }} />
              </IconButton>
              
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: { xs: 16, sm: 24, md: 32 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                  width: { xs: 28, sm: 32, md: 40 },
                  height: { xs: 28, sm: 32, md: 40 },
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowForward sx={{ fontSize: { xs: 16, sm: 18, md: 24 } }} />
              </IconButton>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(255,255,255,0.9))',
                  p: { xs: 1.5, sm: 2, md: 3 },
                }}
              >
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold', 
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}>
                  {selectedImage.title || selectedImage.name}
                </Typography>
                <Typography variant="body1" sx={{ 
                  mb: 2, 
                  opacity: 0.9,
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  display: { xs: '-webkit-box', sm: 'block' },
                  WebkitLineClamp: { xs: 2, sm: 'none' },
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}>
                  {selectedImage.description}
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 2 }} 
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    disabled
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                      px: { xs: 1, sm: 1.5, md: 2 },
                      py: { xs: 0.5, sm: 0.75, md: 1 },
                      minWidth: { xs: '80px', sm: '90px', md: '100px' },
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        opacity: 1,
                      },
                    }}
                  >
                    ${selectedImage.price}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      handleAddToCart(selectedImage);
                      handleCloseLightbox();
                    }}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                      px: { xs: 1, sm: 1.5, md: 2 },
                      py: { xs: 0.5, sm: 0.75, md: 1 },
                      minWidth: { xs: '80px', sm: '90px', md: '100px' },
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Success Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Footer />
    </Box>
  );
};

export default ShopGallery; 