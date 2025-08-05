'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionButton = motion.create(Button);

interface LogoButtonProps {
  onClick?: () => void;
}

const LogoButton = ({ onClick }: LogoButtonProps) => {
  return (
    <MotionButton
      variant="contained"
      size="large"
      onClick={onClick}
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
        width: { xs: 45, sm: 55, md: 70, lg: 85, xl: 100 },
        height: { xs: 45, sm: 55, md: 70, lg: 85, xl: 100 },
        minWidth: 'unset',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10,
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
          fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem', lg: '1.9rem', xl: '2.5rem' },
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