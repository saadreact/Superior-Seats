'use client';

import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
            color: '#DA291C !important',
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
        // Removed hover effects as requested
        sx={{
          backgroundColor: 'white',
          color: '#DA291C',
          borderRadius: '50%',   // S logo  size button
          width: { xs: '90px', sm: '80px', md: '100px', lg: '120px', xl: '160px' },
          height: { xs: '90px', sm: '80px', md: '100px', lg: '120px', xl: '160px' },
          minWidth: 'unset',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 20,
          // Removed hover effect as requested
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
                     width: { xs: '70px', sm: '60px', md: '70px', lg: '80px', xl: '100px' },
                     height: { xs: '70px', sm: '60px', md: '70px', lg: '80px', xl: '100px' },
                     filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                   }}
                 >
                                       <Image
                      src="/superiorlogo/SButton.png"
                      alt="Superior Seating Logo"
                      width={90}
                      height={90}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      priority
                    />
                 </Box>
      </MotionButton>
    </Tooltip>
  );
};

export default LogoButton; 