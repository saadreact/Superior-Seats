'use client';

import React from 'react';
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
import { ArrowForward } from '@mui/icons-material';
import LogoButton from './LogoButton';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);

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

  // Background images for slider
  const backgroundImages = [
    '/Gallery/HeroSection/01.jpg',
    '/Gallery/HeroSection/02.jpg',
    '/Gallery/HeroSection/03.jpg',
    '/Gallery/HeroSection/04.jpg',
    '/Gallery/HeroSection/05.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto-slide background images with pause on hover
  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length, isPaused]);

  const handleImageChange = (index: number) => {
    if (index === currentImageIndex) return;
    setCurrentImageIndex(index);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
         <Box
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
               sx={{
          background: `linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.85) 100%), url('${backgroundImages[currentImageIndex]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 8, md: 12 },
          minHeight: { xs: '60vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          transition: 'background 0.5s ease-in-out',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
     >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: { xs: 2, md: 3 } }}>
                 <Box
           sx={{
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'flex-start',
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
                          <MotionTypography
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                  fontWeight: 'bold',
                  mb: 2,
                  lineHeight: 1.2,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  color: 'white',
                }}
              >
                Superior Seating LLC
              </MotionTypography>
             <MotionTypography
               initial={{ opacity: 0, y: 50, scale: 0.9 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ duration: 1, ease: "easeOut" }}
               sx={{
                 mb: 3,
                 opacity: 0.95,
                 fontSize: { xs: '1.1rem', md: '1.25rem' },
                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                 letterSpacing: '0.5px',
                 fontWeight: 300,
               }}
             >
               Premium truck, RV, and van seating with custom options and superior craftsmanship
             </MotionTypography>
             <MotionBox
               initial={{ opacity: 0, y: 30, scale: 0.8 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               sx={{
                 display: 'flex',
                 gap: { xs: 3, sm: 2 },
                 flexDirection: { xs: 'column', sm: 'row' },
                 justifyContent: 'flex-start',
                 alignItems: 'center',
                 mt: 2,
                 width: '100%',
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
                 style={{
                   filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                 }}
               >
                 <LogoButton />
               </motion.div>
               <motion.div
                 animate={{
                   scale: [1, 1.05, 1],
                 }}
                 transition={{
                   duration: 2,
                   repeat: Infinity,
                   ease: "easeInOut",
                 }}
                 whileHover={{
                   scale: 1.1,
                   transition: { duration: 0.2 },
                 }}
                 whileTap={{
                   scale: 0.95,
                   transition: { duration: 0.1 },
                 }}
               >
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    borderWidth: 2,
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Learn More
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
           bottom: 30,
           left: '50%',
           transform: 'translateX(-50%)',
           display: 'flex',
           gap: 2,
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
                 width: index === currentImageIndex ? 50 : 12,
                 height: 12,
                 borderRadius: index === currentImageIndex ? 6 : '50%',
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

       {/* Enhanced Pause/Play Indicator */}
       {isPaused && (
         <motion.div
           initial={{ opacity: 0, scale: 0.8, y: -20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.8, y: -20 }}
           transition={{ duration: 0.3, ease: "easeOut" }}
         >
           <Box
             sx={{
               position: 'absolute',
               top: 20,
               right: 20,
               background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))',
               color: 'white',
               px: 3,
               py: 1.5,
               borderRadius: 3,
               fontSize: '0.875rem',
               fontWeight: 600,
               zIndex: 3,
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.2)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
               animation: 'pulse 2s ease-in-out infinite',
               '@keyframes pulse': {
                 '0%, 100%': { 
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                   transform: 'scale(1)',
                 },
                 '50%': { 
                   boxShadow: '0 8px 32px rgba(220, 38, 38, 0.4)',
                   transform: 'scale(1.05)',
                 },
               },
             }}
           >
             ⏸️ Paused
           </Box>
         </motion.div>
       )}
    </Box>
  );
};

export default HeroSection; 