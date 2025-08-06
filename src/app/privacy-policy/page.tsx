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

import { motion } from 'framer-motion';
import { Security, Shield } from '@mui/icons-material';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionPaper = motion.create(Paper);

const PrivacyPolicy = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal information (name, email, phone number) when you contact us or place orders',
        'Technical information (IP address, browser type, device information) for website functionality',
        'Usage data to improve our services and user experience',
        'Payment information processed securely through our payment partners'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'Process and fulfill your orders for custom seating solutions',
        'Communicate with you about your orders and customer service inquiries',
        'Send you updates about our products and services (with your consent)',
        'Improve our website functionality and user experience',
        'Comply with legal obligations and protect our rights'
      ]
    },
    {
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with trusted service providers who assist in our operations',
        'Information may be disclosed if required by law or to protect our rights',
        'We maintain strict confidentiality agreements with all service providers'
      ]
    },
    {
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your information',
        'All data is encrypted during transmission and storage',
        'Regular security audits and updates to maintain protection',
        'Limited access to personal information on a need-to-know basis'
      ]
    },
    {
      title: 'Your Rights',
      content: [
        'Access and review your personal information',
        'Request correction of inaccurate information',
        'Request deletion of your personal information (subject to legal requirements)',
        'Opt-out of marketing communications',
        'File a complaint with relevant authorities'
      ]
    },
    {
      title: 'Cookies and Tracking',
      content: [
        'We use cookies to enhance your browsing experience',
        'Essential cookies for website functionality',
        'Analytics cookies to understand website usage',
        'Marketing cookies (with your consent) for personalized content',
        'You can control cookie settings through your browser'
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
                <Security sx={{ fontSize: 48, color: '#DA291C' }} />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', md: '3rem' },
                    color: '#DA291C',
                  }}
                >
                  Privacy Policy
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
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                    {index === 3 && <Security sx={{ fontSize: 24 }} />}
                    {index === 4 && <Shield sx={{ fontSize: 24 }} />}
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
                Questions About Our Privacy Policy?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                If you have any questions about this privacy policy or our data practices, 
                please contact us at privacy@superiorseats.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                We&apos;re committed to protecting your privacy and will respond to your inquiries promptly.
              </Typography>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
      
      
    </Box>
  );
};

export default PrivacyPolicy; 