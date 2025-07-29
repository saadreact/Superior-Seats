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
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);

const leftColVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const featuresContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const featureCard = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Star sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Custom Seating',
      description: 'Build your perfect seat with our customization wizard.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Premium Quality',
      description: 'Superior craftsmanship for truck, RV, and van seating.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Warranty Protected',
      description: 'Comprehensive warranty coverage for peace of mind.',
    },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #DA291C 0%, #B71C1C 100%)', // Pantone 485C gradient
        color: 'white',
        py: { xs: 8, md: 12 },
        minHeight: { xs: '60vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Left: Headline, Description, Buttons */}
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            variants={leftColVariants}
            sx={{ textAlign: { xs: 'center', md: 'left' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
          >
            <MotionTypography
              variants={fadeInUp}
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                fontWeight: 'bold',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Superior Seating LLC
            </MotionTypography>
            <MotionTypography
              variants={fadeInUp}
              sx={{
                mb: 3,
                opacity: 0.9,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Premium truck, RV, and van seating with custom options and superior craftsmanship
            </MotionTypography>
            <MotionBox
              variants={fadeInUp}
              sx={{
                display: 'flex',
                gap: { xs: 3, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center',
                mt: 2,
                width: '100%',
              }}
            >
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <LogoButton />
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
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
              </motion.div>
            </MotionBox>
          </MotionBox>

          {/* Right: Features */}
          <MotionBox
            variants={featuresContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 4, sm: 3 },
              justifyContent: 'center',
              alignItems: { xs: 'center', sm: 'stretch' },
              width: '100%',
              mt: { xs: 2, sm: 0 },
            }}
          >
            {features.map((feature, index) => (
              <MotionCard
                key={index}
                variants={featureCard}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  minWidth: 0,
                  flex: { xs: 'none', sm: 1 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                  borderRadius: 3,
                  transition: 'transform 0.3s',
                  mx: { xs: 'auto', sm: 1 },
                  my: { xs: 1.5, sm: 0 },
                  p: 3,
                  minHeight: { xs: 150, sm: 180 },
                  maxWidth: { xs: 280, sm: 260 },
                  width: { xs: '100%', sm: 'auto' },
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
              </MotionCard>
            ))}
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection; 