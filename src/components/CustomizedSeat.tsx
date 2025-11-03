'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
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
// NEW IMPORT: Added to fetch vehicle trim data
import { apiService } from '@/utils/api';
import HeroSectionCommon from './common/HeroSectionaCommon';
// import Breadcrumbs from './Breadcrumbs'; // Temporarily disabled
import Footer from './Footer';
// CSS Module import
import styles from './CustomizedSeat.module.css';

// 3D MODEL IMPORTS - Dynamic import to avoid SSR issues
const Scene3D = dynamic(() => import('@/components/model/3D/Scene3D'), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <p>Loading 3D Model...</p>
    </div>
  )
}) as any;

const CustomizationPanel = dynamic(() => import('@/components/model/CustomizationPanel'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
}) as any;

const PartCustomizationPopup = dynamic(() => import('@/components/model/PartCustomizationPopup'), { 
  ssr: false 
}) as any;

const SubmitButton = dynamic(() => import('@/components/model/SubmitButton'), { 
  ssr: false 
}) as any;
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
  Snackbar,
  Alert,
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

  // 3D MODEL STATE - State for 3D model customization
  const scene3DRef = useRef<any>(null); // Ref for Scene3D to capture images
  const [modelId, setModelId] = useState('1'); // Model selection (1 or 2)
  const [stitchColor3D, setStitchColor3D] = useState('#ffffff'); // 3D stitch color
  const [fabricColor3D, setFabricColor3D] = useState('#ffffff'); // 3D fabric color
  const [fabricType3D, setFabricType3D] = useState('leather'); // 3D fabric type
  const [patternId3D, setPatternId3D] = useState('default'); // 3D pattern selection
  const [seatType3D, setSeatType3D] = useState('single'); // Two-Tone mode: 'single' or 'two-tone'
  const [savedTwoToneCustomizations3D, setSavedTwoToneCustomizations3D] = useState<Record<string, any>>({}); // Saved two-tone customizations
  const [meshCustomizations3D, setMeshCustomizations3D] = useState<Record<string, any>>({}); // Individual mesh customizations
  const [showIndividualControls3D, setShowIndividualControls3D] = useState(false); // Show/hide individual controls
  const [highlightedMesh3D, setHighlightedMesh3D] = useState<string | null>(null); // Highlighted mesh for preview
  const [popupState3D, setPopupState3D] = useState<any>(null); // Popup state for part customization
  const [isSubmitting3D, setIsSubmitting3D] = useState(false); // Submission state

  // Variation data state
  const [variations, setVariations] = useState<ProductVariations | null>(null);

  // Removed localStorage functionality - product ID is now only managed through context

  // Fetch product data when selectedItem ID changes
  useEffect(() => {
    // console.log('🔄 CustomizedSeat - useEffect triggered, selectedItem:', selectedItem);
    
    const fetchProductData = async () => {
      if (selectedItem && selectedItem.id) {
        try {
          setProductLoading(true);
          setProductError(null);
          console.log('🔄 CustomizedSeat - Fetching product data for ID:', selectedItem.id);
          
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

  // Fetch vehicle trim data when product loads
  useEffect(() => {
    const fetchVehicleTrimData = async () => {
      if (productData && productData.vehicle_trim_id) {
        try {
          setVehicleTrimLoading(true);
          console.log('🚗 CustomizedSeat - Fetching vehicle trim data for ID:', productData.vehicle_trim_id);
          
          const trimData = await apiService.getVehicleTrimById(productData.vehicle_trim_id);
          setVehicleTrimData(trimData);
          
          // Set the selected values from the API response
          if (trimData) {
            setSelectedMake(trimData.model?.make?.id?.toString() || '');
            setSelectedModel(trimData.model?.id?.toString() || '');
            setSelectedTrim(trimData.id?.toString() || '');
            
            console.log('✅ CustomizedSeat - Vehicle trim data loaded:', {
              make: trimData.model?.make?.name,
              model: trimData.model?.name,
              trim: trimData.name
            });
          }
        } catch (error) {
          console.error('❌ CustomizedSeat - Error fetching vehicle trim data:', error);
        } finally {
          setVehicleTrimLoading(false);
        }
      } else {
        // Reset vehicle data when no product or no vehicle_trim_id
        setVehicleTrimData(null);
        setSelectedMake('');
        setSelectedModel('');
        setSelectedTrim('');
      }
    };

    fetchVehicleTrimData();
  }, [productData]);
  
  // State for vehicle information
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  
  // State for vehicle trim data from API
  const [vehicleTrimData, setVehicleTrimData] = useState<any>(null);
  const [vehicleTrimLoading, setVehicleTrimLoading] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
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
    if (productData) {
      // Prefer tier-adjusted price if available
      try {
        const { getEffectiveProductPrice } = require('@/utils/pricing');
        baseSeatPrice = getEffectiveProductPrice(productData, (window as any)?.__AUTH_USER__ || null);
      } catch {
        if (productData?.price) {
          const priceStr = productData.price.toString().replace(/[$,]/g, '');
          baseSeatPrice = parseFloat(priceStr) || 0;
        }
      }
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

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 3D MODEL HANDLERS
  const handleMeshCustomizationChange = (meshName: string, customization: any) => {
    setMeshCustomizations3D(prev => ({
      ...prev,
      [meshName]: customization
    }));
  };

  const handleMeshHighlight = (meshName: string) => {
    setHighlightedMesh3D(meshName);
  };

  const handleMeshUnhighlight = () => {
    setHighlightedMesh3D(null);
  };

  // Two-Tone mode handler
  const handleSeatTypeChange = (nextType: string) => {
    console.log('🔄 Seat type changing from', seatType3D, 'to', nextType);
    if (nextType === 'single') {
      // Save current two-tone customizations and clear them from view
      setSavedTwoToneCustomizations3D(meshCustomizations3D);
      setMeshCustomizations3D({});
      setSeatType3D('single');
    } else if (nextType === 'two-tone') {
      // Restore saved two-tone customizations if available
      setMeshCustomizations3D(prev => Object.keys(savedTwoToneCustomizations3D).length ? savedTwoToneCustomizations3D : prev);
      setSeatType3D('two-tone');
    }
  };

  // Right-click handler for part customization (Two-Tone mode only)
  const handlePartRightClick = (partName: string, position: any) => {
    // Only allow right-click customization in two-tone mode
    if (seatType3D === 'two-tone') {
      console.log('🎯 Right-click on part:', partName);
      setPopupState3D({ partName, position });
    }
  };

  const handlePopupClose = () => {
    setPopupState3D(null);
  };

  const handlePopupApply = (customization: any) => {
    if (popupState3D) {
      console.log(`🎯 Applying customization to ${popupState3D.partName}:`, customization);
      handleMeshCustomizationChange(popupState3D.partName, customization);
    }
  };

  // Submit design handler - captures images from multiple angles
  const handleSubmit = async () => {
    setIsSubmitting3D(true);
    try {
      console.log('📸 Starting image capture...');
      
      // Capture images from different angles
      const images = await scene3DRef.current.captureImages();
      
      // Generate unique ID
      const uniqueId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`✅ Captured ${images.length} images with ID: ${uniqueId}`);
      
      // In a real application, you would send these to a backend API
      // For now, we'll download them locally
      images.forEach((img: any, index: number) => {
        const link = document.createElement('a');
        link.download = `${uniqueId}_${img.angle}.png`;
        link.href = img.dataUrl;
        link.click();
      });
      
      // Also save configuration as JSON
      const config = {
        id: uniqueId,
        timestamp: new Date().toISOString(),
        modelId,
        fabricType: fabricType3D,
        fabricColor: fabricColor3D,
        stitchColor: stitchColor3D,
        patternId: patternId3D,
        seatType: seatType3D,
        meshCustomizations: meshCustomizations3D,
        // Include product data if available
        productId: productData?.id,
        productName: productData?.name,
        variations: {
          recline: selectedRecline,
          lumber: selectedLumber,
          heatingCooling: selectedHeatingCooling,
          seatType: selectedSeatType,
          itemType: selectedItemType,
          seatStyle: selectedSeatStyle,
          materialType: selectedMaterialType,
          includedArm: selectedIncludedArm
        }
      };
      
      const configBlob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const configLink = document.createElement('a');
      configLink.download = `${uniqueId}_config.json`;
      configLink.href = URL.createObjectURL(configBlob);
      configLink.click();
      
      alert(`Design submitted successfully! ID: ${uniqueId}\n${images.length} images captured.`);
    } catch (error) {
      console.error('❌ Failed to capture images:', error);
      alert('Failed to submit design. Please try again.');
    } finally {
      setIsSubmitting3D(false);
    }
  };

  return (
    <Box className={styles.mainContainer}>
      {showHeader && <Header />}
      
            {showHero && (
        /* Hero Section */
        <HeroSectionCommon
         title="Build Your Own Seat"
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

      {/* Breadcrumbs - Temporarily disabled */}
      {/* <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop-now' },
          { label: 'Build Your Own Seat' }
        ]}
      /> */}

      {/* Main Configuration Section */}
      <Container maxWidth="xl" className={styles.configContainer}>
        <Box className={styles.gridContainer}>
          {/* Left Column - 3D Viewer */}
          <Box className={styles.leftColumn} sx={{ position: 'relative' }}>
            <Card className={styles.viewerCard}>
              <Box className={styles.viewerBackground}>
                {/* 3D MODEL VIEWER - Replaced image display with Scene3D */}
                <Box className={styles.imageDisplayArea} sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Scene3D 
                    ref={scene3DRef}
                    modelId={modelId}
                    stitchColor={stitchColor3D}
                    fabricColor={fabricColor3D}
                    fabricType={fabricType3D}
                    patternId={patternId3D}
                    seatType={seatType3D}
                    meshCustomizations={meshCustomizations3D}
                    highlightedMesh={highlightedMesh3D}
                    onPartRightClick={handlePartRightClick}
                  />
                  
                  {/* Submit Design Button - Positioned in 3D viewer */}
                  <Box sx={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000 }}>
                    <SubmitButton onSubmit={handleSubmit} disabled={isSubmitting3D} />
                  </Box>
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
            {/* CUSTOMIZATION PANEL FROM MODEL FOLDER - Contains all options */}
            <CustomizationPanel 
              modelId={modelId}
              onModelIdChange={setModelId}
              stitchColor={stitchColor3D}
              onStitchColorChange={setStitchColor3D}
              fabricColor={fabricColor3D}
              onFabricColorChange={setFabricColor3D}
              fabricType={fabricType3D}
              onFabricTypeChange={setFabricType3D}
              patternId={patternId3D}
              onPatternChange={setPatternId3D}
              seatType={seatType3D}
              onSeatTypeChange={handleSeatTypeChange}
              meshCustomizations={meshCustomizations3D}
              onMeshCustomizationChange={handleMeshCustomizationChange}
              showIndividualControls={showIndividualControls3D}
              onToggleIndividualControls={() => setShowIndividualControls3D(!showIndividualControls3D)}
              onMeshHighlight={handleMeshHighlight}
              onMeshUnhighlight={handleMeshUnhighlight}
              vehicleTrimData={vehicleTrimData}
              vehicleTrimLoading={vehicleTrimLoading}
              variations={variations}
              selectedRecline={selectedRecline}
              onReclineChange={setSelectedRecline}
              selectedLumber={selectedLumber}
              onLumberChange={setSelectedLumber}
              selectedHeatingCooling={selectedHeatingCooling}
              onHeatingCoolingChange={setSelectedHeatingCooling}
              selectedSeatType={selectedSeatType}
              onSeatTypeChangeAPI={setSelectedSeatType}
              selectedItemType={selectedItemType}
              onItemTypeChange={setSelectedItemType}
              selectedSeatStyle={selectedSeatStyle}
              onSeatStyleChange={setSelectedSeatStyle}
              selectedMaterialType={selectedMaterialType}
              onMaterialTypeChange={setSelectedMaterialType}
              selectedIncludedArm={selectedIncludedArm}
              onIncludedArmChange={setSelectedIncludedArm}
            />
            
            {/* ===== PRICE CARD ===== */}
            {productData && (
              <Card className={styles.priceCard}>
                <CardContent className={styles.priceContent}>
                  <Box className={styles.priceLayout}>
                    <Typography variant="h4" className={styles.totalPrice}>
                      US ${totalPrice.toFixed(2)}
                    </Typography>
                  
                    <Box className={styles.addToCartContainer}>
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
                            category: productData.category?.name || 'seat',
                            stock: (productData as any)?.stock,
                            variants: {
                              materialType: selectedTexture && selectedTexture !== 'none' ? selectedTexture : '',
                              color: selectedColor && selectedColor !== 'none' ? selectedColor : '',
                              seatStitchPattern: selectedStitching && selectedStitching !== 'none' ? selectedStitching : '',
                              reclineType: selectedRecline || '',
                              lumbarType: selectedLumber || '',
                              heatOption: selectedHeatingCooling || '',
                              seatType: selectedSeatType || '',
                              itemType: selectedItemType || '',
                              seatStyle: selectedSeatStyle || '',
                              armType: selectedIncludedArm || '',
                            },
                          }));

                          setSnackbar({
                            open: true,
                            message: 'Successfully added to cart!',
                            severity: 'success',
                          });
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

      {/* Part Customization Popup - Only shown in Two-Tone mode when right-clicking parts */}
      {popupState3D && (
        <PartCustomizationPopup
          partName={popupState3D.partName}
          position={popupState3D.position}
          onClose={handlePopupClose}
          currentCustomization={meshCustomizations3D[popupState3D.partName]}
          onApply={handlePopupApply}
          modelId={modelId}
          seatType={seatType3D}
          fabricColor={fabricColor3D}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomizedSeat;
