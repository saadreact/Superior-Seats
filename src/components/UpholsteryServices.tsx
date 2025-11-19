'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  DirectionsBoat,
  CheckCircleOutline,
  ArrowForward,
  Close,
  Build,
  ColorLens,
  Speed,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionTypography = motion.create(Typography);

// Boat images from the Upholstery folder
const upholsteryImages = [
  { id: 1, src: '/Upholstery/boat 1.jpg', alt: 'Luxury Boat Seating' },
  { id: 2, src: '/Upholstery/boat 3.jpg', alt: 'Marine Upholstery' },
  { id: 3, src: '/Upholstery/boat 4.jpg', alt: 'Custom Boat Interior' },
  { id: 4, src: '/Upholstery/IMG_3524.jpg', alt: 'Premium Marine Seats' },
  { id: 5, src: '/Upholstery/IMG_3525.jpg', alt: 'Boat Seat Restoration' },
  { id: 6, src: '/Upholstery/IMG_3526.jpg', alt: 'Custom Boat Cushions' },
  { id: 7, src: '/Upholstery/IMG_3527.jpg', alt: 'Marine Interior Design' },
  { id: 8, src: '/Upholstery/IMG_3528.jpg', alt: 'Luxury Boat Upholstery' },
];

// Headings and copy for each showcase image
const showcaseCopy = [
  {
    title: 'Premium Marine Seating',
    text: 'Built for comfort and longevity with UV-stable, mildew-resistant materials that look great season after season.'
  },
  {
    title: 'Sun‑Safe. Water‑Ready.',
    text: 'Marine-grade vinyl and performance fabrics that stand up to sun, spray, and salt without sacrificing feel.'
  },
  {
    title: 'Custom Boat Interiors',
    text: 'Tailored layouts, matching trims, and thoughtful details to elevate every inch of your vessel.'
  },
  {
    title: 'Helm Seats & Consoles',
    text: 'Ergonomic captain’s chairs and helm pads designed for support during long days on the water.'
  },
  {
    title: 'Restorations That Last',
    text: 'From torn seats to full interior refreshes—durable, color‑matched restorations you can trust.'
  },
  {
    title: 'Tailored Cushions',
    text: 'High‑density foams, quick‑dry construction, and precise patterning for a perfect fit.'
  },
  {
    title: 'Precision Stitching',
    text: 'Double‑stitched seams, reinforced stress points, and consistent panel alignment.'
  },
  {
    title: 'Luxury Finishes',
    text: 'Embossing, contrast stitching, piping, and textures that bring a premium look to your craft.'
  },
];

const services = [
  {
    icon: DirectionsBoat,
    title: 'Marine Upholstery',
    description: 'Specialized boat seating and interior upholstery designed to withstand marine environments with premium materials.',
  },
  {
    icon: Build,
    title: 'Custom Design',
    description: 'Tailored designs that match your vision and vessel specifications, from concept to completion.',
  },
  {
    icon: ColorLens,
    title: 'Premium Materials',
    description: 'Marine-grade vinyl, weather-resistant fabrics, and UV-protected materials for lasting durability.',
  },
  {
    icon: Speed,
    title: 'Quick Turnaround',
    description: 'Efficient service without compromising quality, getting you back on the water faster.',
  },
];

const features = [
  'Marine-Grade Materials',
  'UV Protection',
  'Mildew Resistant',
  'Custom Colors & Patterns',
  'Weather Resistant',
  'Expert Craftsmanship',
  'Seat Restoration',
  'Full Interior Reupholstery',
];

