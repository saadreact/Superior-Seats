'use client';

import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionButton = motion.create(Button);

interface LogoButtonProps {
  onClick?: () => void;
}

const LogoButton = ({ onClick }: LogoButtonProps) => {
  return (
    <Tooltip
      title="Start customizing your seat"
      placement="bottom"
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'white !important',
            color: '#DA291C !important', // Pantone 485C - red text
            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
            padding: { xs: '8px 12px', sm: '10px 16px' },
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            fontWeight: 600,
            letterSpacing: '0.5px',
            border: '1px solid rgba(218, 41, 28, 0.2)',
            '& .MuiTooltip-arrow': {
              color: 'white !important',
            },
          },
        },
      }}
    >
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
          width: { xs: 85, sm: 65, md: 70, lg: 85, xl: 100 },
          height: { xs: 85, sm: 65, md: 70, lg: 85, xl: 100 },
          minWidth: 'unset',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 20,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Box   // s setting
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: { xs: '2.5rem', sm: '1.6rem', md: '2rem', lg: '2.3rem', xl: '3rem' },
            fontWeight: 'bold',
            color: '#DA291C', // Pantone 485C
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          S
        </Box>
      </MotionButton>
    </Tooltip>
  );
};

export default LogoButton; 