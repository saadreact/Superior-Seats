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
import { ArrowForward, Star, TrendingUp, Security } from '@mui/icons-material';
import LogoButton from './LogoButton';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Custom Seating',
      description: 'Build your perfect seat with our customization wizard.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Premium Quality',
      description: 'Superior craftsmanship for truck, RV, and van seating.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Warranty Protected',
      description: 'Comprehensive warranty coverage for peace of mind.',
    },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        minHeight: { xs: '60vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center',
          }}
        >
          {/* Left: Headline, Description, Buttons */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                fontWeight: 'bold',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Superior Seating LLC
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                opacity: 0.9,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Premium truck, RV, and van seating with custom options and superior craftsmanship
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center',
                mt: 2,
              }}
            >
              <LogoButton />
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>

          {/* Right: Features */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              justifyContent: 'center',
              alignItems: 'stretch',
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  minWidth: 0,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                  borderRadius: 3,
                  transition: 'transform 0.3s',
                  mx: { xs: 0, sm: 1 },
                  my: { xs: 1.5, sm: 0 },
                  p: 3,
                  minHeight: { xs: 150, sm: 180 },
                  maxWidth: 260,
                  width: '100%',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                  },
                }}
              >
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(feature.icon, { sx: { fontSize: 40, color: 'white' } })}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.85,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    textAlign: 'center',
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection; 