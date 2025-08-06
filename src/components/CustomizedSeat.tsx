'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Grid } from '@mui/material'; 
import { textures } from '@/data/textures';
import { colors } from '@/data/colors';
import { testimonials } from '@/data/testimonials';
import Header from '@/components/Header';
import Chair3DModel from '@/components/Chair3DModel';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Stack,
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
  
  // State for customization options
  const [selectedTexture, setSelectedTexture] = useState('leather');
  const [selectedColor, setSelectedColor] = useState('black');
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);

  // Different objects to display
  const objects = [
    { id: 'sofa', name: 'Car Seat', price: 899 },
    { id: 'car', name: 'Back Double Seat', price: 1299 },
    { id: 'truck', name: 'Truck Seat', price: 1499 },
    { id: 'racing', name: 'Van Seat', price: 1899 },
    { id: 'office', name: 'Ship Seats', price: 699 },
  ];

  const calculateTotalPrice = () => {
    const currentObject = objects[currentObjectIndex];
    const texturePrice = textures.find(t => t.id === selectedTexture)?.price || 0;
    return currentObject.price + texturePrice;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {showHeader && <Header />}
      
      {showHero && (
        /* Hero Section */
        <Box sx={{ mt: { xs: 8, sm: 9, md: 8, lg: 8 } }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
            color: 'white',
            height: { xs: '18vh', sm: '20vh', md: '18vh', lg: '20vh' },
            py: { xs: 2, sm: 3, md: 4, lg: 5 },
           px: { xs: 1, sm: 2, md: 3, lg: 4 },
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: { xs: 0, sm: 0.5, md: 1, lg: 1.5 },
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem', xl: '3rem' },
                fontWeight: 'bold',
                mb: { xs: 0.25, sm: 0.5, md: 0.75, lg: 1 },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                lineHeight: { xs: 1, sm: 1, md: 1, lg: 1 },
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                minWidth: 0,
                px: { xs: 1, sm: 0 },
              }}
            >
              Customize Your Seat
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: { xs: 0, sm: 0.25, md: 0.5, lg: 0.75 },
                opacity: 0.9,
                maxWidth: '100%',
                mx: 'auto',
                lineHeight: { xs: 1.4, sm: 1.5, md: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.5rem' },
                px: { xs: 1, sm: 0 },
                whiteSpace: 'nowrap',
                overflow: 'visible',
                textOverflow: 'clip',
              }}
            >
              Design your perfect seat with our interactive 3D configurator
            </Typography>
          </Container>
        </Box>
        </Box>
      )}

      {/* Main Configuration Section */}
      <Container maxWidth="xl" sx={{ 
        py: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 5 },
        px: { xs: 2, sm: 3 }
      }}>
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
          gap: { xs: 2, sm: 3 },
          alignItems: 'start'
        }}>
          {/* Left Column - 3D Viewer */}
          <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 1' } }}>
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
                {/* Left Arrow */}
                <IconButton
                  onClick={() => setCurrentObjectIndex(prev => prev === 0 ? objects.length - 1 : prev - 1)}
                  sx={{
                    position: 'absolute',
                    left: { xs: 10, sm: 15, md: 20 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: '#d32f2f',
                    width: { xs: 40, sm: 44, md: 48 },
                    height: { xs: 40, sm: 44, md: 48 },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)',
                      transform: 'translateY(-50%) scale(1.1)',
                    },
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  ←
                </IconButton>

                {/* Right Arrow */}
                <IconButton
                  onClick={() => setCurrentObjectIndex(prev => prev === objects.length - 1 ? 0 : prev + 1)}
                  sx={{
                    position: 'absolute',
                    right: { xs: 10, sm: 15, md: 20 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: '#d32f2f',
                    width: { xs: 40, sm: 44, md: 48 },
                    height: { xs: 40, sm: 44, md: 48 },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)',
                      transform: 'translateY(-50%) scale(1.1)',
                    },
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  →
                </IconButton>
                
                {/* 3D Model Viewer */}
                <Box sx={{ 
                  height: '100%', 
                  width: '100%',
                  position: 'relative'
                }}>
                  <Chair3DModel 
                    selectedTexture={selectedTexture}
                    selectedColor={colors.find(c => c.id === selectedColor)?.hex || '#000000'}
                    currentObjectIndex={currentObjectIndex}
                  />
                  
                  {/* Object Name Display */}
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
                      {objects[currentObjectIndex].name}
                    </Typography>
                  </Box>
                  
                  {/* Instructions */}
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
                      {isMobile ? 'Tap arrows to change seat type' : 'Drag to rotate • Scroll to zoom • Use arrows to change seat type'}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Viewer Controls */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: { xs: 10, sm: 15, md: 20 }, 
                  right: { xs: 10, sm: 15, md: 20 },
                  display: 'flex',
                  gap: { xs: 0.5, sm: 1 }
                }}>
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
          <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 1' } }}>
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
                        color: 'primary.main', 
                        textAlign: 'center',
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
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
                          <Image
                            src={texture.image}
                            alt={texture.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {selectedTexture === texture.id && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CheckCircle sx={{ 
                                color: 'white', 
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
                              backgroundColor: color.hex,
                              border: '4px solid',
                              borderColor: selectedColor === color.id ? 'primary.main' : 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.15)',
                                borderColor: 'primary.main',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {selectedColor === color.id && (
                              <CheckCircle sx={{ 
                                color: 'white', 
                                fontSize: { xs: 16, sm: 17, md: 18 } 
                              }} />
                            )}
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>



      

    </Box>
  );
};

export default CustomizedSeat; 