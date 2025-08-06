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

  // Auto-slide background images with slide from right animation
  React.useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
      // Trigger animation by updating key
      setAnimationKey(prev => prev + 1);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length, isAutoPlaying]);

  const handleImageChange = (index: number, direction: 'right' | 'left' = 'left') => {
    if (index === currentImageIndex) return;
    setSlideDirection(direction);
    setCurrentImageIndex(index);
    // Trigger animation by updating key
    setAnimationKey(prev => prev + 1);
  };

  // Swipe functionality
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
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
    e.preventDefault();
    setIsDragging(true);
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsAutoPlaying(false); // Pause auto-play when user starts interacting
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
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
          py: { xs: 6, sm: 8, md: 10, lg: 12 },
          minHeight: { xs: '50vh', sm: '60vh', md: '70vh', lg: '80vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'hidden',
          userSelect: 'none',
          touchAction: 'none',
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
       <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: { xs: 2, sm: 3, md: 4, lg: 4 } }}>
                    <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                ml: { xs: 0, sm: -1, md: -2, lg: -4 },
              }}
            >
                      {/* Left: Headline, Description, Buttons */}
                       <MotionBox
               initial={{ opacity: 0, y: 60, scale: 0.95 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               viewport={{ once: true, amount: 0.7 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
             >
                              {/* Layout with Logo on Left and Content on Right */}
                <MotionBox
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 2, sm: 3, md: 4, lg: 6 },
                    mb: { xs: 1, sm: 1.5, md: 2, lg: 2 },
                  }}
                >
                  {/* Logo on Left */}
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
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                      marginTop: '32px',
                    }}
                  >
                    <LogoButton onClick={() => router.push('/custom-seats')} />
                  </motion.div>
                  
                  {/* Content on Right */}
                  <MotionBox
                    sx={{
                      flex: 1,
                      textAlign: 'left',
                      minWidth: 0, // Prevents text overflow
                    }}
                  >
                    <MotionTypography
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.8rem', lg: '3.5rem', xl: '4rem' },
                        fontWeight: 'bold',
                        lineHeight: { xs: 1.1, sm: 1.15, md: 1.2, lg: 1.2 },
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        mb: { xs: 0.5, sm: 0.75, md: 1, lg: 1 },
                        mt: { xs: 2, sm: 0, md: 0, lg: 0 },
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
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
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' },
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                        letterSpacing: '0.5px',
                        fontWeight: 300,
                        lineHeight: { xs: 1.3, sm: 1.4, md: 1.4, lg: 1.4 },
                        display: { xs: 'block', sm: 'block' },
                      }}
                    >
                      Premium truck, RV, and van seating with custom options and superior craftsmanship
                    </MotionTypography>
                  </MotionBox>
                </MotionBox>
           </MotionBox>


        </Box>
      </Container>

             {/* Enhanced Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 15, sm: 20, md: 25, lg: 30 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: { xs: 0.5, sm: 1, md: 1.5, lg: 2 },
            zIndex: 3,
            alignItems: 'center',
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
                  width: index === currentImageIndex ? { xs: 30, sm: 35, md: 40, lg: 50 } : { xs: 8, sm: 10, md: 11, lg: 12 },
                  height: { xs: 8, sm: 10, md: 11, lg: 12 },
                  borderRadius: index === currentImageIndex ? { xs: 4, sm: 4.5, md: 5, lg: 6 } : '50%',
                  backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  boxShadow: index === currentImageIndex 
                    ? '0 0 20px rgba(255, 255, 255, 0.6)' 
                    : '0 0 5px rgba(255, 255, 255, 0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    borderRadius: 'inherit',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                    opacity: index === currentImageIndex ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    borderRadius: 'inherit',
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                    opacity: index === currentImageIndex ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    zIndex: -1,
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
            height: 4,
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