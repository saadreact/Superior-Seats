'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Grid } from '@mui/material'; 
import { testimonials } from '@/data/testimonials';
import Header from '@/components/Header';
// CONSOLIDATED IMPORTS: All customization data now comes from a single file
import { textures, objects, stichtingtextures, vehicleYears, vehicleMakes, vehicleModels, vehicleTrims, reclineOptions, childRestraintOptions, motorBackRelaxerOptions, lumberOptions, heatingCoolingOptions, seatTypeOptions, itemTypeOptions, seatStyleOptions, materialTypeOptions, includedArmOptions, extraArmOptions } from '@/data/CustomizedSeat';
// API imports
import { CustomizedSeatApi, Color, VehicleModel, VehicleTrim } from '@/services/CustomizedSeatApi';
// NEW IMPORTS: Added to enable communication between ShopGallery and CustomizedSeat components
import { useSelectedItem } from '@/contexts/SelectedItemContext'; // Context hook to access selected item data
import { useRouter } from 'next/navigation'; // Next.js router for programmatic navigation
// NEW IMPORT: Added to enable cart functionality
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
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
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  

  const { selectedItem, clearSelectedItem } = useSelectedItem(); // Destructure selectedItem and clearSelectedItem from context
  const router = useRouter(); 
 
  const dispatch = useDispatch(); 

  // State for customization options
  const [selectedTexture, setSelectedTexture] = useState('none'); 
  const [selectedColor, setSelectedColor] = useState('none'); 
  const [selectedStitching, setSelectedStitching] = useState('none');
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // API state for colors
  const [apiColors, setApiColors] = useState<Color[]>([]);
  const [colorsLoading, setColorsLoading] = useState(false);
  const [colorsError, setColorsError] = useState<string | null>(null);

  // API state for vehicle models
  const [apiVehicleModels, setApiVehicleModels] = useState<VehicleModel[]>([]);
  const [vehicleModelsLoading, setVehicleModelsLoading] = useState(false);
  const [vehicleModelsError, setVehicleModelsError] = useState<string | null>(null);

  // API state for vehicle trims
  const [apiVehicleTrims, setApiVehicleTrims] = useState<VehicleTrim[]>([]);
  const [vehicleTrimsLoading, setVehicleTrimsLoading] = useState(false);
  const [vehicleTrimsError, setVehicleTrimsError] = useState<string | null>(null);

  // Fetch colors from API on component mount
  useEffect(() => {
    const fetchColors = async () => {
      setColorsLoading(true);
      setColorsError(null);
      try {
        const colors = await CustomizedSeatApi.getAllColors();
        setApiColors(colors);
      } catch (error) {
        console.error('Failed to fetch colors:', error);
        setColorsError('Failed to load colors. Please try again.');
      } finally {
        setColorsLoading(false);
      }
    };

    fetchColors();
  }, []);

  // Fetch vehicle models from API on component mount
  useEffect(() => {
    const fetchVehicleModels = async () => {
      setVehicleModelsLoading(true);
      setVehicleModelsError(null);
      try {
        const models = await CustomizedSeatApi.getAllVehicleModels();
        setApiVehicleModels(models);
      } catch (error) {
        console.error('Failed to fetch vehicle models:', error);
        setVehicleModelsError('Failed to load vehicle models. Please try again.');
      } finally {
        setVehicleModelsLoading(false);
      }
    };

    fetchVehicleModels();
  }, []);

  // Fetch vehicle trims from API on component mount
  useEffect(() => {
    const fetchVehicleTrims = async () => {
      setVehicleTrimsLoading(true);
      setVehicleTrimsError(null);
      try {
        const trims = await CustomizedSeatApi.getAllVehicleTrims();
        setApiVehicleTrims(trims);
      } catch (error) {
        console.error('Failed to fetch vehicle trims:', error);
        setVehicleTrimsError('Failed to load vehicle trims. Please try again.');
      } finally {
        setVehicleTrimsLoading(false);
      }
    };

    fetchVehicleTrims();
  }, []);
  
  // State for vehicle information
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  
  // State for variation options
  const [selectedRecline, setSelectedRecline] = useState('');
  const [selectedChildRestraint, setSelectedChildRestraint] = useState('');
  const [selectedMotorBackRelaxer, setSelectedMotorBackRelaxer] = useState('');
  const [selectedLumber, setSelectedLumber] = useState('');
  const [selectedHeatingCooling, setSelectedHeatingCooling] = useState('');
  
  // State for seat options
  const [selectedSeatType, setSelectedSeatType] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');
  const [selectedSeatStyle, setSelectedSeatStyle] = useState('');
  const [selectedMaterialType, setSelectedMaterialType] = useState('');
  const [selectedIncludedArm, setSelectedIncludedArm] = useState('');
  const [selectedExtraArm, setSelectedExtraArm] = useState('');
  
  // State for select section
  const [quantity, setQuantity] = useState(1);

  const calculateTotalPrice = () => {
    // Get base seat price (from selected item or default objects)
    const baseSeatPrice = selectedItem ? parseFloat(selectedItem.price.replace('$', '')) : objects[currentObjectIndex].price;
    
    // Get material/texture price
    const texturePrice = textures.find(t => t.id === selectedTexture)?.price || 0;
    
    // Get color price (currently no price in API response, defaulting to 0)
    const colorPrice = 0; // apiColors.find(c => c.id === selectedColor)?.price || 0;
    
    // Get stitching pattern price
    const stitchingPrice = stichtingtextures.find(s => s.id === selectedStitching)?.price || 0;
    
    // Get variation prices
    const reclinePrice = reclineOptions.find(r => r.id === selectedRecline)?.price || 0;
    const childRestraintPrice = childRestraintOptions.find(c => c.id === selectedChildRestraint)?.price || 0;
    const motorBackRelaxerPrice = motorBackRelaxerOptions.find(m => m.id === selectedMotorBackRelaxer)?.price || 0;
    const lumberPrice = lumberOptions.find(l => l.id === selectedLumber)?.price || 0;
    const heatingCoolingPrice = heatingCoolingOptions.find(h => h.id === selectedHeatingCooling)?.price || 0;
    
    // Get seat prices
    const seatTypePrice = seatTypeOptions.find(s => s.id === selectedSeatType)?.price || 0;
    const itemTypePrice = itemTypeOptions.find(i => i.id === selectedItemType)?.price || 0;
    const seatStylePrice = seatStyleOptions.find(s => s.id === selectedSeatStyle)?.price || 0;
    const materialTypePrice = materialTypeOptions.find(m => m.id === selectedMaterialType)?.price || 0;
    const includedArmPrice = includedArmOptions.find(i => i.id === selectedIncludedArm)?.price || 0;
    const extraArmPrice = extraArmOptions.find(e => e.id === selectedExtraArm)?.price || 0;
    
    // Calculate total
    return baseSeatPrice + texturePrice + colorPrice + stitchingPrice + reclinePrice + childRestraintPrice + motorBackRelaxerPrice + lumberPrice + heatingCoolingPrice + seatTypePrice + itemTypePrice + seatStylePrice + materialTypePrice + includedArmPrice + extraArmPrice;
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
                {/* MODIFIED IMAGE DISPLAY AREA: Now conditionally renders selected item image or placeholder */}
                <Box className={styles.imageDisplayArea}>
                  {selectedItem ? ( // CONDITIONAL RENDERING: Show selected item image if available
                    <>
                      {/* MAIN PRODUCT IMAGE */}
                      <Image
                        src={selectedItem.images && selectedItem.images.length > 0 
                          ? selectedItem.images[currentImageIndex] 
                          : selectedItem.image
                        }
                        alt={selectedItem.title}
                        fill
                        style={{ 
                          objectFit: 'contain',
                          padding: '20px'
                        }}
                      />
                      
                      {/* IMAGE NAVIGATION CONTROLS - Only show if product has multiple images */}
                      {selectedItem.images && selectedItem.images.length > 1 && (
                        <>
                          {/* LEFT ARROW */}
                          <IconButton
                            onClick={() => setCurrentImageIndex(prev => 
                              prev === 0 ? (selectedItem.images?.length || 1) - 1 : prev - 1
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
                              prev === (selectedItem.images?.length || 1) - 1 ? 0 : prev + 1
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
                            {selectedItem.images?.map((_, index: number) => (
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
                  ) : (
                    // ENHANCED PLACEHOLDER: Show better message when no item is selected
                    <Box className={styles.placeholderContainer}>
                      <Typography variant="h5" className={styles.placeholderTitle}>
                        No Product Selected
                      </Typography>
                      <Typography variant="body1" className={styles.placeholderDescription}>
                        Please select a model or product from our shop to start customizing your perfect seat.
                      </Typography>
                                           <Button
                          variant="contained"
                          size="large"
                          onClick={() => router.push('/specials')}
                          startIcon={<ArrowForward />}
                          className={styles.browseShopButton}
                          sx={{ 
                            fontWeight: 400,
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
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
              {selectedItem && (
                <Card className={styles.productInfoCard}>
           <CardContent className={styles.productInfoContent}>
                 {/* Product Title */}
                     <Typography variant="h5" className={styles.productTitle}>
                       {selectedItem.title}
                     </Typography>
                    
                 {/* Product Description */}
                     <Box className={styles.productDescriptionContainer}>
                       {selectedItem.description.split(/[.,]/).filter(sentence => sentence.trim().length > 0).map((sentence, index) => (
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
                                         {/* ===== SELECT SECTION ===== */}
                     <Box className={styles.sectionContainer}>
                       <Typography variant="h6" className={styles.sectionTitle}>
                         Select
                       </Typography>
                      
                                             <Box className={styles.formRow}>
                        {/* Quantity */}
                        <Box className={styles.formField}>
                          <Typography variant="body2" className={styles.fieldLabel}>
                            Quantity:
                          </Typography>
                          <TextField
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            inputProps={{ 
                              min: 1,
                              style: { 
                                height: '18px',
                                fontSize: '14px',
                                padding: '8px 12px'
                              }
                            }}
                            className={styles.textField}
                          />
                        </Box>
                      </Box>
                    </Box>

           {/* Divider */}
                     <Divider className={styles.divider} />

         {/* ===== MATERIAL SELECTION SECTION ===== */}
                   <Box className={styles.sectionContainer}>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                       <Typography variant="h6" className={styles.sectionTitle}>
                         Choose Your Material
                       </Typography>
                                               {selectedTexture !== 'none' && (
                          <Typography variant="body2" sx={{ 
                            color: '#000000', 
                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                            marginRight: '20px'
                          }}>
                            +${textures.find(t => t.id === selectedTexture)?.price || 0}
                          </Typography>
                        )}
                     </Box>
                    
                                         {/* Selected Material Name - Removed to show only on hover */}
                    
                                                                                                                               <Box className={styles.materialOptionsContainer}>
                        {textures.map((texture) => (
                                                    <Tooltip key={texture.id} title={texture.name} placement="top">
                            <Box
                              onClick={() => setSelectedTexture(texture.id)}
                              className={`${styles.materialOption} ${selectedTexture === texture.id ? styles.selected : ''}`}
                            >
                              {texture.id === 'none' ? (
                                // NONE OPTION: Special display for "None" option
                                <Box className={styles.noneOption}>
                                  <Typography 
                                    variant="caption" 
                                    className={styles.noneText}
                                  >
                                    None
                                  </Typography>
                                </Box>
                              ) : (
                                // REGULAR TEXTURE: Normal image display for texture options
                                <Image
                                  src={texture.image}
                                  alt={texture.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              {selectedTexture === texture.id && (
                                <Box className={`${styles.selectedOverlay} ${texture.id === 'none' ? styles.none : ''}`}>
                                  <CheckCircle sx={{ 
                                    color: texture.id === 'none' ? '#d32f2f' : 'white', 
                                    fontSize: { xs: 18, sm: 20, md: 24 } 
                                  }} />
                                </Box>
                              )}
                            </Box>
                          </Tooltip>
                         ))}
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
                       
                     </Box>
                     
                     {/* Loading State */}
                     {colorsLoading && (
                       <Box sx={{ textAlign: 'center', py: 2 }}>
                         <Typography variant="body2" color="text.secondary">
                           Loading colors...
                         </Typography>
                       </Box>
                     )}
                     
                     {/* Error State */}
                     {colorsError && (
                       <Box sx={{ textAlign: 'center', py: 2 }}>
                         <Typography variant="body2" color="error">
                           {colorsError}
                         </Typography>
                       </Box>
                     )}
                     
                                           {/* Colors Display */}
                      {!colorsLoading && !colorsError && (
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
                          
                          {/* API Colors */}
                          {apiColors.map((color) => (
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
                          ))}
                        </Box>
                      )}
                  </Box>

                  {/* Divider */}
                  <Divider sx={{ my: { xs: 1, sm: 1, md: 1.5 , lg: 1.5 , xl:1.5} }} />

       {/* ===== STITCHING PATTERN SECTION ===== */}
                    <Box className={styles.sectionContainer}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" className={styles.sectionTitle}>
                          Choose Your Stitching Pattern
                        </Typography>
                                                 {selectedStitching !== 'none' && (
                           <Typography variant="body2" sx={{ 
                             color: '#000000', 
                             fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                             marginRight: '20px'
                           }}>
                             +${stichtingtextures.find(s => s.id === selectedStitching)?.price || 0}
                           </Typography>
                         )}
                      </Box>
                     
                     <Box className={styles.stitchingOptionsContainer}>
                       {stichtingtextures.map((stitching) => (
                         <Tooltip key={stitching.id} title={stitching.name} placement="top">
                           <Box
                             onClick={() => setSelectedStitching(stitching.id)}
                             className={`${styles.stitchingOption} ${selectedStitching === stitching.id ? styles.selected : ''}`}
                           >
                           {stitching.id === 'none' ? (
                             <Box className={styles.noneOption}>
                               <Typography 
                                 variant="caption" 
                                 className={styles.noneText}
                               >
                                 None
                               </Typography>
                             </Box>
                           ) : (
                             <Image
                               src={stitching.image}
                               alt={stitching.name}
                               fill
                               style={{ objectFit: 'cover' }}
                             />
                           )}
                           {selectedStitching === stitching.id && (
                             <Box className={`${styles.selectedOverlay} ${stitching.id === 'none' ? styles.none : ''}`}>
                               <CheckCircle sx={{ 
                                 color: stitching.id === 'none' ? '#d32f2f' : 'white', 
                                 fontSize: { xs: 18, sm: 20, md: 24 } 
                               }} />
                             </Box>
                           )}
                         </Box>
                         </Tooltip>
                       ))}
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
                                                 {/* Vehicle Year */}
                         <Box className={styles.formField}>
                           <Typography variant="body2" className={styles.fieldLabel}>
                             Vehicle Year:
                           </Typography>
                                                       <FormControl className={styles.formControl}>
                              <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                displayEmpty
                                className={styles.selectField}
                              >
                               <MenuItem value="" disabled>
                                Year
                               </MenuItem>
                               {vehicleYears.map((year) => (
                                 <MenuItem key={year.id} value={year.id}>
                                   {year.name}
                                 </MenuItem>
                               ))}
                             </Select>
                           </FormControl>
                         </Box>

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
                                 disabled={vehicleModelsLoading}
                               >
                                <MenuItem value="" disabled>
                                  {vehicleModelsLoading ? 'Loading models...' : 'Model'}
                                </MenuItem>
                                {vehicleModelsError ? (
                                  <MenuItem value="" disabled>
                                    Error loading models
                                  </MenuItem>
                                ) : (
                                  apiVehicleModels.map((model) => (
                                    <MenuItem key={model.id} value={model.id.toString()}>
                                      {model.name}
                                    </MenuItem>
                                  ))
                                )}
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
                                 disabled={vehicleTrimsLoading}
                               >
                                <MenuItem value="" disabled>
                                  {vehicleTrimsLoading ? 'Loading trims...' : 'Select Trim'}
                                </MenuItem>
                                {vehicleTrimsError ? (
                                  <MenuItem value="" disabled>
                                    Error loading trims
                                  </MenuItem>
                                ) : (
                                  apiVehicleTrims.map((trim) => (
                                    <MenuItem key={trim.id} value={trim.id.toString()}>
                                      {trim.name}
                                    </MenuItem>
                                  ))
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
                             </Typography>
                                                           {selectedRecline && (
                                <Typography variant="body2" sx={{ 
                                  color: '#000000', 
                                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                                }}>
                                  +${reclineOptions.find(r => r.id === selectedRecline)?.price || 0}
                                </Typography>
                              )}
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
                              {reclineOptions.map((recline) => (
                                <MenuItem key={recline.id} value={recline.id}>
                                  {recline.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Child Restraint */}
                        <Box className={styles.formField}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" className={styles.fieldLabel}>
                              Child Restraint:
                            </Typography>
                                                         {selectedChildRestraint && (
                               <Typography variant="body2" sx={{ 
                                 color: '#000000', 
                                 fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                               }}>
                                 +${childRestraintOptions.find(c => c.id === selectedChildRestraint)?.price || 0}
                               </Typography>
                             )}
                          </Box>
                          <FormControl className={styles.formControl}>
                             <Select
                               value={selectedChildRestraint}
                               onChange={(e) => setSelectedChildRestraint(e.target.value)}
                               displayEmpty
                               className={styles.selectField}
                             >
                              <MenuItem value="" disabled>
                                Child Restraint
                              </MenuItem>
                              {childRestraintOptions.map((restraint) => (
                                <MenuItem key={restraint.id} value={restraint.id}>
                                  {restraint.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* 6 Motor Back Relaxer */}
                        <Box className={styles.formField}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" className={styles.fieldLabel}>
                              6 Motor Back Relaxer:
                            </Typography>
                                                         {selectedMotorBackRelaxer && (
                               <Typography variant="body2" sx={{ 
                                 color: '#000000', 
                                 fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                               }}>
                                 +${motorBackRelaxerOptions.find(m => m.id === selectedMotorBackRelaxer)?.price || 0}
                               </Typography>
                             )}
                          </Box>
                          <FormControl className={styles.formControl}>
                             <Select
                               value={selectedMotorBackRelaxer}
                               onChange={(e) => setSelectedMotorBackRelaxer(e.target.value)}
                               displayEmpty
                               className={styles.selectField}
                             >
                              <MenuItem value="" disabled>
                                Motor Back Relaxer
                              </MenuItem>
                              {motorBackRelaxerOptions.map((relaxer) => (
                                <MenuItem key={relaxer.id} value={relaxer.id}>
                                  {relaxer.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Lumber */}
                        <Box className={styles.formField}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" className={styles.fieldLabel}>
                              Lumber:
                            </Typography>
                                                         {selectedLumber && (
                               <Typography variant="body2" sx={{ 
                                 color: '#000000', 
                                 fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                               }}>
                                 +${lumberOptions.find(l => l.id === selectedLumber)?.price || 0}
                               </Typography>
                             )}
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
                              {lumberOptions.map((lumber) => (
                                <MenuItem key={lumber.id} value={lumber.id}>
                                  {lumber.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Heating and Cooling */}
                        <Box className={styles.formField}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" className={styles.fieldLabel}>
                              Heating and Cooling:
                            </Typography>
                                                         {selectedHeatingCooling && (
                               <Typography variant="body2" sx={{ 
                                 color: '#000000', 
                                 fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                               }}>
                                 +${heatingCoolingOptions.find(h => h.id === selectedHeatingCooling)?.price || 0}
                               </Typography>
                             )}
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
                              {heatingCoolingOptions.map((heatingCooling) => (
                                <MenuItem key={heatingCooling.id} value={heatingCooling.id}>
                                  {heatingCooling.name}
                                </MenuItem>
                              ))}
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
                              </Typography>
                                                             {selectedSeatType && (
                                 <Typography variant="body2" sx={{ 
                                   color: '#000000', 
                                   fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                                 }}>
                                   +${seatTypeOptions.find(s => s.id === selectedSeatType)?.price || 0}
                                 </Typography>
                               )}
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
                                {seatTypeOptions.map((seatType) => (
                                  <MenuItem key={seatType.id} value={seatType.id}>
                                    {seatType.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Item Type */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Item Type:
                              </Typography>
                                                                                          {selectedItemType && selectedItemType !== '' && (() => {
                               const price = itemTypeOptions.find(i => i.id === selectedItemType)?.price || 0;
                               if (price !== 0) {
                                 return (
                                   <Typography variant="body2" sx={{ 
                                     color: '#000000', 
                                     fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                                   }}>
                                     {price > 0 ? `+$${price}` : `-$${Math.abs(price)}`}
                                   </Typography>
                                 );
                               }
                               return null;
                             })()}
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
                                {itemTypeOptions.map((itemType) => (
                                  <MenuItem key={itemType.id} value={itemType.id}>
                                    {itemType.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Seat Style */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Seat Style:
                              </Typography>
                           {selectedSeatStyle && (
                                 <Typography variant="body2" sx={{ 
                                   color: '#000000', 
                                   fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                                 }}>
                                   +${seatStyleOptions.find(s => s.id === selectedSeatStyle)?.price || 0}
                                 </Typography>
                               )}
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
                                {seatStyleOptions.map((seatStyle) => (
                                  <MenuItem key={seatStyle.id} value={seatStyle.id}>
                                    {seatStyle.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Material Type */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Material Type:
                              </Typography>
                                                             {selectedMaterialType && (
                                 <Typography variant="body2" sx={{ 
                                   color: '#000000', 
                                   fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                                 }}>
                                   +${materialTypeOptions.find(m => m.id === selectedMaterialType)?.price || 0}
                                 </Typography>
                               )}
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
                                {materialTypeOptions.map((materialType) => (
                                  <MenuItem key={materialType.id} value={materialType.id}>
                                    {materialType.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Included Arm */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Included Arm:
                              </Typography>
                                                             {selectedIncludedArm && (
                                 <Typography variant="body2" sx={{ 
                                   color: '#000000', 
                                   fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                                 }}>
                                   +${includedArmOptions.find(i => i.id === selectedIncludedArm)?.price || 0}
                                 </Typography>
                               )}
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
                                {includedArmOptions.map((includedArm) => (
                                  <MenuItem key={includedArm.id} value={includedArm.id}>
                                    {includedArm.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Extra Arm */}
                          <Box className={styles.formField}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" className={styles.fieldLabel}>
                                Extra Arm:
                              </Typography>
                                                             {selectedExtraArm && (
                                 <Typography variant="body2" sx={{ 
                                   color: '#000000', 
                                   fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                                 }}>
                                   +${extraArmOptions.find(e => e.id === selectedExtraArm)?.price || 0}
                                 </Typography>
                               )}
                            </Box>
                            <FormControl className={styles.formControl}>
                               <Select
                                 value={selectedExtraArm}
                                 onChange={(e) => setSelectedExtraArm(e.target.value)}
                                 displayEmpty
                                 className={styles.selectField}
                               >
                                <MenuItem value="" disabled>
                                  Extra Arm
                                </MenuItem>
                                {extraArmOptions.map((extraArm) => (
                                  <MenuItem key={extraArm.id} value={extraArm.id}>
                                    {extraArm.name}
                                  </MenuItem>
                                ))}
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
      
              {selectedItem && selectedTexture && (
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
                            const materialName = selectedTexture === 'none' ? 'No Material' : textures.find(t => t.id === selectedTexture)?.name;
                                                         const colorName = selectedColor === 'none' ? 'No Color' : apiColors.find(c => c.id.toString() === selectedColor)?.name;
                            const stitchingName = selectedStitching === 'none' ? 'No Stitching' : stichtingtextures.find(s => s.id === selectedStitching)?.name;

                            dispatch(addItem({
                              id: selectedItem.id,
                              title: `${selectedItem.title} - ${materialName} ${colorName} ${stitchingName}`,
                              price: `$${totalPrice}`,
                              image: selectedItem.image,
                              description: `${selectedItem.description} with ${materialName} material, ${colorName} color, and ${stitchingName} stitching`,
                              category: selectedItem.category
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