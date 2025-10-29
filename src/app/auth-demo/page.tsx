'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Email as EmailIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmailResetTemplate from '@/components/EmailResetTemplate';
import TwoFactorEmailTemplate from '@/components/TwoFactorEmailTemplate';
import EmailResetTemplateHTML from '@/components/EmailResetTemplateHTML';
import TwoFactorEmailTemplateHTML from '@/components/TwoFactorEmailTemplateHTML';

const MotionTypography = motion.create(Typography);
const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const AuthDemoPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentView, setCurrentView] = useState<'demo' | 'email-reset-template' | '2fa-email-template' | 'email-reset-html' | '2fa-email-html'>('demo');

  const handleViewEmailResetTemplate = () => {
    setCurrentView('email-reset-template');
  };

  const handleView2FAEmailTemplate = () => {
    setCurrentView('2fa-email-template');
  };

  const handleViewEmailResetHTML = () => {
    setCurrentView('email-reset-html');
  };

  const handleView2FAEmailHTML = () => {
    setCurrentView('2fa-email-html');
  };

  const handleBackToDemo = () => {
    setCurrentView('demo');
  };

  if (currentView === 'email-reset-template') {
    return <EmailResetTemplate onBack={handleBackToDemo} />;
  }

  if (currentView === '2fa-email-template') {
    return <TwoFactorEmailTemplate onBack={handleBackToDemo} />;
  }

  if (currentView === 'email-reset-html') {
    return <EmailResetTemplateHTML onBack={handleBackToDemo} />;
  }

  if (currentView === '2fa-email-html') {
    return <TwoFactorEmailTemplateHTML onBack={handleBackToDemo} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          mt: { xs: '56px', sm: '64px', md: '64px' },
          height: { xs: '40vh', sm: '50vh', md: '50vh', lg: '50vh', xl: '50vh' },
          backgroundImage: 'url(/Gallery/Truckimages/Americanseat.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          mb: { xs: 1, sm: 1.5, md: 2, lg: 1.5, xl: 1.5 },
          py: { xs: 3, sm: 4, md: 6, lg: 10, xl: 12 },
          px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 4 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0%, rgba(211, 47, 47, 0.25) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <MotionTypography
              variant="h1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '2.5rem', xl: '3.5rem' },
                fontWeight: 'bold',
                mb: { xs: 0.5, sm: 1, md: 1, lg: 1, xl: 1.5 },
                textAlign: 'center',
                color: 'white',
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4, lg: 1.5, xl: 1.5 },
                px: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 },
              }}
            >
              Email Templates Demo
            </MotionTypography>
            <MotionTypography
              variant="h5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              sx={{
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem', lg: '1.4rem', xl: '1.6rem' },
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                px: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 },
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Preview our beautifully designed email templates for password reset and 2FA that match the Superior Seats theme
            </MotionTypography>
          </Box>
        </Container>
      </Box>

      {/* Demo Cards Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8, lg: 10, xl: 12 } }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 'bold',
              color: '#d32f2f',
              mb: 2,
            }}
          >
            Choose an Email Template to Preview
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            }}
          >
            Click on any button below to see how our email templates will look and feel
          </Typography>
        </MotionBox>

        <Grid container spacing={4} justifyContent="center">
          {/* Email Reset Password Card */}
          <Grid item xs={12} sm={6} md={5}>
            <MotionCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 16px 48px rgba(211, 47, 47, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: '#d32f2f',
                    mb: 2,
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  }}
                >
                  Password Reset Email
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  Beautiful email template for password reset with Superior Seats branding, security notices, and professional design that matches your brand theme.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    className="gradient-style"
                    onClick={handleViewEmailResetTemplate}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                    }}
                  >
                    View Email Template
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleViewEmailResetHTML}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        backgroundColor: 'rgba(211, 47, 47, 0.04)',
                      },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                    }}
                  >
                    View HTML Template
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* 2FA Card */}
          <Grid item xs={12} sm={6} md={5}>
            <MotionCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 16px 48px rgba(211, 47, 47, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: '#d32f2f',
                    mb: 2,
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  }}
                >
                  Two-Factor Authentication Email
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  Secure 2FA email template with visual code display, security tips, and professional design that ensures user security and brand consistency.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    className="gradient-style"
                    onClick={handleView2FAEmailTemplate}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                    }}
                  >
                    View Email Template
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleView2FAEmailHTML}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        backgroundColor: 'rgba(211, 47, 47, 0.04)',
                      },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                    }}
                  >
                    View HTML Template
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default AuthDemoPage;
