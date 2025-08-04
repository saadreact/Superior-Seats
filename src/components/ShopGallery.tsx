'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ArrowBack,
  ArrowForward,
  FilterList,
} from '@mui/icons-material';
import Header from '@/components/Header';
import { categories, galleryData } from '@/data/ShopGallery';
import { useCart } from '@/contexts/CartContext';

const ShopGallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addItem } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryData[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages = selectedCategory === 'all' 
    ? galleryData 
    : galleryData.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const handleImageClick = (image: typeof galleryData[0], index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleAddToCart = (item: typeof galleryData[0]) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              mb: { xs: 2, md: 3 },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              lineHeight: { xs: 1.2, md: 1.1 },
            }}
          >
            Shop Specials
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: { xs: 3, md: 4 },
              opacity: 0.9,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            Discover our exclusive collection of premium seats with special pricing and unique features
          </Typography>
        </Container>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        px: { xs: 1, sm: 2 },
      }}>
        <Container maxWidth="lg">
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: { xs: 80, sm: 120 },
                fontSize: { xs: '0.75rem', sm: '0.9rem' },
                fontWeight: 500,
                textTransform: 'none',
                color: 'text.secondary',
                padding: { xs: '8px 12px', sm: '12px 16px' },
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: 3,
              },
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.value}
                value={category.value}
                label={category.label}
                icon={<FilterList sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mr: { xs: 0.5, sm: 1 } }} />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Gallery Grid */}
      <Box sx={{ py: { xs: 3, sm: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 2, sm: 3, md: 4 },
            justifyContent: 'center',
            width: '100%'
          }}>
            {filteredImages.map((item, index) => (
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
                      boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.1)', sm: '0 12px 40px rgba(211, 47, 47, 0.25)' },
                      '& .zoom-icon': {
                        opacity: 1,
                      },
                      '& .card-media': {
                        transform: { xs: 'none', sm: 'scale(1.05)' },
                      },
                    },
                  }}
                  onClick={() => handleImageClick(item, index)}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={item.image}
                      alt={item.title}
                      className="card-media"
                      sx={{
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        objectFit: 'contain',
                        width: '100%',
                        height: { xs: '200px', sm: '250px' },
                        backgroundColor: '#f5f5f5',
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
                        backgroundColor: 'rgba(211, 47, 47, 0.9)',
                        borderRadius: '50%',
                        p: { xs: 0.5, sm: 1 },
                        color: 'white',
                        display: { xs: 'none', sm: 'flex' },
                      }}
                    >
                      <ZoomIn sx={{ fontSize: { xs: 18, sm: 24 } }} />
                    </Box>
                    <Chip
                      label={item.price}
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 16 },
                        right: { xs: 8, sm: 16 },
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        height: { xs: 24, sm: 32 },
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        color: 'text.primary',
                        lineHeight: { xs: 1.3, sm: 1.4 },
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.5,
                        mb: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        display: { xs: '-webkit-box', sm: 'block' },
                        WebkitLineClamp: { xs: 2, sm: 'none' },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 1, sm: 1 }}
                      sx={{ flexWrap: 'wrap', gap: { xs: 1, sm: 1 } }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          py: { xs: 0.5, sm: 1 },
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                          },
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          py: { xs: 0.5, sm: 1 },
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {filteredImages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: { xs: 6, md: 8 } }}>
              <Typography variant="h5" sx={{ 
                color: 'text.secondary', 
                mb: 2,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                No products found for this category
              </Typography>
              <Button
                variant="contained"
                onClick={() => setSelectedCategory('all')}
                sx={{ 
                  backgroundColor: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1, sm: 1.5 },
                }}
              >
                View All Products
              </Button>
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: 'black',
            margin: { xs: 2, sm: 4 },
            maxWidth: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 16 },
              right: { xs: 8, sm: 16 },
              color: 'white',
              backgroundColor: 'primary.main',
              zIndex: 1,
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Close sx={{ fontSize: { xs: 18, sm: 24 } }} />
          </IconButton>

          {selectedImage && (
            <Box sx={{ position: 'relative' }}>
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                width={800}
                height={600}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: isSmallMobile ? '60vh' : '80vh',
                  objectFit: 'contain',
                }}
              />
              
              {/* Navigation Arrows */}
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: { xs: 8, sm: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowBack sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>
              
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: { xs: 8, sm: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowForward sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>

              {/* Image Info */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(255,255,255,0.9))',
                  p: { xs: 2, sm: 3 },
                }}
              >
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold', 
                  mb: 1,
                  fontSize: { xs: '1.125rem', sm: '1.5rem' }
                }}>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body1" sx={{ 
                  mb: 2, 
                  opacity: 0.9,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  display: { xs: '-webkit-box', sm: 'block' },
                  WebkitLineClamp: { xs: 2, sm: 'none' },
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {selectedImage.description}
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 2 }} 
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    disabled
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.5 },
                      minWidth: { xs: '120px', sm: '140px' },
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        opacity: 1,
                      },
                    }}
                  >
                    {selectedImage.price}
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      handleAddToCart(selectedImage);
                      handleCloseLightbox();
                    }}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.5 },
                      minWidth: { xs: '120px', sm: '140px' },
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ShopGallery; 