'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import Breadcrumbs from '@/components/Breadcrumbs';

// NEW IMPORTS: Added to enable communication with CustomizedSeat component
import { useSelectedItem } from '@/contexts/SelectedItemContext'; // Context hook to set selected item data
import { useRouter } from 'next/navigation'; // Next.js router for programmatic navigation
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { RootState } from '@/store/store';
// API IMPORTS
import shopNowApis, { Product, User, PriceTier, Category } from '@/services/ShopNowApis';

const ShopNow = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const pathname = usePathname(); // Get current pathname
  
  // NEW CONTEXT USAGE: Access functions to set selected item and navigate
  const { setSelectedItem } = useSelectedItem(); // Destructure setSelectedItem from context
  const router = useRouter(); // Initialize Next.js router for navigation
  
  // Redux selectors for authentication state
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  // Check if we're on the ShopGallery or Shop Now page
  const isOnShopGalleryPage = pathname === '/ShopGallery' || pathname === '/shop-now';
  
  // Debug: Log environment variables in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
    }
  }, [pathname, isOnShopGalleryPage]);

  // Debug: Monitor for unexpected navigation changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
      } else {
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const [selectedMainCategory, setSelectedMainCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);   // cards per page - server-side pagination
  const [modalImageIndex, setModalImageIndex] = useState(0); // For multiple images in modal
  const [showSpecialOnly, setShowSpecialOnly] = useState(false); // Special products filter
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state

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
  
  // User State
  const [userData, setUserData] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  // Price Tiers State
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [priceTiersLoading, setPriceTiersLoading] = useState(false);

  // Categories State - Now extracted from products
  const [categories, setCategories] = useState<Category[]>([]);

    // Function to fetch price tiers
  const fetchPriceTiers = useCallback(async () => {
    if (!isOnShopGalleryPage) {
      return;
    }

    try {
      setPriceTiersLoading(true);
      
      const response = await shopNowApis.getPriceTiers();
      
      if (response.status === 'success' && response.data) {
        setPriceTiers(response.data);
      } else {
        setPriceTiers([]); // Set empty array as fallback
      }
    } catch (error) {
      setPriceTiers([]); // Set empty array as fallback
      // Don't throw error to prevent breaking the app
    } finally {
      setPriceTiersLoading(false);
    }
  }, [isOnShopGalleryPage]);


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

  // Function to fetch all categories by getting all products first
  const fetchAllCategories = useCallback(async () => {
    if (!isOnShopGalleryPage || categories.length > 0) {
      return; // Skip if not on the right page or categories already loaded
    }

    try {
      const response = await shopNowApis.getProducts({ page: 1, limit: 1000 }); // Get a large number to get all products
      
      if (response.status === 'success' && response.data) {
        const extractedCategories = extractCategoriesFromProducts(response.data);
        setCategories(extractedCategories);
      }
    } catch (error) {
    }
  }, [isOnShopGalleryPage, categories.length, extractCategoriesFromProducts]);

  // Function to fetch products with server-side pagination and filtering
  const fetchProducts = useCallback(async () => {
    if (!isOnShopGalleryPage) {
      return;
    }
    if ((fetchProducts as any).__inFlight) {
      return;
    }
    (fetchProducts as any).__inFlight = true;
    
    // If a specific category is selected but categories are not loaded yet, wait
    if (selectedMainCategory !== 'all' && categories.length === 0) {
      (fetchProducts as any).__inFlight = false;
      return;
    }
    
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
      
      
      // Add userData to API params
      apiParams.userData = userData;
      
      const productsResponse = await shopNowApis.getProducts(apiParams);
      
      // Debug: Log first product's price tiers to see the structure
      if (productsResponse.data && productsResponse.data.length > 0) {
        const firstProduct = productsResponse.data[0];
      }
      
      if (productsResponse.status === 'success' && productsResponse.data) {
        setApiProducts(productsResponse.data);
        
        // Categories are now loaded separately via fetchAllCategories
        
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
  }, [isOnShopGalleryPage, currentPage, itemsPerPage, showSpecialOnly, selectedMainCategory, categories, extractCategoriesFromProducts]);

  // Function to refresh all APIs (price tiers, user data, categories)
  const refreshAllApis = useCallback(async () => {
    // Only refresh APIs if we're on the ShopGallery page
    if (!isOnShopGalleryPage) {
      return;
    }
    if ((refreshAllApis as any).__inFlight) {
      return;
    }
    (refreshAllApis as any).__inFlight = true;
    
    
    // Fetch all categories first
    try {
      await fetchAllCategories();
    } catch (error) {
    }
    
    // Fetch price tiers
    try {
      await fetchPriceTiers();
    } catch (error) {
    }
    
    // Fetch user data if authenticated
    if (isAuthenticated) {
      setUserLoading(true);
      try {
        const userResponse = await shopNowApis.getCurrentUser();
        setUserData(userResponse);
      } catch (userError: any) {
        // Don't redirect on user data fetch failure, just clear user data
        if (userError?.response?.status === 401) {
        }
        setUserData(null);
      } finally {
        setUserLoading(false);
      }
    } else {
      setUserData(null);
      setUserLoading(false);
    }
    (refreshAllApis as any).__inFlight = false;
  }, [isAuthenticated, isOnShopGalleryPage, fetchPriceTiers, fetchAllCategories]);

  // Effect to fetch products when filters or pagination change
  useEffect(() => {
    if (isOnShopGalleryPage) {
      fetchProducts();
    }
  }, [fetchProducts, isOnShopGalleryPage]);

  // Effect to fetch products when categories are loaded and a specific category is selected
  useEffect(() => {
    if (isOnShopGalleryPage && selectedMainCategory !== 'all' && categories.length > 0) {
      fetchProducts();
    }
  }, [categories, selectedMainCategory, isOnShopGalleryPage, fetchProducts]);

  // Effect to refresh APIs when authentication state changes (only if on ShopGallery page)
  useEffect(() => {
    if (isOnShopGalleryPage) {
      refreshAllApis();
    } else {
    }
  }, [isAuthenticated, user, refreshAllApis, isOnShopGalleryPage]);

  // Initial load effect (only if on ShopGallery page)
  useEffect(() => {
    if (isOnShopGalleryPage) {
      refreshAllApis();
    } else {
    }
  }, [isOnShopGalleryPage, refreshAllApis]); // Only depend on page check

  // Check if user is retail customer
  const isRetailCustomer = () => {
    return shopNowApis.isRetailCustomer(userData);
  };

  // Get wholesale discount percentage
  const getWholesaleDiscount = () => {
    return shopNowApis.getWholesaleDiscount(priceTiers, userData);
  };

  // Get display price based on customer type
  const getDisplayPrice = (price: string | number) => {
    return shopNowApis.getDisplayPrice(price, isAuthenticated, userData, priceTiers);
  };

  // Get best price tier for a product
  const getBestPriceTier = (product: Product) => {
    const result = shopNowApis.getBestPriceTierForProduct(product, userData);
    return result;
  };

  // Debug logging for user state
  useEffect(() => {
    if (isOnShopGalleryPage) {
    }
  }, [userData, isAuthenticated, isOnShopGalleryPage, priceTiers]);

  // Use server-side filtered products directly (no client-side filtering needed)
  const filteredImages = apiProducts;
  const currentItems = apiProducts; // All products are already paginated from server

  // Calculate pagination from server metadata
  const totalPages = paginationMeta?.last_page || 1;
  const startIndex = paginationMeta?.from || 1;
  const endIndex = paginationMeta?.to || 0;

     // Debug logging for filtering
   useEffect(() => {
     if (isOnShopGalleryPage) {
       // Log available categories from API
       if (categories && categories.length > 0) {
       }
     }
   }, [selectedMainCategory, showSpecialOnly, apiProducts.length, categories, isOnShopGalleryPage, currentPage, itemsPerPage, paginationMeta]);

     // Generate main categories from extracted categories data
   const apiMainCategories = [
     { value: 'all', label: 'All Products' },
     ...(categories || []) // Add null check for categories
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
  };

  const handleCloseLightbox = () => {
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

  // Touch/swipe functionality for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleNextModalImage = () => {
    if (selectedImage) {
      const productImages = getProductImages(selectedImage);
      const nextIndex = (modalImageIndex + 1) % productImages.length;
      setModalImageIndex(nextIndex);
    }
  };

  const handlePrevModalImage = () => {
    if (selectedImage) {
      const productImages = getProductImages(selectedImage);
      const prevIndex = modalImageIndex === 0 ? productImages.length - 1 : modalImageIndex - 1;
      setModalImageIndex(prevIndex);
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
    const effective = getBestPriceTier(item)?.finalPrice ?? parseFloat(item.price.toString());
    const priceString = Number.isFinite(effective) ? effective.toFixed(2) : parseFloat(item.price.toString()).toFixed(2);
    dispatch(addItem({
      id: item.id,
      title: item.name,
      price: priceString,
      image: getFirstValidImage(item) || '/placeholder-image.jpg',
      description: item.description || '',
      category: typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'seat',
    }));
    handleSnackbarOpen();
  };

  // NEW FUNCTION: Handles item selection and navigation to customization page
  const handleCustomize = (item: Product) => {
    
    // Set only the product ID in the context
    setSelectedItem({ 
      id: item.id
    });
    
    alert('Customize feature coming soon!');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // The useEffect will automatically trigger a new API call with the new page
  };

  // Snackbar handlers
  const handleSnackbarOpen = () => {
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
          title="Shop Now"
          description="Discover our exclusive collection of premium seats with special pricing and unique features"
          height={{
            xs: '75px',
            sm: '70px', 
            md: '80px',
            lg: '95px',
            xl: '105px',
            xxl: '115px'
          }}
        />

      {/* Breadcrumbs */}
      <Breadcrumbs />


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
                     ? 'All Products' 
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
                     
                    {/* Enhanced Price Display with Product-Specific Price Tiers */}
                    {(() => {
                      const priceTierInfo = getBestPriceTier(item);
                      
                      if (priceTierInfo) {
                        // Show price tier pricing for wholesale customers
                        return (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: { xs: 12, sm: 12, md: 16 },
                          right: { xs: 12, sm: 12, md: 16 },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: { xs: 0.5, sm: 0.75 },
                          maxWidth: { xs: '140px', sm: '160px', md: '180px' },
                        }}
                      >
                        {/* Discount Percentage Badge */}
                        <Chip
                              label={`${priceTierInfo.discountPercentage}% OFF`}
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '1rem', lg: '1rem' , xl: '1rem'},
                            height: { xs: 20, sm: 22, md: 24 },
                            '& .MuiChip-label': {
                              px: { xs: 0.75, sm: 1 },
                            },
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          }}
                        />
                        
                        {/* Original Price with Strikethrough */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '1rem' },
                            fontWeight: 'medium',
                            textDecoration: 'line-through',
                            textDecorationColor: 'text.primary',
                            opacity: 0.7,
                          }}
                        >
                              ${priceTierInfo.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                        
                        {/* Discounted Price */}
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'primary.main',
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                            fontWeight: 'bold',
                            lineHeight: 1,
                          }}
                        >
                              ${priceTierInfo.finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                        );
                      } else {
                        // Show regular price for retail customers or products without price tiers
                        return (
                      <Chip
                            label={`$${parseFloat(item.price.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        sx={{
                          position: 'absolute',
                          top: { xs: 12, sm: 12, md: 16 },
                          right: { xs: 12, sm: 12, md: 16 },
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                          height: { xs: 28, sm: 32, md: 36 },
                          maxWidth: { xs: '120px', sm: '150px', md: '180px' },
                          '& .MuiChip-label': {
                            px: { xs: 1, sm: 1.5 },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      />
                        );
                      }
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
                   ? 'No products found'
                   : `No products found for ${apiMainCategories.find(cat => cat.value === selectedMainCategory)?.label?.toLowerCase() || 'this category'}`
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

            {/* Debug Info - Remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                alignItems: { xs: 'center', sm: 'flex-start' },
                width: { xs: '100%', sm: 'auto' },
              }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.disabled',
                    fontSize: '0.7rem',
                    textAlign: { xs: 'center', sm: 'left' },
                  }}
                >
                  Debug: Page {currentPage}/{totalPages} | Items: {itemsPerPage} | Meta: {paginationMeta ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}

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

             {/* Lightbox Dialog */}
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
                     {/* Enhanced Price Display in Modal with Product-Specific Price Tiers */}
                     {(() => {
                       const priceTierInfo = getBestPriceTier(selectedImage);
                       
                       if (priceTierInfo) {
                         // Show price tier pricing for wholesale customers
                         return (
                       <Box
                         sx={{
                           position: 'absolute',
                           top: { xs: 12, sm: 16, md: 20 },
                           right: { xs: 12, sm: 16, md: 20 },
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'flex-end',
                           gap: { xs: 0.75, sm: 1 },
                           maxWidth: { xs: '180px', sm: '220px', md: '260px' },
                           zIndex: 3,
                           backgroundColor: 'rgba(255, 255, 255, 0.95)',
                           padding: { xs: 1, sm: 1.5, md: 2 },
                           borderRadius: '12px',
                           boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                           border: '2px solid rgba(255, 255, 255, 0.2)',
                         }}
                       >
                         {/* Discount Percentage Badge */}
                         <Chip
                               label={`${priceTierInfo.discountPercentage}% OFF`}
                           sx={{
                             backgroundColor: 'primary.main',
                             color: 'white',
                             fontWeight: 'bold',
                             fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.5rem' },
                             height: { xs: 24, sm: 28, md: 32 },
                             '& .MuiChip-label': {
                               px: { xs: 1, sm: 1.5 },
                             },
                             boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                           }}
                         />
                         
                         {/* Original Price with Strikethrough */}
                         <Typography
                           variant="body2"
                           sx={{
                             color: 'text.primary',
                             fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                             fontWeight: 'medium',
                             textDecoration: 'line-through',
                             textDecorationColor: 'text.primary',
                             opacity: 0.7,
                           }}
                         >
                               ${priceTierInfo.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </Typography>
                         
                         {/* Discounted Price */}
                         <Typography
                           variant="h5"
                           sx={{
                             color: 'primary.main',
                             fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.7rem' },
                             fontWeight: 'bold',
                             lineHeight: 1,
                           }}
                         >
                               ${priceTierInfo.finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </Typography>
                       </Box>
                         );
                       } else {
                         // Show regular price for retail customers or products without price tiers
                         return (
                       <Chip
                             label={`$${parseFloat(selectedImage.price.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                         sx={{
                           position: 'absolute',
                           top: { xs: 12, sm: 16, md: 20 },
                           right: { xs: 12, sm: 16, md: 20 },
                           backgroundColor: 'primary.main',
                           color: 'white',
                           fontWeight: 'bold',
                           fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                           height: { xs: 36, sm: 40, md: 44 },
                           maxWidth: { xs: '200px', sm: '250px', md: '300px' },
                           zIndex: 3,
                           '& .MuiChip-label': {
                             px: { xs: 1.5, sm: 2, md: 2.5 },
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             whiteSpace: 'nowrap',
                           },
                           boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                           border: '2px solid rgba(255, 255, 255, 0.2)',
                         }}
                       />
                         );
                       }
                     })()}

                    {/* Main Product Image */}
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
                      {(() => {
                        const images = getProductImages(selectedImage);
                        if (images && images.length > 0 && modalImageIndex < images.length) {
                          return (
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
                              }}
                              priority
                            />
                          );
                        } else {
                          return (
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                              }}
                            >
                              <Typography
                                variant="h5"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
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
                         onClick={() => setModalImageIndex(index)}
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

                                       {/* Customize Button - Bottom Right of Image Container (Desktop Only) */}
                                                                 <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            // TODO: Uncomment when customize page is ready
                            // handleCustomize(selectedImage);
                            // handleCloseLightbox();
                            
                            // Temporary: Show snackbar that feature is coming soon
                            handleSnackbarOpen();
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
                       {/* CUSTOMIZE BUTTON - Only visible on mobile */}
                                                                       <Button
                          variant="outlined"
                          size="medium"
                          onClick={() => {
                            // TODO: Uncomment when customize page is ready
                            // handleCustomize(selectedImage);
                            // handleCloseLightbox();
                            
                            // Temporary: Show snackbar that feature is coming soon
                            handleSnackbarOpen();
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
          Added to cart
        </Alert>
      </Snackbar>
      
      <Footer />
    </Box>
  );
};

export default ShopNow; 