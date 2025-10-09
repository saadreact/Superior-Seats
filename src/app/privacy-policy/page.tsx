'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// import Breadcrumbs from '@/components/Breadcrumbs'; // Temporarily disabled
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';

import { motion } from 'framer-motion';
import { Security, Shield, Policy } from '@mui/icons-material';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionPaper = motion.create(Paper);

const PrivacyPolicy = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Your Privacy Matters',
      content: [
        'At Superior Seating LLC, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.'
      ]
    },
    {
      title: 'Information We Collect',
      content: [
        'We collect information you provide directly to us, such as when you contact us through our website forms, request quotes or place orders, sign up for our newsletter, or create an account on our platform.'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'We use the information we collect to provide and improve our services, process your orders and payments, communicate with you about your orders, and send you marketing communications (with your consent).'
      ]
    },
    {
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.'
      ]
    },
    {
      title: 'Data Security',
      content: [
        'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
      ]
    },
    {
      title: 'Your Rights',
      content: [
        'You have the right to access your personal information, correct inaccurate information, request deletion of your information, and opt out of marketing communications.'
      ]
    },
 
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
      
      <HeroSectionCommon
        title="Privacy Policy"
        description="We are committed to protecting your privacy and ensuring the security of your personal information."
        height={{
          xs: '75px',
          sm: '70px', 
          md: '80px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
        }}
      />

      {/* Breadcrumbs - Temporarily disabled */}
      {/* <Breadcrumbs /> */}

      <Box sx={{ 
        flex: 1, 
        py: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 } 
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >

            {/* Content as Accordions */}
            <MotionPaper
              variants={itemVariants}
              sx={{
                p: { xs: 1, sm: 1.5, md: 2 },
                backgroundColor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {sections.map((section, index) => (
                <Accordion key={index} defaultExpanded={index === 0} disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      {section.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {section.content.map((item, itemIndex) => (
                      <Typography
                        key={itemIndex}
                        variant="body1"
                        sx={{
                          lineHeight: 1.7,
                          color: 'text.secondary',
                          fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                          mb: itemIndex < section.content.length - 1 ? 1.5 : 0,
                          textAlign: 'justify',
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </MotionPaper>
          </MotionBox>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default PrivacyPolicy; 