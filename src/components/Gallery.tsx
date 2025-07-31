'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import Header from '@/components/Header';
import { workPictures, WorkImage } from '@/data/Gallery';

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedImage, setSelectedImage] = useState<WorkImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const handleImageClick = (image: WorkImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % workPictures.length;
    setSelectedImage(workPictures[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = currentImageIndex === 0 ? workPictures.length - 1 : currentImageIndex - 1;
    setSelectedImage(workPictures[prevIndex]);
    setCurrentImageIndex(prevIndex);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
          color: 'white',
          py: { xs: 6, md: 4 },
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
            Our Work Gallery
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
            Explore our custom seating solutions across different vehicle types and see our craftsmanship in action.
          </Typography>
        </Container>
      </Box>
      {/* Our Work Pictures Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 6,
              color: 'text.primary',
            }}
          >
            Our Beautiful Work
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: { xs: 2, md: 3 },
            justifyContent: 'center',
          }}>
            {workPictures.map((item, index) => (
              <Box 
                key={item.id} 
                sx={{ 
                  width: '100%',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    '& .zoom-icon': {
                      opacity: 1,
                    },
                    '& .image-overlay': {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => handleImageClick(item, index)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '75%', // 4:3 aspect ratio
                    overflow: 'hidden',
                    borderRadius: 2,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="card-media"
                  />
                  
                  {/* Zoom Icon */}
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
                      zIndex: 2,
                    }}
                  >
                    <ZoomIn />
                  </Box>
                  
                  {/* Image Overlay with Title */}
                  <Box
                    className="image-overlay"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      color: 'white',
                      p: 2,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontSize: '0.8rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
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
            backgroundColor: 'rgba(0,0,0,0.95)',
            color: 'white',
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
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
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
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
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
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <ArrowForward />
              </IconButton>

              {/* Project Info */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                  p: 3,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {selectedImage.description}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Call to Action Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
        color: 'white',
        py: { xs: 6, md: 4 },
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Ready to Start Your Project?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Get inspired by our gallery and let us bring your vision to life. Contact us for a custom quote today.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Get a Quote
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Gallery; 