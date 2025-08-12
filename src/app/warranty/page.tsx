'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Chip,
  Alert,
  useTheme,
} from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { motion } from 'framer-motion';
import { Security, Build, Warning, CheckCircle, Schedule, Shield } from '@mui/icons-material';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionPaper = motion.create(Paper);

const Warranty = () => {
  const theme = useTheme();

  const warrantyTypes = [
    {
      type: 'Standard Warranty',
      duration: '1 Year',
      description: 'Covers manufacturing defects and material failures',
      icon: <CheckCircle />,
      features: [
        'Manufacturing defects',
        'Material failures',
        'Structural issues',
        'Stitching problems'
      ]
    },
    {
      type: 'Extended Warranty',
      duration: '3 Years',
      description: 'Comprehensive coverage for extended peace of mind',
      icon: <Security />,
      features: [
        'All standard warranty coverage',
        'Extended wear and tear',
        'Additional parts coverage',
        'Priority service support'
      ]
    },
    {
      type: 'Premium Warranty',
      duration: '5 Years',
      description: 'Maximum protection with premium service',
      icon: <Shield />,
      features: [
        'Complete coverage',
        'Accidental damage protection',
        'Free maintenance service',
        'Lifetime customer support'
      ]
    }
  ];

  const warrantyExclusions = [
    'Damage caused by improper installation or use',
    'Normal wear and tear beyond reasonable expectations',
    'Damage from accidents, misuse, or neglect',
    'Modifications made without authorization',
    'Damage from exposure to extreme conditions',
    'Cosmetic damage that doesn\'t affect functionality'
  ];

  const warrantyProcess = [
    {
      step: '1',
      title: 'Contact Support',
      description: 'Reach out to our warranty team with your issue',
      icon: <CheckCircle />
    },
    {
      step: '2',
      title: 'Document Issue',
      description: 'Provide photos and detailed description of the problem',
      icon: <Security />
    },
    {
      step: '3',
      title: 'Assessment',
      description: 'Our team will review and determine coverage',
      icon: <Build />
    },
    {
      step: '4',
      title: 'Resolution',
      description: 'We\'ll repair, replace, or provide appropriate solution',
      icon: <Schedule />
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
        py: { xs: 1, sm: 1.5, md: 2, lg: 2.5 } 
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
                mb: { xs: 1, sm: 1.5, md: 2 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  mb: { xs: 1, sm: 1.5 },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Security sx={{ 
                  fontSize: { xs: 32, sm: 40, md: 48 }, 
                  color: '#DA291C' 
                }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                    color: '#DA291C',
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  Warranty
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 700,
                  textAlign: 'center',
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem', lg: '1.1rem' },
                  px: { xs: 2, sm: 0 },
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                We stand behind the quality of our custom seating solutions with comprehensive warranty coverage.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  opacity: 0.7,
                  fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '1rem' },
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
                p: { xs: 2, sm: 3, md: 4 },
                backgroundColor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {warrantyTypes.map((warranty, index) => (
                <MotionBox
                  key={index}
                  variants={itemVariants}
                  sx={{ mb: index < warrantyTypes.length - 1 ? { xs: 2, sm: 2.5 } : 0 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      mb: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: '#DA291C',
                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                        textAlign: 'center',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 40,
                          height: 2,
                          backgroundColor: '#DA291C',
                          borderRadius: 1,
                        }
                      }}
                    >
                      {warranty.type}
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      m: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: { xs: 1, sm: 1.5 },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: { xs: 1.2, sm: 1.4, md: 1.6, lg: 1.7 },
                        color: 'text.secondary',
                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '1rem' },
                        fontWeight: 400,
                        textAlign: 'center',
                        maxWidth: { xs: '100%', sm: '90%', md: '85%' },
                        px: { xs: 1, sm: 2 },
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto',
                      }}
                    >
                      {warranty.description}
                    </Typography>
                    
                    <Chip
                      label={warranty.duration}
                      sx={{
                        backgroundColor: '#DA291C',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                        mb: { xs: 1, sm: 1.5 },
                      }}
                    />
                    
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: { xs: 0.5, sm: 1 },
                    }}>
                      {warranty.features.map((feature, featureIndex) => (
                        <Typography
                          key={featureIndex}
                          variant="body2"
                          sx={{
                            lineHeight: { xs: 1.2, sm: 1.4, md: 1.6, lg: 1.7 },
                            color: 'text.secondary',
                            fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem', lg: '0.9rem' },
                            fontWeight: 400,
                            textAlign: 'center',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto',
                          }}
                        >
                          • {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  
                  {index < warrantyTypes.length - 1 && (
                    <Divider 
                      sx={{ 
                        mt: { xs: 2, sm: 2.5 }, 
                        mb: { xs: 2, sm: 2.5 },
                        borderColor: 'rgba(218, 41, 28, 0.2)',
                        borderWidth: 1,
                      }} 
                    />
                  )}
                </MotionBox>
              ))}
            </MotionPaper>

            {/* Warranty Process */}
            <MotionBox variants={itemVariants} sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                  color: '#DA291C',
                }}
              >
                Warranty Process
              </Typography>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: { xs: 1.5, sm: 2, md: 3 },
                mt: { xs: 2, sm: 3 },
              }}>
                {warrantyProcess.map((step, index) => (
                  <MotionBox
                    key={index}
                    variants={itemVariants}
                    sx={{
                      textAlign: 'center',
                      p: { xs: 1.5, sm: 2 },
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ 
                      color: '#DA291C', 
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    }}>
                      {step.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                        mb: { xs: 0.5, sm: 1 },
                        color: '#DA291C',
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                        color: 'text.secondary',
                        lineHeight: { xs: 1.2, sm: 1.4, md: 1.6 },
                      }}
                    >
                      {step.description}
                    </Typography>
                  </MotionBox>
                ))}
              </Box>
            </MotionBox>

            {/* Warranty Exclusions */}
            <MotionBox variants={itemVariants} sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                  color: '#DA291C',
                }}
              >
                Warranty Exclusions
              </Typography>
                             <Alert 
                 severity="warning" 
                 icon={false}
                 sx={{ 
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   textAlign: 'center',
                   mb: { xs: 2, sm: 3 },
                   '& .MuiAlert-message': {
                     fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '1rem' },
                     lineHeight: { xs: 1.2, sm: 1.4, md: 1.6, lg: 1.7 },
                     textAlign: 'center',
                     width: '100%',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                   }
                 }}
               >
                The following items are not covered under our warranty:
              </Alert>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
              }}>
                {warrantyExclusions.map((exclusion, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      lineHeight: { xs: 1.2, sm: 1.4, md: 1.6, lg: 1.7 },
                      color: 'text.secondary',
                      fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '1rem' },
                      fontWeight: 400,
                      textAlign: 'center',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                    }}
                  >
                    {exclusion}
                  </Typography>
                ))}
              </Box>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Warranty; 