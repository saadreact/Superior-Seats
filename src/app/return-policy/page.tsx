'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
  Alert,
} from '@mui/material';
import Header from '@/components/Header';

import { motion } from 'framer-motion';
import { Warning, CheckCircle, Info } from '@mui/icons-material';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionPaper = motion.create(Paper);

const ReturnPolicy = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Return Window',
      content: [
        'Standard products: 30 days from delivery date',
        'Custom products: Non-returnable unless defective',
        'Defective products: Covered under warranty terms',
        'Holiday orders: Extended return window may apply'
      ],
      icon: <Info sx={{ fontSize: 24 }} />
    },
    {
      title: 'Return Conditions',
      content: [
        'Product must be in original condition and packaging',
        'All original accessories and documentation included',
        'No signs of use, damage, or modification',
        'Original proof of purchase required',
        'Return shipping costs may apply'
      ],
      icon: <CheckCircle sx={{ fontSize: 24 }} />
    },
    {
      title: 'Non-Returnable Items',
      content: [
        'Custom-built seats and upholstery',
        'Personalized or engraved products',
        'Products marked as "Final Sale"',
        'Items damaged due to improper installation',
        'Products used beyond normal wear and tear'
      ],
      icon: <Warning sx={{ fontSize: 24 }} />
    },
    {
      title: 'Return Process',
      content: [
        'Contact customer service to initiate return',
        'Provide order number and reason for return',
        'Receive return authorization and shipping label',
        'Package item securely with all components',
        'Ship within 7 days of authorization',
        'Refund processed within 10-14 business days'
      ],
      icon: <Info sx={{ fontSize: 24 }} />
    },
    {
      title: 'Refund Information',
      content: [
        'Refunds issued to original payment method',
        'Processing time: 10-14 business days',
        'Original shipping costs non-refundable',
        'Return shipping costs deducted from refund',
        'Restocking fees may apply to certain items'
      ],
      icon: <CheckCircle sx={{ fontSize: 24 }} />
    },
    {
      title: 'Warranty Claims',
      content: [
        'Manufacturing defects covered under warranty',
        'Warranty period varies by product type',
        'Submit detailed description and photos of defect',
        'Warranty does not cover normal wear and tear',
        'Improper installation voids warranty coverage'
      ],
      icon: <Info sx={{ fontSize: 24 }} />
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
      
      <Box sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
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
                mb: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Info sx={{ fontSize: 48, color: '#DA291C' }} />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', md: '3rem' },
                    color: '#DA291C',
                  }}
                >
                  Return Policy
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 600,
                  textAlign: 'center',
                }}
              >
                We want you to be completely satisfied with your purchase. Here&apos;s everything you need to know about returns.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  opacity: 0.8,
                }}
              >
                Last updated: {new Date().toLocaleDateString()}
              </Typography>
            </MotionBox>

            {/* Important Notice */}
            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
              <Alert 
                severity="info" 
                sx={{ 
                  fontSize: '1rem',
                  '& .MuiAlert-icon': { fontSize: 28 }
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Important Notice
                </Typography>
                <Typography variant="body1">
                  Custom seats and upholstery are made specifically for your requirements and cannot be returned unless defective. 
                  Please ensure all specifications are correct before placing your order.
                </Typography>
              </Alert>
            </MotionBox>

            {/* Content */}
            <MotionPaper
              variants={itemVariants}
              sx={{
                p: { xs: 3, md: 4 },
                backgroundColor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
              }}
            >
              {sections.map((section, index) => (
                <MotionBox
                  key={index}
                  variants={itemVariants}
                  sx={{ mb: index < sections.length - 1 ? 4 : 0 }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      color: '#DA291C',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {section.icon}
                    {section.title}
                  </Typography>
                  
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {section.content.map((item, itemIndex) => (
                      <Typography
                        key={itemIndex}
                        component="li"
                        variant="body1"
                        sx={{
                          mb: 1,
                          lineHeight: 1.6,
                          color: 'text.primary',
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                  
                  {index < sections.length - 1 && (
                    <Divider sx={{ mt: 3, borderColor: 'divider' }} />
                  )}
                </MotionBox>
              ))}
            </MotionPaper>

            {/* Contact Section */}
            <MotionBox
              variants={itemVariants}
              sx={{
                mt: 6,
                textAlign: 'center',
                p: 4,
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Need Help with a Return?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Our customer service team is here to help with any return questions or issues. 
                Contact us at returns@superiorseats.com or call +1 (555) 123-4567
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                We&apos;re committed to making the return process as smooth as possible for our customers.
              </Typography>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
      
      
    </Box>
  );
};

export default ReturnPolicy; 