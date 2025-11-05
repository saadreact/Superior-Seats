'use client';

import React from 'react';
import { Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const MotionButton = motion.create(Button);

const FloatingLogoButton = () => {
  const router = useRouter();

  const handleClick = () => {
    // Scroll to top or navigate to home
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Optionally navigate to home: router.push('/');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: '15px', sm: '25px', md: '35px', lg: '45px', xl: '55px' },
        right: { xs: '15px', sm: '25px', md: '35px', lg: '45px', xl: '55px' },
        zIndex: 1000,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MotionButton
        variant="contained"
        size="large"
        onClick={handleClick}
        initial={{ opacity: 0, rotateY: 0 }}
        animate={{
          rotateY: 360,
        }}
        transition={{
          rotateY: {
            duration: 2.5,
            repeat: Infinity,
            ease: [0.25, 0.1, 0.25, 1],
            repeatDelay: 0.5,
          },
        }}
        whileInView={{ 
          opacity: 1,
          transition: { 
            duration: 1,
            ease: "easeInOut",
            delay: 0.1
          }
        }}
        viewport={{ once: false, amount: 0.1, margin: "0px 0px -100px 0px" }}
        whileHover={{ 
          scale: 1.05,
          transition: { 
            duration: 0.3, 
            ease: "easeInOut"
          }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
        sx={{
          backgroundColor: 'transparent',
          color: '#DA291C',
          borderRadius: '50%',
          width: { xs: '60px', sm: '75px', md: '90px', lg: '105px', xl: '120px' },
          height: { xs: '55px', sm: '70px', md: '85px', lg: '100px', xl: '115px' },
          minWidth: 'unset',
          position: 'relative',
          overflow: 'visible',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
          '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Image
          src="/superiorlogo/sp.png"
          alt="Superior Seating Logo"
          fill
          style={{
            objectFit: 'cover',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            borderRadius: '50%',
          }}
          priority
        />
      </MotionButton>
    </Box>
  );
};

export default FloatingLogoButton;

