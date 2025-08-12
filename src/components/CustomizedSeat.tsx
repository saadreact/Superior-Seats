'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Grid } from '@mui/material'; 
import { testimonials } from '@/data/testimonials';
import Header from '@/components/Header';
// CONSOLIDATED IMPORTS: All customization data now comes from a single file
import { textures, colors, objects, stichtingtextures } from '@/data/CustomizedSeat';
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

  const calculateTotalPrice = () => {
    // Get base seat price (from selected item or default objects)
    const baseSeatPrice = selectedItem ? parseFloat(selectedItem.price.replace('$', '')) : objects[currentObjectIndex].price;
    
    // Get material/texture price
    const texturePrice = textures.find(t => t.id === selectedTexture)?.price || 0;
    
    // Get color price
    const colorPrice = colors.find(c => c.id === selectedColor)?.price || 0;
    
    // Get stitching pattern price
    const stitchingPrice = stichtingtextures.find(s => s.id === selectedStitching)?.price || 0;
    
    // Calculate total
    return baseSeatPrice + texturePrice + colorPrice + stitchingPrice;
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
           xs: '18vh',
           sm: '20vh',
           md: '18vh',
           lg: '20vh'
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
        px: { xs: 2, sm: 3 }
      }}>
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: '1fr 1fr', lg: '1fr 1fr' }, 
          gap: { xs: 2, sm: 3 },
          alignItems: 'start'
        }}>
          {/* Left Column - 3D Viewer */}
          <Grid sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1', lg: 'span 1' } }}>
            <Card sx={{ 
              height: { xs: '350px', sm: '400px', md: '500px', lg: '600px' }, 
              position: 'relative', 
              overflow: 'hidden', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: { xs: 2, md: 3 }
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
                    <Image
                      src={selectedItem.image} // DISPLAY: Show the selected item's image
                      alt={selectedItem.title}
                      fill
                      style={{ 
                        objectFit: 'contain',
                        padding: '20px'
                      }}
                    />
                  ) : (
                    // PLACEHOLDER: Show message when no item is selected from shop
                    <Typography variant="h6" sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center',
                      px: 2
                    }}>
                      Select an item from the shop to customize
                    </Typography>
                  )}
                  
                  {/* MODIFIED OBJECT NAME DISPLAY: Now shows selected item title when available */}
                  {selectedItem && ( // CONDITIONAL RENDERING: Only show if an item is selected
                    <Box sx={{
                      position: 'absolute',
                      top: { xs: 10, sm: 15, md: 20 },
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: { xs: 2, sm: 3 },
                      py: { xs: 0.5, sm: 1 },
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)',
                      maxWidth: { xs: '90%', sm: 'auto' }
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                      }}>
                        {selectedItem.title} {/* DISPLAY: Show selected item's title */}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* MODIFIED INSTRUCTIONS/INFO DISPLAY: Now shows selected item price and category */}
                  {selectedItem && ( // CONDITIONAL RENDERING: Only show if an item is selected
                    <Box sx={{
                      position: 'absolute',
                      bottom: { xs: 10, sm: 15, md: 20 },
                      left: '50%',
                      transform: 'translateX(-50%)',
                      textAlign: 'center',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: { xs: 2, sm: 3 },
                      py: { xs: 0.5, sm: 1 },
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)',
                      maxWidth: { xs: '90%', sm: 'auto' }
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.2
                      }}>
                        {selectedItem.price} • {selectedItem.category} {/* DISPLAY: Show selected item's price and category */}
                      </Typography>
                    </Box>
                  )}
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
                p: { xs: 2, sm: 3 },
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
                      justifyContent: 'center', 
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
                      justifyContent: 'center',
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
                       justifyContent: 'center', 
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

                                     {/* ENHANCED PRICE SECTION: Displays base seat price, material price, color price, and total */}
                   {selectedTexture && (
                     <Box sx={{ 
                       mx: { xs: 1, sm: 2 }, // ADDED: Left and right margins
                       overflow: 'hidden' // ADDED: Prevent horizontal scrollbar
                     }}>
                       <Typography variant="h6" sx={{ 
                         mb: { xs: 1.5, sm: 2 }, 
                         fontWeight: 'bold', 
                         color: 'text.primary',
                         fontSize: { xs: '1.1rem', sm: '1.25rem' }
                       }}>
                         Price Breakdown
                       </Typography>
                       
                       {/* TWO-ROW PRICE LAYOUT: Base Seat + Material + Color Price in first row, Total Price + Add to Cart in second row */}
                       <Box sx={{
                         display: 'flex',
                         flexDirection: 'column',
                         gap: { xs: 1, sm: 1.5 },
                         mb: 2,
                         width: '100%' // ADDED: Ensure full width within container
                       }}>
                                                   {/* FIRST ROW: Base Seat Price, Material Price, Color Price, and Stitching Pattern Price buttons */}
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                            gap: { xs: 0.5, sm: 0.75 }, // REDUCED: Smaller gaps to fit better
                            width: '100%' // ADDED: Ensure full width
                          }}>
                                                                                   {/* BASE SEAT PRICE BUTTON: Shows base seat price using standard button */}
                             <Button
                               variant="outlined"
                               disabled
                               sx={{
                                 bgcolor: 'white',
                                 color: '#d32f2f',
                                 border: '2px solid #d32f2f',
                                 minHeight: '60px',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 py: { xs: 0.75, sm: 1 },
                                 px: { xs: 0.5, sm: 1 }, // REDUCED: Smaller horizontal padding
                                 width: '100%', // CHANGED: Use full width of grid cell
                                 height: '50px',
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
                                fontWeight: 'bold',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' }, // REDUCED: Smaller font size for better fit
                                mb: 0.25,
                                lineHeight: 1
                              }}>
                                ${selectedItem ? parseFloat(selectedItem.price.replace('$', '')) : objects[currentObjectIndex].price}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                opacity: 0.9,
                                fontSize: { xs: '0.6rem', sm: '0.7rem' }, // REDUCED: Smaller font size for better fit
                                lineHeight: 1
                              }}>
                               {selectedItem ? selectedItem.title : objects[currentObjectIndex].name}
                             </Typography>
                           </Button>
                           
                                                                                   {/* MATERIAL PRICE BUTTON: Shows selected material/texture price using standard button */}
                             <Button
                               variant="outlined"
                               disabled
                               sx={{
                                 bgcolor: 'white',
                                 color: '#d32f2f',
                                 border: '2px solid #d32f2f',
                                 minHeight: '60px',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 py: { xs: 0.75, sm: 1 },
                                 px: { xs: 0.5, sm: 1 }, // REDUCED: Smaller horizontal padding
                                 width: '100%', // CHANGED: Use full width of grid cell
                                 height: '50px',
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
                                fontWeight: 'bold',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' }, // REDUCED: Smaller font size for better fit
                                mb: 0.25,
                                lineHeight: 1
                              }}>
                                {selectedTexture === 'none' ? '$0' : `+$${textures.find(t => t.id === selectedTexture)?.price || 0}`}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                opacity: 0.9,
                                fontSize: { xs: '0.6rem', sm: '0.7rem' }, // REDUCED: Smaller font size for better fit
                                lineHeight: 1
                              }}>
                               {textures.find(t => t.id === selectedTexture)?.name}
                             </Typography>
                           </Button>
                           
                                                                                   {/* COLOR PRICE BUTTON: Shows selected color price using standard button */}
                             <Button
                               variant="outlined"
                               disabled
                               sx={{
                                 bgcolor: 'white',
                                 color: '#d32f2f',
                                 border: '2px solid #d32f2f',
                                 minHeight: '60px',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 py: { xs: 0.75, sm: 1 },
                                 px: { xs: 0.5, sm: 1 }, // REDUCED: Smaller horizontal padding
                                 width: '100%', // CHANGED: Use full width of grid cell
                                 height: '50px',
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
                                fontWeight: 'bold',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' }, // REDUCED: Smaller font size for better fit
                                mb: 0.25,
                                lineHeight: 1
                              }}>
                                {selectedColor === 'none' ? '$0' : `+$${colors.find(c => c.id === selectedColor)?.price || 0}`}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                opacity: 0.9,
                                fontSize: { xs: '0.6rem', sm: '0.7rem' }, // REDUCED: Smaller font size for better fit
                                lineHeight: 1
                              }}>
                               {colors.find(c => c.id === selectedColor)?.name}
                             </Typography>
                                                        </Button>
                           
                                                                                    {/* STITCHING PATTERN PRICE BUTTON: Shows selected stitching pattern price using standard button */}
                             <Button
                               variant="outlined"
                               disabled
                               sx={{
                                 bgcolor: 'white',
                                 color: '#d32f2f',
                                 border: '2px solid #d32f2f',
                                 minHeight: '60px',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 py: { xs: 0.75, sm: 1 },
                                 px: { xs: 0.5, sm: 1 }, // REDUCED: Smaller horizontal padding
                                 width: '100%', // CHANGED: Use full width of grid cell
                                 height: '50px',
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
                                fontWeight: 'bold',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' }, // REDUCED: Smaller font size for better fit
                                mb: 0.25,
                                lineHeight: 1
                              }}>
                                {selectedStitching === 'none' ? '$0' : `+$${stichtingtextures.find(s => s.id === selectedStitching)?.price || 0}`}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                opacity: 0.9,
                                fontSize: { xs: '0.6rem', sm: '0.7rem' }, // REDUCED: Smaller font size for better fit
                                lineHeight: 1
                              }}>
                               {stichtingtextures.find(s => s.id === selectedStitching)?.name}
                             </Typography>
                           </Button>
                         </Box>
                         
                                                                                                                                  {/* SECOND ROW: Total Price and Add to Cart button */}
                                                           <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                                gap: { xs: 0.5, sm: 0.75 }, // REDUCED: Smaller gaps to match first row
                                width: '100%',
                                mt: { xs: 1, sm: 1.5, md: 1.5, lg: 1.5 }
                              }}>
                               {/* TOTAL PRICE BUTTON: Shows the merged total price using standard button */}
                              <Button
                                variant="contained"
                                disabled
                                sx={{
                                  bgcolor: '#d32f2f', // Changed to red color
                                  color: 'white',
                                  minHeight: '60px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  py: { xs: 0.75, sm: 1 },
                                  px: { xs: 0.5, sm: 1 }, // REDUCED: Smaller horizontal padding
                                  width: '100%', // CHANGED: Use full width of grid cell
                                   height: '50px',
                                  '&:hover': {
                                    bgcolor: '#b71c1c', // Changed to darker red for hover effect
                                    transform: 'scale(1.02)', // Added scale effect like cart button
                                  },
                                  '&.Mui-disabled': {
                                    bgcolor: '#d32f2f', // Changed to red
                                    color: 'white',
                                    opacity: 1
                                  },
                                  transition: 'all 0.2s ease-in-out', // Added transition for smooth effects
                                  boxShadow: { xs: '0 4px 12px rgba(211, 47, 47, 0.35)', sm: '0 6px 20px rgba(211, 47, 47, 0.4)' }, // Changed to red box shadow
                                }}
                              >
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 'bold',
                                  fontSize: { xs: '0.8rem', sm: '0.9rem' }, // REDUCED: Smaller font size for better fit
                                  mb: 0.25,
                                  lineHeight: 1
                                }}>
                                  ${totalPrice}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  opacity: 0.9,
                                  fontSize: { xs: '0.65rem', sm: '0.75rem' }, // REDUCED: Smaller font size for better fit
                                  lineHeight: 1
                                }}>
                                 Total Price
                               </Typography>
                             </Button>
                             
                                                                        {/* ADD TO CART BUTTON: Uses the merged total price - positioned under second button */}
               {selectedItem && (
                 <Button
                   variant="contained"
                   size="medium"
                   startIcon={<ShoppingCart sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />} // REDUCED: Smaller icon size
                   onClick={() => {
                                           // ENHANCED: Add item to cart with the merged total price, handling "None" selections
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
                     bgcolor: '#d32f2f', // Changed to red color
                     color: 'white',
                     fontSize: { xs: '0.7rem', sm: '0.8rem' }, // REDUCED: Smaller font size for better fit
                     py: { xs: 0.5, sm: 0.75 }, // REDUCED: Less vertical padding for better fit
                     px: { xs: 0.5, sm: 1 }, // REDUCED: Less horizontal padding for better fit
                     minHeight: '60px',
                     width: '100%', // CHANGED: Use full width of grid cell
                     height: '50px', // Added to match Total Price button size
                     gap: { xs: 0.25, sm: 0.5 }, // ADDED: Control spacing between icon and text
                     '&:hover': {
                       bgcolor: '#b71c1c', // Changed to darker red for hover effect
                       transform: 'scale(1.02)',
                     },
                     transition: 'all 0.2s ease-in-out',
                     boxShadow: { xs: '0 4px 12px rgba(211, 47, 47, 0.35)', sm: '0 6px 20px rgba(211, 47, 47, 0.4)' }, // Changed to red box shadow
                     '& .MuiButton-startIcon': {
                       marginRight: { xs: 0.25, sm: 0.5 }, // ADDED: Control icon spacing
                     }
                   }}
                 >
                   Add to Cart - ${totalPrice}
                 </Button>
               )}
                             
                                                           {/* EMPTY SPACE: Third and fourth columns to maintain grid alignment */}
                              <Box sx={{ width: '100%', height: '50px' }} />
                              <Box sx={{ width: '100%', height: '50px' }} />
                          </Box>
                       </Box>
                       

                     </Box>
                   )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />

    </Box>
  );
};

export default CustomizedSeat; 