const UpholsteryServices = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <HeroSectionCommon
        title="Ready to Transform Your Boat,RV,or Home Furniture"
        description="Premium marine and automotive upholstery solutions crafted with precision and passion."
        height={{
          xs: '75px',
          sm: '70px', 
          md: '80px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
        }}
        singleLineTitle={true}
      />

      {/* Introduction Section */}
      <Box sx={{ 
        py: { xs: 6, md: 7, lg: 7, xl: 7},
        backgroundColor: 'white',
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' },
                letterSpacing: 2,
              }}
            >
              BEYOND THE BUILD
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
           Excellence in Marine & Furniture Upholstery 
            </Typography>
            <MotionBox
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              sx={{
                mt: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: { xs: 3, md: 4, lg: 6 },
                textAlign: 'left',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  flex: { md: '0 0 50%' },
                  maxWidth: { xs: '100%', md: 'unset' },
                }}
              >
                From elegant home furnishings to custom RV interiors, our upholstery specialists deliver exceptional comfort and craftsmanship. We build and recover RV seating to your exact specifications and restore home furniture with precision and care.
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  flex: { md: '0 0 45%' },
                  width: { xs: '100%', md: '100%' },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  aspectRatio: { xs: '4 / 3', md: '16 / 10' },
                  minHeight: { xs: 220, sm: 260, md: 320 },
                }}
              >
                <Image
                  src="/Gallery/Truckimages/cu7.jpg"
                  alt="Custom upholstery showcased on seating"
                  fill
                  priority={false}
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 45vw, 40vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </MotionBox>
          </MotionBox>

          {/* Services Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(4, 1fr)' 
              },
              gap: { xs: 3, md: 4 },
              mt: 6,
            }}
          >
            {services.map((service, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                elevation={0}
                sx={{
                  height: '100%',
                  p: 4,
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'white',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 20px 60px rgba(211, 47, 47, 0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(211, 47, 47, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '.MuiCard-root:hover &': {
                        backgroundColor: 'primary.main',
                        transform: 'scale(1.1)',
                        '& svg': {
                          color: 'white',
                        },
                      },
                    }}
                  >
                    <service.icon sx={{ fontSize: 40, color: 'primary.main', transition: 'color 0.3s ease' }} />
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                    color: 'text.primary',
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                  }}
                >
                  {service.description}
                </Typography>
              </MotionCard>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="h3"
              sx={{
                mb: 3,
                fontWeight: 600,
              }}
            >
              What We Offer
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Our comprehensive upholstery services combine traditional craftsmanship with modern materials 
              and techniques.
            </Typography>
          </MotionBox>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(4, 1fr)' 
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    boxShadow: '0 8px 24px rgba(211, 47, 47, 0.15)',
                  },
                }}
              >
                <CheckCircleOutline sx={{ color: 'primary.main', fontSize: 24, flexShrink: 0 }} />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, fontSize: '0.95rem' }}
                >
                  {feature}
                </Typography>
              </MotionBox>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Gallery Section - Marine Upholstery Showcase */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        backgroundColor: '#fafafa',
      }}>
        <Container maxWidth="xl">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' },
                letterSpacing: 2,
              }}
            >
              OUR PORTFOLIO
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Marine Upholstery Showcase
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Explore our collection of custom marine upholstery projects, from elegant yacht interiors 
              to durable fishing boat seats.
            </Typography>
          </MotionBox>

          {/* Alternating sections using the 8 images */}
          {upholsteryImages.map((image, index) => (
            <Box
              key={image.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 3, md: 6 },
                alignItems: 'center',
                mb: { xs: 6, md: 10 },
              }}
            >
              {/* Content */}
              <MotionBox
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                sx={{ order: { xs: 2, md: index % 2 === 0 ? 1 : 2 } }}
              >
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2, fontSize: { xs: '1.25rem', sm: '1.7rem', md: '1.9rem', lg: '2.2rem', xl: '2.2rem' } }}>
                  MARINE UPHOLSTERY
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>
                  {showcaseCopy[index]?.title || image.alt}
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
                  {showcaseCopy[index]?.text || image.alt}
                </Typography>
              </MotionBox>

              {/* Image */}
              <MotionBox
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                sx={{ position: 'relative', paddingTop: '70%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', order: { xs: 1, md: index % 2 === 0 ? 2 : 1 } }}
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority={index < 2}
                />
              </MotionBox>
            </Box>
          ))}
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ 
        py: { xs: 8, md: 10, lg: 12 },
        background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.95) 0%, rgba(139, 0, 0, 0.95) 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/Upholstery/boat%201.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0,
        },
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center' }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontWeight: 700,
              }}
            >
              Ready to Transform Your Boat, RV, or Home Furniture?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 5,
                opacity: 0.95,
                lineHeight: 1.8,
              }}
            >
              Let&apos;s bring your vision to life with our expert marine upholstery services. 
              Contact us today for a free consultation and quote.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/contact')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Get a Quote
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/gallery')}
                endIcon={<ArrowForward />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                View Gallery
              </Button>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            color: 'white',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.8)',
              },
            }}
          >
            <Close />
          </IconButton>

          {selectedImage && (
            <Box
              component="img"
              src={selectedImage.src}
              alt={selectedImage.alt}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default UpholsteryServices;

