'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Grid } from '@mui/material'; 
import { testimonials } from '@/data/testimonials';
import Header from '@/components/Header';
// VEHICLE DATA: Keep static vehicle data as requested
import { vehicleMakes } from '@/data/CustomizedSeat';
// Removed API imports and interfaces - keeping fields static
// NEW IMPORTS: Added to enable communication between ShopGallery and CustomizedSeat components
import { useSelectedItem, ProductVariations, VariationOption } from '@/contexts/SelectedItemContext'; // Context hook to access selected item data
import { useRouter } from 'next/navigation'; // Next.js router for programmatic navigation
// NEW IMPORT: Added to enable cart functionality
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
// NEW IMPORT: Added to fetch product data via API
import { CustomizedSeatApi, Product } from '@/services/CustomizedSeatApi';
import HeroSectionCommon from './common/HeroSectionaCommon';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
// CSS Module import
import styles from './CustomizedSeat.module.css';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import { 
  Chair, 
  Settings, 
  Palette,
  Star,
  ArrowForward,
  ShoppingCart,
  Favorite,
  ZoomIn,
  CheckCircle,
  LocalShipping,
  Security,
  Support
} from '@mui/icons-material';
interface CustomizeYourSeatProps {
  showHeader?: boolean;
  showHero?: boolean;
  showPricing?: boolean;
  showAbout?: boolean;
  showTestimonials?: boolean;
}

