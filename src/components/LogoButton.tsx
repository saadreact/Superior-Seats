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
      title="Customize Feature Coming Soon"
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
        initial={{ opacity: 0, rotateY: 0 }}
        whileInView={{ 
          opacity: 1,
          rotateY: 360,
          transition: { 
            duration: 2.5, 
            ease: "easeInOut",
            delay: 0.1
          }
        }}
        viewport={{ once: false, amount: 0.1, margin: "0px 0px -100px 0px" }}
        whileHover={{ 
          rotateY: 360,
          transition: { 
            duration: 2.5, 
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
          borderRadius: '50%',   // S logo  size button
          width: { xs: '120px', sm: '110px', md: '130px', lg: '150px', xl: '180px' },
          height: { xs: '120px', sm: '110px', md: '130px', lg: '150px', xl: '180px' },
          minWidth: 'unset',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 20,
          boxShadow: 'none',
          '&:hover': {
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
    </Tooltip>
  );
};

export default LogoButton; 