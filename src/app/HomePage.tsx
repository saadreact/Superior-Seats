'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import LogoButton from '@/components/LogoButton';
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
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import Footer from '@/components/Footer';
import HeroImageSlider from '@/components/HeroImageSlider';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sectionHeights = {
    xs: 'auto',
    md: 420,
    lg: 480,
    xl: 540,
  };
  const leftContentBlockHeights = {
    logo: { xs: 'auto', md: '110px', lg: '120px', xl: '130px' },
    title: { xs: 'auto', md: '90px', lg: '100px', xl: '110px' },
    description: { xs: 'auto', md: '140px', lg: '160px', xl: '180px' },
  };

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

  const handleToggleFullscreen = async () => {
    if (!videoContainerRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (videoContainerRef.current.requestFullscreen) {
          await videoContainerRef.current.requestFullscreen();
        } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
          await (videoContainerRef.current as any).webkitRequestFullscreen();
        } else if ((videoContainerRef.current as any).mozRequestFullScreen) {
          await (videoContainerRef.current as any).mozRequestFullScreen();
        } else if ((videoContainerRef.current as any).msRequestFullscreen) {
          await (videoContainerRef.current as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Header />
      <Box sx={{ mt: 0, pt: 0 }}>
        <HeroSection />
      </Box>
      <TruckCarousel />
      
      {/* New Superior Seating LLC Section */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        height: sectionHeights,
        alignItems: { xs: 'stretch', md: 'stretch' }
      }}>
        {/* Left Side - Content with Gradient Background */}
        <Box sx={{ 
          flex: { xs: '1 1 100%', md: '1 1 0%' },
          width: { xs: '100%', md: 'auto' ,lg: 'auto', xl: 'auto'},
          height: sectionHeights,
          px: { xs: 3, md: 4 },
          py: { xs: 4, md: 0 ,lg: 0, xl: 0},
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          backgroundSize: 'cover',  
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          order: { xs: 2, md: 1 }
        }}>
          <Container
            maxWidth="lg"
            disableGutters
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              width: '100%',
              height: '100%',
              py: { xs: 1, md: 0 },
              gap: { xs: 2, md: 2.5 }
            }}>
              {/* Logo Button - Responsive */}
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: leftContentBlockHeights.logo,
                  mb: { xs: 3, md: 0 },
                }}
              >
                <LogoButton />
              </MotionBox>

              {/* Text Content - Responsive */}
              <MotionBox
                sx={{
                  textAlign: 'center',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  pt: { xs: 1, md: 4, lg: 5 },
                  gap: { xs: 2, md: 0 },
                }}
              >
                {/* Company Name - Responsive */}
                <MotionTypography
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem", xl: "4.5rem" },
                    fontWeight: "bold",
                    lineHeight: { xs: 1.1, sm: 1.15, md: 1, lg: 1, xl: 1.2 },
                    color: 'white',
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    mt: { xs: '8px', md: '0px', lg: '0px', xl: '24px'},
                    ml: { xs: '0px', md: '0px', lg: '0px', xl: '0px' },
                    whiteSpace: { xs: "normal", md: "nowrap" },
                    overflow: { xs: "visible", md: "hidden" },
                    textOverflow: { xs: "clip", md: "ellipsis" },
                    textAlign: 'center',
                    height: leftContentBlockHeights.title,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Superior Seating LLC
                </MotionTypography>

                {/* Description - Responsive */}
                <MotionTypography
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  sx={{
                    opacity: 0.95,
                    fontSize: { xs: "0.85rem", sm: "0.875rem", md: "1rem", lg: "1.8rem", xl: "2rem" },
                    letterSpacing: "0.5px",
                    fontWeight: { xs: 600, md: 300 },
                    lineHeight: { xs: 1.3, sm: 1.4, md: 1, lg: 1.1, xl: 1.1 },
                    textAlign: 'center',
                    alignSelf: 'center',
                    color: 'white',
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
                    mt: { xs: '8px', md: '-50px' ,lg: '-20px', xl: '-20px'},
                    ml: { xs: '0px', md: '0px', lg: '0px', xl: '0px' },
                    px: { xs: '16px', md: '24px' },
                    py: { xs: '10px', md: '0px' },
                    height: leftContentBlockHeights.description,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Premium Truck, SemiTruck, RV and Van seating with custom
                  <br />
                  <span style={{ display: "block", width: "100%" }}>
                    options and superior craftsmanship
                  </span>
                </MotionTypography>
              </MotionBox>
            </Box>
          </Container>
        </Box>

        {/* Right Side - Truck Image (No Background) */}
        <Box sx={{ 
          flex: { xs: '0 0 auto', md: '0 0 auto' },
          width: { xs: '100%', md: 'auto' },
          height: { xs: 'auto', md: sectionHeights },
          minHeight: { xs: 'auto', md: sectionHeights },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          order: { xs: 1, md: 2 },
          py: { xs: 2, md: 0 },
          px: { xs: 2, md: 0 },
        }}>
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '100%', md: 'fit-content' },
              height: { xs: 'auto', md: 'fit-content' },
              maxWidth: { xs: '100%', md: '720px', lg: '760px', xl: '820px' },
            }}
          >
            <Box
              component="img"
              src="/Gallery/Truckimages/mappic.png"
              alt="Truck"
              sx={{
                width: { xs: '100%', md: 'auto' },
                height: { xs: 'auto', md: 'auto' },
                maxWidth: { xs: '100%', md: '100%' },
                maxHeight: { xs: 'none', sm: '320px', md: '420px', lg: '480px', xl: '540px' },
                objectFit: { xs: 'contain', md: 'contain' },
                display: 'block',
              }}
            />
          </MotionBox>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 3, md: 3, lg: 3, xl: 3 },
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
              mb: 3,
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

      {/* Brand Carousel Section - Moved before Crafters */}
    

   

      {/* Our Process Section - Inspired by B&G */}
      {/*
      <Box sx={{ 
        py: { xs: 3, md: 3, lg: 3, xl: 3 },
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
                mt: 0,
                mb: 2,
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
      */}

      {/* Portfolio/Gallery Section - Full Width Images */}
      <Box sx={{ 
        py: { xs: 3, md: 3, lg: 3, xl: 3 },
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
                <Image
                  src={picture.image}
                  alt={`Project ${picture.id}`}
                  fill
                  priority={index < 2}
                  quality={80}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
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
              <Image
                src="/LandingPage/Fw_ Seats/image0 (12).jpeg"
                alt="Custom Seat Installation 1"
                fill
                priority={false}
                quality={80}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
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
                <Image
                  src="/LandingPage/Fw_ Seats/IMG_2797.JPEG"
                  alt="Custom Seat Installation 2"
                  fill
                  priority={false}
                  quality={75}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{
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
                <Image
                  src="/LandingPage/Fw__Seats%20(1)/IMG_3590.jpg"
                  alt="Custom Seat Installation 3"
                  fill
                  priority={false}
                  quality={75}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{
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
                <Image
                  src="/LandingPage/Fw__Seats%20(1)/IMG_5557.JPG"
                  alt="Custom Seat Installation 4"
                  fill
                  priority={false}
                  quality={75}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
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
              <Image
                src="/LandingPage/Fw__Seats%20(1)/IMG_7077.jpg"
                alt="Custom Seat Installation 5"
                fill
                quality={75}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
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
              <Image
                src="/LandingPage/Fw__FW__/1000001039.jpg"
                alt="Custom Seat Installation 6"
                fill
                quality={75}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
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
              <Image
                src="/LandingPage/Fw__Seats%20(1)/IMG_8107.jpeg"
                alt="Custom Seat Installation 7"
                fill
                quality={75}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
            </MotionBox>
          </Box>
        </Container>
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