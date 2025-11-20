'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const FleetBuilderSolutionsPage = () => {
  // Base URL for images from server
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_STATIC_IMAGES;
  
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <HeroSectionCommon
        title="Fleet & Builder Solutions"
        description="We partner with RV, limousine, and bus manufacturers."
        height={{
          xs: '75px',
          sm: '70px', 
          md: '80px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
        }}
      /> 

      {/* Introduction Section */}
      <Box sx={{ 
        py: { xs: 4, sm: 6, md: 8, lg: 10 },
        backgroundColor: 'white',
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Content */}
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              sx={{
                textAlign: 'center',
                maxWidth: { xs: '100%', md: '800px', lg: '900px' },
                width: '100%',
                mb: { xs: 4, sm: 5, md: 6 },
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' },
                  letterSpacing: 2,
                  display: 'block',
                  textAlign: 'center',
                }}
              >
                PARTNERSHIP EXCELLENCE
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mt: { xs: 1.5, sm: 2 },
                  mb: { xs: 2, sm: 3 },
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.5rem', xl: '2.5rem' },
                  textAlign: 'center',
                  lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                }}
              >
                Premium Custom Seating Solutions
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem', lg: '1.125rem' },
                  textAlign: 'center',
                  mx: 'auto',
                  maxWidth: { xs: '100%', md: '700px' },
                }}
              >
               We partner with RV, limousine, and bus manufacturers and upfitters to provide premium custom seating solutions. 
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem', lg: '1.125rem' },
                  mb: { xs: 3, sm: 4 },
                  textAlign: 'center',
                  mx: 'auto',
                  maxWidth: { xs: '100%', md: '700px' },
                }}
              >
                From design and prototyping to full-scale production, our team delivers comfort, durability, and craftsmanship your customers will notice.
              </Typography>
            </MotionBox>
              
            {/* Two Images side by side */}
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              sx={{ 
                width: '100%',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2, sm: 3, md: 4 },
                maxWidth: { xs: '100%', md: '1200px' },
              }}
            >
              <Box
                sx={{
                  display: 'inline-block',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  maxWidth: '100%',
                  width: '100%',
                }}
              >
                <Box
                  component="img"
                  src={`${IMAGE_BASE_URL}/Gallery/Truckimages/c11.png`}
                  alt="Custom seating solutions"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'inline-block',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  maxWidth: '100%',
                  width: '100%',
                }}
              >
                <Box
                  component="img"
                  src={`${IMAGE_BASE_URL}/Gallery/Truckimages/cu4.png`}
                  alt="Custom seating solutions"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                  }}
                />
              </Box>
            </MotionBox>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 4, sm: 6, md: 8, lg: 10 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 } }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2, fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' } }}>
              OUR SERVICES
            </Typography>
            <Typography variant="h2" sx={{ mt: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3rem' } }}>
              Partner Solutions
            </Typography>
            <Typography sx={{ mt: { xs: 1.5, sm: 2 }, color: 'text.secondary', maxWidth: 800, mx: 'auto', fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }}>
              Explore our comprehensive seating solutions designed for different vehicle types and industries.
            </Typography>
          </MotionBox>

          {/* Fleet Buses */}
          <Box sx={{ mb: { xs: 4, sm: 6, md: 10 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 2, sm: 3, md: 6 }, mb: { xs: 3, sm: 4, md: 5 } }}>
              <MotionBox initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 650, fontSize:{ xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' }}}>FLEET BUSES</Typography>
                <Typography variant="h3" sx={{ mt: { xs: 0.75, sm: 1 }, mb: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' } }}>Large-Scale Solutions</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }}>
                  Large-scale seating solutions for public transit, school buses, and commercial fleet operations. 
                  We deliver high-volume orders with consistent quality and on-time delivery.
                </Typography>
              </MotionBox>
              {/* Parallel Images Container */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: { xs: 2, sm: 2, md: 3 } }}>
                <MotionBox
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7 }}
                >
                  <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '100%', width: '100%' }}>
                    <Box
                      component="img"
                      src={`${IMAGE_BASE_URL}/Gallery/Truckimages/cu2.png`}
                      alt="Fleet buses"
                      sx={{
                        display: 'block',
                        width: '100%',
                        height: { 
                          xs: 'auto', 
                          sm: 'auto', 
                          md: 'auto',
                          lg: 'auto', 
                          xl: 'auto' 
                        },
                        maxHeight: { 
                          xs: '300px', 
                          sm: '350px', 
                          md: '400px',
                          lg: 'none', 
                          xl: 'none' 
                        },
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                </MotionBox>
                <MotionBox
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '100%', width: '100%' }}>
                    <Box
                      component="img"
                      src={`${IMAGE_BASE_URL}/Gallery/Truckimages/c10.png`}
                      alt="Fleet buses 2"
                      sx={{
                        display: 'block',
                        width: '100%',
                        height: { 
                          xs: 'auto', 
                          sm: 'auto', 
                          md: 'auto',
                          lg: 'auto', 
                          xl: 'auto' 
                        },
                        maxHeight: { 
                          xs: '300px', 
                          sm: '350px', 
                          md: '400px',
                          lg: 'none', 
                          xl: 'none' 
                        },
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                </MotionBox>
              </Box>
            </Box>
          </Box>

          {/* Limos */}
          <Box sx={{ mb: { xs: 4, sm: 6, md: 10 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' }, gap: { xs: 2, sm: 3, md: 6 }, alignItems: 'center', mb: { xs: 3, sm: 4, md: 5 } }}>
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7 }}
              >
                <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '100%' }}>
                  <Box
                    component="img"
                    src={`${IMAGE_BASE_URL}/Gallery/Truckimages/limo.png`}
                    alt="Luxury limos"
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      maxWidth: '100%',
                    }}
                  />
                </Box>
              </MotionBox>
              <MotionBox initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' } }}>LUXURY LIMOUSINES</Typography>
                <Typography variant="h3" sx={{ mt: { xs: 0.75, sm: 1 }, mb: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' }}}>Executive Transportation</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }}>
                  Luxury seating for executive transportation and special occasions. Premium materials and elegant 
                  designs that match the sophistication of high-end limousines.
                </Typography>
              </MotionBox>
            </Box>
            {/* Additional Limo Images */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: { xs: 2, sm: 3, md: 4 } }}>
              {[
                { src: `${IMAGE_BASE_URL}/Gallery/Truckimages/limo.png`, alt: 'Luxury limos 2' },
                { src: `${IMAGE_BASE_URL}/Gallery/Truckimages/limo2.png`, alt: 'Luxury limos 3' },
              ].map((image, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                  <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '100%', width: '100%' }}>
                    <Box
                      component="img"
                      src={image.src}
                      alt={image.alt}
                      sx={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%',
                      }}
                    />
                  </Box>
                </MotionBox>
              ))}
            </Box>
          </Box>

          {/* RV & Van Upfitters */}
          <Box sx={{ mb: { xs: 4, sm: 2, md: 2 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 2, sm: 3, md: 6 }, mb: { xs: 3, sm: 4, md: 5 } }}>
              <MotionBox initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, fontSize:{ xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' } }}>RV & VAN UPFITTERS</Typography>
                <Typography variant="h3" sx={{ mt: { xs: 0.75, sm: 1 }, mb: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' }}}>Custom Solutions</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }}>
                  Custom solutions for recreational vehicles and commercial vans. We understand the unique challenges 
                  of RV and van customization, delivering seats that maximize space while providing ultimate comfort.
                </Typography>
              </MotionBox>
              <MotionBox
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7 }}
              >
                <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '100%' }}>
                  <Box
                    component="img"
                    src={`${IMAGE_BASE_URL}/Gallery/Truckimages/c4.png`}
                    alt="RV and vans"
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      maxWidth: '100%',
                    }}
                  />
                </Box>
              </MotionBox>
            </Box>
            {/* Additional RV & Van Images */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: { xs: 2, sm: 3, md: 4 } }}>
              {[
                { src: `${IMAGE_BASE_URL}/Gallery/Truckimages/c12.png`, alt: 'RV and vans 2' },
                { src: `${IMAGE_BASE_URL}/Gallery/Truckimages/13.png`, alt: 'RV and vans 3' },
              ].map((image, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                  <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '100%', width: '100%' }}>
                    <Box
                      component="img"
                      src={image.src}
                      alt={image.alt}
                      sx={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%',
                      }}
                    />
                  </Box>
                </MotionBox>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

     

   

      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default FleetBuilderSolutionsPage;
