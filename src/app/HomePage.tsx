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
  AirlineSeatReclineNormal
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

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <Box sx={{ mt: 0, pt: 0 }}>
        <HeroSection />
      </Box>
      
      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 2, md: 1 ,lg: 1, xl: 1},
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Container maxWidth="lg">
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
                 maxWidth: { md: '800px' },
                 mx: 'auto',
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
      <Box sx={{ py: { xs: 2, md: 3, lg: 1, xl: 2 } }}>
        <Container maxWidth="lg">
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
                color:'#DA291C',
              }}
            >
              Our Seating Solutions
            </Typography>
                         <Typography
               variant="h6"
               sx={{
                 color: 'text.secondary',
                 maxWidth: { xs: '100%', sm: '100%', md: '100%' },
                 mx: 'auto',
                 fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                 px: { xs: 2, sm: 0 },
                 whiteSpace: { xs: 'normal', sm: 'nowrap' }, // Allow text to wrap on mobile
                 overflow: 'visible',
                 textOverflow: 'clip',
                 textAlign: 'center', // Center the text
                 lineHeight: { xs: 1.4, sm: 1.5 }, // Better line height for readability
               }}
             >
               Premium truck, RV, and van seating with custom options and superior craftsmanship.
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
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(218, 22, 22, 0.15)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      height: { xs: 150, sm: 180, md: 200 },
                      objectFit: 'contain',
                      backgroundColor: 'grey.100',
                      width: '100%',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5, md: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1.5, md: 2 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {product.title}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {product.price}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: { xs: 1.5, md: 2 }, color: 'text.secondary' }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, mb: { xs: 1.5, md: 2 }, flexWrap: 'wrap' }}>
                      {product.features.map((feature, featureIndex) => (
                        <Chip
                          key={`feature-${index}-${featureIndex}`}
                          label={feature}
                          size="small"
                          sx={{ backgroundColor: 'primary.light', color: 'white' }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Trusted by Leading Truck Manufacturers Section */}
      {/* <Box sx={{ py: { xs: 2, md: 3 } }}>
        <Container maxWidth="lg">
          <MotionBox
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            sx={{ textAlign: 'center', mb: { xs: 2, md: 1.5, lg: 1.5, xl: 3 } }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 1, md: 2 },
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem', lg: '3rem' },
                fontWeight: 'bold',
                color:'#DA291C',
              }}
            >
              Trusted by Leading Truck Manufacturers
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: { xs: '100%', sm: '100%', md: '100%' },
                mx: 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                px: { xs: 2, sm: 0 },
                whiteSpace: { xs: 'normal', sm: 'nowrap' }, // Allow text to wrap on mobile
                overflow: 'visible',
                textOverflow: 'clip',
                textAlign: 'center', // Center the text
                lineHeight: { xs: 1.4, sm: 1.5 }, // Better line height for readability
              }}
            >
              Superior Seating provides custom seating solutions for all major truck brands worldwide
            </Typography>
          </MotionBox>
        </Container>
      </Box> */}

      {/* Truck Carousel Section */}
      <TruckCarousel />
      

      
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
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
        }}
      >
        {formattedCount}{stat.suffix}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
        }}
      >
        {stat.label}
      </Typography>
    </MotionBox>
  );
};

export default HomePage; 