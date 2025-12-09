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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
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
  ArrowBackIos,
  ArrowForwardIos,
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

import axios from 'axios';
import { SeatStyle, PaginationMeta, ApiResponse } from '../data/homepage';

// API Base URL - use environment variable or fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Direct image URLs - using full URLs from server
const IMAGE_BASE_URL_STATIC = process.env.NEXT_PUBLIC_STATIC_IMAGES || 'https://api.superiorseatingllc.com/images';

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

  // Gallery State
  const [galleryData, setGalleryData] = useState<SeatStyle[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Lightbox State
  const [selectedStyle, setSelectedStyle] = useState<SeatStyle | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const imageLoadingRef = useRef(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Touch/swipe functionality for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Fetch Gallery Data
  const fetchGalleryData = async (pageNum: number, limit: number) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/seat-styles?page=${pageNum}&per_page=${limit}&sort_by=name&sort_order=asc`);
      if (response.data.status === 'success') {
        setGalleryData(response.data.data);
        setPagination(response.data.meta.pagination);
      }
    } catch (error) {
      console.error('Error fetching gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryData(page, perPage);
  }, [page, perPage]);

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.last_page) {
      setPage(newPage);
    }
  };

  // Helper to get display image for a style
  const getDisplayImage = (style: SeatStyle) => {
    if (!style.images || style.images.length === 0) return null;
    return style.images.find(img => img.is_primary) || style.images[0];
  };

  // Lightbox Handlers
  const handleOpenLightbox = async (style: SeatStyle) => {
    if (style.images && style.images.length > 0) {
      setSelectedStyle(style);
      setCurrentImageIndex(0);
      setImageLoading(true);
      setShowLoader(false);
      imageLoadingRef.current = true;
      setSelectedProductId(null);
      
      // Fetch full seat style with products
      if (style.id) {
        setLoadingProducts(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/seat-styles/${style.id}`);
          
          // Handle different response structures
          let fullStyle = null;
          if (response.data?.data?.seat_style) {
            fullStyle = response.data.data.seat_style;
          } else if (response.data?.seat_style) {
            fullStyle = response.data.seat_style;
          } else if (response.data) {
            fullStyle = response.data;
          }
          
          if (fullStyle) {
            // Ensure products is an array
            if (!Array.isArray(fullStyle.products)) {
              fullStyle.products = fullStyle.products ? [fullStyle.products] : [];
            }
            
            setSelectedStyle(fullStyle);
            
            // Set first product as default if available
            if (fullStyle.products && fullStyle.products.length > 0) {
              setSelectedProductId(fullStyle.products[0].id);
            } else {
              setSelectedProductId(null);
            }
          }
        } catch (error) {
          console.error('❌ Error fetching seat style with products:', error);
        } finally {
          setLoadingProducts(false);
        }
      }
    }
  };

  const handleCloseLightbox = () => {
    setSelectedStyle(null);
    setCurrentImageIndex(0);
    setImageLoading(false);
    setShowLoader(false);
    imageLoadingRef.current = false;
  };

  const handleNextImage = () => {
    if (!selectedStyle || !selectedStyle.images) return;
    setImageLoading(true);
    setShowLoader(false);
    imageLoadingRef.current = true;
    setCurrentImageIndex((prev) => (prev + 1) % selectedStyle.images.length);
  };

  const handlePrevImage = () => {
    if (!selectedStyle || !selectedStyle.images) return;
    setImageLoading(true);
    setShowLoader(false);
    imageLoadingRef.current = true;
    setCurrentImageIndex((prev) => (prev - 1 + selectedStyle.images.length) % selectedStyle.images.length);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedStyle) return;
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') handleCloseLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStyle, handleNextImage, handlePrevImage, handleCloseLightbox]);

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
        py: { xs: 6, md: 5, lg: 5, xl: 5 },
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
              Feature Styles
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
            {loading ? (
              // Simple loading skeleton
              Array.from(new Array(6)).map((_, index) => (
                <Box key={index} sx={{ height: { xs: 300, sm: 350, md: 400, lg: 450 }, bgcolor: '#f0f0f0', borderRadius: 2 }} />
              ))
            ) : (
              galleryData.map((style, index) => {
                const displayImage = getDisplayImage(style);
                return (
                  <MotionBox
                    key={style.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => handleOpenLightbox(style)}
                    sx={{
                      width: '100%',
                      position: 'relative',
                      cursor: displayImage ? 'pointer' : 'default',
                      overflow: 'hidden',
                      borderRadius: 2,
                      '&:hover .gallery-image': {
                        transform: displayImage ? 'scale(1.05)' : 'none',
                      },
                      '&:hover::after': {
                        opacity: displayImage ? 0.5 : 0,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, transparent 50%, rgba(31, 29, 29, 0.2) 100%)',
                        opacity: 0.3,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                        zIndex: 1,
                        display: displayImage ? 'block' : 'none',
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
                        boxShadow: '0 10px 40px rgba(53, 48, 49, 0.08)',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.3s ease',
                        height: { xs: 300, sm: 350, md: 400, lg: 450 },
                        width: '100%',
                        '&:hover': {
                          transform: displayImage ? 'translateY(-4px) scale(1.02)' : 'none',
                          boxShadow: displayImage ? '0 20px 60px rgba(54, 54, 54, 0.15)' : '0 10px 40px rgba(227, 24, 55, 0.08)',
                        },
                      }}
                    >
                      {displayImage ? (
                        <LazyImage
                          src={displayImage.image_url}
                          alt={displayImage.alt_text || style.name}
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
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            color: 'text.secondary',
                            p: 2,
                            textAlign: 'center',
                          }}
                        >
                          <Chair sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                          <Typography variant="body1" fontWeight={500}>{style.name}</Typography>
                          <Typography variant="caption">No images available</Typography>
                        </Box>
                      )}

                      {/* Overlay with Style Name */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 2,
                          background: 'linear-gradient(to top, rgba(51, 45, 45, 0.9) 0%, transparent 100%)',
                          color: 'white',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          '.MuiBox-root:hover &': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{style.name}</Typography>
                        {style.images && style.images.length > 1 && (
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {style.images.length} images
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </MotionBox>
                );
              })
            )}
          </Box>

          {/* Pagination Controls */}
          {pagination && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              mt: 4,
              borderTop: 1,
              borderColor: 'divider',
              flexWrap: 'wrap',
              gap: 2,
              backgroundColor: 'white',
              borderRadius: 2,
            }}>
              {/* Left side - Items per page select dropdown */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Items per page:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 80, maxWidth: 100 }}>
                  <Select
                    value={perPage.toString()}
                    onChange={(event: any) => {
                      const value = parseInt(event.target.value, 10);
                      setPerPage(value);
                      setPage(1); // Reset to first page
                    }}
                    sx={{
                      '& .MuiSelect-select': {
                        textAlign: 'center',
                        padding: '8px 12px',
                      },
                    }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Center - Page info */}
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Showing {pagination.from} to {pagination.to} of {pagination.total} seat styles
              </Typography>

              {/* Right side - Navigation controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={!pagination.links.prev}
                  onClick={() => handlePageChange(page - 1)}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  Previous
                </Button>

                <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                  Page {pagination.current_page} of {pagination.last_page}
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  disabled={!pagination.links.next}
                  onClick={() => handlePageChange(page + 1)}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  Next
                </Button>
              </Box>

              {/* Mobile Page Info - shown only on mobile */}
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' }, width: '100%', textAlign: 'center', mt: 1 }}>
                Showing {pagination.from} to {pagination.to} of {pagination.total} seat styles
              </Typography>
            </Box>
          )}

          {/* <Box sx={{ textAlign: 'center', mt: 4 }}>
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
          </Box> */}
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


      <Footer />

      {/* Lightbox Modal */}
      <Dialog
        open={!!selectedStyle}
        onClose={handleCloseLightbox}
        maxWidth="lg"
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
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 12, md: 16 },
              right: { xs: 8, sm: 12, md: 16 },
              color: 'white',
              backgroundColor: theme.palette.primary.main,
              zIndex: 1,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}4D`,
              width: { xs: 28, sm: 32, md: 40 },
              height: { xs: 28, sm: 32, md: 40 },
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: `0 6px 20px ${theme.palette.primary.main}66`,
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Close />
          </IconButton>

          {selectedStyle && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                height: '100%',
                minHeight: { xs: 'auto', md: '100%' },
                maxHeight: '100%'
              }}
            >
              {/* Image Container - 60% width on desktop */}
              <Box
                sx={{
                  flex: { xs: 'none', md: '0 0 60%' },
                  position: 'relative',
                  backgroundColor: '#f8f8f8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: '60vh', md: '100%' },
                  overflow: 'hidden',
                  p: { xs: 1, sm: 2, md: 3 }
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Main Image */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: '45vh', md: '100%' }
                  }}
                >
                  {/* Loading Spinner */}
                  {showLoader && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                      >
                        Loading image...
                      </Typography>
                    </Box>
                  )}

                  {selectedStyle.images && selectedStyle.images[currentImageIndex] && (
                    <img
                      src={selectedStyle.images[currentImageIndex].image_url}
                      alt={selectedStyle.images[currentImageIndex].alt_text || selectedStyle.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        opacity: imageLoading ? 0 : 1,
                        transition: 'opacity 0.3s ease-in-out',
                      }}
                      onLoad={() => {
                        setImageLoading(false);
                        setShowLoader(false);
                        imageLoadingRef.current = false;
                      }}
                      onError={() => {
                        setImageLoading(false);
                        setShowLoader(false);
                        imageLoadingRef.current = false;
                      }}
                    />
                  )}
                </Box>

                {/* Image Navigation Dots */}
                {selectedStyle.images && selectedStyle.images.length > 1 && (
                  <Box sx={{
                    position: 'absolute',
                    bottom: { xs: 20, sm: 30, md: 40 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: { xs: 0.75, sm: 1, md: 1.25 },
                    zIndex: 2,
                    padding: { xs: 1, sm: 1.5, md: 2 },
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '25px',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}>
                    {selectedStyle.images.map((image, index) => (
                      <Box
                        key={image.id}
                        onClick={() => {
                          if (index !== currentImageIndex) {
                            setImageLoading(true);
                            setShowLoader(false);
                            imageLoadingRef.current = true;
                            setCurrentImageIndex(index);
                          }
                        }}
                        sx={{
                          width: { xs: 12, sm: 14, md: 16 },
                          height: { xs: 12, sm: 14, md: 16 },
                          borderRadius: '50%',
                          backgroundColor: index === currentImageIndex ? '#000000' : 'rgba(255, 255, 255, 0.8)',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: index === currentImageIndex ? '2px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: index === currentImageIndex
                            ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2)'
                            : '0 2px 8px rgba(0, 0, 0, 0.2)',
                          '&:hover': {
                            backgroundColor: index === currentImageIndex ? '#000000' : 'rgba(255, 255, 255, 0.95)',
                            transform: 'scale(1.2)',
                            boxShadow: index === currentImageIndex
                              ? '0 6px 16px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.3)'
                              : '0 4px 12px rgba(0, 0, 0, 0.3)',
                          },
                          '&:active': {
                            transform: 'scale(0.95)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Previous/Next Buttons */}
                {selectedStyle.images && selectedStyle.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: { xs: 8, sm: 16, md: 24 },
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'white',
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: `0 4px 12px ${theme.palette.primary.main}4D`,
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          boxShadow: `0 6px 20px ${theme.palette.primary.main}66`,
                          transform: 'translateY(-50%) scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ArrowBackIos sx={{ pl: 0.5 }} />
                    </IconButton>

                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: { xs: 8, sm: 16, md: 24 },
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'white',
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: `0 4px 12px ${theme.palette.primary.main}4D`,
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          boxShadow: `0 6px 20px ${theme.palette.primary.main}66`,
                          transform: 'translateY(-50%) scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ArrowForwardIos />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* Content Container - 40% width on desktop */}
              <Box
                sx={{
                  flex: { xs: 'none', md: '0 0 40%' },
                  p: { xs: 1.5, sm: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderTop: { xs: '1px solid rgba(0,0,0,0.1)', md: 'none' },
                  borderLeft: { xs: 'none', md: '1px solid rgba(0,0,0,0.1)' },
                  minHeight: { xs: 'auto', md: '100%' },
                  overflow: 'auto',
                  maxHeight: { xs: '40vh', md: '100%' }
                }}
              >
                <Typography variant="h5" sx={{
                  fontWeight: 'medium',
                  mb: 2,
                  fontSize: { xs: '0.9rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  color: 'text.primary',
                  lineHeight: 1.3,
                }}>
                  {selectedStyle.name}
                </Typography>

                <Typography variant="body1" sx={{
                  mb: 3,
                  fontSize: { xs: '0.75rem', sm: '1rem', md: '1.125rem', lg: '1.25rem' },
                  lineHeight: 1.6,
                  fontWeight: 'regular',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  color: 'text.secondary',
                  flex: 1,
                }}>
                  {selectedStyle.description || 'No description available'}
                </Typography>

                {selectedStyle.images && selectedStyle.images.length > 1 && (
                  <Typography variant="body2" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    mb: 2,
                  }}>
                    {selectedStyle.images.length} images available - swipe or click arrows to view
                  </Typography>
                )}

                {/* Build Your Own Seat Section */}
                {selectedStyle?.products && Array.isArray(selectedStyle.products) && selectedStyle.products.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    {selectedStyle.products.length > 1 && (
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Product</InputLabel>
                        <Select
                          value={selectedProductId || ''}
                          onChange={(e) => setSelectedProductId(Number(e.target.value))}
                          label="Select Product"
                        >
                          {selectedStyle.products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => {
                        if (selectedProductId) {
                          router.push(`/build-your-seat?productId=${selectedProductId}`);
                        }
                      }}
                      disabled={!selectedProductId || loadingProducts}
                      sx={{
                        py: 1.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: 3,
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loadingProducts ? 'Loading...' : 'Build Your Own Seat'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

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