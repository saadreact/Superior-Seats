'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { 
  Chair, 
  EventSeat, 
  AirlineSeatReclineNormal,
  Star,
  ArrowForward 
} from '@mui/icons-material';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const products = [
    {
      id: 1,
      name: 'Truck Seats',
      description: 'Premium truck seating with custom options and superior comfort.',
      price: 'Custom',
      rating: 4.9,
      image: '/api/placeholder/300/200',
      features: ['Custom', 'Comfort', 'Durable'],
    },
    {
      id: 2,
      name: 'RV Seats',
      description: 'Luxury RV seating designed for long-haul comfort and style.',
      price: 'Custom',
      rating: 4.8,
      image: '/api/placeholder/300/200',
      features: ['Luxury', 'Comfort', 'Custom'],
    },
    {
      id: 3,
      name: 'Van Seats',
      description: 'Professional van seating with integrated safety features.',
      price: 'Custom',
      rating: 4.7,
      image: '/api/placeholder/300/200',
      features: ['Professional', 'Safety', 'Custom'],
    },
  ];

  const stats = [
    { number: '1000+', label: 'Custom Seats Built' },
    { number: '25+', label: 'Years Experience' },
    { number: '50+', label: 'Seat Models' },
    { number: '99%', label: 'Customer Satisfaction' },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <HeroSection />
      
      {/* Stats Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid columns={12} columnSpacing={4} rowSpacing={4}>
            {stats.map((stat, index) => (
              <Grid key={index} sx={{ gridColumn: { xs: 'span 6', md: 'span 3' } }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      fontSize: { xs: '2rem', md: '3rem' },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Products Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 'bold',
              }}
            >
              Our Seating Solutions
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Premium truck, RV, and van seating with custom options and superior craftsmanship.
            </Typography>
          </Box>

          <Grid columns={12} columnSpacing={4} rowSpacing={4}>
            {products.map((product) => (
              <Grid key={product.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Chair sx={{ fontSize: 60, color: 'primary.main' }} />
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {product.price}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      {product.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {product.features.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          size="small"
                          sx={{ backgroundColor: 'primary.light', color: 'white' }}
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {product.rating}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<ArrowForward />}
                      >
                        View Details
                      </Button>
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
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 'bold',
              }}
            >
              Ready to Build Your Custom Seat?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Join hundreds of satisfied customers who have transformed their vehicles with our premium seating.
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
              Build Your Custom Seat
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 