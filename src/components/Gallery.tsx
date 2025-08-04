'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
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
import { workPictures, workPicturesTruck, WorkImage } from '@/data/Gallery';

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedImage, setSelectedImage] = useState<WorkImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animatedImages, setAnimatedImages] = useState<boolean[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Initialize animation states
  useEffect(() => {
    const animationStates = workPictures.map(() => false);
    setAnimatedImages(animationStates);
    
    // Animate images one by one with delay
    const animateImages = () => {
      workPictures.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedImages(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }, index * 200); // 200ms delay between each image
      });
    };

    // Start animation after a short delay
    const timer = setTimeout(animateImages, 300);
    return () => clearTimeout(timer);
  }, []);


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

  const handleSliderNext = () => {
    setSliderIndex((prev) => (prev + 1) % workPictures.length);
  };

  const handleSliderPrev = () => {
    setSliderIndex((prev) => (prev - 1 + workPictures.length) % workPictures.length);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleSliderNext();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [sliderIndex]);

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
      {/* Horizontal Image Slider */}
      <Box sx={{ 
        backgroundColor: '#f8f9fa',
        py: { xs: 4, md: 6 },
        overflow: 'hidden',
      }}>
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 4,
              color: 'text.primary',
            }}
          >
            Our Workshop
          </Typography>
          
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '150px',
                zIndex: 2,
                pointerEvents: 'none',
              },
              '&::before': {
                left: 0,
                background: 'linear-gradient(to right, #f8f9fa 0%, transparent 100%)',
              },
              '&::after': {
                right: 0,
                background: 'linear-gradient(to left, #f8f9fa 0%, transparent 100%)',
              },
            }}
          >
          {/* Continuous Sliding Images */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              animation: 'slideLeft 30s linear infinite',
              width: 'max-content',
              animationPlayState: selectedImage ? 'paused' : 'running',
              '@keyframes slideLeft': {
                '0%': {
                  transform: 'translateX(0)',
                },
                '100%': {
                  transform: 'translateX(-50%)',
                },
              },
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {/* First set of images */}
            {workPicturesTruck.map((item, index) => (
              <Box
                key={`first-${item.id}`}
                sx={{
                  minWidth: 350,
                  width: 350,
                  height: 250,
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(211, 47, 47, 0.3)',
                    '& .image-overlay': {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => handleImageClick(item, index)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{
                    objectFit: 'cover',
                    backgroundColor: '#f5f5f5',
                  }}
                />
                
                {/* Hover Overlay */}
                <Box
                  className="image-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.8) 0%, rgba(0,0,0,0.6) 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    p: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <ZoomIn sx={{ fontSize: 20, mt: 1 }} />
                </Box>
              </Box>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {workPicturesTruck.map((item, index) => (
              <Box
                key={`second-${item.id}`}
                sx={{
                  minWidth: 350,
                  width: 350,
                  height: 250,
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(211, 47, 47, 0.3)',
                    '& .image-overlay': {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => handleImageClick(item, index)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{
                    objectFit: 'cover',
                    backgroundColor: '#f5f5f5',
                  }}
                />
                
                {/* Hover Overlay */}
                <Box
                  className="image-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.8) 0%, rgba(0,0,0,0.6) 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    p: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <ZoomIn sx={{ fontSize: 20, mt: 1 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        </Container>
      </Box>

      {/* Our Work Pictures Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa' }}>
        <Container maxWidth="xl">
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
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' },
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
                  opacity: animatedImages[index] ? 1 : 0,
                  transform: animatedImages[index] ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.8)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: animatedImages[index] ? 'imageFloat 3s ease-in-out infinite' : 'none',
                  '@keyframes imageFloat': {
                    '0%, 100%': {
                      transform: 'translateY(0) scale(1)',
                    },
                    '50%': {
                      transform: 'translateY(-5px) scale(1.02)',
                    },
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.05)',
                    boxShadow: '0 20px 40px rgba(211, 47, 47, 0.3)',
                    '& .zoom-icon': {
                      opacity: 1,
                      transform: 'translate(-50%, -50%) scale(1.1)',
                    },
                    '& .image-overlay': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                    '& .gallery-image': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
                onClick={() => handleImageClick(item, index)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '75%', 
                    overflow: 'hidden',
                    borderRadius: 2,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{
                      objectFit: 'contain',
                      backgroundColor: '#f5f5f5',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="gallery-image"
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
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: 'rgba(211, 47, 47, 0.95)',
                      borderRadius: '50%',
                      p: 1.5,
                      color: 'white',
                      zIndex: 2,
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <ZoomIn sx={{ fontSize: 24 }} />
                  </Box>
                  
                  {/* Image Overlay with Title */}
                  <Box
                    className="image-overlay"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                      color: 'white',
                      p: 3,
                      opacity: 0,
                      transform: 'translateY(20px)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontSize: '0.9rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        lineHeight: 1.4,
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(202, 38, 38, 0.4)',
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
                backgroundColor: 'rgba(175, 40, 40, 0.7)',
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
        <Container maxWidth="xl">
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