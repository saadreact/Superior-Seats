'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
} from '@mui/material';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TruckCarousel from '@/components/TruckCarousel';
import { seatingProducts, stats } from '@/data/homepage';

import { motion } from 'framer-motion';
import { 
  Star,
  ArrowForward,
  Chair,
  EventSeat,
  AirlineSeatReclineNormal,
  Close
} from '@mui/icons-material';
import Footer from '@/components/Footer';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionCard = motion.create(Card);

// Custom hook for count-up animation
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return count;
};

// Animation variants
const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6
    } 
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8
    } 
  },
};

const productsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const productCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6
    } 
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      staggerChildren: 0.2,
    } 
  },
};

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);



  // Using data from homepage.ts file

  // Function to render icon based on iconName
  const renderIcon = (iconName: string) => {
    const iconProps = { sx: { fontSize: 60, color: 'primary.main' } };
    
    switch (iconName) {
      case 'Chair':
        return <Chair {...iconProps} />;
      case 'EventSeat':
        return <EventSeat {...iconProps} />;
      case 'AirlineSeatReclineNormal':
        return <AirlineSeatReclineNormal {...iconProps} />;
      default:
        return <Chair {...iconProps} />;
    }
  };

  // Modal handlers
  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <Box sx={{ mt: 0, pt: 0 }}>
        <HeroSection />
      </Box>
      
      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 2, md: 1 ,lg: 2, xl: 2},
        backgroundColor: 'rgba(228, 221, 221, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
      }}>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
          <MotionBox
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
                         <Grid
               display="grid"
               gridTemplateColumns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr' }}
               sx={{
                 width: '100%',
                 gap: { xs: 3, sm: 4, md: 6, lg: 8, xl: 10 },
               }}
             >
              {stats.map((stat, index) => (
                <StatItem key={index} stat={stat} />
              ))}
            </Grid>
          </MotionBox>
        </Container>
      </Box>

      {/* Products Section */}
      <Box sx={{ py: { xs: 2, md: 3, lg: 1, xl: 2 }, width: '100%' }}>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
          <MotionBox
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 1, md: 2 },
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem', lg: '3rem' },
                fontWeight: 'bold',
                color: 'black',
              }}
            >
              Our Seating Solutions
            </Typography>
                         <Typography
               variant="h6"
               sx={{
                 color: 'black',
                 width: '100%',
                 fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' ,lg: '1.25rem', xl: '1.25rem'},
                 px: { xs: 2, sm: 0 },
                 whiteSpace: { xs: 'normal', sm: 'nowrap' }, // Allow text to wrap on mobile
                 overflow: 'visible',
                 textOverflow: 'clip',
                 textAlign: 'center', // Center the text
                 lineHeight: { xs: 1.4, sm: 1.5 }, // Better line height for readability
               }}
             >
               Premium Truck, RV, and Van seating with custom options and Superior craftsmanship.
             </Typography>
          </MotionBox>

          <MotionBox
            variants={productsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Grid
              display="grid"
              gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
              gap={{ xs: 2, sm: 3, md: 4 }}
              sx={{ width: '100%' }}
            >
              {seatingProducts.map((product, index) => (
                <MotionCard
                  key={`product-${index}`}
                  variants={productCardVariants}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    // Removed hover effects as requested
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      height: { xs: 150, sm: 180, md: 200 ,lg: '250px', xl: '250px'},
                      objectFit: 'contain',
                      backgroundColor: 'grey.100',
                      width: '100%',
                      fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem' },
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5, md: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1.5, md: 2 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {product.title}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'black', fontWeight: 'normal' }}>
                        {product.price}
                      </Typography>
                    </Box>
                    <Typography  sx={{ mb: { xs: 1.5, md: 2 }, color: 'black', fontWeight: 'normal' }}>
                      {product.description}
                    </Typography>
                                         <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, mb: { xs: 1.5, md: 2 }, flexWrap: 'wrap' }}>
                       {product.features.map((feature, featureIndex) => (
                         <Chip
                           key={`feature-${index}-${featureIndex}`}
                           label={feature}
                           size="small"
                           sx={{ 
                             backgroundColor: 'rgba(220, 38, 38, 0.8)', 
                             color: 'white',
                             fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '0.9rem', xl: '0.95rem' },
                             fontWeight: 500,
                             padding: { xs: '4px 8px', sm: '6px 10px', md: '8px 12px' },
                             '& .MuiChip-label': {
                               padding: { xs: '0 4px', sm: '0 6px', md: '0 8px' },
                               whiteSpace: 'nowrap',
                               overflow: 'hidden',
                               textOverflow: 'ellipsis',
                             }
                           }}
                         />
                       ))}
                     </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,height: '40px'}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {product.rating}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<ArrowForward />}
                        onClick={() => handleOpenModal(product)}
                        sx={{
                          height: { xs: '40px', sm: '40px', md: '40px', lg: '40px', xl: '50px' },
                        
                          fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem' },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </MotionCard>
              ))}
            </Grid>
          </MotionBox>
        </Container>
      </Box>

     
      {/* Truck Carousel Section */}
      <TruckCarousel />
      
      {/* Product Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.99)',
            color: 'black',
            margin: { xs: 1, sm: 2, md: 4 },
            maxWidth: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
            maxHeight: { xs: 'calc(100vh - 16px)', sm: 'calc(100vh - 32px)', md: 'calc(100vh - 64px)' },
            height: { xs: 'auto', md: '80vh' },
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', height: '100%' }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 12, md: 16 },
              right: { xs: 8, sm: 12, md: 16 },
              color: 'white',
              backgroundColor: 'primary.main',
              zIndex: 1,
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
              width: { xs: 28, sm: 32, md: 40 },
              height: { xs: 28, sm: 32, md: 40 },
              // Removed hover effects as requested
              transition: 'all 0.2s ease',
            }}
          >
            <Close sx={{ fontSize: { xs: 16, sm: 18, md: 24 } }} />
          </IconButton>

          {selectedProduct && (
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                height: '100%',
                minHeight: { xs: 'auto', md: '100%' },
                maxHeight: '100%'
              }}
            >
              {/* Image Container */}
              <Box 
                sx={{ 
                  flex: { xs: 'none', md: '0 0 50%' },
                  position: 'relative',
                  backgroundColor: 'rgba(228, 221, 221, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: '50vh', md: '100%' },
                  overflow: 'hidden',
                  p: { xs: 1, sm: 2, md: 3 }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: '40vh', md: '100%' }
                  }}
                >
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                  />
                </Box>
              </Box>

              {/* Content Container */}
              <Box
                sx={{
                  flex: { xs: 'none', md: '0 0 50%' },
                  p: { xs: 1.5, sm: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderTop: { xs: '1px solid rgba(0,0,0,0.1)', md: 'none' },
                  borderLeft: { xs: 'none', md: '1px solid rgba(0,0,0,0.1)' },
                  minHeight: { xs: 'auto', md: '100%' },
                  overflow: 'auto',
                  maxHeight: { xs: '50vh', md: '100%' }
                }}
              >
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  color: 'black',
                  lineHeight: 1.3,
                }}>
                  {selectedProduct.title}
                </Typography>
                
                <Typography variant="h5" sx={{ 
                  mb: 2, 
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                  color: 'primary.main',
                  fontWeight: 'bold',
                }}>
                  {selectedProduct.price}
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  mb: 3, 
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  lineHeight: 1.6,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  color: 'text.secondary',
                  flex: 1,
                }}>
                  {selectedProduct.description}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'black' }}>
                  Features:
                </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedProduct.features.map((feature: string, index: number) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        sx={{ backgroundColor: 'primary.light', color: 'white' }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Star sx={{ fontSize: 20, color: 'warning.main' }} />
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Rating: {selectedProduct.rating}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      flex: 1,
                      borderColor: 'primary.main',
                      color: 'black',
                      fontWeight: 'bold',
                      // Removed hover effects as requested
                    }}
                  >
                    Customize
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      flex: 1,
                      backgroundColor: 'primary.main',
                      fontWeight: 'bold',
                      // Removed hover effects as requested
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
      
   <Footer/>
  
    </Box>
  );
};

// Stat Item Component with Count-up Animation
const StatItem = ({ stat }: { stat: { number: number; label: string; suffix: string } }) => {
  const [isVisible, setIsVisible] = useState(false);
  const count = useCountUp(isVisible ? stat.number : 0, 2000);

  // Format number with commas
  const formattedCount = count.toLocaleString();

  return (
    <MotionBox
      variants={statItemVariants}
      onAnimationStart={() => setIsVisible(true)}
      sx={{ textAlign: 'center', width: '100%' }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: '600',
          color: 'black',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
        }}
      >
        {formattedCount}{stat.suffix}
      </Typography>
      <Typography
      
        sx={{
          color: 'black',
          fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem', xl: '1.8rem' },
          fontWeight: 'bold',
        }}
      >
        {stat.label}
      </Typography>
    </MotionBox>
  );
};

export default HomePage; 