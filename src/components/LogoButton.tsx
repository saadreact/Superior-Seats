'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionButton = motion.create(Button);

const LogoButton = () => {
  return (
    <MotionButton
      variant="contained"
      size="large"
      endIcon={<ArrowForward />}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      sx={{
        backgroundColor: 'white',
        color: '#DA291C', // Pantone 485C
        borderRadius: '50%',
        width: 80,
        height: 80,
        minWidth: 'unset',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#DA291C', // Pantone 485C
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        S
      </Box>
    </MotionButton>
  );
};

export default LogoButton; 