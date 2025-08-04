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
  showPricing = true,
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
        <Box
          sx={{
            background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
            color: 'white',
            py: { xs: 3, sm: 4, md: 5, lg: 6 },
            px: { xs: 2, sm: 3 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 'bold',
                mb: { xs: 1, sm: 2 },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
              }}
            >
              Customize Your Seat
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
                px: { xs: 1, sm: 0 }
              }}
            >
              Design your perfect seat with our interactive 3D configurator
            </Typography>
          </Container>
        </Box>
      )}

      {/* Main Configuration Section */}
      <Container maxWidth="xl" sx={{ 
        py: { xs: 3, sm: 4, md: 6, lg: 8, xl: 10 },
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
            <Stack spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ height: '100%' }}>
              {/* Texture Selection - Top Container */}
              <Card sx={{ 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
                borderRadius: 2,
                flex: { xs: 'none', lg: 1 }
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
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
                  
                  {/* Price Display */}
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: { xs: 2, sm: 3, lg: 4 }, 
                      alignItems: 'center',
                      p: { xs: 1, sm: 1.5, lg: 2 },
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      border: '1px solid #dee2e6',
                      flexDirection: { xs: 'column', sm: 'row', lg: 'row' },
                      minHeight: { lg: '80px' }
                    }}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        minWidth: { xs: 'auto', sm: 70, lg: 100 },
                        flex: 1
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary', 
                          display: 'block',
                          fontWeight: 'bold',
                          letterSpacing: 0.5,
                          mb: 0.5,
                          fontSize: { xs: '0.6rem', sm: '0.7rem', lg: '0.8rem' }
                        }}>
                          RETAIL PRICE
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: 'text.primary',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          mb: 0.5,
                          fontSize: { xs: '1rem', sm: '1.25rem', lg: '1.5rem' }
                        }}>
                          {(() => {
                            const texture = textures.find(t => t.id === selectedTexture);
                            return texture && texture.price !== 0
                              ? `${texture.price > 0 ? '+' : ''}$${texture.price}`
                              : 'Included';
                          })()}
                        </Typography>
                      </Box>
                      <Divider 
                        orientation="vertical"
                        flexItem 
                        sx={{ 
                          height: { xs: 1, sm: 40, lg: 60 }, 
                          width: 1,
                          borderColor: '#dee2e6', 
                          mx: { xs: 0, sm: 2, lg: 3 },
                          my: { xs: 1, sm: 0, lg: 0 },
                          display: { xs: 'none', sm: 'block' }
                        }} 
                      />
                      <Box sx={{ 
                        textAlign: 'center', 
                        minWidth: { xs: 'auto', sm: 70, lg: 100 },
                        flex: 1
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: 'success.main', 
                          display: 'block',
                          fontWeight: 'bold',
                          letterSpacing: 0.5,
                          mb: 0.5,
                          fontSize: { xs: '0.6rem', sm: '0.7rem', lg: '0.8rem' }
                        }}>
                          WHOLESALE
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: 'success.main',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          mb: 0.5,
                          fontSize: { xs: '1rem', sm: '1.25rem', lg: '1.5rem' }
                        }}>
                          {(() => {
                            const texture = textures.find(t => t.id === selectedTexture);
                            if (texture && texture.price !== 0) {
                              const wholesalePrice = Math.round(texture.price * 0.7);
                              return `${texture.price > 0 ? '+' : ''}$${wholesalePrice}`;
                            }
                            return 'Included';
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Color Selection - Bottom Container */}
              <Card sx={{ 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
                borderRadius: 2, 
                flex: { xs: 'none', lg: 1 }
              }}>
                <CardContent sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}>
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
                    flex: 1, 
                    alignItems: 'center' 
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
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {showPricing && (
        /* Pricing Section */
        <Box sx={{ 
          py: { xs: 4, sm: 5, md: 6, lg: 8 }, 
          backgroundColor: 'white',
          px: { xs: 2, sm: 3 }
        }}>
          <Container maxWidth="lg">
            <Card sx={{ 
              p: { xs: 3, sm: 4, md: 5, lg: 6 }, 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: 3
            }}>
              <Grid container spacing={{ xs: 3, sm: 4 }} alignItems="center">
                <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 12' } }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: { xs: 2, sm: 3 }, 
                    color: 'text.primary',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                    textAlign: { xs: 'center', md: 'left' }
                  }}>
                    Your Custom Seat
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: { xs: 1.5, sm: 2 },
                    px: { xs: 1, sm: 0 },
                    maxWidth: { xs: '100%', lg: '400px' }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        mb: { xs: 0.5, sm: 0 }
                      }}>
                        Base Price:
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        ${objects[currentObjectIndex].price}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        mb: { xs: 0.5, sm: 0 }
                      }}>
                        Material:
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        textAlign: { xs: 'right', sm: 'left' }
                      }}>
                        {textures.find(t => t.id === selectedTexture)?.name}
                        {(() => {
                          const texture = textures.find(t => t.id === selectedTexture);
                          return texture && texture.price !== 0 
                            ? ` (${texture.price > 0 ? '+' : ''}$${texture.price})`
                            : '';
                        })()}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: { xs: 1.5, sm: 2 }, borderColor: 'grey.300' }} />
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 'bold', 
                        color: 'text.primary',
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                      }}>
                        Total:
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.main',
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                      }}>
                        ${totalPrice}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Buttons Section - Below Total on Large Screens */}
                  <Box sx={{ 
                    mt: { xs: 3, sm: 4, lg: 4 },
                    display: 'flex',
                    justifyContent: { xs: 'center', lg: 'flex-start' }
                  }}>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row', lg: 'row' }} 
                      spacing={{ xs: 2, sm: 3 }}
                      sx={{ 
                        justifyContent: { xs: 'center', lg: 'flex-start' },
                        alignItems: 'stretch',
                        width: { xs: '100%', lg: 'auto' }
                      }}
                    >
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={<ShoppingCart />}
                        fullWidth={isMobile}
                        sx={{
                          backgroundColor: '#d32f2f',
                          px: { xs: 1.5, sm: 2, md: 3 },
                          py: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          borderRadius: 2,
                          pl: 2,
                          boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)',
                          '&:hover': {
                            backgroundColor: '#9a0007',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 25px rgba(211, 47, 47, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                          minHeight: { xs: 40, sm: 44 }
                        }}
                      >
                        Add to Cart - ${totalPrice}
                      </Button>
                      <Button
                        variant="outlined"
                        size="medium"
                        endIcon={<ArrowForward />}
                        fullWidth={isMobile}
                        sx={{
                          borderColor: '#d32f2f',
                          color: '#d32f2f',
                          px: { xs: 1.5, sm: 4 },
                          py: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          borderRadius: 2,
                          borderWidth: 2,
                          '&:hover': {
                            borderColor: '#9a0007',
                            backgroundColor: 'rgba(211, 47, 47, 0.04)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(211, 47, 47, 0.2)',
                          },
                          transition: 'all 0.3s ease',
                          minHeight: { xs: 40, sm: 44 }
                        }}
                      >
                        Build Now
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Container>
        </Box>
      )}

      {showAbout && (
        /* About Section */
        <Box sx={{ 
          py: { xs: 4, sm: 5, md: 6, lg: 8 }, 
          backgroundColor: '#fafafa',
          px: { xs: 2, sm: 3 }
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center">
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Box sx={{ 
                  textAlign: { xs: 'center', md: 'left' },
                  px: { xs: 1, sm: 2 }
                }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                    lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                  }}>
                    Crafted for Comfort
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    mb: { xs: 2, sm: 3 }, 
                    color: 'text.secondary', 
                    lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                    px: { xs: 1, sm: 0 }
                  }}>
                    At Superior Seats, we believe that every driver deserves the perfect seat. Our commitment to quality craftsmanship and premium materials ensures that your custom seat will provide unmatched comfort and durability for years to come.
                  </Typography>
                  
                  {/* Features List */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: { xs: 1.5, sm: 2 },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    mt: { xs: 2, sm: 3 }
                  }}>
                    {/* Feature 1 */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 1, sm: 1.5, md: 2 },
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      <LocalShipping sx={{ 
                        color: 'primary.main',
                        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                        flexShrink: 0
                      }} />
                      <Typography sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                        lineHeight: 1.3,
                        maxWidth: { xs: '200px', sm: 'none' }
                      }}>
                        Free shipping on all custom orders
                      </Typography>
                    </Box>
                    
                    {/* Feature 2 */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 1, sm: 1.5, md: 2 },
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      <Security sx={{ 
                        color: 'primary.main',
                        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                        flexShrink: 0
                      }} />
                      <Typography sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                        lineHeight: 1.3,
                        maxWidth: { xs: '200px', sm: 'none' }
                      }}>
                        3-year warranty on all seats
                      </Typography>
                    </Box>
                    
                    {/* Feature 3 */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 1, sm: 1.5, md: 2 },
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      <Support sx={{ 
                        color: 'primary.main',
                        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                        flexShrink: 0
                      }} />
                      <Typography sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                        lineHeight: 1.3,
                        maxWidth: { xs: '200px', sm: 'none' }
                      }}>
                        Expert support throughout the process
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {showTestimonials && (
        /* Testimonials Section */
        <Box sx={{ 
          py: { xs: 4, sm: 5, md: 6, lg: 8 }, 
          backgroundColor: 'white',
          px: { xs: 2, sm: 3 }
        }}>
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ 
              textAlign: 'center', 
              fontWeight: 'bold', 
              mb: { xs: 4, sm: 5, md: 6 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' }
            }}>
              What Our Customers Say
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {testimonials.map((testimonial) => (
                <Grid key={testimonial.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                  <Card sx={{ 
                    height: '100%', 
                    p: { xs: 2, sm: 3 },
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: { xs: 40, sm: 45, md: 50 },
                          height: { xs: 40, sm: 45, md: 50 },
                          borderRadius: '50%',
                          backgroundColor: 'grey.300',
                          mr: 2,
                        }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ 
                          color: '#ffc107', 
                          fontSize: { xs: 16, sm: 18, md: 20 } 
                        }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ 
                      fontStyle: 'italic', 
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      flex: 1
                    }}>
                      &ldquo;{testimonial.text}&rdquo;
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default CustomizedSeat; 