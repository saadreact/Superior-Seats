'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';

interface HeroSectionProps {
  title: string;
  description: string;
  height?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
  titleFontSize?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  descriptionFontSize?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  height = {
    xs: '18vh',
    sm: '20vh', 
    md: '18vh',
    lg: '20vh'
  },
  titleFontSize = {
    xs: '1.25rem',
    sm: '1.5rem',
    md: '2rem',
    lg: '2.5rem',
    xl: '3rem'
  },
  descriptionFontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem'
  }
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Dynamic header height detection
  const [headerHeight, setHeaderHeight] = useState('56px');
  
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header') || document.querySelector('[role="banner"]');
      if (header) {
        const height = header.getBoundingClientRect().height;
        setHeaderHeight(`${height}px`);
      } else {
        // Fallback to responsive values based on current header implementation
        if (isSmallMobile) {
          setHeaderHeight('56px');
        } else if (isMobile) {
          setHeaderHeight('60px');
        } else {
          setHeaderHeight('64px');
        }
      }
    };

    // Initial calculation
    updateHeaderHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Update after a short delay to ensure header is rendered
    const timer = setTimeout(updateHeaderHeight, 100);
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timer);
    };
  }, [isMobile, isSmallMobile]);
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
        color: 'white',
        height: height,
        py: { xs: 2, sm: 3, md: 4, lg: 5 },
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: headerHeight,
        mb: { xs: 0, sm: 0.5, md: 1, lg: 1.5 },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontSize: titleFontSize,
            fontWeight: 'bold',
            mb: { xs: 0.5, sm: 0.75, md: 1, lg: 1.5 },
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            lineHeight: { xs: 1.2, sm: 1.3, md: 1.2, lg: 1.2 },
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            minWidth: 0,
            px: { xs: 0.5, sm: 1 },
            display: 'block',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 0, sm: 0.25, md: 0.5, lg: 0.75 },
            opacity: 0.9,
            maxWidth: '100%',
            mx: 'auto',
            lineHeight: { xs: 1.3, sm: 1.4, md: 1.3, lg: 1.4 },
            fontSize: descriptionFontSize,
            px: { xs: 0.5, sm: 1 },
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
            display: 'block',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {description}
        </Typography>
      </Container>
    </Box>
  );
};

export default HeroSection;
