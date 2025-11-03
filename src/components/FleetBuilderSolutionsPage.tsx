'use client';

import React from 'react';
import Image from 'next/image';
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
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <HeroSectionCommon
        title="Fleet & Builder Solutions"
        description="We partner with RV, limousine, and bus manufacturers and upfitters to provide premium custom seating solutions."
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
                  fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                }}
              >
               We partner with RV, limousine, and bus manufacturers and upfitters to provide premium custom seating solutions. 
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                }}
              >
                From design and prototyping to full-scale production, our team delivers comfort, durability, and craftsmanship your customers will notice.
              </Typography>
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
                  src="/Gallery/Truckimages/u09.png"
                  alt="Fleet and builder solutions"
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

      {/* Services Section */}
      <Box sx={{ py: { xs: 4, sm: 6, md: 8, lg: 10 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 } }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 2, sm: 3, md: 6 }, mb: { xs: 4, sm: 6, md: 10 } }}>
            <MotionBox initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>FLEET BUSES</Typography>
              <Typography variant="h3" sx={{ mt: { xs: 0.75, sm: 1 }, mb: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem', xl: '2rem' } }}>Large-Scale Solutions</Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }}>
                Large-scale seating solutions for public transit, school buses, and commercial fleet operations. 
                We deliver high-volume orders with consistent quality and on-time delivery.
              </Typography>
            </MotionBox>
            <Box sx={{ position: 'relative', paddingTop: '70%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <Image src="/Gallery/Truckimages/u11.png" alt="Fleet buses" fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 100vw, 50vw" priority />
            </Box>
          </Box>

          {/* Limos */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' }, gap: { xs: 2, sm: 3, md: 6 }, alignItems: 'center', mb: { xs: 4, sm: 6, md: 10 } }}>
            <Box sx={{ position: 'relative', paddingTop: '70%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <Image src="/Gallery/Truckimages/u12.png" alt="Luxury limos" fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 100vw, 50vw" />
            </Box>
            <MotionBox initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>LUXURY LIMOUSINES</Typography>
              <Typography variant="h3" sx={{ mt: { xs: 0.75, sm: 1 }, mb: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem', xl: '2rem' } }}>Executive Transportation</Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }}>
                Luxury seating for executive transportation and special occasions. Premium materials and elegant 
                designs that match the sophistication of high-end limousines.
              </Typography>
            </MotionBox>
          </Box>

          {/* RV & Van Upfitters */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 2, sm: 3, md: 6 }, mb: { xs: 4, sm: 2, md: 2 } }}>
            <MotionBox initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>RV & VAN UPFITTERS</Typography>
              <Typography variant="h3" sx={{ mt: { xs: 0.75, sm: 1 }, mb: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem', xl: '2rem' } }}>Custom Solutions</Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }}>
                Custom solutions for recreational vehicles and commercial vans. We understand the unique challenges 
                of RV and van customization, delivering seats that maximize space while providing ultimate comfort.
              </Typography>
            </MotionBox>
            <Box sx={{ position: 'relative', paddingTop: '70%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <Image src="/Gallery/Truckimages/u13.png" alt="RV and vans" fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 100vw, 50vw" />
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
