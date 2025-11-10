'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Grid,
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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ArrowBack,
  ArrowForward,
  FilterList,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import Header from '@/components/Header';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';
import Footer from '@/components/Footer';

// NEW IMPORTS: Added to enable communication with CustomizedSeat component
import { useSelectedItem } from '@/contexts/SelectedItemContext'; // Context hook to set selected item data
import { useRouter } from 'next/navigation'; // Next.js router for programmatic navigation
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { RootState } from '@/store/store';
// API IMPORTS
import shopNowApis, { Product, Category } from '@/services/ShopNowApis';

const CustomizeYourSeat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const pathname = usePathname(); // Get current pathname
  
  // NEW CONTEXT USAGE: Access functions to set selected item and navigate
  const { setSelectedItem } = useSelectedItem(); // Destructure setSelectedItem from context
  const router = useRouter(); // Initialize Next.js router for navigation
  
  // Redux selectors for authentication state and cart
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth) || {};
  const cartItems = useSelector((state: RootState) => state.cart.items) || [];
  
  // Check if we're on the customize-your-seat page
  const isOnCustomizeYourSeatPage = pathname === '/customize-your-seat';
  
  
  const [selectedMainCategory, setSelectedMainCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);   // cards per page - server-side pagination
  const [modalImageIndex, setModalImageIndex] = useState(0); // For multiple images in modal
  const [showSpecialOnly, setShowSpecialOnly] = useState(false); // Special products filter
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState('Added to cart'); // Snackbar message
  const [imageLoading, setImageLoading] = useState(true); // Track image loading state
  const [showLoader, setShowLoader] = useState(false); // Only show loader if loading takes > 200ms
  const imageLoadingRef = useRef(true); // Ref to track loading state for timer callbacks

  // API State
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<{
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    has_more_pages: boolean;
  } | null>(null);
  
  // Categories State - Now extracted from products
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Extract role_id (customer ID) directly from Redux state (persisted in localStorage)
  const customerId = user?.role?.id || user?.role_id || null;

  // Function to extract unique categories from products
  const extractCategoriesFromProducts = useCallback((products: Product[]) => {
    const categoryMap = new Map();
    
    products.forEach(product => {
      if (product.category && product.category.id) {
        const category = product.category;
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image_url: category.image_url,
            is_active: category.is_active,
            sort_order: category.sort_order,
            products_count: 1
          });
        } else {
          // Increment products count
          const existingCategory = categoryMap.get(category.id);
          existingCategory.products_count += 1;
        }
      }
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => a.sort_order - b.sort_order);
  }, []);

  // Function to fetch products with server-side pagination and filtering
  const fetchProducts = useCallback(async () => {
    if (!isOnCustomizeYourSeatPage) {
      return;
    }
    if ((fetchProducts as any).__inFlight) {
      return;
    }
    (fetchProducts as any).__inFlight = true;
    
    setLoading(true);
    setError(null);
    
    try {
      // Build API parameters
      const apiParams: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      // Add special products filter if enabled
      if (showSpecialOnly) {
        apiParams.show_on_special_shop = true;
      }
      
      // Add category filter if not "all"
      if (selectedMainCategory !== 'all') {
        // Find the selected category from the current categories state
        const selectedCategory = categories.find(cat => cat && cat.slug === selectedMainCategory);
        if (selectedCategory) {
          apiParams.category_id = selectedCategory.id;
        } else {
          // Don't add category_id if category not found, this will show all products
        }
      }
      
      
      // Add customer ID (role_id) directly from Redux if user is authenticated
      if (isAuthenticated && customerId) {
        apiParams.customerId = customerId;
      }
      
      const productsResponse = await shopNowApis.getProducts(apiParams);
      
      if (productsResponse.status === 'success' && productsResponse.data) {
        // CLIENT-SIDE FILTER: Only show products where is_customize_3d_product = true
        const filteredProducts = productsResponse.data.filter((product: Product) => 
          product.is_customize_3d_product === true
        );
        
        setApiProducts(filteredProducts);
        
        // Extract and set categories from filtered products (only show categories with products)
        if (categories.length === 0) {
          const extractedCategories = extractCategoriesFromProducts(filteredProducts);
          setCategories(extractedCategories);
        }
        
        // Set pagination metadata
        if (productsResponse.meta?.pagination) {
          setPaginationMeta(productsResponse.meta.pagination);
        }
        
      } else {
        setApiProducts([]);
        setPaginationMeta(null);
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error?.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (error?.response?.status === 403) {
        setError('Access denied. You may not have permission to view these products.');
      } else if (error?.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load products. Please try again.');
      }
      
      setApiProducts([]);
      setPaginationMeta(null);
    }
    
    setLoading(false);
    (fetchProducts as any).__inFlight = false;
  }, [isOnCustomizeYourSeatPage, currentPage, itemsPerPage, showSpecialOnly, selectedMainCategory, customerId, isAuthenticated, extractCategoriesFromProducts]);

  // Effect to fetch products - categories are extracted from products response
  useEffect(() => {
    if (isOnCustomizeYourSeatPage) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnCustomizeYourSeatPage, currentPage, itemsPerPage, showSpecialOnly, selectedMainCategory, customerId, isAuthenticated]);

  // Cleanup effect to clear any pending timers when component unmounts
  useEffect(() => {
    return () => {
      // Clear any pending loader timers on unmount
      if ((handleImageClick as any).loaderTimer) {
        clearTimeout((handleImageClick as any).loaderTimer);
      }
      if ((handleNextModalImage as any).loaderTimer) {
        clearTimeout((handleNextModalImage as any).loaderTimer);
      }
      if ((handlePrevModalImage as any).loaderTimer) {
        clearTimeout((handlePrevModalImage as any).loaderTimer);
      }
      if ((setModalImageIndex as any).loaderTimer) {
        clearTimeout((setModalImageIndex as any).loaderTimer);
      }
    };
  }, []);

  // Use server-side filtered products directly (no client-side filtering needed)
  const filteredImages = apiProducts;
  const currentItems = apiProducts; // All products are already paginated from server

  // Calculate pagination from server metadata
  const totalPages = paginationMeta?.last_page || 1;
  const startIndex = paginationMeta?.from || 1;
  const endIndex = paginationMeta?.to || 0;


     // Generate categories dropdown - only show categories that have products
   const apiMainCategories = [
     { value: 'all', label: 'All Products' },
     ...(categories || [])
       .filter(cat => cat && cat.is_active) // Only show active categories
       .sort((a, b) => a.sort_order - b.sort_order) // Sort by sort_order
       .map(cat => ({
         value: cat.slug,
         label: `${cat.name}${cat.products_count ? ` (${cat.products_count})` : ''}`
       }))
   ];



  const handleMainCategoryChange = (event: any) => {
    const newMainCategory = event.target.value;
    setSelectedMainCategory(newMainCategory);
    
    // Reset sub-category to 'all' when main category changes
    setSelectedSubCategory('all');
    setCurrentPage(1); // Reset to first page for server-side pagination
  };

  const handleSubCategoryChange = (event: any) => {
    setSelectedSubCategory(event.target.value);
    setCurrentPage(1); // Reset to first page when sub-category changes
  };

  const handleImageClick = (image: Product, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setModalImageIndex(0); // Reset modal image index when opening modal
    setImageLoading(true);
    setShowLoader(false);
    imageLoadingRef.current = true; // Set ref to true when starting to load
    
    // Only show loader if image takes more than 200ms to load
    const loaderTimer = setTimeout(() => {
      // Only show loader if we're still in loading state
      if (imageLoadingRef.current) {
        setShowLoader(true);
      }
    }, 200);
    
    // Store timer reference for cleanup
    (handleImageClick as any).loaderTimer = loaderTimer;
  };

  const handleCloseLightbox = () => {
    // Clear any pending loader timers when closing modal
    if ((handleImageClick as any).loaderTimer) {
      clearTimeout((handleImageClick as any).loaderTimer);
    }
    if ((handleNextModalImage as any).loaderTimer) {
      clearTimeout((handleNextModalImage as any).loaderTimer);
    }
    if ((handlePrevModalImage as any).loaderTimer) {
      clearTimeout((handlePrevModalImage as any).loaderTimer);
    }
    if ((setModalImageIndex as any).loaderTimer) {
      clearTimeout((setModalImageIndex as any).loaderTimer);
    }
    setSelectedImage(null);
  };

     // Get multiple images for the selected product from the images array
   const getProductImages = (product: Product) => {
     return shopNowApis.processProductImages(product);
   };

  

  // Validate and filter product images to avoid invalid string values like 'null'/'undefined'
  const isValidImageUrl = (url: string): boolean => {
    if (typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    const lower = trimmed.toLowerCase();
    if (lower === 'null' || lower === 'undefined' || lower === 'n/a') return false;
    return true;
  };

  const getValidImages = (product: Product): string[] => {
    const images = getProductImages(product) || [];
    return images.filter((u: string) => isValidImageUrl(u));
  };

  const getFirstValidImage = (product: Product): string | undefined => {
    const images = getValidImages(product);
    return images.length > 0 ? images[0] : undefined;
  };

  // Helper function to get pricing information with discount
  const getPriceDisplay = (product: Product) => {
    const originalPrice = parseFloat(product.price.toString());
    
    // Check if product has price_tiers with active discounts
    if (product.price_tiers && product.price_tiers.length > 0) {
      const priceTier = product.price_tiers[0]; // Use first price tier
      const discountedPrice = parseFloat(priceTier.pivot.price_adjustment);
      const discountPercentage = parseFloat(priceTier.discount_off_retail_price);
      
      // Only show discount if there's an actual discount (price is different and percentage > 0)
      const hasActualDiscount = discountPercentage > 0 && discountedPrice < originalPrice && discountedPrice > 0;
      
      return {
        hasDiscount: hasActualDiscount,
        originalPrice,
        discountedPrice: hasActualDiscount ? discountedPrice : originalPrice,
        discountPercentage: priceTier.discount_off_retail_price,
        displayPrice: hasActualDiscount ? discountedPrice : originalPrice
      };
    }
    
    return {
      hasDiscount: false,
      originalPrice,
      discountedPrice: originalPrice,
      discountPercentage: '0',
      displayPrice: originalPrice
    };
  };

  // Touch/swipe functionality for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleNextModalImage = () => {
    if (selectedImage) {
      const productImages = getProductImages(selectedImage);
      const nextIndex = (modalImageIndex + 1) % productImages.length;
      setImageLoading(true);
      setShowLoader(false);
      imageLoadingRef.current = true; // Set ref to true when starting to load
      setModalImageIndex(nextIndex);
      
      // Only show loader if image takes more than 200ms to load
      const loaderTimer = setTimeout(() => {
        if (imageLoadingRef.current) {
          setShowLoader(true);
        }
      }, 200);
      
      // Store timer reference for cleanup
      (handleNextModalImage as any).loaderTimer = loaderTimer;
    }
  };

  const handlePrevModalImage = () => {
    if (selectedImage) {
      const productImages = getProductImages(selectedImage);
      const prevIndex = modalImageIndex === 0 ? productImages.length - 1 : modalImageIndex - 1;
      setImageLoading(true);
      setShowLoader(false);
      imageLoadingRef.current = true; // Set ref to true when starting to load
      setModalImageIndex(prevIndex);
      
      // Only show loader if image takes more than 200ms to load
      const loaderTimer = setTimeout(() => {
        if (imageLoadingRef.current) {
          setShowLoader(true);
        }
      }, 200);
      
      // Store timer reference for cleanup
      (handlePrevModalImage as any).loaderTimer = loaderTimer;
    }
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextModalImage();
    }
    if (isRightSwipe) {
      handlePrevModalImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };



  const handleAddToCart = (item: Product) => {
    // Prevent adding when stock is missing or zero
    const stock = Number((item as any)?.stock ?? NaN);
    if (!Number.isFinite(stock) || stock <= 0) {
      handleSnackbarOpen('Out of stock');
      return;
    }
    // Enforce stock across repeated add clicks by checking existing cart qty
    try {
      const currentQty = (cartItems || []).filter((it: any) => Number(it.id) === Number(item.id)).reduce((s: number, it: any) => s + (Number(it.quantity) || 0), 0) || 0;
      if (currentQty + 1 > stock) {
        handleSnackbarOpen(`Only ${stock} in stock`);
        return;
      }
    } catch {}
    
    // Get the correct price (discounted if available)
    const priceInfo = getPriceDisplay(item);
    const priceString = priceInfo.displayPrice.toFixed(2);
    
    dispatch(addItem({
      id: item.id,
      title: item.name,
      price: priceString,
      image: getFirstValidImage(item) || '/placeholder-image.jpg',
      description: item.description || '',
      category: typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'seat',
      stock: stock, // Include stock information
    }));
    handleSnackbarOpen('Added to cart');
  };

  // NEW FUNCTION: Handles item selection and navigation to 3D customization page
  const handleCustomize = (item: Product) => {
    
    // Set only the product ID in the context
    setSelectedItem({ 
      id: item.id
    });
    
    // Navigate to build-your-seat page (3D model)
    router.push('/build-your-seat');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // The useEffect will automatically trigger a new API call with the new page
  };

  // Snackbar handlers
  const handleSnackbarOpen = (message: string = 'Added to cart') => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
             {/* Hero Section */}
               <HeroSectionCommon
          title="Customize Your Seat"
          description="Build your perfect seat with our 3D customization tool"
          height={{
            xs: '75px',
            sm: '70px', 
            md: '80px',
            lg: '95px',
            xl: '105px',
            xxl: '115px'
          }}
        />


             {/* Gallery Grid */}
       <Box sx={{ py: { xs: 1, sm: 1.5, md: 2, lg: 2 }, px: { xs: 1, sm: 2, md: 3 } }}>
         <Container sx={{ 
           padding: { xs: 2, sm: 3, md: 4 },
           width: { xs: '100%', sm: '100%', md: '90%', lg: '90%', xl: '90%' },
           maxWidth: { xs: '100%', sm: '100%', md: '90%', lg: '90%', xl: '90%' },
           mx: 'auto'
         }}>
                     {/* Category Filtering Dropdowns */}
           <Box sx={{ 
             mb: { xs: 2, sm: 3, md: 4 },
             display: 'flex',
             flexDirection: { xs: 'column', sm: 'row' },
             gap: { xs: 2, sm: 3 },
             alignItems: { xs: 'stretch', sm: 'center' },
             width: '100%'
           }}>
             {/* Main Category Dropdown */}
             <FormControl 
               sx={{ 
                 minWidth: { xs: '100%', sm: 200, md: 250 },
                 flex: { xs: 'none', sm: '0 0 auto' },
                 margin: 0,
                 '& .MuiFormControl-root': {
                   margin: 0,
                 }
               }}
               size="small"
             >
               <InputLabel id="main-category-label">Category</InputLabel>
                               <Select
                  labelId="main-category-label"
                  value={selectedMainCategory}
                  label="Category"
                  onChange={handleMainCategoryChange}
                  sx={{
                    backgroundColor: 'white',
                    borderColor: theme.palette.primary.main,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.dark,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                                  {apiMainCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
               </Select>
             </FormControl>

             {/* Special Products Filter Checkbox */}
             <FormControlLabel
               control={
                 <Checkbox
                   checked={showSpecialOnly}
                   onChange={(e) => {
                     setShowSpecialOnly(e.target.checked);
                     setCurrentPage(1); // Reset to first page when filter changes
                   }}
                   sx={{
                     color: theme.palette.primary.main,
                     '&.Mui-checked': {
                       color: theme.palette.primary.main,
                     },
                   }}
                 />
               }
               label={
                 <Typography
                   variant="body2"
                   sx={{
                     fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                     color: 'text.primary',
                     fontWeight: 'medium',
                   }}
                 >
                   Special Products Only
                 </Typography>
               }
               sx={{
                 margin: 0,
                 minWidth: { xs: '100%', sm: 'auto' },
                 flex: { xs: 'none', sm: '0 0 auto' },
                 '& .MuiFormControlLabel-label': {
                   marginLeft: 1,
                 },
               }}
             />

      {/* Clear Filters Button */}
               {(selectedMainCategory !== 'all' || showSpecialOnly) && (
                 <Button
                   variant="outlined"
                   size="small"
                   onClick={() => {
                     setSelectedMainCategory('all');
                     setShowSpecialOnly(false);
                     setCurrentPage(1);
                   }}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    minWidth: { xs: '100%', sm: 120 },
                    height: 40,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      color: 'white',
                    },
                  }}
                >
                  Clear Filters
                </Button>
              )}

             
           </Box>

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
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                               <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
                    textAlign: { xs: 'center', sm: 'left' },
                    width: { xs: '100%', sm: 'auto' },
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                                   {selectedMainCategory === 'all' 
                     ? 'All Customizable Products' 
                     : apiMainCategories.find(cat => cat.value === selectedMainCategory)?.label || 'Products'
                   }
                </Typography>
               
               
             </Box>
             <Box sx={{ 
               display: 'flex', 
               flexDirection: 'column', 
               alignItems: { xs: 'center', sm: 'flex-end' },
               gap: 1
             }}>
                              <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    textAlign: { xs: 'center', sm: 'right' },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                {paginationMeta ? `${paginationMeta.total} product${paginationMeta.total !== 1 ? 's' : ''} found` : `${filteredImages.length} product${filteredImages.length !== 1 ? 's' : ''} found`}
                </Typography>
             </Box>
           </Box>

                     {/* Loading State */}
           {loading && (
             <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6, md: 8 } }}>
               <Typography variant="h5" sx={{ 
                 color: 'text.secondary', 
                 mb: 2,
                 fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
               }}>
                 Loading products...
               </Typography>
             </Box>
           )}

           {/* Error State - Only show for product loading errors, not category errors */}
           {error && (
             <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6, md: 8 } }}>
               <Typography variant="h5" sx={{ 
                 color: 'error.main', 
                 mb: 2,
                 fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
               }}>
                 {error}
               </Typography>
               <Button
                 variant="contained"
                 onClick={() => window.location.reload()}
                 sx={{ 
                   backgroundColor: theme.palette.primary.main,
                   px: { xs: 2, sm: 3, md: 4 },
                   py: { xs: 0.75, sm: 1, md: 1.5 },
                 }}
               >
                 Try Again
               </Button>
             </Box>
           )}

                     {/* Products Grid */}
           {!loading && !error && (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(3, 1fr)', 
                xl: 'repeat(4, 1fr)', 
                xxl: 'repeat(4, 1fr)' 
              },
              gap: { xs: 3, sm: 2, md: 3, lg: 4, xl: 3, xxl: 3 },
              justifyContent: 'center',
              width: '100%',
              '@media (min-width: 1200px) and (max-width: 1535px)': {
                gridTemplateColumns: 'repeat(3, 1fr) !important'
              }
            }}>
            {currentItems.map((item, index) => (
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
                       boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.1)', sm: `0 12px 40px ${theme.palette.primary.main}40` },
                       '& .zoom-icon': {
                         opacity: 1,
                       },
                       '& .card-media': {
                         transform: { xs: 'none', sm: 'scale(1.05)' },
                       },
                     },
                  }}
                  onClick={() => handleImageClick(item, startIndex + index)}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    height: { xs: '220px', sm: '200px', md: '220px', lg: '250px' },
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}>
                    {getFirstValidImage(item) ? (
                      <>
                        <CardMedia
                          component="img"
                          height="250"
                          image={getFirstValidImage(item) as string}
                          alt={item.name}
                          className="card-media"
                          onError={(e: any) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                            const fallback = img.parentElement?.querySelector('.no-image-fallback');
                            if (fallback) {
                              (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                          sx={{
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            objectFit: 'contain',
                            width: '100%',
                            height: { xs: '220px', sm: '200px', md: '220px', lg: '250px' },
                            backgroundColor: '#f5f5f5',
                            padding: { xs: '12px', sm: '8px', md: '6px' },
                          }}
                        />
                        {/* Hidden fallback shown when image fails to load */}
                        <Box
                          className="no-image-fallback"
                          sx={{
                            display: 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                              fontWeight: 'medium',
                              textAlign: 'center',
                            }}
                          >
                            No Image
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                            fontWeight: 'medium',
                            textAlign: 'center',
                          }}
                        >
                          No Image
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Zoom Icon */}
                    <Box
                      className="zoom-icon"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        backgroundColor: `${theme.palette.primary.main}E6`,
                        borderRadius: '50%',
                        p: { xs: 0.5, sm: 1 },
                        color: 'white',
                        display: { xs: 'none', sm: 'flex' },
                      }}
                    >
                      <ZoomIn sx={{ fontSize: { xs: 18, sm: 24 } }} />
                    </Box>

                    {/* Special Product Diagonal Ribbon */}
                    {item.show_on_special_shop && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: { xs: '80px', sm: '90px', md: '100px' },
                          height: { xs: '80px', sm: '90px', md: '100px' },
                          overflow: 'hidden',
                          zIndex: 3,
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: { xs: '15px', sm: '18px', md: '20px' },
                            left: { xs: '-25px', sm: '-28px', md: '-30px' },
                            width: { xs: '100px', sm: '120px', md: '130px' },
                            height: { xs: '25px', sm: '28px', md: '32px' },
                            backgroundColor: 'error.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(-45deg)',
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
                            },
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: '-2px',
                              left: 0,
                              right: 0,
                              height: '2px',
                              background: 'rgba(0,0,0,0.2)',
                            }
                          }}
                        >
                          Special
                        </Box>
                      </Box>
                    )}
                     
                    {/* Price Display */}
                    {(() => {
                      const priceInfo = getPriceDisplay(item);
                      return (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: { xs: 12, sm: 12, md: 16 },
                            right: { xs: 12, sm: 12, md: 16 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 0.5,
                          }}
                        >
                          {/* Discount Badge */}
                          {priceInfo.hasDiscount && (
                            <Chip
                              label={`${priceInfo.discountPercentage}% OFF`}
                              size="small"
                              sx={{
                                backgroundColor: 'error.main',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                                height: { xs: 22, sm: 24, md: 26 },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              }}
                            />
                          )}
                          
                          {/* Price Display */}
                          {priceInfo.hasDiscount ? (
                            // Show both original and discounted price
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 0.25,
                              }}
                            >
                              {/* Original Price with strikethrough */}
                              <Typography
                                sx={{
                                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                  textDecoration: 'line-through',
                                  color: '#616161',
                                  fontWeight: 'medium',
                                  lineHeight: 1.2,
                                }}
                              >
                                ${priceInfo.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </Typography>
                              
                              {/* Discounted Price */}
                              <Typography
                                sx={{
                                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                                  fontWeight: 'bold',
                                  color: 'primary.main',
                                  lineHeight: 1.2,
                                }}
                              >
                                ${priceInfo.displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </Typography>
                            </Box>
                          ) : (
                            // Show only regular price
                            <Chip
                              label={`$${priceInfo.displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                              sx={{
                                backgroundColor: 'primary.main',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                                height: { xs: 28, sm: 32, md: 36 },
                                '& .MuiChip-label': {
                                  px: { xs: 1, sm: 1.5 },
                                },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              }}
                            />
                          )}
                        </Box>
                      );
                    })()}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2, md: 2.5, lg: 3 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'regular',
                        mb: { xs: 1.5, sm: 1 },
                        fontSize: { xs: '0.9rem', sm: '0.8rem', md: '0.875rem' , lg: '1rem' , xl: '1rem'},
                        color: 'text.primary',
                        lineHeight: { xs: 1.3, sm: 1.3 },
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: { xs: '2.8rem', sm: '2.6rem', md: '2.8rem' },
                        minHeight: { xs: '2.8rem', sm: '2.6rem', md: '2.8rem' },
                      }}
                    >
                      {item.name}
                    </Typography>

                                                                                   <Stack 
                        direction="row" 
                        spacing={2}
                        sx={{ width: '100%' }}
                      >
                   
                        
               {/* DETAILS BUTTON: Opens the product modal */}
                         <Button
                           variant="outlined"
                           size="small"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleImageClick(item, startIndex + index);
                           }}
                                                       sx={{
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              flex: 1,
                              height: { xs: '44px', sm: '40px' },
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.1rem', lg: '1.1rem' , xl: '1.1rem'},
                              textOverflow: 'ellipsis',
                              textTransform: 'none',
                              boxShadow: 'none',
                              '& .MuiButton-startIcon': {
                                marginRight: '4px',
                              },
                              '&:hover': {
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                boxShadow: 'none',
                              },
                            }}
                         >
                           Details
                         </Button>
                        
                                                 <Button
                           variant="contained"
                           size="small"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleAddToCart(item);
                           }}
                           disabled={!item.stock || item.stock <= 0}
                                                       sx={{
                              backgroundColor: item.stock && item.stock > 0 ? theme.palette.primary.main : 'grey.400',
                              color: 'white',
                              flex: 1,
                              height: { xs: '44px', sm: '40px' },
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontWeight: 'regular',
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.1rem', lg: '1.1rem' , xl: '1.1rem'},
                             
                              textTransform: 'none',
                              boxShadow: 'none',
                              '& .MuiButton-startIcon': {
                                marginRight: '4px',
                              },
                              '&:hover': {
                                backgroundColor: item.stock && item.stock > 0 ? theme.palette.primary.dark : 'grey.400',
                                boxShadow: 'none',
                              },
                              '&:disabled': {
                                backgroundColor: 'grey.400',
                                color: 'grey.600',
                              },
                            }}
                         >
                           {item.stock && item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                         </Button>
                     </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          )}

                     {!loading && !error && filteredImages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6, md: 8 } }}>
              <Typography variant="h5" sx={{ 
                color: 'text.secondary', 
                mb: 2,
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}>
                                 {selectedMainCategory === 'all' 
                   ? 'No customizable products found'
                   : `No customizable products found for ${apiMainCategories.find(cat => cat.value === selectedMainCategory)?.label?.toLowerCase() || 'this category'}`
                 }
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                mb: 3,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
              }}>
                Try adjusting your filters or browse all products
              </Typography>
              <Button
                variant="contained"
                                 onClick={() => {
                   setSelectedMainCategory('all');
                   setCurrentPage(1);
                 }}
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 0.75, sm: 1, md: 1.5 },
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                View All Products
              </Button>
            </Box>
          )}

          {/* Always show pagination info and controls */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: { xs: 3, sm: 4, md: 5 },
              gap: { xs: 2, sm: 0 }
            }}>
              {/* Pagination Info */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
              {paginationMeta ? `Showing ${startIndex} to ${endIndex} of ${paginationMeta.total} products` : `Showing ${filteredImages.length} product${filteredImages.length !== 1 ? 's' : ''}`}
              </Typography>


            {/* Pagination Controls - Always show */}
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
                     borderColor: theme.palette.primary.main,
                     color: theme.palette.primary.main,
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

                {/* Items Per Page Select Dropdown */}
                <FormControl size="small" sx={{ width: { xs: 80, sm: 100 } }}>
                  <Select
                    value={itemsPerPage.toString()}
                    onChange={(event: any) => {
                      const newItemsPerPage = parseInt(event.target.value, 10);
                      setItemsPerPage(newItemsPerPage);
                      setCurrentPage(1); // Reset to first page when items per page changes
                      // Scroll to top when items per page changes
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      // The useEffect will automatically trigger a new API call with the new items per page
                    }}
                    sx={{
                      height: { xs: 32, sm: 40 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.dark,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      '& .MuiSelect-select': {
                        textAlign: 'center',
                        padding: { xs: '6px 8px', sm: '8px 12px' },
                      },
                    }}
                  >
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                 
                  </Select>
                </FormControl>
                
                                 <Button
                   variant="outlined"
                   size="small"
                   disabled={currentPage === totalPages}
                   onClick={() => handlePageChange({} as any, currentPage + 1)}
                   endIcon={<KeyboardArrowRight />}
                   sx={{
                     borderColor: theme.palette.primary.main,
                     color: theme.palette.primary.main,
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
        </Container>
      </Box>

      {/* Lightbox Dialog - Identical to ShopNow but with "Build Your Own Seat" button visible */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.99)',
            color: 'black',
            margin: { xs: 1, sm: 2, md: 4 },
            maxWidth: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
            maxHeight: { xs: 'calc(100vh - 16px)', sm: 'calc(100vh - 32px)', md: 'calc(100vh - 64px)' },
            height: { xs: 'auto', md: '80vh' },
          },
        }}
      >
         <DialogContent sx={{ p: 0, position: 'relative', height: '100%' }}>
                     <IconButton
             onClick={handleCloseLightbox}
             sx={{
               position: 'absolute',
               top: { xs: 8, sm: 12, md: 16 },
               right: { xs: 8, sm: 12, md: 16 },
               color: 'white',
               backgroundColor: theme.palette.primary.main,
               zIndex: 1,
               boxShadow: `0 4px 12px ${theme.palette.primary.main}4D`,
               width: { xs: 28, sm: 32, md: 40 },
               height: { xs: 28, sm: 32, md: 40 },
               '&:hover': {
                 backgroundColor: theme.palette.primary.dark,
                 boxShadow: `0 6px 20px ${theme.palette.primary.main}66`,
                 transform: 'translateY(-1px)',
               },
               transition: 'all 0.2s ease',
             }}
           >
                         <Close />
          </IconButton>

                                                        {selectedImage && (
                               <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    height: '100%',
                    minHeight: { xs: 'auto', md: '100%' },
                    maxHeight: '100%'
                  }}
                >
                  {/* Top Container - Image (Mobile) / Right Container (Desktop) */}
                  <Box 
                    sx={{ 
                      flex: { xs: 'none', md: '0 0 60%' },
                      position: 'relative',
                      backgroundColor: '#f8f8f8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: { xs: '60vh', md: '100%' },
                      overflow: 'hidden',
                      p: { xs: 1, sm: 2, md: 3 }
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                     {/* Price Display in Modal */}
                     {(() => {
                       const priceInfo = getPriceDisplay(selectedImage);
                       return (
                         <Box
                           sx={{
                             position: 'absolute',
                             top: { xs: 12, sm: 16, md: 20 },
                             right: { xs: 12, sm: 16, md: 20 },
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'flex-end',
                             gap: 0.75,
                             zIndex: 3,
                           }}
                         >
                           {/* Discount Badge */}
                           {priceInfo.hasDiscount && (
                             <Chip
                               label={`${priceInfo.discountPercentage}% OFF`}
                               size="small"
                               sx={{
                                 backgroundColor: 'error.main',
                                 color: 'white',
                                 fontWeight: 'bold',
                                 fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                                 height: { xs: 26, sm: 30, md: 34 },
                                 boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                                 border: '2px solid rgba(255, 255, 255, 0.2)',
                               }}
                             />
                           )}
                           
                           {/* Price Display */}
                           {priceInfo.hasDiscount ? (
                             // Show both original and discounted price
                             <Box
                               sx={{
                                 display: 'flex',
                                 flexDirection: 'column',
                                 alignItems: 'flex-end',
                                 gap: 0.5,
                               }}
                             >
                               {/* Original Price with strikethrough */}
                               <Typography
                                 sx={{
                                   fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                   textDecoration: 'line-through',
                                   color: '#616161',
                                   fontWeight: 'medium',
                                   lineHeight: 1.2,
                                 }}
                               >
                                 ${priceInfo.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                               </Typography>
                               
                               {/* Discounted Price */}
                               <Typography
                                 sx={{
                                   fontSize: { xs: '1.25rem', sm: '1.4rem', md: '1.5rem' },
                                   fontWeight: 'bold',
                                   color: 'primary.main',
                                   lineHeight: 1.2,
                                 }}
                               >
                                 ${priceInfo.displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                               </Typography>
                             </Box>
                           ) : (
                             // Show only regular price
                             <Chip
                               label={`$${priceInfo.displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                               sx={{
                                 backgroundColor: 'primary.main',
                                 color: 'white',
                                 fontWeight: 'bold',
                                 fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                                 height: { xs: 36, sm: 40, md: 44 },
                                 '& .MuiChip-label': {
                                   px: { xs: 1.5, sm: 2, md: 2.5 },
                                 },
                                 boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                                 border: '2px solid rgba(255, 255, 255, 0.2)',
                               }}
                             />
                           )}
                         </Box>
                       );
                     })()}

                    {/* Main Product Image - Same as ShopNow */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { xs: '45vh', md: '100%' }
                      }}
                    >
                      {/* Smart Loading Spinner - Only shows if loading takes > 200ms */}
                      {showLoader && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <CircularProgress 
                            size={60}
                            thickness={4}
                            sx={{
                              color: theme.palette.primary.main,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}
                          >
                            Loading image...
                          </Typography>
                        </Box>
                      )}
                      
                      {(() => {
                        const images = getProductImages(selectedImage);
                        if (images && images.length > 0 && modalImageIndex < images.length) {
                          return (
                            <>
                              <Image
                                src={images[modalImageIndex]}
                                alt={`${selectedImage.name || 'Product'} - Image ${modalImageIndex + 1}`}
                                width={800}
                                height={600}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain',
                                  objectPosition: 'center',
                                  opacity: imageLoading ? 0 : 1,
                                  transition: 'opacity 0.3s ease-in-out',
                                }}
                                priority
                                onLoad={() => {
                                  setImageLoading(false);
                                  setShowLoader(false);
                                  imageLoadingRef.current = false; // Set ref to false when image loads
                                  // Clear any pending loader timers
                                  if ((handleImageClick as any).loaderTimer) {
                                    clearTimeout((handleImageClick as any).loaderTimer);
                                  }
                                  if ((handleNextModalImage as any).loaderTimer) {
                                    clearTimeout((handleNextModalImage as any).loaderTimer);
                                  }
                                  if ((handlePrevModalImage as any).loaderTimer) {
                                    clearTimeout((handlePrevModalImage as any).loaderTimer);
                                  }
                                  if ((setModalImageIndex as any).loaderTimer) {
                                    clearTimeout((setModalImageIndex as any).loaderTimer);
                                  }
                                }}
                                onError={(e: any) => {
                                  setImageLoading(false);
                                  setShowLoader(false);
                                  imageLoadingRef.current = false; // Set ref to false when image fails
                                  // Clear any pending loader timers
                                  if ((handleImageClick as any).loaderTimer) {
                                    clearTimeout((handleImageClick as any).loaderTimer);
                                  }
                                  if ((handleNextModalImage as any).loaderTimer) {
                                    clearTimeout((handleNextModalImage as any).loaderTimer);
                                  }
                                  if ((handlePrevModalImage as any).loaderTimer) {
                                    clearTimeout((handlePrevModalImage as any).loaderTimer);
                                  }
                                  if ((setModalImageIndex as any).loaderTimer) {
                                    clearTimeout((setModalImageIndex as any).loaderTimer);
                                  }
                                  const img = e.target as HTMLImageElement;
                                  img.style.display = 'none';
                                  const fallback = img.parentElement?.querySelector('.modal-no-image-fallback');
                                  if (fallback) {
                                    (fallback as HTMLElement).style.display = 'flex';
                                  }
                                }}
                              />
                              {/* Hidden fallback shown when image fails to load */}
                              <Box
                                className="modal-no-image-fallback"
                                sx={{
                                  display: 'none',
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: '50%',
                                  height: '50%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#f5f5f5',
                                  border: '1px solid #e0e0e0',
                                  borderRadius: 1,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                                    fontWeight: 'medium',
                                    textAlign: 'center',
                                  }}
                                >
                                  No Image
                                </Typography>
                              </Box>
                            </>
                          );
                        } else {
                          return (
                            <Box
                              sx={{
                                width: '50%',
                                height: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                                  fontWeight: 'medium',
                                  textAlign: 'center',
                                }}
                              >
                                No Image
                              </Typography>
                            </Box>
                          );
                        }
                      })()}
                    </Box>
                  
                                     {/* Image Navigation Dots */}
                   <Box sx={{
                     position: 'absolute',
                     bottom: { xs: 20, sm: 30, md: 40 },
                     left: '50%',
                     transform: 'translateX(-50%)',
                     display: 'flex',
                     gap: { xs: 0.75, sm: 1, md: 1.25 },
                     zIndex: 2,
                     padding: { xs: 1, sm: 1.5, md: 2 },
                     backgroundColor: 'rgba(0, 0, 0, 0.3)',
                     borderRadius: '25px',
                     backdropFilter: 'blur(8px)',
                     border: '1px solid rgba(255, 255, 255, 0.2)',
                   }}>
                     {getProductImages(selectedImage).map((image: string, index: number) => (
                       <Box
                         key={index}
                         onClick={() => {
                           if (index !== modalImageIndex) {
                             setImageLoading(true);
                             setShowLoader(false);
                             imageLoadingRef.current = true; // Set ref to true when starting to load
                             setModalImageIndex(index);
                             
                             // Only show loader if image takes more than 200ms to load
                             const loaderTimer = setTimeout(() => {
                               if (imageLoadingRef.current) {
                                 setShowLoader(true);
                               }
                             }, 200);
                             
                             // Store timer reference for cleanup
                             (setModalImageIndex as any).loaderTimer = loaderTimer;
                           }
                         }}
                         sx={{
                           width: { xs: 12, sm: 14, md: 16 },
                           height: { xs: 12, sm: 14, md: 16 },
                           borderRadius: '50%',
                           backgroundColor: index === modalImageIndex ? '#000000' : 'rgba(255, 255, 255, 0.8)',
                           cursor: 'pointer',
                           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                           border: index === modalImageIndex ? '2px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.3)',
                           boxShadow: index === modalImageIndex 
                             ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2)' 
                             : '0 2px 8px rgba(0, 0, 0, 0.2)',
                           '&:hover': {
                             backgroundColor: index === modalImageIndex ? '#000000' : 'rgba(255, 255, 255, 0.95)',
                             transform: 'scale(1.2)',
                             boxShadow: index === modalImageIndex 
                               ? '0 6px 16px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.3)' 
                               : '0 4px 12px rgba(0, 0, 0, 0.3)',
                           },
                           '&:active': {
                             transform: 'scale(0.95)',
                           },
                         }}
                       />
                     ))}
                   </Box>
                  
                  {/* Navigation Arrows */}
                                     <IconButton
                     onClick={handlePrevModalImage}
                     sx={{
                       position: 'absolute',
                       left: { xs: 8, sm: 16, md: 24 },
                       top: '50%',
                       transform: 'translateY(-50%)',
                       color: 'white',
                       backgroundColor: theme.palette.primary.main,
                       boxShadow: `0 4px 12px ${theme.palette.primary.main}4D`,
                       width: { xs: 32, sm: 36, md: 40 },
                       height: { xs: 32, sm: 36, md: 40 },
                       display: { xs: 'flex', sm: 'flex' },
                       '&:hover': {
                         backgroundColor: theme.palette.primary.dark,
                         boxShadow: `0 6px 20px ${theme.palette.primary.main}66`,
                         transform: 'translateY(-50%) scale(1.1)',
                       },
                       transition: 'all 0.2s ease',
                     }}
                   >
                             <ArrowBack />
                  </IconButton>
                  
                                     <IconButton
                     onClick={handleNextModalImage}
                     sx={{
                       position: 'absolute',
                       right: { xs: 8, sm: 16, md: 24 },
                       top: '50%',
                       transform: 'translateY(-50%)',
                       color: 'white',
                       backgroundColor: theme.palette.primary.main,
                       boxShadow: `0 4px 12px ${theme.palette.primary.main}4D`,
                       width: { xs: 32, sm: 36, md: 40 },
                       height: { xs: 32, sm: 36, md: 40 },
                       display: { xs: 'flex', sm: 'flex' },
                       '&:hover': {
                         backgroundColor: theme.palette.primary.dark,
                         boxShadow: `0 6px 20px ${theme.palette.primary.main}66`,
                         transform: 'translateY(-50%) scale(1.1)',
                       },
                       transition: 'all 0.2s ease',
                     }}
                   >
                                           <ArrowForward />
                   </IconButton>

                                       {/* Build Your Own Seat Button - Bottom Right of Image Container (Desktop Only) */}
                                                                 <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            handleCustomize(selectedImage);
                            handleCloseLightbox();
                          }}
                          sx={{
                            position: 'absolute',
                            bottom: { xs: 20, sm: 30, md: 30, lg: 30, xl: 30 },
                            right: { xs: 12, sm: 16, md: 20 },
                            display: { xs: 'none', sm: 'flex' }, // Only show on desktop
                           borderColor: theme.palette.primary.main,
                           color: theme.palette.primary.main,
                           backgroundColor: 'rgba(255, 255, 255, 0.9)',
                           
                           height: { xs: 36, sm: 40, md: 44 },
                           px: { xs: 2, sm: 2.5, md: 3 },
                           py: { xs: 0.5, sm: 0.75, md: 1, lg: 1.5 , xl: 1.5},
                           borderRadius: '10px',
                           backdropFilter: 'blur(10px)',
                           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                           zIndex: 2,
                           '&:hover': {
                             backgroundColor: theme.palette.primary.main,
                             color: 'white',
                             boxShadow: `0 6px 20px ${theme.palette.primary.main}4D`,
                             transform: 'translateY(-2px)',
                           },
                           transition: 'all 0.3s ease',
                         }}
                       >
                         Build Your Own Seat
                       </Button>
                   
                  </Box>

                 {/* Bottom Container - Text Content (Mobile) / Left Container (Desktop) */}
                 <Box
                   sx={{
                     flex: { xs: 'none', md: '0 0 40%' },
                     p: { xs: 1.5, sm: 3, md: 4 },
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     backgroundColor: 'white',
                     borderTop: { xs: '1px solid rgba(0,0,0,0.1)', md: 'none' },
                     borderRight: { xs: 'none', md: '1px solid rgba(0,0,0,0.1)' },
                     minHeight: { xs: 'auto', md: '100%' },
                     overflow: 'auto',
                     maxHeight: { xs: '40vh', md: '100%' }
                   }}
                 >
                  <Typography variant="h5" sx={{ 
                    fontWeight: 'medium', 
                    mb: 2,
                    fontSize: { xs: '0.9rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    color: 'text.primary',
                    lineHeight: 1.3,
                  }}>
                    {selectedImage.name}
                  </Typography>
                  
                  {/* Stock Information */}
                  <Box sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap'
                  }}>
                    <Chip
                      label={
                        selectedImage.stock && selectedImage.stock > 0 
                          ? `In Stock (${selectedImage.stock} available)`
                          : 'Out of Stock'
                      }
                      sx={{
                        backgroundColor: selectedImage.stock && selectedImage.stock > 0 
                          ? 'success.main' 
                          : 'error.main',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                        height: { xs: 24, sm: 28, md: 32 },
                        '& .MuiChip-label': {
                          px: { xs: 1, sm: 1.5 },
                        },
                      }}
                    />
                    {selectedImage.stock && selectedImage.stock > 0 && selectedImage.stock <= 5 && (
                      <Chip
                        label="Low Stock"
                        sx={{
                          backgroundColor: 'warning.main',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                          height: { xs: 24, sm: 28, md: 32 },
                          '& .MuiChip-label': {
                            px: { xs: 1, sm: 1.5 },
                          },
                        }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body1" sx={{ 
                    mb: 3, 
                    fontSize: { xs: '0.75rem', sm: '1rem', md: '1.125rem' , lg: '1.25rem' , xl: '1.25rem'},
                    lineHeight: 1.6,
                    fontWeight: 'regular',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    color: 'text.secondary',
                    flex: 1,
                  }}>
                    {selectedImage.description}
                  </Typography>
                  
                                                                                                                                                   <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        width: '100%',
                        gap: { xs: 2, sm: 0 } // Gap only for mobile
                      }}>
                       {/* BUILD YOUR OWN SEAT BUTTON - Only visible on mobile */}
                                                                       <Button
                          variant="outlined"
                          size="medium"
                          onClick={() => {
                            handleCustomize(selectedImage);
                            handleCloseLightbox();
                          }}
                          sx={{
                            display: { xs: 'flex', sm: 'none' }, // Only show on mobile
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            backgroundColor: 'white',
                            width: '100%',
                            height: { xs: '44px', sm: '40px' },
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                              backgroundColor: theme.palette.primary.main,
                              color: 'white',
                              boxShadow: `0 4px 12px ${theme.palette.primary.main}4D`,
                            },
                          }}
                        >
                          Build Your Own Seat
                        </Button>
                       
                       {/* ADD TO CART BUTTON */}
                                                                       <Button
                          variant="contained"
                          size="medium"
                          onClick={() => {
                            handleAddToCart(selectedImage);
                            handleCloseLightbox();
                          }}
                          disabled={!selectedImage.stock || selectedImage.stock <= 0}
                          sx={{
                            backgroundColor: selectedImage.stock && selectedImage.stock > 0 ? theme.palette.primary.main : 'grey.400',
                            color: 'white',
                            width: '100%',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.1rem', lg: '1.2rem' , xl: '1.2rem'},
                            fontWeight: 'regular',
                            height: { xs: '44px', sm: '40px' },
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                              backgroundColor: selectedImage.stock && selectedImage.stock > 0 ? theme.palette.primary.dark : 'grey.400',
                              boxShadow: 'none',
                            },
                            '&:disabled': {
                              backgroundColor: 'grey.400',
                              color: 'grey.600',
                            },
                          }}
                        >
                          {selectedImage.stock && selectedImage.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                     </Box>
               </Box>
               </Box>
             )}
        </DialogContent>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      <Footer />
    </Box>
  );
};

export default CustomizeYourSeat;

