'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { motion } from 'framer-motion';
import { Gavel, Security, Policy } from '@mui/icons-material';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionPaper = motion.create(Paper);

const TermsOfService = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using Superior Seats website and services, you accept and agree to be bound by these terms and conditions.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to modify these terms at any time, with changes effective immediately upon posting.',
        'Your continued use of our services constitutes acceptance of any modifications.'
      ]
    },
    {
      title: 'Use of Services',
      content: [
        'Our services are intended for legitimate business and personal use only.',
        'You agree to use our services in compliance with all applicable laws and regulations.',
        'You are responsible for maintaining the confidentiality of your account information.',
        'You may not use our services for any illegal or unauthorized purpose.'
      ]
    },
    {
      title: 'Product Information and Orders',
      content: [
        'All product descriptions, prices, and availability are subject to change without notice.',
        'We strive for accuracy but do not guarantee that all information is error-free.',
        'Orders are subject to acceptance and availability.',
        'We reserve the right to refuse or cancel any order at our discretion.',
        'Custom orders require detailed specifications and may have extended lead times.'
      ]
    },
    {
      title: 'Payment and Pricing',
      content: [
        'All prices are in USD unless otherwise specified.',
        'Payment is due at the time of order placement.',
        'We accept major credit cards and other payment methods as indicated.',
        'Sales tax will be added where applicable.',
        'Custom orders may require a deposit or full payment in advance.'
      ]
    },
    {
      title: 'Shipping and Delivery',
      content: [
        'Shipping costs and delivery times vary by location and product.',
        'Delivery dates are estimates and may be affected by factors beyond our control.',
        'Risk of loss transfers to you upon delivery to the carrier.',
        'Custom orders may have extended production and shipping times.',
        'International shipping may be subject to additional fees and restrictions.'
      ]
    },
    {
      title: 'Returns and Warranty',
      content: [
        'Returns must be initiated within 30 days of delivery for standard products.',
        'Custom products are non-returnable unless defective.',
        'Products must be returned in original condition and packaging.',
        'We provide a limited warranty on all products as specified in our warranty policy.',
        'Warranty claims must be submitted with proof of purchase and defect description.'
      ]
    },
    {
      title: 'Intellectual Property',
      content: [
        'All content on this website is owned by Superior Seats and protected by copyright.',
        'You may not reproduce, distribute, or create derivative works without permission.',
        'Our trademarks and trade dress are protected under applicable laws.',
        'Unauthorized use of our intellectual property is strictly prohibited.'
      ]
    },
    {
      title: 'Limitation of Liability',
      content: [
        'Superior Seats shall not be liable for any indirect, incidental, or consequential damages.',
        'Our total liability shall not exceed the amount paid for the specific product or service.',
        'We are not responsible for damages caused by improper installation or use.',
        'Some jurisdictions do not allow liability limitations, so these may not apply to you.'
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box sx={{ 
        flex: 1, 
        mt: { xs: '56px', sm: '64px', md: '64px' },
        py: { xs: 1.5, sm: 2, md: 2.5, lg: 3 } 
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <MotionBox
              variants={itemVariants}
              sx={{
                textAlign: 'center',
                mb: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 2, sm: 3 },
                  mb: { xs: 2, sm: 3 },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Gavel sx={{ 
                  fontSize: { xs: 40, sm: 48, md: 56 }, 
                  color: '#DA291C' 
                }} />
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                    color: '#DA291C',
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  Terms of Service
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 700,
                  textAlign: 'center',
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                  px: { xs: 2, sm: 0 },
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Please read these terms carefully before using our services or purchasing our products.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  opacity: 0.7,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 500,
                }}
              >
                Last updated: {new Date().toLocaleDateString()}
              </Typography>
            </MotionBox>

            {/* Content */}
            <MotionPaper
              variants={itemVariants}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                backgroundColor: 'background.paper',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {sections.map((section, index) => (
                <MotionBox
                  key={index}
                  variants={itemVariants}
                  sx={{ mb: index < sections.length - 1 ? { xs: 4, sm: 5 } : 0 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      mb: { xs: 3, sm: 4 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#DA291C',
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        textAlign: 'center',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 60,
                          height: 3,
                          backgroundColor: '#DA291C',
                          borderRadius: 2,
                        }
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      m: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: { xs: 2, sm: 2.5 },
                    }}
                  >
                    {section.content.map((item, itemIndex) => (
                      <Typography
                        key={itemIndex}
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          color: 'text.primary',
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 400,
                          textAlign: 'center',
                          maxWidth: { xs: '100%', sm: '90%', md: '85%' },
                          px: { xs: 2, sm: 3 },
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                  
                  {index < sections.length - 1 && (
                    <Divider 
                      sx={{ 
                        mt: { xs: 3, sm: 4 }, 
                        mb: { xs: 3, sm: 4 },
                        borderColor: 'rgba(218, 41, 28, 0.2)',
                        borderWidth: 1,
                      }} 
                    />
                  )}
                </MotionBox>
              ))}
            </MotionPaper>
           
          </MotionBox>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default TermsOfService; 