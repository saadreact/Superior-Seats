'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionBox = motion(Box);

const truckBrands = [
  { name: 'Freightliner', logo: '/Trucks/Freightliner.png' },
  { name: 'Peterbilt', logo: '/Trucks/peterbilt.jpg' },
  { name: 'Kenworth', logo: '/Trucks/Kenworth.png' },
  { name: 'Mack', logo: '/Trucks/mack-degradado-1280x831.png' },
  { name: 'Volvo', logo: '/Trucks/volvo-logo-white-png-7.png' },
  { name: 'Western Star', logo: '/Trucks/western-star-trucks-logo-black-and-white.png' },
  { name: 'International', logo: '/Trucks/international-1-logo-black-and-white.png' },
  { name: 'Ford', logo: '/Trucks/ford-truck-logo.png' },
  { name: 'Mercedes-Benz', logo: '/Trucks/Logo_MB_Trucks.png' },
  { name: 'Scania', logo: '/Trucks/scania-logo-blackand-white-u9lxv50j8jad25l4.png' },
  { name: 'MAN', logo: '/Trucks/man_truck_bus_new_logo_2d_black1.png' },
  { name: 'DAF', logo: '/Trucks/DAF-logo-black-1920x1080.png' },
  { name: 'Iveco', logo: '/Trucks/iveco-logo-black-and-white-1.png' },
  { name: 'Renault', logo: '/Trucks/Renault-Trucks-Logo.jpg' },
  { name: 'Isuzu', logo: '/Trucks/isuzu-black-logo-png-image-701751694713879ukdtg9sbys.png' },
  { name: 'Hino', logo: '/Trucks/hino.png' },
  { name: 'Fuso', logo: '/Trucks/fuso-logo-black-and-white.png' },
  { name: 'Hyundai', logo: '/Trucks/hyundai-motor-company-logo-hyundai-starex-hyundai-entourage-png-favpng-ZjxJzUwHpxmcQBirJuHJNmpUL.jpg' },
  { name: 'Tata', logo: '/Trucks/tata-logo-tata-icon-free-free-vector.jpg' },
  { name: 'Ashok Leyland', logo: '/Trucks/ashok.jpg' },
  { name: 'Eicher', logo: '/Trucks/eicher.png' },
  { name: 'Mahindra', logo: '/Trucks/mahindra.png' },
  { name: 'Force', logo: '/Trucks/Force-Motors-Logo.png' },
  { name: 'UD Trucks', logo: '/Trucks/UD-Logo-1999-533x400.png' },
  { name: 'Autocar', logo: '/Trucks/autocar_logo.5cd5a2d95d222.avif' },
  { name: 'Tesla', logo: '/Trucks/tesla-brand-logo-car-symbol-with-name-black-design-vector-46155438.jpg' },
  { name: 'Nikola', logo: '/Trucks/nikola.png' },
  { name: 'Lion Electric', logo: '/Trucks/lion-electric-logo-freelogovectors.net_-285x400.png' },
  { name: 'Edison Motors', logo: '/Trucks/edison motors.png' },
];

const TruckCarousel = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', mb: 4 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#DA291C', // Pantone 485C
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Trusted by Leading Truck Manufacturers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Superior Seating provides custom seating solutions for all major truck brands worldwide
          </Typography>
        </MotionBox>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '100px',
              zIndex: 2,
              pointerEvents: 'none',
            },
            '&::before': {
              left: 0,
              background: 'linear-gradient(to right, #f8f9fa 0%, transparent 100%)',
            },
            '&::after': {
              right: 0,
              background: 'linear-gradient(to left, #f8f9fa 0%, transparent 100%)',
            },
          }}
        >
          <motion.div
            animate={{
              x: [0, -50 * truckBrands.length],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              display: 'flex',
              gap: '60px',
              alignItems: 'center',
              minWidth: 'max-content',
            }}
          >
            {/* First set of logos */}
            {truckBrands.map((brand, index) => (
              <Box
                key={`first-${brand.name}-${index}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '120px',
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    filter: 'grayscale(0%)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={80}
                  height={80}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  {brand.name}
                </Typography>
              </Box>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {truckBrands.map((brand, index) => (
              <Box
                key={`second-${brand.name}-${index}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '120px',
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    filter: 'grayscale(0%)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={80}
                  height={80}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  {brand.name}
                </Typography>
              </Box>
            ))}
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default TruckCarousel; 