'use client';

/**
 * ShopGallery Component
 * 
 * Features:
 * - Displays products in a responsive grid layout
 * - Supports pagination and filtering
 * - Customer type-based pricing:
 *   - Retail customers: Shows standard pricing
 *   - Wholesale customers: Can be configured for different pricing
 * - User authentication integration
 * - Product customization and cart functionality
 * 
 * Customer Type Pricing Logic:
 * - Checks user authentication via ShopGalleryApi
 * - Fetches user data from /api/user endpoint
 * - Determines customer type (retail/wholesale)
 * - Applies appropriate pricing based on customer type
 * - Shows customer type indicator in UI


 */

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

const ShopGallery = () => {
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
  
  // Check if we're on the ShopGallery, Shop Now, or Specials page
  const isOnShopGalleryPage = pathname === '/ShopGallery' || pathname === '/shop-now' || pathname === '/specials';
  
  const [selectedMainCategory, setSelectedMainCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);   // cards per page
  const [modalImageIndex, setModalImageIndex] = useState(0); // For multiple images in modal

  // API State
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User State
  const [userData, setUserData] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  // Price Tiers State
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [priceTiersLoading, setPriceTiersLoading] = useState(false);

  // Categories State
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

     // Function to fetch categories
   const fetchCategories = useCallback(async () => {
     if (!isOnShopGalleryPage) {
       console.log('🔄 ShopGallery - Not on ShopGallery page, skipping categories fetch');
       return;
     }

     try {
       setCategoriesLoading(true);
       setCategoriesError(null);
       console.log('📂 ShopGallery - Fetching categories...');
       
       const response = await shopNowApis.getCategories();
       
       if (response.status === 'success' && response.data) {
         setCategories(response.data);
         console.log('✅ ShopGallery - Categories loaded:', response.data);
       } else {
         // Don't set error, just log it and continue without categories
         console.warn('⚠️ ShopGallery - Categories API returned non-success status:', response);
         setCategories([]); // Set empty array to prevent errors
       }
     } catch (error) {
       // Don't set error, just log it and continue without categories
       console.warn('⚠️ ShopGallery - Error fetching categories, continuing without categories:', error);
       setCategories([]); // Set empty array to prevent errors
     } finally {
       setCategoriesLoading(false);
     }
   }, [isOnShopGalleryPage]);

    // Function to fetch price tiers
  const fetchPriceTiers = useCallback(async () => {
    if (!isOnShopGalleryPage) {
      console.log('🔄 ShopGallery - Not on ShopGallery page, skipping price tiers fetch');
      return;
    }

    try {
      setPriceTiersLoading(true);
      console.log('💰 ShopGallery - Fetching price tiers...');
      
      const response = await shopNowApis.getPriceTiers();
      
      if (response.status === 'success' && response.data) {
        setPriceTiers(response.data);
        console.log('✅ ShopGallery - Price tiers loaded:', response.data);
      } else {
        console.warn('⚠️ ShopGallery - Price tiers API returned non-success status:', response);
        setPriceTiers([]); // Set empty array as fallback
      }
    } catch (error) {
      console.warn('⚠️ ShopGallery - Error fetching price tiers, using fallback:', error);
      setPriceTiers([]); // Set empty array as fallback
      // Don't throw error to prevent breaking the app
    } finally {
      setPriceTiersLoading(false);
    }
  }, [isOnShopGalleryPage]);

  // Function to refresh all APIs
  const refreshAllApis = useCallback(async () => {
    // Only refresh APIs if we're on the ShopGallery page
    if (!isOnShopGalleryPage) {
      console.log('🔄 ShopGallery - Not on ShopGallery page, skipping API refresh');
      return;
    }
    
    console.log('🔄 ShopGallery - Refreshing all APIs...');
    
    setLoading(true);
    setError(null);
    
    // Fetch products
    console.log('🚀 ShopGallery - Fetching products from API...');
    try {
      const productsResponse = await shopNowApis.getProducts();
      console.log('✅ ShopGallery - Products API Response:', productsResponse);
      
      if (productsResponse.status === 'success' && productsResponse.data) {
        setApiProducts(productsResponse.data);
        console.log('📦 Products loaded:', productsResponse.data.length);
      } else {
        console.warn('⚠️ ShopGallery - Products API returned non-success status:', productsResponse);
        setApiProducts([]); // Set empty array as fallback
      }
    } catch (error) {
      console.warn('⚠️ ShopGallery - Error fetching products, using fallback:', error);
      setApiProducts([]); // Set empty array as fallback
      setError('Failed to load products');
    }
    
    // Fetch categories only (price tiers endpoint might not exist)
    try {
      await fetchCategories();
    } catch (error) {
      console.warn('⚠️ ShopGallery - Categories API call failed:', error);
    }
    
    // Skip price tiers for now since the endpoint might not exist
    // TODO: Re-enable when price tiers endpoint is available
    console.log('💰 ShopGallery - Skipping price tiers fetch (endpoint not available)');
    setPriceTiers([]); // Set empty array as fallback
    
    // Fetch user data if authenticated
    if (isAuthenticated) {
      console.log('✅ User is authenticated, fetching user data...');
      setUserLoading(true);
      try {
        const userResponse = await shopNowApis.getCurrentUser();
        console.log('👤 User data fetched:', userResponse);
        setUserData(userResponse);
      } catch (userError) {
        console.warn('⚠️ ShopGallery - Error fetching user data:', userError);
        setUserData(null);
      } finally {
        setUserLoading(false);
      }
    } else {
      console.log('❌ User is not authenticated, clearing user data');
      setUserData(null);
      setUserLoading(false);
    }
    
    setLoading(false);
  }, [isAuthenticated, isOnShopGalleryPage, fetchCategories]);

  // Effect to refresh APIs when authentication state changes (only if on ShopGallery page)
  useEffect(() => {
    if (isOnShopGalleryPage) {
      console.log('🔄 ShopGallery - Authentication state changed:', { isAuthenticated, user });
      refreshAllApis();
    } else {
      console.log('🔄 ShopGallery - Authentication state changed but not on ShopGallery page, skipping refresh');
    }
  }, [isAuthenticated, user, refreshAllApis, isOnShopGalleryPage]);

  // Initial load effect (only if on ShopGallery page)
  useEffect(() => {
    if (isOnShopGalleryPage) {
      console.log('🚀 ShopGallery - Initial load on ShopGallery page');
      refreshAllApis();
    } else {
      console.log('🚀 ShopGallery - Initial load but not on ShopGallery page, skipping');
    }
  }, [isOnShopGalleryPage]); // Only depend on page check

  // Check if user is retail customer
  const isRetailCustomer = () => {
    return shopNowApis.isRetailCustomer(userData);
  };

  // Get wholesale discount percentage
  const getWholesaleDiscount = () => {
    return shopNowApis.getWholesaleDiscount(priceTiers);
  };

  // Get display price based on customer type
  const getDisplayPrice = (price: string | number) => {
    return shopNowApis.getDisplayPrice(price, isAuthenticated, userData, priceTiers);
  };

  // Debug logging for user state
  useEffect(() => {
    if (isOnShopGalleryPage) {
      console.log('🔄 ShopGallery - User state updated:', {
        userData,
        isRetail: isRetailCustomer(),
                 isAuthenticated: shopNowApis.isAuthenticated(),
        reduxIsAuthenticated: isAuthenticated,
        currentPage: isOnShopGalleryPage,
        priceTiers: priceTiers
      });
    }
  }, [userData, isAuthenticated, isOnShopGalleryPage, priceTiers]);

       // Filter products based on selected categories (using API data)
   const filteredImages = apiProducts.filter(item => {
     // If "All Products" is selected, show everything
     if (selectedMainCategory === 'all') {
       return true;
     }
     
     // If no categories loaded, show all products
     if (!categories || categories.length === 0) {
       return true;
     }
     
     // Check if product's category matches the selected main category
     const productCategory = item.category;
     if (!productCategory) {
       return false;
     }
     
     // Get category name safely
     const categoryName = typeof productCategory === 'string' 
       ? productCategory 
       : (productCategory as any)?.name || '';
     
     // Find the selected category from API data
     const selectedCategory = categories.find(cat => cat && cat.slug === selectedMainCategory);
     if (!selectedCategory) {
       return false;
     }
     
     // Check if product's category matches the selected category
     const matchesMainCategory = categoryName.toLowerCase().includes(selectedCategory.name.toLowerCase()) ||
                                categoryName.toLowerCase().includes(selectedCategory.slug.toLowerCase());
     
     // If main category doesn't match, exclude the product
     if (!matchesMainCategory) {
       return false;
     }
     
     // For now, show all products in the selected category (sub-category filtering can be added later)
     return true;
   });

  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredImages.slice(startIndex, endIndex);

     // Debug logging for filtering
   useEffect(() => {
     if (isOnShopGalleryPage) {
       console.log('🔍 ShopGallery - Filtering Debug:', {
         selectedMainCategory,
         selectedSubCategory,
         totalProducts: apiProducts.length,
         filteredProducts: filteredImages.length,
         
         categoriesLoaded: categories?.length || 0,
         currentPage,
         itemsPerPage
       });
       
       // Log available categories from API
       if (categories && categories.length > 0) {
         console.log('📂 ShopGallery - Available categories from API:', categories.map(cat => ({
           id: cat.id,
           name: cat.name,
           slug: cat.slug,
           is_active: cat.is_active
         })));
       }
     }
   }, [selectedMainCategory, selectedSubCategory, apiProducts.length, filteredImages.length, categories, isOnShopGalleryPage, currentPage, itemsPerPage]);

     // Generate main categories from API data
   const apiMainCategories = [
     { value: 'all', label: 'All Products' },
     ...(categories || []) // Add null check for categories
       .filter(cat => cat && cat.is_active && cat.products_count > 0) // Only show active categories with products
       .sort((a, b) => a.sort_order - b.sort_order) // Sort by sort_order
       .map(cat => ({
         value: cat.slug,
         label: `${cat.name} (${cat.products_count})`
       }))
   ];



  const handleMainCategoryChange = (event: any) => {
    const newMainCategory = event.target.value;
    setSelectedMainCategory(newMainCategory);
    
    // Reset sub-category to 'all' when main category changes
    setSelectedSubCategory('all');
    setCurrentPage(1); // Reset to first page
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
    dispatch(addItem({
      id: item.id,
      title: item.name,
      price: item.price.toString(),
      image: getProductImages(item)[0] || '/placeholder-image.jpg',
      description: item.description || '',
      category: typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'seat',
    }));
  };

  // NEW FUNCTION: Handles item selection and navigation to customization page
  const handleCustomize = (item: Product) => {
    // Prepare images array with full URLs using the getProductImages function
    const imagesArray = getProductImages(item);
    
    setSelectedItem({ // FUNCTION: Set the selected item in global context
      id: item.id,
      title: item.name,
      category: typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'seat',
      subCategory: typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'seat',
      mainCategory: 'seats',
      image: imagesArray.length > 0 ? imagesArray[0] : '/placeholder-image.jpg',
      images: imagesArray, // ADDED: Pass the full images array
      description: item.description || '',
      price: item.price.toString(),
    });
    router.push('/customize-your-seat'); // FUNCTION: Navigate to customization page
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                 flex: { xs: 'none', sm: '0 0 auto' }
               }}
               size="small"
             >
               <InputLabel id="main-category-label">Main Category</InputLabel>
                               <Select
                  labelId="main-category-label"
                  value={selectedMainCategory}
                  label="Main Category"
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

             

      {/* Clear Filters Button */}
               {selectedMainCategory !== 'all' && (
                 <Button
                   variant="outlined"
                   size="small"
                   onClick={() => {
                     setSelectedMainCategory('all');
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
                  {filteredImages.length} product{filteredImages.length !== 1 ? 's' : ''} found
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
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: { xs: 3, sm: 2, md: 3, lg: 4 },
              justifyContent: 'center',
              width: '100%'
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
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={getProductImages(item)[0] || '/placeholder-image.jpg'}
                      alt={item.name}
                      className="card-media"
                      sx={{
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        objectFit: 'contain',
                        width: '100%',
                        height: { xs: '220px', sm: '200px', md: '220px', lg: '250px' },
                        fontWeight: 'regular',
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.1rem', lg: '1.1rem' , xl: '1.1rem'},

                        backgroundColor: '#f5f5f5',
                        padding: { xs: '12px', sm: '8px', md: '6px' },
                      }}
                    />
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
                     {/* Wholesale Price Display */}
                     {isAuthenticated && !isRetailCustomer() && (
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
                         <Chip
                           label={`${getWholesaleDiscount()}% OFF`}
                           sx={{
                             backgroundColor: 'success.main',
                             color: 'white',
                             fontWeight: 'bold',
                             fontSize: { xs: '0.65rem', sm: '0.6rem', md: '0.7rem' },
                             height: { xs: 20, sm: 18, md: 20 },
                             '& .MuiChip-label': {
                               px: { xs: 0.75, sm: 0.75 },
                             },
                           }}
                         />
                         {/* Original Price (Crossed Out) */}
                         <Typography
                           variant="caption"
                           sx={{
                             color: 'text.secondary',
                             textDecoration: 'line-through',
                             fontSize: { xs: '0.7rem', sm: '0.65rem', md: '0.75rem' },
                             fontWeight: 400,
                           }}
                         >
                           ${parseFloat(item.price.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </Typography>
                         {/* Final Price */}
                         <Typography
                           variant="caption"
                           sx={{
                             color: 'success.main',
                             fontWeight: 'bold',
                             fontSize: { xs: '0.8rem', sm: '0.75rem', md: '0.875rem' },
                           }}
                         >
                           ${getDisplayPrice(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </Typography>
                       </Box>
                     )}
                     
                     {/* Regular Price Display (for non-wholesale) */}
                     {(!isAuthenticated || isRetailCustomer()) && (
                       <Chip
                         label={`$${getDisplayPrice(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                         sx={{
                           position: 'absolute',
                           top: { xs: 12, sm: 12, md: 16 },
                           right: { xs: 12, sm: 12, md: 16 },
                           backgroundColor: 'primary.main',
                           color: 'white',
                           fontWeight: 'bold',
                           fontSize: { xs: '0.8rem', sm: '0.75rem', md: '0.875rem' },
                           height: { xs: 28, sm: 24, md: 28, lg: 32 },
                           '& .MuiChip-label': {
                             px: { xs: 1.5, sm: 1.5 },
                           },
                         }}
                       />
                     )}
                     
                     {/* Stock Status Chip */}
                     <Chip
                       label={
                         item.stock && item.stock > 0 
                           ? (item.stock <= 5 ? 'Low Stock' : 'In Stock')
                           : 'Out of Stock'
                       }
                       sx={{
                         position: 'absolute',
                         top: { xs: 12, sm: 12, md: 16 },
                         left: { xs: 12, sm: 12, md: 16 },
                         backgroundColor: item.stock && item.stock > 0 
                           ? (item.stock <= 5 ? 'warning.main' : 'success.main')
                           : 'error.main',
                         color: 'white',
                         fontWeight: 'bold',
                         fontSize: { xs: '0.7rem', sm: '0.65rem', md: '0.75rem' },
                         height: { xs: 24, sm: 20, md: 24, lg: 28 },
                         '& .MuiChip-label': {
                           px: { xs: 1, sm: 1 },
                         },
                       }}
                     />
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
                   
                        
               {/* CUSTOMIZE BUTTON: New button to navigate to customize page */}
                         <Button
                           variant="outlined"
                           size="small"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleCustomize(item); // FUNCTION: Navigate to customize page with item details
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

          {totalPages > 1 && (
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredImages.length)} of {filteredImages.length} products
              </Typography>

              {/* Pagination Controls */}
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
                     {/* Wholesale Price Display in Modal */}
                     {isAuthenticated && !isRetailCustomer() && (
                       <Box
                         sx={{
                           position: 'absolute',
                           top: { xs: 12, sm: 16, md: 20 },
                           left: { xs: 12, sm: 'auto' },
                           right: { xs: 'auto', sm: 16, md: 20 },
                           zIndex: 3,
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'flex-end',
                           gap: 0.5,
                         }}
                       >
                         {/* Discount Badge */}
                         <Chip
                           label={`${getWholesaleDiscount()}% OFF`}
                           sx={{
                             backgroundColor: 'success.main',
                             color: 'white',
                             fontWeight: 'bold',
                             fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                             height: { xs: 24, sm: 28, md: 32 },
                             '& .MuiChip-label': {
                               px: { xs: 1, sm: 1.5 },
                             },
                             boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                             border: '2px solid rgba(255, 255, 255, 0.2)',
                           }}
                         />
                         {/* Original Price (Crossed Out) */}
                         <Box
                           sx={{
                             backgroundColor: 'rgba(0, 0, 0, 0.7)',
                             color: 'text.secondary',
                             px: { xs: 1.5, sm: 2, md: 2.5 },
                             py: { xs: 0.5, sm: 0.75, md: 1 },
                             borderRadius: '15px',
                             backdropFilter: 'blur(8px)',
                             border: '1px solid rgba(255, 255, 255, 0.2)',
                           }}
                         >
                           <Typography
                             variant="caption"
                             sx={{
                               color: 'text.secondary',
                               textDecoration: 'line-through',
                               fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                               fontWeight: 400,
                             }}
                           >
                             ${parseFloat(selectedImage.price.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </Typography>
                         </Box>
                         {/* Final Price */}
                         <Box
                           sx={{
                             backgroundColor: 'success.main',
                             color: 'white',
                             px: { xs: 2, sm: 2.5, md: 3 },
                             py: { xs: 0.5, sm: 0.75, md: 1 },
                             boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                             border: '2px solid rgba(255, 255, 255, 0.2)',
                           }}
                         >
                           <Typography
                             component="span"
                             sx={{
                               fontWeight: 'bold',
                               fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                               color: 'white',
                               textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                             }}
                           >
                             ${getDisplayPrice(selectedImage.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </Typography>
                         </Box>
                       </Box>
                     )}
                     
                     {/* Regular Price Display in Modal (for non-wholesale) */}
                     {(!isAuthenticated || isRetailCustomer()) && (
                                                <Box
                           sx={{
                             position: 'absolute',
                             top: { xs: 12, sm: 16, md: 20 },
                             left: { xs: 12, sm: 'auto' },
                             right: { xs: 'auto', sm: 16, md: 20 },
                             backgroundColor: theme.palette.primary.main,
                             color: 'white',
                             fontWeight: 'bold',
                             fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                             height: { xs: 32, sm: 36, md: 40 },
                             zIndex: 3,
                             px: { xs: 2, sm: 2.5, md: 3 },
                             py: { xs: 0.5, sm: 0.75, md: 1 },
                             borderRadius: '20px',
                             display: 'flex',
                             alignItems: 'center',
                             gap: { xs: 0.5, sm: 0.75 },
                             boxShadow: `0 4px 12px ${theme.palette.primary.main}66`,
                             border: '2px solid rgba(255, 255, 255, 0.2)',
                             '&::before': {
                               content: '""',
                               position: 'absolute',
                               top: '50%',
                               left: { xs: '-8px', sm: 'auto' },
                               right: { xs: 'auto', sm: '-8px' },
                               transform: 'translateY(-50%)',
                               width: 0,
                               height: 0,
                               borderTop: '8px solid transparent',
                               borderBottom: '8px solid transparent',
                               borderLeft: { xs: '8px solid', sm: 'none' },
                               borderRight: { xs: 'none', sm: '8px solid' },
                               borderLeftColor: { xs: theme.palette.primary.main, sm: 'transparent' },
                               borderRightColor: { xs: 'transparent', sm: theme.palette.primary.main },
                             },
                             '&::after': {
                               content: '""',
                               position: 'absolute',
                               top: '50%',
                               left: { xs: '-6px', sm: 'auto' },
                               right: { xs: 'auto', sm: '-6px' },
                               transform: 'translateY(-50%)',
                               width: '4px',
                               height: '4px',
                               borderRadius: '50%',
                               backgroundColor: 'rgba(255, 255, 255, 0.3)',
                             }
                           }}
                         >
                         <Typography
                           component="span"
                           sx={{
                             fontWeight: 'bold',
                             fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                             color: 'white',
                             textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                           }}
                         >
                           ${getDisplayPrice(selectedImage.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </Typography>
                       </Box>
                     )}

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
                      <Image
                        src={(() => {
                          const images = getProductImages(selectedImage);
                          if (images && images.length > 0 && modalImageIndex < images.length) {
                            return images[modalImageIndex];
                          }
                          return '/placeholder-image.jpg';
                        })()}
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
                         Start Customizing
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
                          Start Customizing Now
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
      
      <Footer />
    </Box>
  );
};

export default ShopGallery; 