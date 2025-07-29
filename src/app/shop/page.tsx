'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Grid } from '@mui/material'; 
import { textures } from '@/data/textures';
import { colors } from '@/data/colors';
import { testimonials } from '@/data/testimonials';

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
} from '@mui/material';
import Header from '@/components/Header';
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

const ShopPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for customization options
  const [selectedTexture, setSelectedTexture] = useState('leather');
  const [selectedColor, setSelectedColor] = useState('black');
  const [basePrice] = useState(1299);



  const calculateTotalPrice = () => {
    const texturePrice = textures.find(t => t.id === selectedTexture)?.price || 0;
    return basePrice + texturePrice;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
          color: 'white',
          py: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Custom Seat Shop
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Design your perfect seat with our interactive 3D configurator
          </Typography>
        </Container>
      </Box>

      {/* Main Configuration Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8, lg: 10 } }}>
        <Grid container spacing={6} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          {/* Left Column - 3D Viewer */}
          {/* 3D VIEWER WIDTH: Mobile (xs) = 100% width, Large screens (lg) = 50% width */}
          <Grid>
            <Card sx={{ height: '600px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
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
                {/* 3D Model Placeholder */}
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    position: 'relative',
                    display: 'inline-block',
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Chair sx={{ 
                      fontSize: 140, 
                      color: (() => {
                        const color = colors.find(c => c.id === selectedColor);
                        return color ? color.hex : '#8b4513';
                      })(),
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                      transition: 'all 0.3s ease'
                    }} />
                  </Box>
                  <Typography variant="h5" sx={{ mt: 3, color: 'text.primary', fontWeight: 'bold' }}>
                    3D Interactive Viewer
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                    Drag to rotate • Scroll to zoom • Click to select
                  </Typography>
                </Box>
                
                {/* Viewer Controls */}
                <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                  <Tooltip title="Zoom In">
                    <IconButton 
                      size="medium" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.95)', 
                        mr: 1,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <ZoomIn />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add to Favorites">
                    <IconButton 
                      size="medium" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.95)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <Favorite />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Right Column - Customization Options */}
          {/* RIGHT COLUMN WIDTH: Mobile (xs) = 100% width, Large screens (lg) = 50% width */}
          <Grid>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '600px', justifyContent: 'space-between' }}>
              {/* Texture Selection - Top Container */}
              <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                    Choose Your Material
                  </Typography>
                  
                  {/* Selected Material Name */}
                  {selectedTexture && (
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
                      {textures.find(t => t.id === selectedTexture)?.name}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {textures.map((texture) => (
                                              <Box
                          key={texture.id}
                          onClick={() => setSelectedTexture(texture.id)}
                          sx={{
                            width: 60,
                            height: 60,
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
                              <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                          )}
                        </Box>
                    ))}
                  </Box>
                  
                  {/* Price Display */}
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {(() => {
                        const texture = textures.find(t => t.id === selectedTexture);
                        return texture && texture.price !== 0
                          ? `${texture.price > 0 ? '+' : ''}$${texture.price}`
                          : 'Included';
                      })()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Color Selection - Bottom Container */}
              <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 2, flex: 1 }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                    Choose Your Color
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                    {colors.map((color) => (
                      <Tooltip key={color.id} title={color.name}>
                        <Box
                          onClick={() => setSelectedColor(color.id)}
                          sx={{
                            width: 50,
                            height: 50,
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
                            <CheckCircle sx={{ color: 'white', fontSize: 18 }} />
                          )}
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                </CardContent>
              </Card>


            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Card sx={{ 
            p: 6, 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 3
          }}>
            <Grid container spacing={4} alignItems="center">
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                  Your Custom Seat
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Base Price:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>${basePrice}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Material:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {textures.find(t => t.id === selectedTexture)?.name}
                      {(() => {
                        const texture = textures.find(t => t.id === selectedTexture);
                        return texture && texture.price !== 0 
                          ? ` (${texture.price > 0 ? '+' : ''}$${texture.price})`
                          : '';
                      })()}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: 'grey.300' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      Total:
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ${totalPrice}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'row', gap: 5, ml: 20 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    sx={{
                      backgroundColor: '#d32f2f',
                      px: 6,
                      py: 2.5,
                      fontSize: '1.2rem',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)',
                      '&:hover': {
                        backgroundColor: '#9a0007',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(211, 47, 47, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Add to Cart - ${totalPrice}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      px: 6,
                      py: 2.5,
                      fontSize: '1.2rem',
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#9a0007',
                        backgroundColor: 'rgba(211, 47, 47, 0.04)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(211, 47, 47, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Build Now
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6', display: 'flex', flexDirection: 'column', gap: 2 } }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                Crafted for Comfort
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
                At Superior Seats, we believe that every driver deserves the perfect seat. Our commitment to quality craftsmanship and premium materials ensures that your custom seat will provide unmatched comfort and durability for years to come.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalShipping sx={{ color: 'primary.main' }} />
                  <Typography>Free shipping on all custom orders</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Security sx={{ color: 'primary.main' }} />
                  <Typography>3-year warranty on all seats</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Support sx={{ color: 'primary.main' }} />
                  <Typography>Expert support throughout the process</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
            What Our Customers Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid key={testimonial.id} sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'grey.300',
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                    &ldquo;{testimonial.text}&rdquo;
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ShopPage; 