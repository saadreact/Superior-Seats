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
  Chip,
} from '@mui/material';
import Header from '@/components/Header';

import { motion } from 'framer-motion';
import { Security, Build, Warning, CheckCircle, Schedule } from '@mui/icons-material';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionPaper = motion.create(Paper);

const Warranty = () => {
  const theme = useTheme();

  const warrantyTypes = [
    {
      type: 'Standard Warranty',
      duration: '1 Year',
      coverage: [
        'Manufacturing defects in materials and workmanship',
        'Structural integrity of seat frames',
        'Stitching and upholstery defects',
        'Mechanical components and adjustments'
      ],
      icon: <CheckCircle sx={{ fontSize: 24 }} />
    },
    {
      type: 'Extended Warranty',
      duration: '3 Years',
      coverage: [
        'All standard warranty coverage',
        'Extended protection on high-wear components',
        'Additional coverage for commercial use',
        'Priority customer service support'
      ],
      icon: <Security sx={{ fontSize: 24 }} />
    },
    {
      type: 'Commercial Warranty',
      duration: '2 Years',
      coverage: [
        'Enhanced durability for commercial applications',
        'Extended coverage for heavy-duty use',
        'Specialized support for fleet operations',
        'Custom warranty terms for large orders'
      ],
      icon: <Build sx={{ fontSize: 24 }} />
    }
  ];

  const warrantyExclusions = [
    'Damage from improper installation or use',
    'Normal wear and tear from regular use',
    'Damage from accidents, misuse, or abuse',
    'Modifications made to the product',
    'Damage from exposure to extreme conditions',
    'Cosmetic damage that doesn\'t affect functionality'
  ];

  const warrantyProcess = [
    {
      step: '1',
      title: 'Contact Support',
      description: 'Reach out to our warranty team with your claim details'
    },
    {
      step: '2',
      title: 'Provide Documentation',
      description: 'Submit proof of purchase and detailed description of the issue'
    },
    {
      step: '3',
      title: 'Assessment',
      description: 'Our team will review your claim and determine coverage'
    },
    {
      step: '4',
      title: 'Resolution',
      description: 'Repair, replacement, or refund as appropriate'
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
        py: { xs: 2, sm: 3, md: 4, lg: 5 } 
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
                mb: { xs: 3, sm: 4, md: 5, lg: 6 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 2 },
                  mb: { xs: 1, sm: 2 },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Security sx={{ 
                  fontSize: { xs: 32, sm: 40, md: 48 }, 
                  color: '#DA291C' 
                }} />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                    color: '#DA291C',
                    textAlign: { xs: 'center', sm: 'left' },
                  }}
                >
                  Warranty Information
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 600,
                  textAlign: 'center',
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  px: { xs: 2, sm: 0 },
                }}
              >
                We stand behind the quality of our products with comprehensive warranty coverage.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  opacity: 0.8,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                Last updated: {new Date().toLocaleDateString()}
              </Typography>
            </MotionBox>

            {/* Warranty Types */}
            <MotionBox variants={itemVariants} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
              <Typography variant="h4" sx={{ 
                mb: { xs: 2, sm: 3, md: 4 }, 
                fontWeight: 'bold', 
                textAlign: 'center', 
                color: '#DA291C',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' }
              }}>
                Warranty Coverage Options
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                {warrantyTypes.map((warranty, index) => (
                  <MotionPaper
                    key={index}
                    variants={itemVariants}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                      {React.cloneElement(warranty.icon, { 
                        sx: { fontSize: { xs: 20, sm: 24 } } 
                      })}
                    </Box>
                    <Typography variant="h6" sx={{ 
                      mb: { xs: 0.5, sm: 1 }, 
                      fontWeight: 'bold', 
                      color: '#DA291C',
                      fontSize: { xs: '1rem', sm: '1.125rem' }
                    }}>
                      {warranty.type}
                    </Typography>
                    <Chip
                      label={warranty.duration}
                      sx={{
                        mb: { xs: 1, sm: 2 },
                        backgroundColor: '#DA291C',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    />
                    <Box component="ul" sx={{ pl: { xs: 1.5, sm: 2 }, textAlign: 'left' }}>
                      {warranty.coverage.map((item, itemIndex) => (
                        <Typography
                          key={itemIndex}
                          component="li"
                          variant="body2"
                          sx={{
                            mb: { xs: 0.5, sm: 1 },
                            lineHeight: 1.4,
                            color: 'text.secondary',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          }}
                        >
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  </MotionPaper>
                ))}
              </Box>
            </MotionBox>

            {/* Warranty Process */}
            <MotionBox variants={itemVariants} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
              <Typography variant="h4" sx={{ 
                mb: { xs: 2, sm: 3, md: 4 }, 
                fontWeight: 'bold', 
                textAlign: 'center', 
                color: '#DA291C',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' }
              }}>
                Warranty Claim Process
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                {warrantyProcess.map((step, index) => (
                  <MotionPaper
                    key={index}
                    variants={itemVariants}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: { xs: 1.5, sm: 2 },
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        borderRadius: '50%',
                        backgroundColor: '#DA291C',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                        flexShrink: 0,
                      }}
                    >
                      {step.step}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        mb: { xs: 0.5, sm: 1 }, 
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', sm: '1.125rem' }
                      }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </MotionPaper>
                ))}
              </Box>
            </MotionBox>

            {/* Exclusions */}
            <MotionBox variants={itemVariants} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
              <Typography variant="h4" sx={{ 
                mb: { xs: 2, sm: 3, md: 4 }, 
                fontWeight: 'bold', 
                textAlign: 'center', 
                color: '#DA291C',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' }
              }}>
                Warranty Exclusions
              </Typography>
              <MotionPaper
                variants={itemVariants}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  backgroundColor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                }}
              >
                <Box component="ul" sx={{ pl: { xs: 2, sm: 3 }, m: 0 }}>
                  {warrantyExclusions.map((exclusion, index) => (
                    <Typography
                      key={index}
                      component="li"
                      variant="body1"
                      sx={{
                        mb: { xs: 1, sm: 2 },
                        lineHeight: 1.6,
                        color: 'text.primary',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: { xs: 0.5, sm: 1 },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      <Warning sx={{ 
                        fontSize: { xs: 14, sm: 16 }, 
                        color: 'warning.main', 
                        mt: 0.5, 
                        flexShrink: 0 
                      }} />
                      {exclusion}
                    </Typography>
                  ))}
                </Box>
              </MotionPaper>
            </MotionBox>

            {/* Important Notice */}
            <MotionBox variants={itemVariants} sx={{ mb: { xs: 3, sm: 4 } }}>
              <Alert 
                severity="info" 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '& .MuiAlert-icon': { fontSize: { xs: 20, sm: 28 } }
                }}
              >
                <Typography variant="h6" sx={{ 
                  mb: { xs: 0.5, sm: 1 }, 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.125rem' }
                }}>
                  Important Information
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Warranty coverage begins from the date of delivery. Keep your proof of purchase for warranty claims. 
                  Custom products may have specific warranty terms based on materials and construction.
                </Typography>
              </Alert>
            </MotionBox>

            {/* Contact Section */}
            <MotionBox
              variants={itemVariants}
              sx={{
                mt: { xs: 4, sm: 5, md: 6 },
                textAlign: 'center',
                p: { xs: 3, sm: 4 },
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ 
                mb: { xs: 1, sm: 2 }, 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.125rem' }
              }}>
                Need Warranty Support?
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: { xs: 2, sm: 3 }, 
                opacity: 0.9,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Our warranty team is here to help with any warranty claims or questions. 
                Contact us at warranty@superiorseats.com or call +1 (555) 123-4567
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.8,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                We&apos;re committed to ensuring your satisfaction with our products and services.
              </Typography>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
      
      
    </Box>
  );
};

export default Warranty; 