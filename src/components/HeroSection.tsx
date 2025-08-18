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

  const backgroundImages = [
    '/Gallery/HeroSection/01.jpg',
    '/Gallery/HeroSection/02.jpg',
    '/Gallery/HeroSection/03.jpg',
    '/Gallery/HeroSection/04.jpg',
    '/Gallery/HeroSection/05.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [animationKey, setAnimationKey] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [slideDirection, setSlideDirection] = React.useState<'right' | 'left'>('left');

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


  return (
                  <Box
        sx={{
          background: `linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.85) 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          minHeight: { xs: '50vh', sm: '55vh', md: '30vh', lg: '55vh', xl: '50vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
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
                  {/* Background Image with Slide Animation */}
          <Box
            key={animationKey}
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
              animation: slideDirection === 'left' ? 'slideFromRight 0.8s ease-in-out' : 'slideFromLeft 0.8s ease-in-out',
              zIndex: 1,
            }}
          />
    <Container maxWidth="xl" disableGutters sx={{ position: 'relative', zIndex: 2 }}>
                  {/* Main Content Container - Easy to reposition */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      pl: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 }, // Remove left padding on xl screens
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
                          alignItems: { xs: 'center', sm: 'flex-start' },
                          gap: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 6 },
                          width: '100%',
                          maxWidth: { xl: '800px' }, // Limit width on xl screens
                          ml: { md: 4, lg: 6, xl: -0 },
                          // Absolute position within hero section for md, lg, xl screens
                          position: { md: 'absolute', lg: 'absolute', xl: 'absolute' },
                        //  top: { md: '30%', lg: '30%', xl: '50%' },
                          left: { md: '50px', lg: '80px', xl: '100px' },
                          transform: { md: 'translateY(-50%)', lg: 'translateY(-50%)', xl: 'translateY(-50%)' },
                          zIndex: 10,
                        }}
                     >
                                             {/* Logo Container */}
                       <Box
                         sx={{
                           filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                           marginTop: { xs: '-8px', sm: '-6px', md: '-4px',lg: '-4px', xl: '-4px'},
                           marginLeft: { xs: '0px', sm: '0px', md: '0px' ,lg: '0px', xl: '-100px'},
                           flexShrink: 0,
                           alignSelf: { xs: 'center', sm: 'flex-start' },
                         }}
                       >
                        <motion.div
                          animate={{
                            y: [-8, 8, -8],
                            rotate: [0, 1, -1, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <LogoButton onClick={() => router.push('/custom-seats')} />
                        </motion.div>
                      </Box>
                      
                                             {/* Text Content Container */}
                       <MotionBox
                         sx={{
                           flex: 1,
                           textAlign: { xs: 'center', sm: 'left' },
                           minWidth: 0, // Prevents text overflow
                           display: 'flex',
                           flexDirection: 'column',
                           justifyContent: 'center',
                           alignItems: { xs: 'center', sm: 'flex-start' ,
                             xl: 'flex-start',
                             lg: 'flex-start',
                             md: 'flex-start',
                             },
                             mx: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0},
                         }}
                       >
                        <MotionTypography
                          initial={{ opacity: 0, y: 50, scale: 0.9 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          sx={{
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '2rem', lg: '2.5rem', xl: '3rem' },
                            fontWeight: 'bold',
                            lineHeight: { xs: 1.1, sm: 1.15, md: 1.2, lg: 1.2, xl: 1.2},
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            mb: { xs: 0.25, sm: 0.5, md: 0.75, lg: 0.75 },
                            mt: { xs: 0.5, sm: 0, md: 0, lg: 0 ,xl: -2},
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            px: { xs: 1, sm: 0 },
                          }}
                        >
                          Superior Seating LLC
                        </MotionTypography>
                        <MotionTypography
                          initial={{ opacity: 0, y: 50, scale: 0.9 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          sx={{
                            opacity: 0.95,
                            fontSize: { xs: '1.5rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.5rem' },
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                            letterSpacing: '0.5px',
                            fontWeight: 300,
                            lineHeight: { xs: 1.3, sm: 1.4, md: 1.4, lg: 1.4 },
                            display: { xs: 'block', sm: 'block' },
                            px: { xs: 2, sm: 0 },
                            py: { xs: 0.5, sm: 1, md: 3, lg: 2 },
                            textAlign: { xs: 'center', sm: 'left' },
                          }}
                        >
                          Premium truck, RV, and van seating with custom options and superior craftsmanship
                        </MotionTypography>
                        
                        {/* Customize Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.8 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => router.push('/custom-seats')}
                            sx={{
                              border: '2px solid white',
                              color: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.2rem' },
                              fontWeight: 600,
                              px: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
                              py: { xs: 1, sm: 1.25, md: 1, lg: 1, xl: 1 },
                              mt: { xs: 1.5, sm: 2, md: 2.5, lg: 1, xl: 2 },
                              borderRadius: { xs: 2, sm: 2.5, md: 3 },
                              textTransform: 'none',
                              letterSpacing: '0.5px',
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                border: '2px solid white',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                              },
                              '&:active': {
                                transform: 'translateY(0px)',
                              },
                            }}
                          >
                            Start Customizing Your Seat
                          </Button>
                        </motion.div>
                      </MotionBox>
                    </MotionBox>
                  </Box>
      </Container>

             {/* Enhanced Slide Indicators */}
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
            <motion.div
              key={index}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              style={{
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  width: { xs: 6, sm: 8, md: 10, lg: 11, xl: 12 },
                  height: { xs: 6, sm: 8, md: 10, lg: 11, xl: 12 },
                  borderRadius: '50%',
                  backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.6)',
                    transform: 'scale(1.2)',
                  },
                }}
                onClick={() => handleImageChange(index)}
              />
            </motion.div>
          ))}
        </Box>

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
            animate={{ width: `${((currentImageIndex + 1) / backgroundImages.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #ffffff, #f0f0f0, #ffffff)',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
              borderRadius: '0 2px 2px 0',
            }}
          />
        </Box>




    </Box>
  );
};

export default HeroSection; 