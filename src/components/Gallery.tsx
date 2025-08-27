'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';
import LazyImage from '@/components/common/LazyImage';
import { workPictures, workPicturesTruck, WorkImage } from '@/data/Gallery';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.8
    } 
  },
};

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
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
         <HeroSectionCommon
          title="Our Work Gallery"
          description="Explore our custom seating solutions across different vehicle types and see our craftsmanship in action."
          height={{
            xs: '75px',
            sm: '70px', 
            md: '80px',
            lg: '95px',
            xl: '105px',
            xxl: '115px'
          }}
        /> 

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Gallery' }
        ]}
      />
     {/* Horizontal Image Slider */}
      <Box sx={{ 
        backgroundColor: '#f8f9fa',
        py: { xs: 0.25, md: 0.5, lg: 1, xl: 1 },
        overflow: 'hidden',
      }}>
          <Container maxWidth="xl">
            <MotionBox
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              sx={{ textAlign: 'center', mb: { xs: 0.5, sm: 1.5, md: 2.5, lg: 2.5 } }}
            >
              <MotionTypography
                variant="h3"
                sx={{
                  textAlign: 'center',
                  fontWeight: 500,
                  mb: { xs: 0.5, sm: 1.5, md: 2.5, lg: 2.5 },
                }}
              >
                Our Work Shop
              </MotionTypography>
            </MotionBox>
          
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
                background: 'linear-gradient(to right,rgba(248, 249, 250, 0.42) 0%, transparent 100%)',
              },
              '&::after': {
                right: 0,
                background: 'linear-gradient(to left,rgba(248, 249, 250, 0.42) 0%, transparent 100%)',
              },
            }}
          >
          {/* Continuous Sliding Images */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
                             animation: 'slideLeft 60s linear infinite',
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
                {item.image && item.image.trim() !== '' ? (
                  <LazyImage
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5',
                    }}
                    showSkeleton={true}
                    skeletonHeight="100%"
                    skeletonWidth="100%"
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      color: 'text.secondary',
                    }}
                  >
                    <Typography variant="body2">No image</Typography>
                  </Box>
                )}
                
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
                {item.image && item.image.trim() !== '' ? (
                  <LazyImage
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5',
                    }}
                    showSkeleton={true}
                    skeletonHeight="100%"
                    skeletonWidth="100%"
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      color: 'text.secondary',
                    }}
                  >
                    <Typography variant="body2">No image</Typography>
                  </Box>
                )}
                
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
      <Box sx={{ py: { xs: 1, md: 1.5 }, backgroundColor: '#fafafa' }}>
          <Container maxWidth="xl">
            <MotionBox
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              sx={{ textAlign: 'center', mb: { xs: 1, sm: 1.5, md: 3, lg: 2.5 }, py: { xs: 1, sm: 1.5, md: 3, lg: 2.5 } }}
            >
              <MotionTypography
                variant="h3"
                sx={{
                  textAlign: 'center',
                  fontWeight: 500,
                  mb: { xs: 1, sm: 1.5, md: 3, lg: 2.5 },
                  py: { xs: 1, sm: 1.5, md: 3, lg: 2.5 },
                  color: 'text.primary',
                }}
              >
                Our Beautiful Work
              </MotionTypography>
            </MotionBox>
                     <Box sx={{ 
             display: 'grid',
             gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' },
             gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
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
                  animation: animatedImages[index] ? 'imageFloat 20s ease-in-out infinite' : 'none',
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
                  {item.image && item.image.trim() !== '' ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      className="gallery-image"
                      onError={(e) => {
                        console.error('Image failed to load:', item.image);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', item.image);
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        color: 'text.secondary',
                      }}
                    >
                      <Typography variant="body2">No image</Typography>
                    </Box>
                  )}
                  
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
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      zIndex: 2,
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <ZoomIn sx={{ fontSize: 20 }} />
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
                       variant="body1"
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
          
      {/* Image View Modal - Gallery Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 25px rgba(202, 38, 38, 0.2)',
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
              backgroundColor: 'rgba(0,0,0,0.1)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(175, 40, 40, 0.3)',
              },
            }}
          >
            <Close />
          </IconButton>

          {selectedImage && (
            <Box sx={{ position: 'relative' }}>
              {selectedImage.image && selectedImage.image.trim() !== '' ? (
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
                  priority
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="h6">No image available</Typography>
                </Box>
              )}
              
              {/* Image Details Overlay - No Background */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'transparent',
                  color: 'black',
                  p: { xs: 2, sm: 3, md: 4 },
                  transform: 'translateY(0)',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                    mb: { xs: 0.5, sm: 1 },
                    lineHeight: 1.3,
                    color: 'black',
                  }}
                >
                  {selectedImage.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.8,
                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                    textShadow: '0 1px 2px rgba(255,255,255,0.6)',
                    lineHeight: 1.5,
                    maxWidth: '80%',
                    color: 'text.secondary',
                  }}
                >
                  {selectedImage.description}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      
      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default Gallery; 