const CustomizedSeat: React.FC<CustomizeYourSeatProps> = ({
  showHeader = true,
  showHero = true,
  showPricing = false,
  showAbout = true,
  showTestimonials = true
}) => {
  // console.log('🔄 CustomizedSeat - Component rendered');
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  

  const { selectedItem, setSelectedItem, clearSelectedItem } = useSelectedItem(); // Destructure selectedItem, setSelectedItem, and clearSelectedItem from context
  const router = useRouter(); 

  const dispatch = useDispatch(); 

  // State for product data fetched from API
  const [productData, setProductData] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  // State for customization options
  const [selectedTexture, setSelectedTexture] = useState('none'); 
  const [selectedColor, setSelectedColor] = useState('none'); 
  const [selectedStitching, setSelectedStitching] = useState('none');
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Variation data state
  const [variations, setVariations] = useState<ProductVariations | null>(null);

  // Check for product ID in local storage on component mount (runs only once)
  useEffect(() => {
    const savedProductId = localStorage.getItem('selectedProductId');
    // console.log('🔄 CustomizedSeat - Component mounted, checking localStorage:', savedProductId);
    
    if (savedProductId) {
      const productId = parseInt(savedProductId);
      // console.log('🔄 CustomizedSeat - Found saved product ID in localStorage:', productId);
      // console.log('🔄 CustomizedSeat - Setting product ID from localStorage:', productId);
      setSelectedItem({ id: productId });
    } else {
      // console.log('🔄 CustomizedSeat - No saved product ID found in localStorage');
    }
  }, []); // Empty dependency array - runs only once on mount

  // Cleanup function to clear localStorage when component unmounts (optional)
  useEffect(() => {
    return () => {
      // Optional: Clear localStorage when leaving the page
      // Uncomment the line below if you want to clear localStorage when leaving the customize page
      // localStorage.removeItem('selectedProductId');
    };
  }, []);

  // Fetch product data when selectedItem ID changes
  useEffect(() => {
    // console.log('🔄 CustomizedSeat - useEffect triggered, selectedItem:', selectedItem);
    
    const fetchProductData = async () => {
      if (selectedItem && selectedItem.id) {
        try {
          setProductLoading(true);
          setProductError(null);
          console.log('🔄 CustomizedSeat - Fetching product data for ID:', selectedItem.id);
          
          // Save the product ID to localStorage
          localStorage.setItem('selectedProductId', selectedItem.id.toString());
          console.log('💾 CustomizedSeat - Saved product ID to localStorage:', selectedItem.id);
          
          const product = await CustomizedSeatApi.getProductById(selectedItem.id);
          setProductData(product);
          
          // Debug: Log the images data from API
          console.log('🖼️ CustomizedSeat - Product images from API:', {
            totalImages: product.product_images?.length || 0,
            product_images: product.product_images,
            primaryImage: product.primary_image,
            currentImageIndex: 0,
            fullProduct: product
          });
          
          // Reset image index when new product loads
          setCurrentImageIndex(0);
          
          // Use actual API variation data directly (cast to match context interface)
          const processedVariations = {
            vehicle_trim: product.vehicle_trim ? [{
              id: product.vehicle_trim.id,
              name: product.vehicle_trim.name,
              price: 0,
              is_active: product.vehicle_trim.is_active
            }] : [],
            colors: (product.colors || []) as any[],
            material_types: (product.material_types || []) as any[],
            heat_options: (product.heat_options || []) as any[],
            lumbar_types: (product.lumbar_types || []) as any[],
            recline_types: (product.recline_types || []) as any[],
            seat_stitch_patterns: (product.seat_stitch_patterns || []) as any[],
            arm_types: (product.arm_types || []) as any[],
            seat_types: (product.seat_types || []) as any[],
            seat_styles: (product.seat_styles || []) as any[],
            item_types: (product.item_types || []) as any[]
          };
          
          setVariations(processedVariations);
          console.log('✅ CustomizedSeat - Product data and variations loaded successfully');
        } catch (error) {
          console.error('❌ CustomizedSeat - Error fetching product data:', error);
          setProductError('Failed to load product details');
        } finally {
          setProductLoading(false);
        }
      } else {
        console.log('🔄 CustomizedSeat - No selected item ID available');
        setProductData(null);
        setVariations(null);
      }
    };

    fetchProductData();
  }, [selectedItem]);
  
  // State for vehicle information
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  
  // State for variation options
  const [selectedRecline, setSelectedRecline] = useState('');
  const [selectedLumber, setSelectedLumber] = useState('');
  const [selectedHeatingCooling, setSelectedHeatingCooling] = useState('');
  
  // State for seat options
  const [selectedSeatType, setSelectedSeatType] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');
  const [selectedSeatStyle, setSelectedSeatStyle] = useState('');
  const [selectedMaterialType, setSelectedMaterialType] = useState('');
  const [selectedIncludedArm, setSelectedIncludedArm] = useState('');
  


  // Helper function to get price from API response
  const getPriceFromItem = (item: any): number => {
    if (!item) return 0;
    
    // Use direct price field from API response (handle both string and number formats)
    if (item.price !== undefined && item.price !== null) {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price);
      return isNaN(price) ? 0 : price;
    }
    
    // Fallback to price_tiers if direct price is not available
    if (item.price_tiers && item.price_tiers.length > 0) {
      // Look for retail_price tier first, then any tier with pivot data
      const retailTier = item.price_tiers.find((tier: any) => tier.name === 'retail_price');
      if (retailTier?.pivot?.price_adjustment) {
        const price = parseFloat(retailTier.pivot.price_adjustment);
        return isNaN(price) ? 0 : price;
      }
      
      // Fallback to any tier with pivot data
      const tierWithPivot = item.price_tiers.find((tier: any) => tier.pivot?.price_adjustment);
      if (tierWithPivot?.pivot?.price_adjustment) {
        const price = parseFloat(tierWithPivot.pivot.price_adjustment);
        return isNaN(price) ? 0 : price;
      }
    }
    
    return 0;
  };

  const calculateTotalPrice = () => {
    // Get base seat price from product data (handle different price formats)
    let baseSeatPrice = 0;
    if (productData?.price) {
      const priceStr = productData.price.toString().replace(/[$,]/g, '');
      baseSeatPrice = parseFloat(priceStr) || 0;
    }
    
    // Get prices from API variation data using direct price field
    const materialPrice = selectedTexture !== 'none' ? 
      getPriceFromItem(variations?.material_types?.find((m: any) => m.id.toString() === selectedTexture)) : 0;
    
    const colorPrice = selectedColor !== 'none' ? 
      getPriceFromItem(variations?.colors?.find((c: any) => c.id.toString() === selectedColor)) : 0;
    
    const stitchingPrice = selectedStitching !== 'none' ? 
      getPriceFromItem(variations?.seat_stitch_patterns?.find((s: any) => s.id.toString() === selectedStitching)) : 0;
    
    // Get variation prices from API data
    const reclinePrice = selectedRecline ? 
      getPriceFromItem(variations?.recline_types?.find((r: any) => r.id.toString() === selectedRecline)) : 0;
    
    const lumberPrice = selectedLumber ? 
      getPriceFromItem(variations?.lumbar_types?.find((l: any) => l.id.toString() === selectedLumber)) : 0;
    
    const heatingCoolingPrice = selectedHeatingCooling ? 
      getPriceFromItem(variations?.heat_options?.find((h: any) => h.id.toString() === selectedHeatingCooling)) : 0;
    
    // Get seat prices from API data
    const seatTypePrice = selectedSeatType ? 
      getPriceFromItem(variations?.seat_types?.find((s: any) => s.id.toString() === selectedSeatType)) : 0;
    
    const itemTypePrice = selectedItemType ? 
      getPriceFromItem(variations?.item_types?.find((i: any) => i.id.toString() === selectedItemType)) : 0;
    
    const seatStylePrice = selectedSeatStyle ? 
      getPriceFromItem(variations?.seat_styles?.find((s: any) => s.id.toString() === selectedSeatStyle)) : 0;
    
    const materialTypePrice = selectedMaterialType ? 
      getPriceFromItem(variations?.material_types?.find((m: any) => m.id.toString() === selectedMaterialType)) : 0;
    
    const includedArmPrice = selectedIncludedArm ? 
      getPriceFromItem(variations?.arm_types?.find((a: any) => a.id.toString() === selectedIncludedArm)) : 0;
    
    // Calculate total
    const total = baseSeatPrice + materialPrice + colorPrice + stitchingPrice + reclinePrice + lumberPrice + heatingCoolingPrice + seatTypePrice + itemTypePrice + seatStylePrice + materialTypePrice + includedArmPrice;
    
    // Debug logging to help troubleshoot price calculation
    console.log('💰 Price Calculation Debug:', {
      baseSeatPrice,
      materialPrice,
      colorPrice,
      stitchingPrice,
      reclinePrice,
      lumberPrice,
      heatingCoolingPrice,
      seatTypePrice,
      itemTypePrice,
      seatStylePrice,
      materialTypePrice,
      includedArmPrice,
      total
    });
    
    return total;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <Box className={styles.mainContainer}>
      {showHeader && <Header />}
      
            {showHero && (
        /* Hero Section */
        <HeroSectionCommon
         title="Customize Your Seat"
         description="Design your perfect seat with our interactive 3D configurator"
         height={{
          xs: '75px',
          sm: '70px', 
          md: '80px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
          }}
          />
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: 'Customize Your Seat' }
        ]}
      />

      {/* Main Configuration Section */}
      <Container maxWidth="xl" className={styles.configContainer}>
        <Box className={styles.gridContainer}>
          {/* Left Column - 3D Viewer */}
          <Box className={styles.leftColumn}>
                         <Card className={styles.viewerCard}>
              <Box className={styles.viewerBackground}>
                {/* MODIFIED IMAGE DISPLAY AREA: Now conditionally renders product image or placeholder */}
                <Box className={styles.imageDisplayArea}>
                  {productData ? ( // CONDITIONAL RENDERING: Show product image if available
                    <>
                      {/* MAIN PRODUCT IMAGE */}
                      <Image
                        src={(() => {
                          // Get all available images from the API response
                          const allImages = productData.product_images || [];
                          const primaryImage = productData.primary_image;
                          
                          // console.log('🔍 CustomizedSeat - Image selection debug:', {
                          //   allImages,
                          //   primaryImage,
                          //   currentImageIndex,
                          //   selectedImage: allImages[currentImageIndex]
                          // });
                          
                          // Get the image URL from the current image
                          let selectedImageUrl = null;
                          
                          if (allImages.length > 0 && allImages[currentImageIndex]) {
                            const currentImg = allImages[currentImageIndex];
                            selectedImageUrl = currentImg.image_url;
                          }
                          
                          if (!selectedImageUrl && primaryImage) {
                            selectedImageUrl = primaryImage.image_url;
                          }
                          
                          const finalImage = selectedImageUrl || 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image+Available';
                          // console.log(`🖼️ CustomizedSeat - Final image URL:`, finalImage);
                          return finalImage;
                        })()}
                        alt={productData.name}
                        fill
                        style={{ 
                          objectFit: 'contain',
                          padding: '20px'
                        }}
                      />
                      

                      {/* IMAGE NAVIGATION CONTROLS - Show if product has any images */}
                      {(productData.product_images && productData.product_images.length > 0) && (
                        <>
                          {/* LEFT ARROW */}
                          <IconButton
                            onClick={() => setCurrentImageIndex(prev => 
                              prev === 0 ? (productData.product_images?.length || 1) - 1 : prev - 1
                            )}
                            sx={{
                              position: 'absolute',
                              left: { xs: 8, sm: 12, md: 16 },
                              top: '50%',
                              transform: 'translateY(-50%)',
                              bgcolor: 'rgba(255,255,255,0.9)',
                              color: 'text.primary',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,1)',
                                transform: 'translateY(-50%) scale(1.1)',
                              },
                              zIndex: 3,
                              width: { xs: 32, sm: 40 },
                              height: { xs: 32, sm: 40 }
                            }}
                          >
                            ←
                          </IconButton>
                          
                          {/* RIGHT ARROW */}
                          <IconButton
                            onClick={() => setCurrentImageIndex(prev => 
                              prev === (productData.product_images?.length || 1) - 1 ? 0 : prev + 1
                            )}
                            sx={{
                              position: 'absolute',
                              right: { xs: 8, sm: 12, md: 16 },
                              top: '50%',
                              transform: 'translateY(-50%)',
                              bgcolor: 'rgba(255,255,255,0.9)',
                              color: 'text.primary',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,1)',
                                transform: 'translateY(-50%) scale(1.1)',
                              },
                              zIndex: 3,
                              width: { xs: 32, sm: 40 },
                              height: { xs: 32, sm: 40 }
                            }}
                          >
                            →
                          </IconButton>
                          
                          {/* IMAGE INDICATORS */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: { xs: 8, sm: 12, md: 16 },
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: { xs: 0.5, sm: 1 },
                            zIndex: 3
                          }}>
                            {productData.product_images?.map((image: any, index: number) => (
                              <Box
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                sx={{
                                  width: { xs: 8, sm: 10 },
                                  height: { xs: 8, sm: 10 },
                                  borderRadius: '50%',
                                                                     bgcolor: index === currentImageIndex ? '#d32f2f' : 'rgba(255,255,255,0.6)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                                                         bgcolor: index === currentImageIndex ? '#d32f2f' : 'rgba(255,255,255,0.8)',
                                    transform: 'scale(1.2)',
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </>
                      )}
                    </>
                  ) : productLoading ? (
                    // LOADING STATE: Show loading message while fetching product data
                    <Box 
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        textAlign: 'center',
                        padding: { xs: 2, sm: 3, md: 4 },
                        gap: { xs: 2, sm: 3, md: 4 }
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 'medium',
                          color: 'text.primary',
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                          marginBottom: { xs: 1, sm: 1.5, md: 2, lg: 1, xl: 1 }
                        }}
                      >
                        Loading Product...
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 'regular',
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                          lineHeight: 1,
                          maxWidth: '400px',
                          marginBottom: { xs: 3, sm: 4, md: 1 ,lg: 1 , xl: 1}
                        }}
                      >
                        Please wait while we load the product details.
                      </Typography>
                    </Box>
                  ) : productError ? (
                    // ERROR STATE: Show error message if product loading failed
                    <Box 
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        textAlign: 'center',
                        padding: { xs: 2, sm: 3, md: 4 },
                        gap: { xs: 2, sm: 3, md: 4 }
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 'medium',
                          color: 'error.main',
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                          marginBottom: { xs: 1, sm: 1.5, md: 2, lg: 1, xl: 1 }
                        }}
                      >
                        Error Loading Product
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 'regular',
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                          lineHeight: 1,
                          maxWidth: '400px',
                          marginBottom: { xs: 3, sm: 4, md: 1 ,lg: 1 , xl: 1}
                        }}
                      >
                        {productError}
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                          // Clear localStorage and navigate to shop
                          localStorage.removeItem('selectedProductId');
                          clearSelectedItem();
                          router.push('/specials');
                        }}
                        startIcon={<ArrowForward />}
                        sx={{ 
                          fontWeight: 'regular',
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: '#b71c1c',
                            boxShadow: 'none',
                          }
                        }}
                      >
                        Browse Shop
                      </Button>
                    </Box>
                  ) : (
                    // ENHANCED PLACEHOLDER: Show better message when no item is selected
                    <Box 
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        textAlign: 'center',
                        padding: { xs: 2, sm: 3, md: 4 },
                        gap: { xs: 2, sm: 3, md: 4 }
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 'medium',
                          color: 'text.primary',
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                          marginBottom: { xs: 1, sm: 1.5, md: 2, lg: 1, xl: 1 }
                        }}
                      >
                        No Product Selected
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 'regular',
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                          lineHeight: 1,
                          maxWidth: '400px',
                          marginBottom: { xs: 3, sm: 4, md: 1 ,lg: 1 , xl: 1}
                        }}
                      >
                        Please select a model or product from our shop to start customizing your perfect seat.
                      </Typography>
                                             <Button
                         variant="contained"
                         size="large"
                         onClick={() => {
                           // Clear localStorage and navigate to shop
                           localStorage.removeItem('selectedProductId');
                           clearSelectedItem();
                           router.push('/specials');
                         }}
                         startIcon={<ArrowForward />}
                         sx={{ 
                           fontWeight: 'regular',
                           fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                           backgroundColor: '#d32f2f',
                           color: 'white',
                           boxShadow: 'none',
                           '&:hover': {
                             backgroundColor: '#b71c1c',
                             boxShadow: 'none',
                           }
                         }}
                       >
                         Browse Shop
                       </Button>
                       
                    </Box>
                  )}
                  
                  {/* REMOVED: Overlapping title and info displays - will be shown below the image instead */}
                </Box>
                
                
               </Box>

             </Card>
             
                           {/* NEW CONTAINER: Product Information - Title and Description */}
              {productData && (
                <Card className={styles.productInfoCard}>
           <CardContent className={styles.productInfoContent}>
                 {/* Product Title */}
                     <Typography variant="h5" className={styles.productTitle}>
                       {productData.name}
                     </Typography>
                    
                 {/* Product Description */}
                     <Box className={styles.productDescriptionContainer}>
                       {productData.description.split(/[.,]/).filter(sentence => sentence.trim().length > 0).map((sentence, index) => (
                         <Box key={index} className={styles.descriptionItem}>
                           <Typography 
                             component="span" 
                             className={styles.descriptionBullet}
                           >
                             •
                           </Typography>
                           <Typography variant="body1" className={styles.descriptionText}>
                             {sentence.trim()}
                           </Typography>
                         </Box>
                       ))}
                     </Box>
                  </CardContent>
               </Card>
               
             )}
            </Box>

          {/* Right Column - Customization Options */}
          <Box className={styles.rightColumn}>
            <Card className={styles.customizationCard}>
              <CardContent className={styles.customizationContent}>
                {/* Scrollable Content Container */}
                <Box className={styles.scrollableContainer}>
                  {/* Always show customization options, regardless of product selection */}
                  <>
         {/* ===== MATERIAL SELECTION SECTION ===== */}
                   <Box className={styles.sectionContainer}>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                       <Typography variant="h6" className={styles.sectionTitle}>
                         Choose Your Material
                       </Typography>
                       {selectedTexture !== 'none' && (() => {
                         const selectedMaterial = variations?.material_types?.find((m: any) => m.id.toString() === selectedTexture);
                         const price = Number(selectedMaterial?.price);
                         return selectedMaterial?.price && price > 0 ? (
                           <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.1rem' }}>
                             +${price.toFixed(2)}
                           </Typography>
                         ) : null;
                       })()}
                     </Box>
                    
                                         {/* Selected Material Name - Removed to show only on hover */}
                    
                    <Box className={styles.materialOptionsContainer}>
                      {/* None Option - Always First */}
                      <Tooltip title="No Material">
                        <Box
                          onClick={() => setSelectedTexture('none')}
                          className={`${styles.materialOption} ${selectedTexture === 'none' ? styles.selected : ''}`}
                        >
                          <Box className={styles.noneOption}>
                            <Typography variant="caption" className={styles.noneText}>
                              None
                            </Typography>
                          </Box>
                          {selectedTexture === 'none' && (
                            <Box className={styles.selectedOverlay}>
                              <CheckCircle sx={{ 
                                color: 'white', 
                                fontSize: { xs: 18, sm: 20, md: 24 } 
                              }} />
                            </Box>
                          )}
                        </Box>
                      </Tooltip>
                      
                      {/* Dynamic materials from API data */}
                      {variations?.material_types?.map((material: any) => (
                        <Tooltip key={material.id} title={material.name} placement="top">
                          <Box
                            onClick={() => setSelectedTexture(material.id.toString())}
                            className={`${styles.materialOption} ${selectedTexture === material.id.toString() ? styles.selected : ''}`}
                          >
                            {material.image_url ? (
                              <Image
                                src={material.image_url}
                                alt={material.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <Box className={styles.noneOption}>
                                <Typography variant="caption" className={styles.noneText}>
                                  {material.name}
                                </Typography>
                              </Box>
                            )}
                            {selectedTexture === material.id.toString() && (
                              <Box className={styles.selectedOverlay}>
                                <CheckCircle sx={{ 
                                  color: 'white', 
                                  fontSize: { xs: 18, sm: 20, md: 24 } 
                                }} />
                              </Box>
                            )}
                          </Box>
                        </Tooltip>
                      )) || (
                        // Fallback when no variation data is available
                        <Box className={styles.materialOption}>
                          <Box className={styles.noneOption}>
                            <Typography variant="caption" className={styles.noneText}>
                              No materials available
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    
                    
                  </Box>

                                     {/* Divider */}
                   <Divider className={styles.divider} />

                                     {/* ===== COLOR SELECTION SECTION ===== */}
                   <Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                       <Typography variant="h6" className={styles.sectionTitle}>
                         Choose Your Color
                       </Typography>
                       {selectedColor !== 'none' && (() => {
                         const selectedColorItem = variations?.colors?.find((c: any) => c.id.toString() === selectedColor);
                         const price = Number(selectedColorItem?.price);
                         return selectedColorItem?.price && price > 0 ? (
                           <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.1rem' }}>
                             +${price.toFixed(2)}
                           </Typography>
                         ) : null;
                       })()}
                     </Box>
                     
                     {/* Dynamic color display from variation data */}
                     <Box className={styles.colorOptionsContainer}>
                       {/* None Option - Always First */}
                       <Tooltip title="No Color">
                         <Box
                           onClick={() => setSelectedColor('none')}
                           className={`${styles.colorOption} ${selectedColor === 'none' ? styles.selected : ''}`}
                           style={{ backgroundColor: '#f5f5f5' }}
                         >
                           <Typography 
                             variant="caption" 
                             className={styles.noneColorText}
                             style={{ color: selectedColor === 'none' ? '#d32f2f' : '#666' }}
                           >
                             None
                           </Typography>
                           {selectedColor === 'none' && (
                             <CheckCircle sx={{
                               color: '#d32f2f',
                               fontSize: { xs: 12, sm: 14, md: 16 },
                               position: 'absolute',
                               top: '50%',
                               left: '50%',
                               transform: 'translate(-50%, -50%)',
                               zIndex: 2
                             }} />
                           )}
                         </Box>
                       </Tooltip>
                       
                       {/* Dynamic colors from API data */}
                       {variations?.colors?.map((color: any) => (
                         <Tooltip key={color.id} title={color.name}>
                           <Box
                             onClick={() => setSelectedColor(color.id.toString())}
                             className={`${styles.colorOption} ${selectedColor === color.id.toString() ? styles.selected : ''}`}
                             style={{ backgroundColor: color.hex_code || '#ccc' }}
                           >
                             {selectedColor === color.id.toString() && (
                               <CheckCircle sx={{
                                 color: 'white',
                                 fontSize: { xs: 16, sm: 17, md: 18 },
                                 position: 'absolute',
                                 top: '50%',
                                 left: '50%',
                                 transform: 'translate(-50%, -50%)',
                                 zIndex: 2
                               }} />
                             )}
                           </Box>
                         </Tooltip>
                       )) || (
                         // Fallback when no variation data is available
                         <Box className={styles.colorOption} style={{ backgroundColor: '#ccc' }}>
                           <Typography variant="caption" style={{ color: '#666' }}>
                             No colors available
                           </Typography>
                         </Box>
                       )}
                     </Box>
                  </Box>

                  {/* Divider */}
                  <Divider sx={{ my: { xs: 1, sm: 1, md: 1.5 , lg: 1.5 , xl:1.5} }} />

       {/* ===== STITCHING PATTERN SECTION ===== */}
                    <Box className={styles.sectionContainer}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" className={styles.sectionTitle}>
                          Choose Your Stitching Pattern
                        </Typography>
                        {selectedStitching !== 'none' && (() => {
                          const selectedStitchingItem = variations?.seat_stitch_patterns?.find((s: any) => s.id.toString() === selectedStitching);
                          const price = Number(selectedStitchingItem?.price);
                          return selectedStitchingItem?.price && price > 0 ? (
                            <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.1rem' }}>
                              +${price.toFixed(2)}
                            </Typography>
                          ) : null;
                        })()}
                      </Box>
                     
                     <Box className={styles.stitchingOptionsContainer}>
                       {/* None Option - Always First */}
                       <Tooltip title="No Stitching Pattern">
                         <Box
                           onClick={() => setSelectedStitching('none')}
                           className={`${styles.stitchingOption} ${selectedStitching === 'none' ? styles.selected : ''}`}
                         >
                           <Box className={styles.noneOption}>
                             <Typography variant="caption" className={styles.noneText}>
                               None
                             </Typography>
                           </Box>
                           {selectedStitching === 'none' && (
                             <Box className={styles.selectedOverlay}>
                               <CheckCircle sx={{ 
                                 color: 'white', 
                                 fontSize: { xs: 18, sm: 20, md: 24 } 
                               }} />
                             </Box>
                           )}
                         </Box>
                       </Tooltip>
                       
                       {/* Dynamic stitching patterns from API data */}
                       {variations?.seat_stitch_patterns?.map((stitching: any) => (
                         <Tooltip key={stitching.id} title={stitching.name} placement="top">
                           <Box
                             onClick={() => setSelectedStitching(stitching.id.toString())}
                             className={`${styles.stitchingOption} ${selectedStitching === stitching.id.toString() ? styles.selected : ''}`}
                           >
                             {stitching.image_url ? (
                               <Image
                                 src={stitching.image_url}
                                 alt={stitching.name}
                                 fill
                                 style={{ objectFit: 'cover' }}
                               />
                             ) : (
                               <Box className={styles.noneOption}>
                                 <Typography variant="caption" className={styles.noneText}>
                                   {stitching.name}
                                 </Typography>
                               </Box>
                             )}
                             {selectedStitching === stitching.id.toString() && (
                               <Box className={styles.selectedOverlay}>
                                 <CheckCircle sx={{ 
                                   color: 'white', 
                                   fontSize: { xs: 18, sm: 20, md: 24 } 
                                 }} />
                               </Box>
                             )}
                           </Box>
                         </Tooltip>
                       )) || (
                         // Fallback when no variation data is available
                         <Box className={styles.stitchingOption}>
                           <Box className={styles.noneOption}>
                             <Typography variant="caption" className={styles.noneText}>
                               No stitching patterns available
                             </Typography>
                           </Box>
                         </Box>
                       )}
                     </Box>
                   </Box>

                                     {/* Divider */}
                   <Divider className={styles.divider} />

                                                                               {/* ===== VEHICLE INFORMATION SECTION ===== */}
                     <Box className={styles.vehicleInfoSection}>
                       <Typography variant="h6" className={styles.sectionTitle}>
                         Vehicle Information
                       </Typography>
                     
                                           <Box className={styles.formRow}>
                                                 {/* Vehicle Make */}
                         <Box className={styles.formField}>
                           <Typography variant="body2" className={styles.fieldLabel}>
                             Vehicle Make:
                           </Typography>
                                                       <FormControl className={styles.formControl}>
                              <Select
                                value={selectedMake}
                                onChange={(e) => setSelectedMake(e.target.value)}
                                displayEmpty
                                className={styles.selectField}
                              >
                               <MenuItem value="" disabled>
                                 Make
                               </MenuItem>
                               {vehicleMakes.map((make) => (
                                 <MenuItem key={make.id} value={make.id}>
                                   {make.name}
                                 </MenuItem>
                               ))}
                             </Select>
                           </FormControl>
                         </Box>

                 {/* Vehicle Model */}
                          <Box className={styles.formField}>
                            <Typography variant="body2" className={styles.fieldLabel}>
                              Vehicle Model:
                            </Typography>
                                                        <FormControl className={styles.formControl}>
                                 <Select
                                 value={selectedModel}
                                 onChange={(e) => setSelectedModel(e.target.value)}
                                 displayEmpty
                                 className={styles.selectField}
                               >
                                <MenuItem value="" disabled>
                                  Model
                                </MenuItem>
                                <MenuItem value="none" disabled>
                                  No models available
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                                                                                                   {/* Vehicle Trim */}
                          <Box className={styles.formField}>
                            <Typography variant="body2" className={styles.fieldLabel}>
                              Vehicle Trim:
                            </Typography>
                                                        <FormControl className={styles.formControl}>
                                 <Select
                                 value={selectedTrim}
                                 onChange={(e) => setSelectedTrim(e.target.value)}
                                 displayEmpty
                                 className={styles.selectField}
                               >
                                <MenuItem value="" disabled>
                                  Select Trim
                                </MenuItem>
                                {variations?.vehicle_trim?.map((trim: any) => (
                                  <MenuItem key={trim.id} value={trim.id.toString()}>
                                    {trim.name}
                                  </MenuItem>
                                )) || (
                                  <MenuItem value="none" disabled>
                                    No trims available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Box>
                      </Box>
                   </Box>

                                       {/* Divider */}
                    <Divider className={styles.divider} />

           {/* ===== VARIATION SECTION ===== */}
                      <Box className={styles.variationSection}>
                        <Typography variant="h6" className={styles.sectionTitle}>
                          Variation
                        </Typography>
                      
                       <Box className={styles.formRow}>
                         {/* Recline */}
                         <Box className={styles.formField}>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <Typography variant="body2" className={styles.fieldLabel}>
                               Recline:
                               {selectedRecline && (() => {
                                 const selectedReclineItem = variations?.recline_types?.find((r: any) => r.id.toString() === selectedRecline);
                                 return selectedReclineItem?.price && parseFloat(selectedReclineItem.price.toString()) > 0 ? (
                                   <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                                     +${parseFloat(selectedReclineItem.price.toString()).toFixed(2)}
                                   </span>
                                 ) : null;
                               })()}
                             </Typography>
                           </Box>
                           <FormControl className={styles.formControl}>
                             <Select
                               value={selectedRecline}
                               onChange={(e) => setSelectedRecline(e.target.value)}
                               displayEmpty
                               className={styles.selectField}
                             >
                              <MenuItem value="" disabled>
                                Recline
                              </MenuItem>
                              {variations?.recline_types?.map((recline: any) => (
                                <MenuItem key={recline.id} value={recline.id.toString()}>
                                  {recline.name}
                                </MenuItem>
                              )) || (
                                <MenuItem value="none" disabled>
                                  No recline options available
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Lumber */}
                        <Box className={styles.formField}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" className={styles.fieldLabel}>
                              Lumber:
                               {selectedLumber && (() => {
                                 const selectedLumberItem = variations?.lumbar_types?.find((l: any) => l.id.toString() === selectedLumber);
                                 return selectedLumberItem?.price && parseFloat(selectedLumberItem.price.toString()) > 0 ? (
                                   <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                                     +${parseFloat(selectedLumberItem.price.toString()).toFixed(2)}
                                   </span>
                                 ) : null;
                               })()}
                            </Typography>
                          </Box>
                          <FormControl className={styles.formControl}>
                             <Select
                               value={selectedLumber}
                               onChange={(e) => setSelectedLumber(e.target.value)}
                               displayEmpty
                               className={styles.selectField}
                             >
                              <MenuItem value="" disabled>
                                Lumber
                              </MenuItem>
                              {variations?.lumbar_types?.map((lumber: any) => (
                                <MenuItem key={lumber.id} value={lumber.id.toString()}>
                                  {lumber.name}
                                </MenuItem>
                              )) || (
                                <MenuItem value="none" disabled>
                                  No lumber options available
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Heating and Cooling */}
                        <Box className={styles.formField}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" className={styles.fieldLabel}>
                              Heating and Cooling:
                               {selectedHeatingCooling && (() => {
                                 const selectedHeatingItem = variations?.heat_options?.find((h: any) => h.id.toString() === selectedHeatingCooling);
                                 return selectedHeatingItem?.price && parseFloat(selectedHeatingItem.price.toString()) > 0 ? (
                                   <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                                     +${parseFloat(selectedHeatingItem.price.toString()).toFixed(2)}
                                   </span>
                                 ) : null;
                               })()}
                            </Typography>
                          </Box>
                          <FormControl className={styles.formControl}>
                             <Select
                               value={selectedHeatingCooling}
                               onChange={(e) => setSelectedHeatingCooling(e.target.value)}
                               displayEmpty
                               className={styles.selectField}
                             >
                              <MenuItem value="" disabled>
                                Heating/Cooling
                              </MenuItem>
                              {variations?.heat_options?.map((heatingCooling: any) => (
                                <MenuItem key={heatingCooling.id} value={heatingCooling.id.toString()}>
                                  {heatingCooling.name}
                                </MenuItem>
                              )) || (
                                <MenuItem value="none" disabled>
                                  No heating/cooling options available
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Box>

                    {/* Divider */}
                    <Divider className={styles.divider} />

                                                                                   {/* ===== SEAT SECTION ===== */}
                      <Box className={styles.seatSection}>
                        <Typography variant="h6" className={styles.sectionTitle}>
                          Seat
                        </Typography>
                      
                                                                    <Box className={styles.formRow}>
                                                  {/* Seat Type */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Seat Type:
                                 {selectedSeatType && (() => {
                                   const selectedSeatTypeItem = variations?.seat_types?.find((s: any) => s.id.toString() === selectedSeatType);
                                   const price = Number(selectedSeatTypeItem?.price);
                                   return selectedSeatTypeItem?.price && price > 0 ? (
                                     <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                                       +${price.toFixed(2)}
                                     </span>
                                   ) : null;
                                 })()}
                              </Typography>
                            </Box>
                            <FormControl className={styles.formControl}>
                               <Select
                                 value={selectedSeatType}
                                 onChange={(e) => setSelectedSeatType(e.target.value)}
                                 displayEmpty
                                 className={styles.selectField}
                               >
                                <MenuItem value="" disabled>
                                  Seat Type
                                </MenuItem>
                                {variations?.seat_types?.map((seatType: any) => (
                                  <MenuItem key={seatType.id} value={seatType.id.toString()}>
                                    {seatType.name}
                                  </MenuItem>
                                )) || (
                                  <MenuItem value="none" disabled>
                                    No seat type options available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Item Type */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Item Type:
                                 {selectedItemType && (() => {
                                   const selectedItemTypeItem = variations?.item_types?.find((i: any) => i.id.toString() === selectedItemType);
                                   const price = Number(selectedItemTypeItem?.price);
                                   return selectedItemTypeItem?.price && price > 0 ? (
                                     <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                                       +${price.toFixed(2)}
                                     </span>
                                   ) : null;
                                 })()}
                              </Typography>
                            </Box>
                            <FormControl className={styles.formControl}>
                               <Select
                                 value={selectedItemType}
                                 onChange={(e) => setSelectedItemType(e.target.value)}
                                 displayEmpty
                                 className={styles.selectField}
                               >
                                <MenuItem value="" disabled>
                                   Item Type
                                </MenuItem>
                                {variations?.item_types?.map((itemType: any) => (
                                  <MenuItem key={itemType.id} value={itemType.id.toString()}>
                                    {itemType.name}
                                  </MenuItem>
                                )) || (
                                  <MenuItem value="none" disabled>
                                    No item type options available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Seat Style */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Seat Style:
                                 {selectedSeatStyle && (() => {
                                   const selectedSeatStyleItem = variations?.seat_styles?.find((s: any) => s.id.toString() === selectedSeatStyle);
                                   const price = Number(selectedSeatStyleItem?.price);
                                   return selectedSeatStyleItem?.price && price > 0 ? (
                                     <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                                       +${price.toFixed(2)}
                                     </span>
                                   ) : null;
                                 })()}
                              </Typography>
                            </Box>
                            <FormControl className={styles.formControl}>
                               <Select
                                 value={selectedSeatStyle}
                                 onChange={(e) => setSelectedSeatStyle(e.target.value)}
                                 displayEmpty
                                 className={styles.selectField}
                               >
                                <MenuItem value="" disabled>
                                  Seat Style
                                </MenuItem>
                                {variations?.seat_styles?.map((seatStyle: any) => (
                                  <MenuItem key={seatStyle.id} value={seatStyle.id.toString()}>
                                    {seatStyle.name}
                                  </MenuItem>
                                )) || (
                                  <MenuItem value="none" disabled>
                                    No seat style options available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Material Type */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Material Type:
                                 {selectedMaterialType && (() => {
                                   const selectedMaterialTypeItem = variations?.material_types?.find((m: any) => m.id.toString() === selectedMaterialType);
                                   const price = Number(selectedMaterialTypeItem?.price);
                                   return selectedMaterialTypeItem?.price && price > 0 ? (
                                     <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                                       +${price.toFixed(2)}
                                     </span>
                                   ) : null;
                                 })()}
                              </Typography>
                            </Box>
                            <FormControl className={styles.formControl}>
                               <Select
                                 value={selectedMaterialType}
                                 onChange={(e) => setSelectedMaterialType(e.target.value)}
                                 displayEmpty
                                 className={styles.selectField}
                               >
                                <MenuItem value="" disabled>
                                   Material Type
                                </MenuItem>
                                {variations?.material_types?.map((materialType: any) => (
                                  <MenuItem key={materialType.id} value={materialType.id.toString()}>
                                    {materialType.name}
                                  </MenuItem>
                                )) || (
                                  <MenuItem value="none" disabled>
                                    No material type options available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Included Arm */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Included Arm:
                                 {selectedIncludedArm && (() => {
                                   const selectedIncludedArmItem = variations?.arm_types?.find((a: any) => a.id.toString() === selectedIncludedArm);
                                   const price = Number(selectedIncludedArmItem?.price);
                                   return selectedIncludedArmItem?.price && price > 0 ? (
                                     <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '8px' }}>
                                       +${price.toFixed(2)}
                                     </span>
                                   ) : null;
                                 })()}
                              </Typography>
                            </Box>
                            <FormControl className={styles.formControl}>
                               <Select
                                 value={selectedIncludedArm}
                                 onChange={(e) => setSelectedIncludedArm(e.target.value)}
                                 displayEmpty
                                 className={styles.selectField}
                               >
                                <MenuItem value="" disabled>
                                  Included Arm
                                </MenuItem>
                                {variations?.arm_types?.map((includedArm: any) => (
                                  <MenuItem key={includedArm.id} value={includedArm.id.toString()}>
                                    {includedArm.name}
                                  </MenuItem>
                                )) || (
                                  <MenuItem value="none" disabled>
                                    No included arm options available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Box>

                       </Box>
                    </Box>

                                         {/* Divider */}
                     <Divider className={styles.finalDivider} />
                     </>
                </Box>
              </CardContent>
            </Card>
            
                   {/* ===== PRICE BREAKDOWN CONTAINER - RIGHT BOTTOM SECTION ===== */}
      
              {productData && selectedTexture && (
                <Card className={styles.priceCard}>
                                  <CardContent className={styles.priceContent}>
                                                                       
                   
                                       {/* SIMPLIFIED PRICE LAYOUT: Only Total Price and Add to Cart */}
                    <Box className={styles.priceLayout}>
                                         <Typography variant="h4" className={styles.totalPrice}>
                       US ${totalPrice.toFixed(2)}
                     </Typography>
                    
                 {/* SECOND ROW: Add to Cart button only */}
             <Box className={styles.addToCartContainer}>
                      {/* ADD TO CART BUTTON */}
                                             <Button
                         variant="contained"
                         size="medium"
                         startIcon={<ShoppingCart sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />}
                         onClick={() => {
                            const materialName = selectedTexture === 'none' ? 'No Material' : 
                              variations?.material_types?.find((m: any) => m.id.toString() === selectedTexture)?.name || 'Custom Material';
                            const colorName = selectedColor === 'none' ? 'No Color' : 
                              variations?.colors?.find((c: any) => c.id.toString() === selectedColor)?.name || 'Custom Color';
                            const stitchingName = selectedStitching === 'none' ? 'No Stitching' : 
                              variations?.seat_stitch_patterns?.find((s: any) => s.id.toString() === selectedStitching)?.name || 'Custom Stitching';

                            dispatch(addItem({
                              id: productData.id,
                              title: `${productData.name} - ${materialName} ${colorName} ${stitchingName}`,
                              price: `$${totalPrice}`,
                              image: productData.primary_image?.image_url || '/placeholder-image.jpg',
                              description: `${productData.description} with ${materialName} material, ${colorName} color, and ${stitchingName} stitching`,
                              category: productData.category?.name || 'seat'
                            }));
                         }}
                                                   className={styles.addToCartButton}
                       >
                         Add to Cart
                       </Button>
                    </Box>
                </Box>
              </CardContent>
            </Card>
                         )}
           </Box>
         </Box>
      </Container>

      <Footer />

    </Box>
  );
};

export default CustomizedSeat; 