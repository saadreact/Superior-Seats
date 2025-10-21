'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import LogoButton from './LogoButton';
import { motion } from 'framer-motion';
import { VolumeOff, VolumeUp, Fullscreen, FullscreenExit } from '@mui/icons-material';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionCard = motion.create(Card);

const leftColVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 1,
      ease: "easeOut",
    }
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: "easeOut",
    }
  },
};

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const backgroundImages = [
    '/Gallery/HeroHd/01.jpg',
    '/Gallery/HeroHd/02.jpg',
    '/Gallery/HeroHd/03.jpg',
    '/Gallery/HeroHd/04.jpg',
  
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [animationKey, setAnimationKey] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [slideDirection, setSlideDirection] = React.useState<'right' | 'left'>('left');
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  // Video state (same behavior as HomePage video section)
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    
      setAnimationKey(prev => prev + 1);
    }, 4000); 

    return () => clearInterval(interval);
  }, [backgroundImages.length, isAutoPlaying]);

  const handleImageChange = (index: number, direction: 'right' | 'left' = 'left') => {
    if (index === currentImageIndex) return;
    setSlideDirection(direction);
    setCurrentImageIndex(index);
    setAnimationKey(prev => prev + 1);
  };

  // Swipe functionality
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    // Don't prevent default to allow button clicks
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    // Don't prevent default to allow button clicks
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    // Don't prevent default to allow button clicks
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next image
      const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
      handleImageChange(nextIndex, 'left');
    } else if (isRightSwipe) {
      // Swipe right - go to previous image
      const prevIndex = currentImageIndex === 0 ? backgroundImages.length - 1 : currentImageIndex - 1;
      handleImageChange(prevIndex, 'right');
    }
    
    // Resume auto-play after a delay
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  // Mouse drag functionality
  const [mouseStart, setMouseStart] = React.useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    // Don't prevent default to allow button clicks
    setIsDragging(true);
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsAutoPlaying(false); // Pause auto-play when user starts interacting
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    // Don't prevent default to allow button clicks
    setMouseEnd(e.clientX);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!mouseStart || !mouseEnd) {
      setIsDragging(false);
      return;
    }
    
    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next image
      const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
      handleImageChange(nextIndex, 'left');
    } else if (isRightSwipe) {
      // Swipe right - go to previous image
      const prevIndex = currentImageIndex === 0 ? backgroundImages.length - 1 : currentImageIndex - 1;
      handleImageChange(prevIndex, 'right');
    }
    
    setIsDragging(false);
    // Resume auto-play after a delay
    setTimeout(() => setIsAutoPlaying(true), 3000);
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

  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onTimeUpdate = () => {
      const duration = el.duration || 0;
      const current = el.currentTime || 0;
      setVideoProgress(duration > 0 ? current / duration : 0);
    };

    const onLoadedMetadata = () => onTimeUpdate();

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  return (
                  <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}1A 0%, ${theme.palette.primary.dark}D9 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          height: { xs: '400px', sm: '450px', md: '400px', lg: '500px', xl: '600px' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'default',
          overflow: 'hidden',
          userSelect: 'none',
          touchAction: 'none',
          // Position directly below fixed header
          mt: { xs: '55px', sm: '38px', md: '40px' },
          // Global keyframes for slide animation
          '@keyframes slideFromRight': {
            '0%': { 
              transform: 'translateX(100%)',
              opacity: 0.8,
            },
            '100%': { 
              transform: 'translateX(0%)',
              opacity: 1,
            },
          },
          '@keyframes slideFromLeft': {
            '0%': { 
              transform: 'translateX(-100%)',
              opacity: 0.8,
            },
            '100%': { 
              transform: 'translateX(0%)',
              opacity: 1,
            },
          },
          // Visual feedback for swipe area
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDragging ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            transition: 'background 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1,
          },
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setTimeout(() => setIsAutoPlaying(true), 3000);
          }
        }}
      >
                  {/* Background Image with Slide Animation (commented out) */}
          {/**
          <Box
            key={animationKey}
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <Image src={backgroundImages[currentImageIndex]} alt="Hero background" fill />
          </Box>
          */}

          {/* Video Background */}
          <Box
            ref={videoContainerRef}
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}
          >
            <Box
              ref={videoRef}
              component="video"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="auto"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(1.2) contrast(1.05)',
              }}
            >
              <source src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/videos/SuperiorSeatsINC_banner_video.mov`} type="video/mp4" />
              <source src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/videos/SuperiorSeatsINC_banner_video.mov`} type="video/quicktime" />
            </Box>
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)' }} />

            <IconButton
              onClick={handleToggleMute}
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 66,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                zIndex: 2,
              }}
            >
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>

            <IconButton
              onClick={handleToggleFullscreen}
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                zIndex: 2,
              }}
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Box>
    <Container maxWidth="xl" disableGutters sx={{ position: 'relative', zIndex: 2 }}>
                  {/* Main Content Container - Easy to reposition */}
                                     <Box
                     sx={{
                       position: 'relative',
                       width: '100%',
                       height: '100%',
                       display: 'flex',
                       alignItems: 'center',
                                                                       justifyContent: 'center',
                         pl: { xs: 2, sm: 3, md: 0, lg: 0, xl: 0 },
                     }}
                   >
                                         {/* Content Container - All elements grouped together */}
                                           <MotionBox
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                                                sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: 'center',
                          gap: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 6 },
                          width: '100%',
                          maxWidth: { xl: '1200px' },
                                                     justifyContent: 'center',
                           zIndex: 10,
                        }}
                      >
        {/* Logo Container */}
                   {/* <Box
                                                     sx={{
                             position: { md: 'absolute', lg: 'absolute', xl: 'absolute' },
                             left: { md: '50%', lg: '50%', xl: '50%' },
                             top: { md: '50%', lg: '50%', xl: '50%' },
                             transform: { md: 'translate(-50%, -50%)', lg: 'translate(-50%, -50%)', xl: 'translate(-50%, -50%)' },
                             filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                             marginTop: { xs: '-80px', sm: '-75px', md: '-50px', lg: '-50px', xl: '-70px', xxl: '-70px'},
                             marginLeft: { xs: '-10px', sm: '20px', md: '-270px', lg: '-370px', xl: '-530px'},
                             flexShrink: 0,
                             alignSelf: 'center',
                             zIndex: 20,
                           }}
                        >
                                                                                               <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: false, amount: 0.1 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                              <LogoButton onClick={() => {
                                // TODO: Uncomment when customize page is ready
                                // router.push('/custom-seats');
                                handleSnackbarOpen();
                              }} />
                            </motion.div>
                      </Box> */}
                      
                                             {/* Text Content Container */}
                       <MotionBox
                                                   sx={{
                            position: { md: 'absolute', lg: 'absolute', xl: 'absolute' },
                            left: { md: '50%', lg: '50%', xl: '50%' },
                            top: { md: '50%', lg: '50%', xl: '50%' },
                            transform: { md: 'translate(-50%, -50%)', lg: 'translate(-50%, -50%)', xl: 'translate(-50%, -50%)' },
                            textAlign: { xs: 'left', sm: 'left', md: 'center', lg: 'center', xl: 'center' },
                            minWidth: 0, // Prevents text overflow
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: { xs: 'flex-start', sm: 'flex-start', md: 'center', lg: 'center', xl: 'center' },
                            mx: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0},
                            pl: { xs: 2, sm: 3, md: 0, lg: 0, xl: 0 },
                            zIndex: 15,
                          }}
                       >
                                                                                                   <MotionTypography
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            sx={{
                              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.5rem', lg: '2.5rem', xl: '5rem' },
                              fontWeight: 'bold',
                              lineHeight: { xs: 1.1, sm: 1.15, md: 1.2, lg: 1.2, xl: 1.2},
                              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              mb: { xs: 0.25, sm: 0.5, md: 0.75, lg: 0.75 },
                              mt: { xs: 0.5, sm: 0, md: 0, lg: 0 ,xl: -2},
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              px: { xs: 1, sm: 0 },
                              textAlign: { xs: 'left', sm: 'left', md: 'center', lg: 'center', xl: 'center' },
                             }}
                           >
                             Superior Seating LLC
                          </MotionTypography>
                                                                                                   <MotionTypography
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            sx={{
                              opacity: 0.95,
                              fontSize: { xs: '0.85rem', sm: '0.875rem', md: '1rem', lg: '1.5rem', xl: '2.2rem' },
                              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                              letterSpacing: '0.5px',
                              fontWeight: 300,
                              lineHeight: { xs: 1.3, sm: 1.4, md: 1.4, lg: 1.4 },
                              display: { xs: 'block', sm: 'block' },
                              px: { xs: 2, sm: 0 },
                              py: { xs: 0.5, sm: 1, md: 3, lg: 2 },
                              textAlign: { xs: 'left', sm: 'left', md: 'center', lg: 'center', xl: 'center' },
                               alignSelf: { xs: 'flex-start', sm: 'flex-start', md: 'center', lg: 'center', xl: 'center' },
                            }}
                          >
                                                        Premium Truck, RV, and Van seating with custom<br />
                             <span style={{ textAlign: 'center', display: 'block', width: '100%' }}>options and superior craftsmanship</span>
                          </MotionTypography>
                        
                                           {/* Customize Button */}
                   {/* <Box
                             sx={{
                                                                                               position: { xs: 'absolute', sm: 'absolute', md: 'static', lg: 'static', xl: 'static' },
                                bottom: { xs: '-80px', sm: '-80px', md: 'auto', lg: 'auto', xl: 'auto' },
                                left: { xs: '50%', sm: '50%', md: 'auto', lg: 'auto', xl: 'auto' },
                                transform: { xs: 'translateX(-50%)', sm: 'translateX(-50%)', md: 'none', lg: 'none', xl: 'none' },
                                display: 'flex',
                                justifyContent: { xs: 'center', sm: 'center', md: 'center', lg: 'center', xl: 'center' },
                               width: { xs: '250px', sm: '300px', md: '100%', lg: '100%', xl: '100%' },
                               mt: { xs: 0, sm: 0, md: 1, lg: 1, xl: 1 },
                               pl: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 },
                               zIndex: 25,
                             }}
                           >
                                                       <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: false, amount: 0.1 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                             <Button
                               variant="outlined"
                               onClick={() => {
                                 // TODO: Uncomment when customize page is ready
                                 // router.push('/custom-seats');
                                 handleSnackbarOpen();
                               }}
                             sx={{
                             //  border: `1px solid ${theme.palette.primary.main}`,
                             border: '2px solid text.primary',
                               color: 'text.primary',
                               borderColor: 'text.primary',
                               backgroundColor: 'white',
                               fontSize: { xs: '0.875rem', sm: '0.9rem', md: '0.9rem', lg: '1rem', xl: '1.5rem' },
                               fontWeight: 600,
                               px: { xs: 2, sm: 2.5, md: 3, lg: 4, xl: 8 },
                               py: { xs: 1, sm: 1.25, md: 1, lg: 1, xl: 1 },
                               mt: { xs: 1.5, sm: 2, md: 2.5, lg: 1, xl: 2 },
                               borderRadius: { xs: 2, sm: 2.5, md: 3 },
                               textTransform: 'none',
                               letterSpacing: '0.5px',
                               transition: 'all 0.3s ease',
                               // Removed hover effects as requested
                             }}
                           >
                             Customize Coming Soon
                                                        </Button>
                           </motion.div>
                          </Box> */}
                        </MotionBox>
                      </MotionBox>
                    </Box>
      </Container>

        {/* Enhanced Slide Indicators (commented out for video) */}
        {/**
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 10, sm: 15, md: 20, lg: 25, xl: 30 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: { xs: 0.25, sm: 0.5, md: 1, lg: 1.5, xl: 2 },
            zIndex: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {backgroundImages.map((_, index) => (
            <Box key={index} sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)' }} />
          ))}
        </Box>
        */}

               {/* Enhanced Progress Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            zIndex: 3,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              animation: 'shimmer 2s infinite',
              '@keyframes shimmer': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' },
              },
            },
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(Math.min(100, Math.max(0, videoProgress * 100)))}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #ffffff, #f0f0f0, #ffffff)',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
              borderRadius: '0 2px 2px 0',
            }}
          />
        </Box>

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

    </Box>
  );
};

export default HeroSection; 