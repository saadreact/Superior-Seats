'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Grid } from '@mui/material'; 
import { testimonials } from '@/data/testimonials';
import Header from '@/components/Header';
// CONSOLIDATED IMPORTS: All customization data now comes from a single file
import { textures, colors, objects, stichtingtextures, vehicleYears, vehicleMakes, vehicleModels, vehicleTrims, reclineOptions, childRestraintOptions, motorBackRelaxerOptions, lumberOptions, heatingCoolingOptions, seatTypeOptions, itemTypeOptions, seatStyleOptions, materialTypeOptions, includedArmOptions, extraArmOptions } from '@/data/CustomizedSeat';
// NEW IMPORTS: Added to enable communication between ShopGallery and CustomizedSeat components
import { useSelectedItem } from '@/contexts/SelectedItemContext'; // Context hook to access selected item data
import { useRouter } from 'next/navigation'; // Next.js router for programmatic navigation
// NEW IMPORT: Added to enable cart functionality
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import HeroSectionCommon from './common/HeroSectionaCommon';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
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
  const [selectedCustomerType, setSelectedCustomerType] = useState('');
  const [quantity, setQuantity] = useState(1);

  const calculateTotalPrice = () => {
    // Get base seat price (from selected item or default objects)
    const baseSeatPrice = selectedItem ? parseFloat(selectedItem.price.replace('$', '')) : objects[currentObjectIndex].price;
    
    // Get material/texture price
    const texturePrice = textures.find(t => t.id === selectedTexture)?.price || 0;
    
    // Get color price
    const colorPrice = colors.find(c => c.id === selectedColor)?.price || 0;
    
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {showHeader && <Header />}
      
            {showHero && (
        /* Hero Section */
        <HeroSectionCommon
         title="Customize Your Seat"
         description="Design your perfect seat with our interactive 3D configurator"
         height={{
          xs: '75px',
          sm: '70px', 
          md: '75px',
          lg: '90px',
          xl: '100px',
          xxl: '110px'
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
      <Container maxWidth="xl" sx={{ 
        py: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 5 },
        px: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4 },
        mx: 'auto',
        maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '100%' }
      }}>
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: '1fr 1fr', lg: '1fr 1fr' }, 
          gap: { xs: 2, sm: 3, md: 3, lg: 3, xl: 3 },
          alignItems: 'start',
          width: '100%'
        }}>
          {/* Left Column - 3D Viewer */}
          <Grid sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1', lg: 'span 1' } }}>
                         <Card sx={{ 
               height: { xs: '350px', sm: '400px', md: '500px', lg: '600px' }, 
               position: 'relative', 
               overflow: 'hidden', 
               boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
               borderRadius: { xs: 2, md: 3 },
               display: 'flex',
               flexDirection: 'column'
             }}>
              <Box
                sx={{
                  height: '100%',
                  background: `linear-gradient(45deg, #f5f5f5 25%, transparent 25%), 
                              linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), 
                              linear-gradient(45deg, transparent 75%, #f5f5f5 75%), 
                              linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >

                
                {/* MODIFIED IMAGE DISPLAY AREA: Now conditionally renders selected item image or placeholder */}
                <Box sx={{ 
                  height: '100%', 
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
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
                                  bgcolor: index === currentImageIndex ? 'primary.main' : 'rgba(255,255,255,0.6)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    bgcolor: index === currentImageIndex ? 'primary.main' : 'rgba(255,255,255,0.8)',
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
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                      px: 3
                    }}>
                      <Typography variant="h5" sx={{ 
                        color: 'text.primary',
                        fontWeight: 'bold',
                        mb: 2,
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                      }}>
                        No Product Selected
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: 'text.secondary',
                        mb: 3,
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        maxWidth: '400px'
                      }}>
                        Please select a model or product from our shop to start customizing your perfect seat.
                      </Typography>
                                             <Button
                         variant="contained"
                         size="large"
                         onClick={() => router.push('/specials')}
                         startIcon={<ArrowForward />}
                         sx={{
                           bgcolor: 'primary.main',
                           color: 'white',
                           minWidth: '80px',
                           maxWidth: '110px',
                           height: '40px',
                           fontSize: '0.7rem',
                           whiteSpace: 'nowrap',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           textTransform: 'none',
                           '& .MuiButton-startIcon': {
                             marginRight: '4px',
                           },
                           '&:hover': {
                             bgcolor: 'primary.dark',
                             transform: 'scale(1.05)',
                           },
                           transition: 'all 0.3s ease'
                         }}
                       >
                         Browse Shop
                       </Button>
                    </Box>
                  )}
                  
                  {/* REMOVED: Overlapping title and info displays - will be shown below the image instead */}
                </Box>
                
                {/* MODIFIED VIEWER CONTROLS: Added back to shop button, removed navigation arrows */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: { xs: 10, sm: 15, md: 20 }, 
                  right: { xs: 10, sm: 15, md: 20 },
                  display: 'flex',
                  gap: { xs: 0.5, sm: 1 }
                }}>
                  {/* NEW BACK TO SHOP BUTTON: Only shows when an item is selected */}
                  {selectedItem && ( // CONDITIONAL RENDERING: Only show if an item is selected
                    <Tooltip title="Back to Shop">
                      <IconButton 
                        size={isSmallMobile ? "small" : "medium"}
                        onClick={() => {
                          clearSelectedItem(); // FUNCTION: Clear the selected item from context
                          router.push('/shop'); // FUNCTION: Navigate back to shop page
                        }}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.95)', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,1)',
                            transform: 'scale(1.05)',
                          }
                        }}
                      >
                        ← {/* ICON: Back arrow */}
                      </IconButton>
                    </Tooltip>
                  )}
                  {/* EXISTING ZOOM CONTROLS: Kept for future functionality */}
                  <Tooltip title="Zoom In">
                    <IconButton 
                      size={isSmallMobile ? "small" : "medium"}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.95)', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <ZoomIn sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add to Favorites">
                    <IconButton 
                      size={isSmallMobile ? "small" : "medium"}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.95)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <Favorite sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                    </IconButton>
                  </Tooltip>
                                 </Box>
               </Box>

             </Card>
             
                           {/* NEW CONTAINER: Product Information - Title and Description */}
              {selectedItem && (
                <Card sx={{ 
                  mt: { xs: 2, sm: 3 },
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: { xs: '180px', sm: '200px', md: '120px', lg: '200px' }
                }}>
                                     <CardContent sx={{ 
                     p: { xs: 1.5, sm: 2 },
                     '&:last-child': { pb: { xs: 1.5, sm: 2 } },
                     height: '100%',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'flex-start',
                     pt: { xs: 1.5, sm: 2 }
                   }}>
                    {/* Product Title */}
                    <Typography variant="h5" sx={{ 
                      fontWeight: 400, 
                      color: 'text.primary',
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                      mb: { xs: 1, sm: 1.5 },
                      textAlign: 'center'
                    }}>
                      {selectedItem.title}
                    </Typography>
                    
                                         {/* Product Description */}
                     <Box sx={{ 
                       width: '100%',
                       textAlign: 'left'
                     }}>
                       {selectedItem.description.split(/[.,]/).filter(sentence => sentence.trim().length > 0).map((sentence, index) => (
                         <Box key={index} sx={{ 
                           display: 'flex', 
                           alignItems: 'flex-start',
                           mb: 1,
                           gap: 1
                         }}>
                           <Typography 
                             component="span" 
                             sx={{ 
                               color: 'primary.main',
                               fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                               fontWeight: 'bold',
                               mt: 0.2
                             }}
                           >
                             •
                           </Typography>
                           <Typography variant="body1" sx={{ 
                             color: 'text.secondary',
                             fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                             lineHeight: 1.4,
                             flex: 1
                           }}>
                             {sentence.trim()}
                           </Typography>
                         </Box>
                       ))}
                     </Box>
                  </CardContent>
               </Card>
             )}
          </Grid>

          {/* Right Column - Customization Options */}
          <Grid sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1', lg: 'span 1' } }}>
            <Card sx={{ 
              height: { xs: '350px', sm: '400px', md: '500px', lg: '600px' },
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ 
               // p: { xs: 2, sm: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {/* Scrollable Content Container */}
                <Box sx={{
                  flex: 1,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#a8a8a8',
                    },
                  },
                }}>
                  {/* Always show customization options, regardless of product selection */}
                  <>
                    {/* Select Section - Customer Type and Quantity */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ 
                        mb: { xs: 2, sm: 3 }, 
                        fontWeight: 'bold', 
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}>
                        Select
                      </Typography>
                      
                                             <Box sx={{
                         display: 'flex',
                         flexDirection: 'row',
                         justifyContent: 'flex-start',
                         width: '100%',
                         flexWrap: 'wrap',
                         gap: 3
                       }}>
                        {/* Customer Type */}
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          minWidth: '200px',
                          flex: '0 0 200px'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}>
                            Customer Type:
                          </Typography>
                          <FormControl sx={{ minWidth: '200px' }}>
                            <Select
                              value={selectedCustomerType}
                              onChange={(e) => setSelectedCustomerType(e.target.value)}
                              displayEmpty
                              sx={{
                                height: '40px',
                                fontSize: '14px',
                                '& .MuiSelect-select': {
                                  padding: '8px 12px',
                                },
                                '& .MuiOutlinedInput-root': {
                                  borderColor: selectedCustomerType ? '#d32f2f' : undefined,
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: selectedCustomerType ? '#d32f2f' : undefined,
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: selectedCustomerType ? '#d32f2f' : undefined,
                                  }
                                }
                              }}
                            >
                              <MenuItem value="" disabled>
                                Select Customer Type
                              </MenuItem>
                              <MenuItem value="retail">Retail</MenuItem>
                              <MenuItem value="wholesale">Wholesale</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Quantity */}
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          minWidth: '200px',
                          flex: '0 0 200px'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}>
                            Quantity:
                          </Typography>
                          <TextField
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            inputProps={{ 
                              min: 1,
                              style: { 
                                height: '24px',
                                fontSize: '14px',
                                padding: '8px 12px'
                              }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: '40px',
                                borderColor: quantity > 0 ? '#d32f2f' : undefined,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: quantity > 0 ? '#d32f2f' : undefined,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: quantity > 0 ? '#d32f2f' : undefined,
                                }
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Divider */}
                    <Divider sx={{ my: 3 }} />

                    {/* Material Selection Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ 
                      mb: { xs: 2, sm: 3 }, 
                      fontWeight: 'bold', 
                      color: 'text.primary',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}>
                      Choose Your Material
                    </Typography>
                    
                    {/* Selected Material Name */}
                    {selectedTexture && (
                      <Typography variant="h5" sx={{ 
                        mb: { xs: 2, sm: 3 }, 
                        fontWeight: 'bold', 
                        color: selectedTexture === 'none' ? 'text.secondary' : 'primary.main', 
                        textAlign: 'center',
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                      }}>
                        {textures.find(t => t.id === selectedTexture)?.name}
                      </Typography>
                    )}
                    
                                          <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 1, sm: 1.5, md: 2 }, 
                        justifyContent: 'flex-start', 
                        flexWrap: 'wrap',
                        mb: { xs: 2, sm: 3 }
                      }}>
                      {textures.map((texture) => (
                        <Box
                          key={texture.id}
                          onClick={() => setSelectedTexture(texture.id)}
                          sx={{
                            width: { xs: 50, sm: 55, md: 60 },
                            height: { xs: 50, sm: 55, md: 60 },
                            borderRadius: 2,
                            border: '3px solid',
                            borderColor: selectedTexture === texture.id ? 'primary.main' : 'grey.300',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              borderColor: 'primary.main',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            }
                          }}
                        >
                          {texture.id === 'none' ? (
                            // NONE OPTION: Special display for "None" option
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed #ccc'
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                  color: 'text.secondary',
                                  textAlign: 'center',
                                  fontWeight: 'bold'
                                }}
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
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: texture.id === 'none' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CheckCircle sx={{ 
                                color: texture.id === 'none' ? 'primary.main' : 'white', 
                                fontSize: { xs: 18, sm: 20, md: 24 } 
                              }} />
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                    
                    
                  </Box>

                  {/* Divider */}
                  <Divider sx={{ my: 3 }} />

                  {/* Color Selection Section */}
                  <Box>
                    <Typography variant="h6" sx={{ 
                      mb: { xs: 2, sm: 3 }, 
                      fontWeight: 'bold', 
                      color: 'text.primary',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}>
                      Choose Your Color
                    </Typography>
                                         <Box sx={{ 
                       display: 'flex', 
                       gap: { xs: 1, sm: 1.5 }, 
                       flexWrap: 'wrap', 
                       justifyContent: 'flex-start',
                       mb: { xs: 2, sm: 3 }
                     }}>
                      {colors.map((color) => (
                        <Tooltip key={color.id} title={color.name}>
                          <Box
                            onClick={() => setSelectedColor(color.id)}
                            sx={{
                              width: { xs: 45, sm: 48, md: 50 },
                              height: { xs: 45, sm: 48, md: 50 },
                              borderRadius: '50%',
                              backgroundColor: color.id === 'none' ? '#f5f5f5' : color.hex,
                              border: '4px solid',
                              borderColor: selectedColor === color.id ? 'primary.main' : 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.15)',
                                borderColor: 'primary.secondary',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative', // ADDED: Required for absolute positioning of child elements
                            }}
                          >
                            {color.id === 'none' && (
                              // NONE OPTION: Special display for "None" color option
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontSize: { xs: '0.5rem', sm: '0.6rem' },
                                  color: selectedColor === color.id ? 'primary.main' : 'text.secondary',
                                  fontWeight: 'bold',
                                  // Let parent flexbox center it, no absolute positioning
                                }}
                              >
                                None
                              </Typography>
                            )}
                            {selectedColor === color.id && (
                              <CheckCircle sx={{
                                color: color.id === 'none' ? 'primary.main' : 'white',
                                fontSize: color.id === 'none' ? { xs: 12, sm: 14, md: 16 } : { xs: 16, sm: 17, md: 18 }, // Smaller tick for 'None'
                                position: 'absolute', // Absolute positioning for tick
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 2 // Ensure tick is on top
                              }} />
                            )}
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Divider sx={{ my: 3 }} />

                                     {/* Stitching Pattern Section */}
                   <Box sx={{ mb: 4 }}>
                     <Typography variant="h6" sx={{ 
                       mb: { xs: 2, sm: 3 }, 
                       fontWeight: 'bold', 
                       color: 'text.primary',
                       fontSize: { xs: '1.1rem', sm: '1.25rem' }
                     }}>
                       Choose Your Stitching Pattern
                     </Typography>
                     
                     {/* Selected Stitching Pattern Name */}
                     {selectedStitching && (
                       <Typography variant="h5" sx={{ 
                         mb: { xs: 2, sm: 3 }, 
                         fontWeight: 'bold', 
                         color: selectedStitching === 'none' ? 'text.secondary' : 'primary.main', 
                         textAlign: 'center',
                         fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                       }}>
                         {stichtingtextures.find(s => s.id === selectedStitching)?.name}
                       </Typography>
                     )}
                     
                     <Box sx={{ 
                       display: 'flex', 
                       gap: { xs: 1, sm: 1.5, md: 2 }, 
                       justifyContent: 'flex-start', 
                       flexWrap: 'wrap',
                       mb: { xs: 2, sm: 3 }
                     }}>
                       {stichtingtextures.map((stitching) => (
                         <Box
                           key={stitching.id}
                           onClick={() => setSelectedStitching(stitching.id)}
                           sx={{
                             width: { xs: 50, sm: 55, md: 60 },
                             height: { xs: 50, sm: 55, md: 60 },
                             borderRadius: 2,
                             border: '3px solid',
                             borderColor: selectedStitching === stitching.id ? 'primary.main' : 'grey.300',
                             cursor: 'pointer',
                             transition: 'all 0.3s ease',
                             position: 'relative',
                             overflow: 'hidden',
                             '&:hover': {
                               transform: 'scale(1.1)',
                               borderColor: 'primary.main',
                               boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                             }
                           }}
                         >
                           {stitching.id === 'none' ? (
                             <Box
                               sx={{
                                 width: '100%',
                                 height: '100%',
                                 backgroundColor: '#f5f5f5',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 border: '2px dashed #ccc'
                               }}
                             >
                               <Typography 
                                 variant="caption" 
                                 sx={{ 
                                   fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                   color: 'text.secondary',
                                   textAlign: 'center',
                                   fontWeight: 'bold'
                                 }}
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
                             <Box
                               sx={{
                                 position: 'absolute',
                                 top: 0,
                                 left: 0,
                                 right: 0,
                                 bottom: 0,
                                 backgroundColor: stitching.id === 'none' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                               }}
                             >
                               <CheckCircle sx={{ 
                                 color: stitching.id === 'none' ? 'primary.main' : 'white', 
                                 fontSize: { xs: 18, sm: 20, md: 24 } 
                               }} />
                             </Box>
                           )}
                         </Box>
                       ))}
                     </Box>
                   </Box>

                                     {/* Divider */}
                   <Divider sx={{ my: 3 }} />

                                       {/* Vehicle Information Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ 
                        mb: { xs: 2, sm: 3 }, 
                      
                        fontWeight: 'bold', 
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}>
                        Vehicle Information
                      </Typography>
                     
                                           <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        width: '100%',
                        flexWrap: 'wrap',
                        gap: 3
                      }}>
                                                 {/* Vehicle Year */}
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Vehicle Year:
                           </Typography>
                                                       <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedYear ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedYear ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedYear ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Year
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
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Vehicle Make:
                           </Typography>
                                                       <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedMake}
                                onChange={(e) => setSelectedMake(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedMake ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedMake ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedMake ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Make
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
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Vehicle Model:
                           </Typography>
                                                       <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedModel ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedModel ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedModel ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Model
                               </MenuItem>
                               {vehicleModels.map((model) => (
                                 <MenuItem key={model.id} value={model.id}>
                                   {model.name}
                                 </MenuItem>
                               ))}
                             </Select>
                           </FormControl>
                         </Box>

                                                 {/* Vehicle Trim */}
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Vehicle Trim:
                           </Typography>
                                                       <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedTrim}
                                onChange={(e) => setSelectedTrim(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedTrim ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedTrim ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedTrim ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Trim
                               </MenuItem>
                               {vehicleTrims.map((trim) => (
                                 <MenuItem key={trim.id} value={trim.id}>
                                   {trim.name}
                                 </MenuItem>
                               ))}
                             </Select>
                           </FormControl>
                         </Box>
                      </Box>
                   </Box>

                                       {/* Divider */}
                    <Divider sx={{ my: 3 }} />

                                         {/* Variation Section */}
                     <Box sx={{ mb: 3 }}>
                       <Typography variant="h6" sx={{ 
                         mb: { xs: 2, sm: 3 }, 
                         fontWeight: 'bold', 
                         color: 'text.primary',
                         fontSize: { xs: '1.1rem', sm: '1.25rem' }
                       }}>
                         Variation
                       </Typography>
                      
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        width: '100%',
                        flexWrap: 'wrap',
                        gap: 3
                      }}>
                        {/* Recline */}
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          minWidth: '200px',
                          flex: '0 0 200px'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}>
                            Recline:
                          </Typography>
                                                     <FormControl sx={{ minWidth: '200px' }}>
                             <Select
                               value={selectedRecline}
                               onChange={(e) => setSelectedRecline(e.target.value)}
                               displayEmpty
                               sx={{
                                 height: '40px',
                                 fontSize: '14px',
                                 '& .MuiSelect-select': {
                                   padding: '8px 12px',
                                 },
                                 '& .MuiOutlinedInput-root': {
                                   borderColor: selectedRecline ? '#d32f2f' : undefined,
                                   '&:hover .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedRecline ? '#d32f2f' : undefined,
                                   },
                                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedRecline ? '#d32f2f' : undefined,
                                   }
                                 }
                               }}
                             >
                              <MenuItem value="" disabled>
                                Select Recline
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
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          minWidth: '200px',
                          flex: '0 0 200px'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}>
                            Child Restraint:
                          </Typography>
                                                     <FormControl sx={{ minWidth: '200px' }}>
                             <Select
                               value={selectedChildRestraint}
                               onChange={(e) => setSelectedChildRestraint(e.target.value)}
                               displayEmpty
                               sx={{
                                 height: '40px',
                                 fontSize: '14px',
                                 '& .MuiSelect-select': {
                                   padding: '8px 12px',
                                 },
                                 '& .MuiOutlinedInput-root': {
                                   borderColor: selectedChildRestraint ? '#d32f2f' : undefined,
                                   '&:hover .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedChildRestraint ? '#d32f2f' : undefined,
                                   },
                                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedChildRestraint ? '#d32f2f' : undefined,
                                   }
                                 }
                               }}
                             >
                              <MenuItem value="" disabled>
                                Select Child Restraint
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
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          minWidth: '200px',
                          flex: '0 0 200px'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}>
                            6 Motor Back Relaxer:
                          </Typography>
                                                     <FormControl sx={{ minWidth: '200px' }}>
                             <Select
                               value={selectedMotorBackRelaxer}
                               onChange={(e) => setSelectedMotorBackRelaxer(e.target.value)}
                               displayEmpty
                               sx={{
                                 height: '40px',
                                 fontSize: '14px',
                                 '& .MuiSelect-select': {
                                   padding: '8px 12px',
                                 },
                                 '& .MuiOutlinedInput-root': {
                                   borderColor: selectedMotorBackRelaxer ? '#d32f2f' : undefined,
                                   '&:hover .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedMotorBackRelaxer ? '#d32f2f' : undefined,
                                   },
                                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedMotorBackRelaxer ? '#d32f2f' : undefined,
                                   }
                                 }
                               }}
                             >
                              <MenuItem value="" disabled>
                                Select Motor Back Relaxer
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
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          minWidth: '200px',
                          flex: '0 0 200px'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}>
                            Lumber:
                          </Typography>
                                                     <FormControl sx={{ minWidth: '200px' }}>
                             <Select
                               value={selectedLumber}
                               onChange={(e) => setSelectedLumber(e.target.value)}
                               displayEmpty
                               sx={{
                                 height: '40px',
                                 fontSize: '14px',
                                 '& .MuiSelect-select': {
                                   padding: '8px 12px',
                                 },
                                 '& .MuiOutlinedInput-root': {
                                   borderColor: selectedLumber ? '#d32f2f' : undefined,
                                   '&:hover .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedLumber ? '#d32f2f' : undefined,
                                   },
                                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedLumber ? '#d32f2f' : undefined,
                                   }
                                 }
                               }}
                             >
                              <MenuItem value="" disabled>
                                Select Lumber
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
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          minWidth: '200px',
                          flex: '0 0 200px'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}>
                            Heating and Cooling:
                          </Typography>
                                                     <FormControl sx={{ minWidth: '200px' }}>
                             <Select
                               value={selectedHeatingCooling}
                               onChange={(e) => setSelectedHeatingCooling(e.target.value)}
                               displayEmpty
                               sx={{
                                 height: '40px',
                                 fontSize: '14px',
                                 '& .MuiSelect-select': {
                                   padding: '8px 12px',
                                 },
                                 '& .MuiOutlinedInput-root': {
                                   borderColor: selectedHeatingCooling ? '#d32f2f' : undefined,
                                   '&:hover .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedHeatingCooling ? '#d32f2f' : undefined,
                                   },
                                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                     borderColor: selectedHeatingCooling ? '#d32f2f' : undefined,
                                   }
                                 }
                               }}
                             >
                              <MenuItem value="" disabled>
                                Select Heating/Cooling
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
                    <Divider sx={{ my: 3 }} />

                                         {/* Seat Section */}
                     <Box sx={{ mb: 3 }}>
                       <Typography variant="h6" sx={{ 
                         mb: { xs: 2, sm: 3 }, 
                         fontWeight: 'bold', 
                         color: 'text.primary',
                         fontSize: { xs: '1.1rem', sm: '1.25rem' }
                       }}>
                         Seat
                       </Typography>
                      
                                             <Box sx={{
                         display: 'flex',
                         flexDirection: 'row',
                         justifyContent: 'flex-start',
                         width: '100%',
                         flexWrap: 'wrap',
                         gap: 3
                       }}>
                                                 {/* Seat Type */}
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Seat Type:
                           </Typography>
                                                      <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedSeatType}
                                onChange={(e) => setSelectedSeatType(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedSeatType ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedSeatType ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedSeatType ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Seat Type
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
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Item Type:
                           </Typography>
                                                      <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedItemType}
                                onChange={(e) => setSelectedItemType(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedItemType ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedItemType ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedItemType ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Item Type
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
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Seat Style:
                           </Typography>
                                                      <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedSeatStyle}
                                onChange={(e) => setSelectedSeatStyle(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedSeatStyle ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedSeatStyle ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedSeatStyle ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Seat Style
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
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Material Type:
                           </Typography>
                                                      <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedMaterialType}
                                onChange={(e) => setSelectedMaterialType(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedMaterialType ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedMaterialType ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedMaterialType ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Material Type
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
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Included Arm:
                           </Typography>
                                                      <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedIncludedArm}
                                onChange={(e) => setSelectedIncludedArm(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedIncludedArm ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedIncludedArm ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedIncludedArm ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Included Arm
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
                         <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           minWidth: '200px',
                           flex: '0 0 200px'
                         }}>
                           <Typography variant="body2" sx={{ 
                             fontWeight: 500,
                             color: 'text.primary',
                             fontSize: { xs: '0.8rem', sm: '0.9rem' }
                           }}>
                             Extra Arm:
                           </Typography>
                                                      <FormControl sx={{ minWidth: '200px' }}>
                              <Select
                                value={selectedExtraArm}
                                onChange={(e) => setSelectedExtraArm(e.target.value)}
                                displayEmpty
                                sx={{
                                  height: '40px',
                                  fontSize: '14px',
                                  '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderColor: selectedExtraArm ? '#d32f2f' : undefined,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedExtraArm ? '#d32f2f' : undefined,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: selectedExtraArm ? '#d32f2f' : undefined,
                                    }
                                  }
                                }}
                              >
                               <MenuItem value="" disabled>
                                 Select Extra Arm
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
                    <Divider sx={{ my: 3 }} />
                    </>
                </Box>
              </CardContent>
            </Card>
            
                   {/* ===== PRICE BREAKDOWN CONTAINER - RIGHT BOTTOM SECTION ===== */}
      
              {selectedItem && selectedTexture && (
                <Card sx={{ 
                  mt: { xs: 2, sm: 3, md: 2, lg: 2, xl: 3 },
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: { xs: '180px', sm: '200px', md: '120px', lg: '200px' }
                }}>
                                  <CardContent sx={{ 
                   // p: { xs: 1.5, sm: 2, md: 1, lg: 1, xl: 1 },
                    '&:last-child': { pb: { xs: 1.5, sm: 2 } },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    pt: { xs: 1.5, sm: 2, md: 3, lg: 3, xl: 3 }
                  }}>
                                                                       
                   
                   {/* TWO-ROW PRICE LAYOUT: Base Seat + Material + Color Price in first row, Total Price + Add to Cart in second row */}
                   <Box sx={{
                     display: 'flex',
                     flexDirection: 'column',
                     gap: { xs: 0.5, sm: 1 },
                     mb: 0,
                     width: '100%'
                   }}>
                    {/* FIRST ROW: Base Seat Price, Material Price, Color Price, and Stitching Pattern Price buttons */}
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                      gap: { xs: 0.5, sm: 0.75 },
                      width: '100%'
                    }}>
                      {/* BASE SEAT PRICE BUTTON */}
                      <Button
                        variant="outlined"
                        disabled
                        sx={{
                          bgcolor: 'white',
                          color: '#d32f2f',
                          border: '2px solid #d32f2f',
                          height: '50px',
                          minHeight: '50px',
                          maxHeight: '50px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          py: 0.75,
                          px: 1,
                          width: '100%',
                          minWidth: 0,
                          overflow: 'hidden',
                          '&:hover': {
                            bgcolor: 'white',
                            borderColor: '#d32f2f',
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'white',
                            color: '#d32f2f',
                            borderColor: '#d32f2f',
                            opacity: 1
                          }
                        }}
                      >
                        <Typography variant="h6" sx={{ 
                          fontWeight: 500,
                          fontSize: '1rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center'
                        }}>
                          ${selectedItem ? parseFloat(selectedItem.price.replace('$', '')) : objects[currentObjectIndex].price}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          opacity: 0.9,
                          fontSize: '0.75rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center'
                        }}>
                          Base Seat
                        </Typography>
                      </Button>
                      
                      {/* MATERIAL PRICE BUTTON */}
                      <Button
                        variant="outlined"
                        disabled
                        sx={{
                          bgcolor: 'white',
                          color: '#d32f2f',
                          border: '2px solid #d32f2f',
                          height: '50px',
                          minHeight: '50px',
                          maxHeight: '50px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          py: 0.75,
                          px: 1,
                          width: '100%',
                          minWidth: 0,
                          overflow: 'hidden',
                          '&:hover': {
                            bgcolor: 'white',
                            borderColor: '#d32f2f',
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'white',
                            color: '#d32f2f',
                            borderColor: '#d32f2f',
                            opacity: 1
                          }
                        }}
                      >
                        <Typography variant="h6" sx={{ 
                          fontWeight: 500,
                          fontSize: '1rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center'
                        }}>
                          {selectedTexture === 'none' ? '$0' : `+$${textures.find(t => t.id === selectedTexture)?.price || 0}`}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          opacity: 0.9,
                          fontSize: '0.75rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center'
                        }}>
                          Material
                        </Typography>
                      </Button>
                      
                      {/* COLOR PRICE BUTTON */}
                      <Button
                        variant="outlined"
                        disabled
                        sx={{
                          bgcolor: 'white',
                          color: '#d32f2f',
                          border: '2px solid #d32f2f',
                          height: '50px',
                          minHeight: '50px',
                          maxHeight: '50px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          py: 0.75,
                          px: 1,
                          width: '100%',
                          minWidth: 0,
                          overflow: 'hidden',
                          '&:hover': {
                            bgcolor: 'white',
                            borderColor: '#d32f2f',
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'white',
                            color: '#d32f2f',
                            borderColor: '#d32f2f',
                            opacity: 1
                          }
                        }}
                      >
                        <Typography variant="h6" sx={{ 
                          fontWeight: 500,
                          fontSize: '1rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center'
                        }}>
                          {selectedColor === 'none' ? '$0' : `+$${colors.find(c => c.id === selectedColor)?.price || 0}`}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          opacity: 0.9,
                          fontSize: '0.75rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center'
                        }}>
                          Color
                        </Typography>
                      </Button>
                      
                      {/* STITCHING PATTERN PRICE BUTTON */}
                      <Button
                        variant="outlined"
                        disabled
                        sx={{
                          bgcolor: 'white',
                          color: '#d32f2f',
                          border: '2px solid #d32f2f',
                          height: '50px',
                          minHeight: '50px',
                          maxHeight: '50px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          py: 0.75,
                          px: 1,
                          width: '100%',
                          minWidth: 0,
                          overflow: 'hidden',
                          '&:hover': {
                            bgcolor: 'white',
                            borderColor: '#d32f2f',
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'white',
                            color: '#d32f2f',
                            borderColor: '#d32f2f',
                            opacity: 1
                          }
                        }}
                      >
                        <Typography variant="h6" sx={{ 
                          fontWeight: 500,
                          fontSize: '1rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center'
                        }}>
                          {selectedStitching === 'none' ? '$0' : `+$${stichtingtextures.find(s => s.id === selectedStitching)?.price || 0}`}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          opacity: 0.9,
                          fontSize: '0.75rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center'
                        }}>
                          Stitching
                        </Typography>
                      </Button>
                    </Box>
                                         <Typography variant="h4" sx={{ 
                       mb: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }, 
                       fontWeight: 500, 
                       color: 'black',
                       fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem', lg: '2rem', xl: '2.5rem' },
                       textAlign: 'center'
                     }}>
                       US ${totalPrice.toFixed(2)}
                     </Typography>
                    
                                         {/* SECOND ROW: Add to Cart button only */}
                                                                  <Box sx={{
                         display: 'flex',
                         justifyContent: 'center',
                         width: '100%',
                         mt: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 },
                         mb: 0
                       }}>
                      {/* ADD TO CART BUTTON */}
                                             <Button
                         variant="contained"
                         size="medium"
                         startIcon={<ShoppingCart sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />}
                         onClick={() => {
                            const materialName = selectedTexture === 'none' ? 'No Material' : textures.find(t => t.id === selectedTexture)?.name;
                            const colorName = selectedColor === 'none' ? 'No Color' : colors.find(c => c.id === selectedColor)?.name;
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
                                                   sx={{
                            bgcolor: '#d32f2f',
                            color: 'white',
                            height: '40px',
                            minHeight: '40px',
                            maxHeight: '40px',
                            width: '100%',
                            minWidth: '100%',
                            maxWidth: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 0.5,
                            px: 2,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                            '&:hover': {
                              bgcolor: '#b71c1c',
                            },
                            '& .MuiButton-startIcon': {
                              marginRight: { xs: 0.25, sm: 0.5 },
                            }
                          }}
                       >
                         Add to Cart
                       </Button>
                    </Box>
                </Box>
              </CardContent>
            </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      <Footer />

    </Box>
  );
};

export default CustomizedSeat; 