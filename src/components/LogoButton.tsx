'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const LogoButton = () => {
  return (
    <Button
      variant="contained"
      size="large"
      endIcon={<ArrowForward />}
      sx={{
        backgroundColor: 'white',
        color: 'primary.main',
        borderRadius: '50%',
        width: 80,
        height: 80,
        minWidth: 'unset',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          transform: 'scale(1.05)',
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
          color: 'primary.main',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        S
      </Box>
    </Button>
  );
};

export default LogoButton; 