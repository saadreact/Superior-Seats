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
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Shop Specials
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
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
      }}>
        <Container maxWidth="lg">
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'none',
                color: 'text.secondary',
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
                icon={<FilterList sx={{ fontSize: '1rem', mr: 1 }} />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Gallery Grid */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 4 },
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
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                      '& .zoom-icon': {
                        opacity: 1,
                      },
                      '& .card-media': {
                        transform: 'scale(1.05)',
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
                        height: '250px',
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
                        p: 1,
                        color: 'white',
                      }}
                    >
                      <ZoomIn />
                    </Box>
                    <Chip
                      label={item.price}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        fontSize: '1.1rem',
                        color: 'text.primary',
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
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: 'primary.main',
                          color: 'primary.main',
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
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {filteredImages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
                No products found for this category
              </Typography>
              <Button
                variant="contained"
                onClick={() => setSelectedCategory('all')}
                sx={{ backgroundColor: 'primary.main' }}
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Changed to white background
            color: 'black', // Changed text color to black
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
                     <IconButton
             onClick={handleCloseLightbox}
             sx={{
               position: 'absolute',
               top: 16,
               right: 16,
               color: 'white',
               backgroundColor: 'primary.main',
               zIndex: 1,
               boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
               '&:hover': {
                 backgroundColor: 'primary.dark',
                 boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                 transform: 'translateY(-1px)',
               },
               transition: 'all 0.2s ease',
             }}
           >
             <Close />
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
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
              
                             {/* Navigation Arrows */}
               <IconButton
                 onClick={handlePrevImage}
                 sx={{
                   position: 'absolute',
                   left: 16,
                   top: '50%',
                   transform: 'translateY(-50%)',
                   color: 'white',
                   backgroundColor: 'primary.main',
                   boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                   '&:hover': {
                     backgroundColor: 'primary.dark',
                     boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                     transform: 'translateY(-50%) scale(1.1)',
                   },
                   transition: 'all 0.2s ease',
                 }}
               >
                 <ArrowBack />
               </IconButton>
               
               <IconButton
                 onClick={handleNextImage}
                 sx={{
                   position: 'absolute',
                   right: 16,
                   top: '50%',
                   transform: 'translateY(-50%)',
                   color: 'white',
                   backgroundColor: 'primary.main',
                   boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                   '&:hover': {
                     backgroundColor: 'primary.dark',
                     boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                     transform: 'translateY(-50%) scale(1.1)',
                   },
                   transition: 'all 0.2s ease',
                 }}
               >
                 <ArrowForward />
               </IconButton>

                             {/* Image Info */}
               <Box
                 sx={{
                   position: 'absolute',
                   bottom: 0,
                   left: 0,
                   right: 0,
                   background: 'linear-gradient(transparent, rgba(255,255,255,0.9))',
                   p: 3,
                 }}
               >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                  {selectedImage.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={selectedImage.price}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}
                  />
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => handleAddToCart(selectedImage)}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ShopGallery; 