'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
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
  Snackbar,
  Alert,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TruckCarousel from '@/components/TruckCarousel';
import { seatingProducts, stats } from '@/data/homepage';
import { values, process as processSteps } from '@/data/About';
import { workPictures } from '@/data/Gallery';
import { testimonials } from '@/data/testimonials';

import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Star,
  ArrowForward,
  Chair,
  EventSeat,
  AirlineSeatReclineNormal,
  Close,
  AutoAwesome,
  Support,
  Engineering,
  FormatQuote,
  CheckCircleOutline,
  Verified,
  VolumeOff,
  VolumeUp,
} from '@mui/icons-material';
import Footer from '@/components/Footer';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionCard = motion.create(Card);
const MotionPaper = motion.create(Paper);

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
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
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
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.6
    } 
  },
};

const ctaVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
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
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Video state
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Icon mapping function for values section
  const getIcon = (iconName: string) => {
    const iconProps = { sx: { fontSize: { xs: 40, md: 50, lg: 60 }, color: 'primary.main' } };
    const iconMap: { [key: string]: React.ReactElement } = {
      AutoAwesome: <AutoAwesome {...iconProps} />,
      Support: <Support {...iconProps} />,
      Engineering: <Engineering {...iconProps} />,
    };
    return iconMap[iconName] || <Chair {...iconProps} />;
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

  // Snackbar handlers
  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Video handlers
  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Header />
      <Box sx={{ mt: 0, pt: 0 }}>
        <HeroSection />
      </Box>
      
      {/* About Section - Inspired by B&G intro */}
      {/* COMMENTED OUT FOR NOW
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        backgroundColor: 'white',
        position: 'relative',
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                letterSpacing: 2,
              }}
            >
              GOING BEYOND THE BUILD
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Crafting Excellence, One Seat at a Time
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem', lg: '1.25rem' },
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              We&apos;re building with spirit for our people, our partners, our communities, and the future we share.
              With over 25 years of experience, we&apos;ve mastered the art of creating premium seating solutions
              that combine comfort, durability, and style.
            </Typography>
          </MotionBox>

          <MotionBox
            variants={productsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
            }}
          >
            {values.map((value, index) => (
              <MotionCard
                key={index}
                variants={productCardVariants}
                sx={{
                  height: '100%',
                  p: 4,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <Box sx={{ mb: 3 }}>
                  {getIcon(value.icon)}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  {value.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}
                >
                  {value.description}
                </Typography>
              </MotionCard>
            ))}
          </MotionBox>
        </Container>
      </Box>
      */}

      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        position: 'relative',
      }}>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
          <MotionTypography
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontSize: { xs: '1.75rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 600,
            }}
          >
            A Little About Us
          </MotionTypography>
          <MotionBox
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' },
              width: '100%',
              gap: { xs: 3, sm: 4, md: 6, lg: 8, xl: 10 },
            }}
          >
            {stats.map((stat, index) => (
              <StatItem key={index} stat={stat} />
            ))}
          </MotionBox>
        </Container>
      </Box>

      {/* Our Process Section - Inspired by B&G */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        backgroundColor: 'white',
        position: 'relative',
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                letterSpacing: 2,
              }}
            >
              OUR PROCESS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Crafters from the Beginning
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem', lg: '1.25rem' },
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              We&apos;re true craftsmen who bring your vision to life with our hands-on approach for more control over quality, comfort, and style.
            </Typography>
          </MotionBox>

          {/* Process Steps */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 3, md: 4 },
              justifyContent: 'center',
            }}
          >
            {processSteps.map((step, index) => (
              <MotionPaper
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                elevation={0}
                sx={{
                  p: 4,
                  background: 'transparent',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 16px)',
                    md: '1 1 calc(33.333% - 21.33px)',
                  },
                  maxWidth: {
                    xs: '100%',
                    sm: 'calc(50% - 16px)',
                    md: 'calc(33.333% - 21.33px)',
                  },
                  minWidth: {
                    xs: '100%',
                    sm: 'calc(50% - 16px)',
                    md: 'calc(33.333% - 21.33px)',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 40px rgba(211, 47, 47, 0.1)',
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '3rem', md: '4rem' },
                    fontWeight: 700,
                    color: 'primary.main',
                    opacity: 0.2,
                    mb: 2,
                  }}
                >
                  {step.step}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  {step.description}
                </Typography>
              </MotionPaper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Portfolio/Gallery Section - Full Width Images */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
      }}>
        <Container maxWidth="xl">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                letterSpacing: 2,
              }}
            >
              OUR CRAFTSMANSHIP
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Featured Projects
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem', lg: '1.25rem' },
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Explore our portfolio of custom seating solutions crafted with precision and passion.
            </Typography>
          </MotionBox>

          {/* Gallery Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 2, md: 3 },
            }}
          >
            {workPictures.slice(0, 6).map((picture, index) => (
              <MotionBox
                key={picture.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                sx={{
                  position: 'relative',
                  paddingTop: '75%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: '#f5f5f5',
                  '&:hover img': {
                    transform: 'scale(1.05)',
                  },
                  '&:hover::after': {
                    opacity: 0.5,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.2) 100%)',
                    opacity: 0.2,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box
                  component="img"
                  src={picture.image}
                  alt={`Project ${picture.id}`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </MotionBox>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/gallery')}
              endIcon={<ArrowForward />}
              sx={{
                borderWidth: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              View Full Gallery
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Latest Work Showcase - Using Landing Page Images */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        backgroundColor: 'white',
        position: 'relative',
      }}>
        <Container maxWidth="xl">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                letterSpacing: 2,
              }}
            >
              LATEST WORK
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Recent Installations
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem', lg: '1.25rem' },
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              See our latest custom seat installations showcasing our craftsmanship and attention to detail.
            </Typography>
          </MotionBox>

          {/* Latest Work Grid - Using Landing Page Images */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: { xs: 2, md: 3 },
              mb: { xs: 2, md: 3 },
            }}
          >
            {/* Row 1 - Large Image */}
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              sx={{
                position: 'relative',
                paddingTop: '66.67%',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&:hover img': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                component="img"
                src="/LandingPage/Fw_ Seats/image0 (12).jpeg"
                alt="Custom Seat Installation 1"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
            </MotionBox>
            
            {/* Row 1 - Small Images Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: { xs: 2, md: 3 },
              }}
            >
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '&:hover img': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  component="img"
                  src="/LandingPage/Fw_ Seats/IMG_2797.JPEG"
                  alt="Custom Seat Installation 2"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '&:hover img': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  component="img"
                  src="/LandingPage/Fw__Seats%20(1)/IMG_3590.jpg"
                  alt="Custom Seat Installation 3"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{
                  position: 'relative',
                  paddingTop: '50%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  gridColumn: 'span 2',
                  '&:hover img': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  component="img"
                  src="/LandingPage/Fw__Seats%20(1)/IMG_5557.JPG"
                  alt="Custom Seat Installation 4"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </MotionBox>
            </Box>
          </Box>

          {/* Row 2 */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 2, md: 3 },
            }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              sx={{
                position: 'relative',
                paddingTop: '133%',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&:hover img': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                component="img"
                src="/LandingPage/Fw__Seats%20(1)/IMG_7077.jpg"
                alt="Custom Seat Installation 5"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              sx={{
                position: 'relative',
                paddingTop: '133%',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&:hover img': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                component="img"
                src="/LandingPage/Fw__FW__/1000001039.jpg"
                alt="Custom Seat Installation 6"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{
                position: 'relative',
                paddingTop: '133%',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&:hover img': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                component="img"
                src="/LandingPage/Fw__Seats%20(1)/IMG_8107.jpeg"
                alt="Custom Seat Installation 7"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
            </MotionBox>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      {/* COMMENTED OUT FOR NOW
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        backgroundColor: '#fafafa',
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                letterSpacing: 2,
              }}
            >
              TESTIMONIALS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              What Our Customers Say
            </Typography>
          </MotionBox>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <MotionCard
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                sx={{
                  height: '100%',
                  p: 4,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <FormatQuote 
                  sx={{ 
                    fontSize: 48,
                    color: 'primary.main',
                    opacity: 0.2,
                    position: 'absolute',
                    top: 16,
                    left: 16,
                  }} 
                />
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} sx={{ fontSize: 20, color: 'warning.main' }} />
                  ))}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{testimonial.text}&rdquo;
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </MotionCard>
            ))}
          </Box>
        </Container>
      </Box>
      */}

      {/* Call to Action Section */}
      {/* COMMENTED OUT FOR NOW
      <Box sx={{ 
        py: { xs: 8, md: 10, lg: 12 },
        background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.95) 0%, rgba(139, 0, 0, 0.95) 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/Gallery/Truckimages/truck01.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0,
        },
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center' }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 700,
              }}
            >
              Ready to Experience Superior Comfort?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 5,
                fontSize: { xs: '1rem', md: '1.25rem' },
                opacity: 0.95,
                lineHeight: 1.8,
              }}
            >
              Join thousands of satisfied customers who&apos;ve transformed their vehicles with our custom seating solutions.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/contact')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Get a Quote
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/shop-now')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Shop Now
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>
      */}
     
      {/* Brand Carousel Section */}
      <TruckCarousel />

      {/* Video Section Above Footer */}
      <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: 'black' }}>
        <Box sx={{ position: 'relative', maxWidth: '1440px', mx: 'auto' }}>
          <Box
            ref={videoRef}
            component="video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            sx={{ width: '100%', height: { xs: 240, sm: 320, md: 420, lg: 520 }, objectFit: 'cover' }}
          >
            <source src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/videos/SuperiorSeatsINC_banner_video.mov`} type="video/mp4" />
            <source src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/videos/SuperiorSeatsINC_banner_video.mov`} type="video/quicktime" />
          </Box>
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 100%)' }} />
          
          {/* Unmute Button */}
          <IconButton
            onClick={handleToggleMute}
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.8)',
              },
              transition: 'all 0.3s ease',
              zIndex: 2,
            }}
          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
        </Box>
      </Box>
      
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
                  fontWeight: 500, 
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
                  fontWeight: 500,
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
                                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: 'black' }}>
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
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Rating: {selectedProduct.rating}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      // TODO: Uncomment when customize page is ready
                      // Navigate to customize page
                      handleSnackbarOpen();
                    }}
                    sx={{
                      flex: 1,
                      borderColor: 'primary.main',
                      color: 'black',
                      fontWeight: 500,
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
                      fontWeight: 500,
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
      
      {/* Snackbar for customize feature coming soon */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Customize feature is coming soon!
        </Alert>
      </Snackbar>
      
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
           fontWeight: 500,
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
          fontWeight: 500,
        }}
      >
        {stat.label}
      </Typography>
    </MotionBox>
  );
};

export default HomePage; 