'use client';

import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionButton = motion.create(Button);

interface FloatingButtonProps {
  onClick?: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 20, sm: 25, md: 30, lg: 65, xl: 60 },
        right: { xs: 20, sm: 25, md: 30, lg: 100, xl: 100 },
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      <Tooltip
        title="Start customizing your seat"
        placement="left"
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
                       onClick={handleClick}
           onMouseDown={handleMouseDown}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseLeave}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut",
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
                     whileHover={{ 
             scale: 1.1,
             rotate: 5,
             transition: { duration: 0.4, ease: "easeOut" }
           }}
           whileTap={{ 
             scale: 0.95,
             rotate: -1,
             transition: { duration: 0.15 }
           }}
                                                                                       sx={{
                               // NORMAL STATE COLORS
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', // Normal background gradient
                color: '#DA291C', // Normal text color
                borderRadius: '60%',
                width: { xs: 65, sm: 70, md: 75, lg: 80, xl: 85 },
                height: { xs: 65, sm: 70, md: 75, lg: 80, xl: 85 },
                minWidth: 'unset',
                position: 'relative',
                zIndex: 20,
                                                border: '4px solid rgba(218, 41, 28, 0.6)', // Normal border color (dark red - primary main)
                                        '&:hover': {
                      // HOVER STATE COLORS
                      background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)', // Hover background gradient (reversed)
                      border: '4px solid rgba(218, 41, 28, 0.8)', // Keep same border width
                      boxShadow: `
                        0 0 0 08px rgba(15, 1, 0,0.02),
                        0 8px 25px rgba(0,0,0,0.2),
                        0 4px 15px rgba(218, 41, 28, 0.3),
                        inset 0 1px 0 rgba(255,255,255,0.9)
                      `, // Create expanding border effect outward (decreased to 15px)
                    transform: 'translateY(-3px)',
                 },
                                                '&:active': {
                   // ACTIVE STATE COLORS (when clicked)
                   transform: 'translateY(-1px)',
                   border: '4px solid rgba(218, 41, 28, 0.8)', 
                   boxShadow: `
                     0 0 0 3px rgba(5, 1, 0, 0.02),
                     0 4px 15px rgba(0,0,0,0.15),
                     0 2px 8px rgba(218, 41, 28, 0.2),
                     inset 0 1px 0 rgba(255,255,255,0.8)
                   `, // Smaller expanding border for active state
                 },
                 // PRESSED STATE (when mouse is held down)
                 ...(isPressed && {
                   transform: 'translateY(2px) scale(0.95)',
                   border: '4px solid rgba(218, 41, 28, 1)',
                   boxShadow: `
                     0 0 0 2px rgba(218, 41, 28, 0.3),
                     0 2px 8px rgba(0,0,0,0.2),
                     0 1px 4px rgba(218, 41, 28, 0.4),
                     inset 0 2px 4px rgba(0,0,0,0.1)
                   `,
                   background: 'linear-gradient(145deg, #f0f0f0 0%, #e8e8e8 100%)',
                 }),
                                                                           // TRANSITION AND ANIMATION
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `
                  0 8px 25px rgba(0,0,0,0.12),
                  0 3px 10px rgba(218, 41, 28, 0.08),
                  inset 0 1px 0 rgba(255,255,255,0.9)
                `,
                animation: 'float 4s ease-in-out infinite', // Continuous floating animation
                '@keyframes float': {
                  '0%, 100%': {
                    transform: 'translateY(0px) scale(1)',
                  },
                  '25%': {
                    transform: 'translateY(-4px) scale(1.02)',
                  },
                  '50%': {
                    transform: 'translateY(-2px) scale(1.01)',
                  },
                  '75%': {
                    transform: 'translateY(-6px) scale(1.03)',
                  },
                },
                             '&::before': {
                 content: '""',
                 position: 'absolute',
                 top: '3px',
                 left: '3px',
                 right: '3px',
                 bottom: '3px',
                 borderRadius: '50%',
                 background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                 pointerEvents: 'none',
                 zIndex: 1,
                 transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
               },
               '&:hover::before': {
                 background: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.12) 100%)',
                 top: '4px',
                 left: '4px',
                 right: '4px',
                 bottom: '4px',
               },
            }}
        >
                     <Box
             sx={{
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               width: { xs: 40, sm: 45, md: 50, lg: 55, xl: 60 },
               height: { xs: 40, sm: 45, md: 50, lg: 55, xl: 60 },
               filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.2))',
               zIndex: 2,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               borderRadius: '50%',
               background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
             }}
           >
                         <Image
               src="/superiorlogo/SButton.png"
               alt="Superior Seating Logo"
               width={60}
               height={60}
               style={{
                 width: '100%',
                 height: '100%',
                 objectFit: 'contain',
                 filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
               }}
               priority
             />
          </Box>
        </MotionButton>
      </Tooltip>
    </Box>
  );
};

export default FloatingButton;
