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
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';

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
      description: 'Covers manufacturing defects and material failures. Includes manufacturing defects, material failures, structural issues, and stitching problems.',
      icon: <CheckCircle />
    },
    {
      type: 'Extended Warranty',
      duration: '3 Years',
      description: 'Comprehensive coverage for extended peace of mind. Includes all standard warranty coverage, extended wear and tear, additional parts coverage, and priority service support.',
      icon: <Security />
    },
    {
      type: 'Premium Warranty',
      duration: '5 Years',
      description: 'Maximum protection with premium service. Includes complete coverage, accidental damage protection, free maintenance service, and lifetime customer support.',
      icon: <Shield />
    }
  ];

  const warrantyExclusions = [
    'The following items are not covered under our warranty: Damage caused by improper installation or use, normal wear and tear beyond reasonable expectations, damage from accidents, misuse, or neglect, modifications made without authorization, damage from exposure to extreme conditions, and cosmetic damage that doesn\'t affect functionality.'
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
      
      <HeroSectionCommon
        title="Warranty"
        description="We stand behind the quality of our custom seating solutions with comprehensive warranty coverage."
        height={{
          xs: '18vh',
          sm: '20vh',
          md: '18vh',
          lg: '20vh'
        }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <Box sx={{ 
        flex: 1, 
        py: { xs: 1, sm: 1.5, md: 2, lg: 0 } 
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >

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
                  sx={{ gap: { xs: 1, sm: 1.5 , lg: 2,xl: 2.5},mb: index < warrantyTypes.length - 1 ? { xs: 2, sm: 2.5 } : 0 }}
                >
                                                           <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: { xs: 1.5, sm: 2 },
                          width: '100%',
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
                            
                          }}
                        >
                          {warranty.type}
                        </Typography>
                        <Chip
                          label={warranty.duration}
                          sx={{
                            backgroundColor: '#DA291C',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                            height: { xs: '24px', sm: '28px', md: '32px' },
                            minWidth: { xs: '60px', sm: '70px', md: '80px' },
                            ml: { xs: 1, sm: 1.5, md: 2, lg: 2 },
                          }}
                        />
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
                             lineHeight: 1.6,
                             color: 'text.secondary',
                             fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem', lg: '1rem' },
                             fontWeight: 400,
                             textAlign: 'justify',
                             maxWidth: '100%',
                             px: { xs: 1, sm: 2 },
                             whiteSpace: 'normal',
                             overflow: 'visible',
                             wordWrap: 'break-word',
                             overflowWrap: 'break-word',
                             hyphens: 'auto',
                             textJustify: 'inter-word',
                             letterSpacing: '0.01em',
                           }}
                         >
                           {warranty.description}
                         </Typography>
                    
                    
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
                                   <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.6,
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem', lg: '1rem' },
                      fontWeight: 400,
                      textAlign: 'justify',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      textJustify: 'inter-word',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {warrantyExclusions[0]}
                  </Typography>
               </MotionPaper>
             </MotionBox>
          </MotionBox>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Warranty; 