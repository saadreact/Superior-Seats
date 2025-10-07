'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
} from '@mui/material';
import LogoButton from './LogoButton';
import { motion } from 'framer-motion';

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

  // Video URL from environment
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const videoUrl = `${apiBaseUrl}/videos/SuperiorSeatsINC_banner_video.mov`;
  
  // Fallback images if video fails
  const backgroundImages = [
    '/Gallery/HeroHd/01.jpg',
    '/Gallery/HeroHd/02.jpg',
    '/Gallery/HeroHd/03.jpg',
    '/Gallery/HeroHd/04.jpg',
  ];
  
  // State for video loading
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const [videoError, setVideoError] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  
  // Fallback image carousel if video fails
  React.useEffect(() => {
    if (videoError) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % backgroundImages.length
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [videoError, backgroundImages.length]);
  
  // Timeout to fallback to images if video doesn't load within 10 seconds
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        console.log('Video loading timeout, falling back to images');
        setVideoError(true);
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [videoLoaded, videoError]);


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


  return (
    <Box
      sx={{
        position: 'relative',
        color: 'white',
        py: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
        height: { xs: '400px', sm: '450px', md: '400px', lg: '500px', xl: '600px' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        // Position directly below fixed header
        mt: { xs: '55px', sm: '38px', md: '40px' },
      }}
    >
      {/* Background Video or Fallback Images */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          // background: `linear-gradient(135deg, ${theme.palette.primary.main}1A 0%, ${theme.palette.primary.dark}D9 100%)`,
        }}
      >
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              objectPosition: 'center',
            }}
            onError={(e) => {
              console.error('Video failed to load:', e);
              setVideoError(true);
            }}
            onLoadStart={() => {
              console.log('Video started loading');
            }}
            onCanPlay={() => {
              console.log('Video can play');
              setVideoLoaded(true);
            }}
            onLoadedData={() => {
              console.log('Video data loaded');
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/quicktime" />
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url('${backgroundImages[currentImageIndex]}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            }}
          />
        )}
      </Box>
      
      {/* Dark overlay for better text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2,
        }}
      />
    <Container maxWidth="xl" disableGutters sx={{ position: 'relative', zIndex: 3 }}>
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
                   <Box
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
                      </Box>
                      
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
                   <Box
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
                          </Box>
                        </MotionBox>
                      </MotionBox>
                    </Box>
      </Container>


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