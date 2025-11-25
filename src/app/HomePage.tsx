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
import LogoButton from '@/components/LogoButton';
import LazyImage from '@/components/common/LazyImage';
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

// Direct image URLs - using full URLs from server
const IMAGE_BASE_URL_STATIC = process.env.NEXT_PUBLIC_STATIC_IMAGES || 'https://api.superiorseatingllc.com/images';

// Featured Projects Gallery Images
const featuredProjectsImages = [
  { id: 1, src: `${IMAGE_BASE_URL_STATIC}/Gallery/double.png`, alt: 'Featured Project 1' },
  { id: 2, src: `${IMAGE_BASE_URL_STATIC}/Gallery/02.png`, alt: 'Featured Project 2' },
  { id: 3, src: `${IMAGE_BASE_URL_STATIC}/Gallery/03.png`, alt: 'Featured Project 3' },
  { id: 4, src: `${IMAGE_BASE_URL_STATIC}/Gallery/07.png`, alt: 'Featured Project 4' },
  { id: 5, src: `${IMAGE_BASE_URL_STATIC}/Gallery/08.png`, alt: 'Featured Project 5' },
  { id: 6, src: `${IMAGE_BASE_URL_STATIC}/Gallery/09.png`, alt: 'Featured Project 6' },
];

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  // Base URL for images from server
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_STATIC_IMAGES || 'https://api.superiorseatingllc.com/images';
  
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
        py: { xs: 6, md: 5, lg: 5 ,xl: 5},
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        minHeight: { xs: 'auto', md: '400px', lg: '400px', xl: '400px' }
      }}>
        {/* Image at Very Left End of Parent Container with Background */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          sx={{
            position: 'absolute',
            top: { xs: '10px', sm: '15px', md: '20px', lg: '-10px', xl: '-20px' },
            left: { xs: -70, sm: -70, md: 'calc(40% - 400px)', lg: 'calc(32% - 450px)', xl: 'calc(35% - 500px)' },
            zIndex: 30,
            display: { xs: 'none', sm: 'none', md: 'block', lg: 'block', xl: 'block' },
            overflow: 'visible',
          }}
        >
          <Box
            component="img"
            src={`${IMAGE_BASE_URL}/Logos/homepage2.png`}
            alt="Superior Seating LLC"
            sx={{
              maxWidth: { xs: '250px', sm: '400px', md: '280px', lg: '300px', xl: '320px' },
              maxHeight: { xs: '150px', sm: '225px', md: '380px', lg: '480px', xl: '500px' },
              borderRadius: 2,
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </MotionBox>

        {/* Image at Very Right End of Parent Container with Background */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
              position: 'absolute',
              top: { xs: '10px', sm: '15px', md: '20px', lg: '25px', xl: '30px' },
              right: 0,
              zIndex: 30,
              display: 'block',
            }}
          >
          <Box
            component="img"
            src={`${IMAGE_BASE_URL}/Gallery/Patriotism/fc.png`}
            alt="Superior Seating LLC"
            sx={{
              width: { xs: '250px', sm: '400px', md: '450px', lg: '450px', xl: '500px' },
              height: { xs: '150px', sm: '225px', md: '280px', lg: '300px', xl: '375px' },
              marginTop: { xs: '-40px', sm: '-55px', md: '-77px', lg: '-92px', xl: '-114px' },
              marginRight: { xs: '-30px', sm: '-40px', md: '-50px', lg: '-50px', xl: '-68px' },
              borderRadius: 2,
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </MotionBox>


        <Container maxWidth="lg" sx={{ position: 'relative', height: '100%', px: { md: 4, lg: 6, xl: 8 } }}>

          {/* Logo Button - Responsive */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              left: { xs: 'auto', md: '45%', lg: '45%', xl: '40%' },
              top: { xs: 'auto', md: '-80px', lg: '-90px', xl: '-120px' },
              transform: { xs: 'none', md: 'translateX(-50%)', lg: 'translateX(-50%)', xl: 'translateX(-50%)' },
              marginTop: { xs: 0 },
              marginLeft: { xs: 0 },
              flexShrink: 0,
              alignSelf: { xs: 'center', md: 'center' },
              zIndex: 20,
              display: 'flex',
              justifyContent: 'center',
              mb: { xs: 4, md: 0 },
            }}
          >
            <LogoButton onClick={() => {
              router.push('/customize-your-seat');
            }} />
          </MotionBox>

          {/* Text Content - Responsive */}
          <MotionBox
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              left: { xs: 'auto', md: '50%', lg: '50%', xl: '50%' },
              top: { xs: 'auto', md: '120px', lg: '120px', xl: '120px' },
              transform: { xs: 'none', md: 'translateX(-50%)', lg: 'translateX(-50%)', xl: 'translateX(-50%)' },
              textAlign: { xs: "center", md: "center" },
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", md: "center" },
              zIndex: 15,
              width: { xs: '100%', md: 'auto' },
            }}
          >
            {/* Company Name - Responsive */}
            <MotionTypography
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "2.9rem", lg: "3.5rem", xl: "4.5rem" },
                fontWeight: "bold",
                lineHeight: { xs: 1.1, sm: 1.15, md: 1.2, lg: 1.2, xl: 1.2 },
                color: 'white',
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                mb: { xs: 0, md: 1, lg: 1, xl: 1 },
                mt: { xs: 0, md: 0, lg: 0, xl: 0 },
                whiteSpace: { xs: "normal", md: "nowrap" },
                overflow: { xs: "visible", md: "hidden" },
                textOverflow: { xs: "clip", md: "ellipsis" },
                textAlign: { xs: "center", md: "center", lg: "center", xl: "center" },
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
                fontSize: { xs: "0.85rem", sm: "0.875rem", md: "1rem", lg: "1.8rem", xl: "2.2rem" },
                letterSpacing: "0.5px",
                fontWeight: { xs: 600, md: 300, lg: 300, xl: 300 },
                lineHeight: { xs: 1.3, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
                textAlign: { xs: "center", md: "center", lg: "center", xl: "center" },
                alignSelf: { xs: "center", md: "center", lg: "center", xl: "center" },
                color: { xs: 'white', md: 'white', lg: 'white', xl: 'white' },
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
                px: { xs: 2, sm: 0, md: 0, lg: 0, xl: 0 },
                py: { xs: 0.5, sm: 1, md: 2, lg: 2, xl: 2 },
                mt: { xs: 0, md: 0, lg: 0, xl: 0 },
              }}
            >
              <Box
                component="span"
                sx={{
                  whiteSpace: { xs: "normal", sm: "normal", md: "normal", lg: "nowrap", xl: "nowrap" },
                  display: { xs: "block", sm: "block", md: "block", lg: "inline", xl: "inline" },
                }}
              >
                Premium Truck,Semi-Truck,RV and Van seating with custom
              </Box>
              <br />
              <span style={{ textAlign: "center", display: "block", width: "100%" }}>
                options and superior craftsmanship
              </span>
            </MotionTypography>
          </MotionBox>
        </Container>
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
            {featuredProjectsImages.map((picture, index) => {
              return (
              <MotionBox
                key={picture.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                sx={{
                  width: '100%',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: 2,
                  '&:hover .gallery-image': {
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
                    zIndex: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: { xs: 300, sm: 350, md: 400, lg: 450 },
                    width: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {picture.src && picture.src.trim() !== '' ? (
                    <LazyImage
                      src={picture.src}
                      alt={picture.alt}
                      fill
                      showSkeleton={true}
                      quality={85}
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        display: 'block',
                      }}
                      priority={index < 2}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
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
                </Box>
              </MotionBox>
            );
            })}
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
                    src={selectedProduct.image?.startsWith('http') 
                      ? selectedProduct.image 
                      : `${IMAGE_BASE_URL}${selectedProduct.image}`}
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