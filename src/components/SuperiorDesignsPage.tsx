'use client';

import React from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const SuperiorDesignsPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <HeroSectionCommon
        title="Upfitting"
        description="Partnering with experts in luxury vehicle upfitting for complete custom van and bus builds."
        height={{
          xs: '75px',
          sm: '70px', 
          md: '80px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
        }}
      /> 

      {/* Partnership Introduction Section */}
      <Box sx={{ 
        py: { xs: 4, sm: 6, md: 8, lg: 10 },
        backgroundColor: 'white',
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 3, sm: 4, md: 6, lg: 8 },
              alignItems: 'center',
            }}
          >
            {/* Content */}
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              sx={{ order: { xs: 2, md: 1 } }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' },
                  letterSpacing: 2,
                }}
              >
                LUXURY VEHICLE UPFITTING
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mt: { xs: 1.5, sm: 2 },
                  mb: { xs: 2, sm: 3 },
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.5rem', xl: '2.5rem' },
                }}
              >
                Your Partner for Custom Van, Bus, and Specialty Builds 
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                }}
              >
                For customers seeking full custom van or bus builds, we proudly partner with 
                Superior Designs, experts in luxury vehicle upfitting. From concept and layout 
                to premium seating and interior finishes, they bring your vision to life with 
                unmatched craftsmanship.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  mb: { xs: 3, sm: 4 },
                  fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                }}
              >
                Superior Designs also handles other specialty and custom build projects, 
                tailored to your exact needs.
              </Typography>
              <Button
                variant="contained"
                href="https://www.superiordesignsllc.com"
                target="_blank"
                rel="noopener noreferrer"
                component="a"
                sx={{
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1.25, sm: 1.5, md: 2 },
                  fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(211, 47, 47, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Visit Superior Designs LLC
              </Button>
            </MotionBox>

            {/* Image */}
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              sx={{ order: { xs: 1, md: 2 } }}
            >
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '75%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 30px 80px rgba(211, 47, 47, 0.25)',
                  },
                }}
              >
                <Box
                  component="img"
                  src="/Gallery/Truckimages/u14.png"
                  alt="Superior Designs custom build"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </MotionBox>
          </Box>
        </Container>
      </Box>

   

      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default SuperiorDesignsPage;

