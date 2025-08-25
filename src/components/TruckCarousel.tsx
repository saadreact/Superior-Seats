'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionBox = motion.create(Box);

const truckBrands = [
  { name: 'Freightliner', logo: '/Logos/Freightliner.png' },
  { name: 'Peterbilt', logo: '/Logos/peterbilt.jpg' },
  { name: 'Kenworth', logo: '/Logos/Kenworth.png' },
  { name: 'Mack', logo: '/Logos/mack-degradado-1280x831.png' },
  { name: 'Volvo', logo: '/Logos/volvo-logo-white-png-7.png' },
  { name: 'Western Star', logo: '/Logos/western-star-trucks-logo-black-and-white.png' },
  { name: 'International', logo: '/Logos/international-1-logo-black-and-white.png' },
  { name: 'Ford', logo: '/Logos/ford-truck-logo.png' },
  { name: 'Mercedes-Benz', logo: '/Logos/Logo_MB_Trucks.png' },
  { name: 'Scania', logo: '/Logos/scania-logo-blackand-white-u9lxv50j8jad25l4.png' },
  { name: 'MAN', logo: '/Logos/man_truck_bus_new_logo_2d_black1.png' },
  { name: 'DAF', logo: '/Logos/DAF-logo-black-1920x1080.png' },
  { name: 'Iveco', logo: '/Logos/iveco-logo-black-and-white-1.png' },
  { name: 'Renault', logo: '/Logos/Renault-Trucks-Logo.jpg' },
  { name: 'Isuzu', logo: '/Logos/isuzu-black-logo-png-image-701751694713879ukdtg9sbys.png' },
  { name: 'Hino', logo: '/Logos/hino.png' },
  { name: 'Fuso', logo: '/Logos/fuso-logo-black-and-white.png' },
  { name: 'Hyundai', logo: '/Logos/hyundai-motor-company-logo-hyundai-starex-hyundai-entourage-png-favpng-ZjxJzUwHpxmcQBirJuHJNmpUL.jpg' },
  { name: 'Tata', logo: '/Logos/tata-logo-tata-icon-free-free-vector.jpg' },
  { name: 'Ashok Leyland', logo: '/Logos/ashok.jpg' },
  { name: 'Eicher', logo: '/Logos/eicher.png' },
  { name: 'Mahindra', logo: '/Logos/mahindra.png' },
  { name: 'Force', logo: '/Logos/Force-Motors-Logo.png' },
  { name: 'UD Trucks', logo: '/Logos/UD-Logo-1999-533x400.png' },
  { name: 'Autocar', logo: '/Logos/autocar_logo.5cd5a2d95d222.avif' },
  { name: 'Tesla', logo: '/Logos/tesla-brand-logo-car-symbol-with-name-black-design-vector-46155438.jpg' },
  { name: 'Nikola', logo: '/Logos/nikola.png' },
  { name: 'Lion Electric', logo: '/Logos/lion-electric-logo-freelogovectors.net_-285x400.png' },
  { name: 'Edison Motors', logo: '/Logos/edison motors.png' },
];

const TruckCarousel = () => {
  return (
    <Box
      sx={{
        mt: { xs: 1, md: 2, lg: 1, xl: 1.5 },
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
        marginBottom: { xs: 1, md: 1, lg: 2, xl: 2 },
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', md: '90%', lg: '90%', xl: '90%' },
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
                width={100}
                height={100}
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
                width={100}
                height={100}
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
    </Box>
  );
};

export default TruckCarousel; 