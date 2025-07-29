'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Header from '@/components/Header';
import { 
  Chair, 
  Settings, 
  Palette,
  Star,
  ArrowForward 
} from '@mui/icons-material';

const CustomSeatsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const seatOptions = [
    {
      id: 1,
      name: 'Adjustable Arms',
      description: 'Allow your arms and wrists to rest comfortably.',
      icon: <Settings sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: ['Comfort', 'Adjustable', 'Ergonomic'],
    },
    {
      id: 2,
      name: 'In-Seat Massage',
      description: 'Our six Motor Relaxer keeps your back loose and pain-free.',
      icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: ['Massage', 'Relaxation', 'Comfort'],
    },
    {
      id: 3,
      name: 'Heating Only',
      description: 'Stay warm on those cold days.',
      icon: <Chair sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: ['Heating', 'Warmth', 'Comfort'],
    },
    {
      id: 4,
      name: 'Heat & Cool',
      description: 'Heating and cooling can help keep you comfy even in the most extreme temperatures.',
      icon: <Palette sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: ['Heating', 'Cooling', 'Climate Control'],
    },
  ];

  const seatTypes = [
    {
      name: 'Truck Seats',
      description: 'Premium truck seating with custom options',
      image: '/api/placeholder/300/200',
    },
    {
      name: 'RV Seats',
      description: 'Luxury RV seating for long-haul comfort',
      image: '/api/placeholder/300/200',
    },
    {
      name: 'Van Seats',
      description: 'Professional van seating with safety features',
      image: '/api/placeholder/300/200',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            Build Your Custom Seat
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Design your perfect seat with our customization wizard. Choose from premium materials, 
            colors, and comfort features to create the ultimate seating experience.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Start Customizing
          </Button>
        </Container>
      </Box>

      {/* Seat Types */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
            }}
          >
            Choose Your Seat Type
          </Typography>
          <Grid columns={12} columnSpacing={4} rowSpacing={4}>
            {seatTypes.map((seat, index) => (
              <Grid key={index} sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Chair sx={{ fontSize: 60, color: 'primary.main' }} />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {seat.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                      {seat.description}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForward />}
                    >
                      Customize {seat.name}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Comfort Options */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
            }}
          >
            Comfort Options
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Comfort options in your new seat can make a big difference when you spend most of your day in it!
          </Typography>
          <Grid columns={12} columnSpacing={4} rowSpacing={4}>
            {seatOptions.map((option) => (
              <Grid key={option.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{option.icon}</Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {option.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                      {option.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {option.features.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          size="small"
                          sx={{ backgroundColor: 'primary.light', color: 'white' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
            }}
          >
            Ready to Build Your Dream Seat?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Contact us today to start designing your custom seat with our expert team.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Contact Us
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomSeatsPage; 