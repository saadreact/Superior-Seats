'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// import Breadcrumbs from '@/components/Breadcrumbs'; // Temporarily disabled
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';
import LazyImage from '@/components/common/LazyImage';
import { workPictures, workPicturesTruck, WorkImage } from '@/data/Gallery';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.8
    } 
  },
};

const Gallery = () => { 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const [selectedImage, setSelectedImage] = useState<WorkImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animatedImages, setAnimatedImages] = useState<boolean[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Initialize animation states
  useEffect(() => {
    const animationStates = workPictures.map(() => false);
    setAnimatedImages(animationStates);
    
    // Animate images one by one with delay
    const animateImages = () => {
      workPictures.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedImages(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }, index * 200); // 200ms delay between each image
      });
    };

    // Start animation after a short delay
    const timer = setTimeout(animateImages, 300);
    return () => clearTimeout(timer);
  }, []);


  const handleImageClick = (image: WorkImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % workPictures.length;
    setSelectedImage(workPictures[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = currentImageIndex === 0 ? workPictures.length - 1 : currentImageIndex - 1;
    setSelectedImage(workPictures[prevIndex]);
    setCurrentImageIndex(prevIndex);
  };

  const handleSliderNext = () => {
    setSliderIndex((prev) => (prev + 1) % workPictures.length);
  };

  const handleSliderPrev = () => {
    setSliderIndex((prev) => (prev - 1 + workPictures.length) % workPictures.length);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleSliderNext();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [sliderIndex]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
            {/* Hero Section */}
         <HeroSectionCommon
          title="Our Work Gallery"
          description="Explore our custom seating solutions across different vehicle types and see our craftsmanship in action."
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
      {/* <Breadcrumbs
        items={[
          { label: 'Gallery' }
        ]}
      /> */}

      {/* Featured Project Section 1 - Truck Customization */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        backgroundColor: 'white',
      }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 6, lg: 8 },
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
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  letterSpacing: 2,
                }}
              >
                TRUCK SEATING EXCELLENCE
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
                Professional Grade Comfort
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                We specialize in creating custom truck seating solutions that combine durability with comfort. 
                Our expert craftsmen work with premium materials to deliver seats that withstand the demands 
                of professional driving while providing superior ergonomic support.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                }}
              >
                Every project is tailored to meet the specific needs of our clients, from long-haul truckers 
                to fleet operators, ensuring maximum comfort and longevity.
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
                onClick={() => handleImageClick(workPicturesTruck[0], 0)}
              >
                <Box
                  component="img"
                  src={workPicturesTruck[1]?.image}
                  alt="Professional truck seating"
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

      {/* Workshop Craftsmanship Section (no grid; split into distinct sections) */}
      <Box sx={{ py: { xs: 6, md: 8, lg: 10 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="xl">
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}>
              BEHIND THE CRAFT
            </Typography>
            <Typography variant="h2" sx={{ mt: 2, fontWeight: 700 }}>
              Where Excellence Begins
            </Typography>
            <Typography sx={{ mt: 2, color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Our workshop is where passion meets precision. Explore select moments from the floor—each paired with
              a short story about what makes our process different.
            </Typography>
          </MotionBox>

          {/* Section A */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 3, md: 6 }, mb: { xs: 6, md: 10 } }}>
            <MotionBox initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>MATERIAL SELECTION</Typography>
              <Typography variant="h3" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>Premium Components, Handpicked</Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                We source leathers, foams, and hardware for longevity and comfort. Each project begins with exacting
                standards so the final product withstands thousands of miles.
              </Typography>
            </MotionBox>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '100%' }}>
                <Box
                  component="img"
                  src="/Gallery/Truckimages/brownchair.jpg"
                  alt="Workshop materials"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Section B */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' }, gap: { xs: 3, md: 6 }, alignItems: 'center', mb: { xs: 6, md: 10 } }}>
            <Box sx={{ position: 'relative', paddingTop: '70%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <Image src="/Gallery/Truckimages/u04.png" alt="Precision cutting" fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 100vw, 50vw" />
            </Box>
            <MotionBox initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>PATTERNING & CUT</Typography>
              <Typography variant="h3" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>Cut With Exactness</Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Patterns are drafted for fit and durability, then cut to precise tolerances. This ensures consistent
                panel alignment and a stronger finished seat.
              </Typography>
            </MotionBox>
          </Box>

          {/* Section C */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 3, md: 6 }, mb: { xs: 6, md: 2 } }}>
            <MotionBox initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>ASSEMBLY</Typography>
              <Typography variant="h3" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>Built by Craftspeople</Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Skilled upholstery technicians assemble every seat by hand, ensuring tight seams, smooth contours,
                and dependable performance.
              </Typography>
            </MotionBox>
            <Box sx={{ position: 'relative', paddingTop: '70%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <Image src="/Gallery/Truckimages/u05.png" alt="Assembly" fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 100vw, 50vw" />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Project Section 2 - Interior Excellence */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        backgroundColor: 'white',
      }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 6, lg: 8 },
              alignItems: 'center',
            }}
          >
            {/* Image */}
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
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
                onClick={() => handleImageClick(workPicturesTruck[7], 7)}
              >
                <Box
                  component="img"
                  src={workPicturesTruck[5]?.image}
                  alt="Interior excellence"
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

            {/* Content */}
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  letterSpacing: 2,
                }}
              >
                INTERIOR TRANSFORMATION
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
                Complete Cabin Solutions
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                From sleeper cabs to day cabs, we transform truck interiors into comfortable, functional spaces. 
                Our comprehensive approach covers everything from seat design to full cabin upholstery, creating 
                an environment where drivers feel at home on the road.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                }}
              >
                We use premium, durable materials that stand up to heavy use while maintaining their appearance 
                and comfort over thousands of miles.
              </Typography>
            </MotionBox>
          </Box>
        </Container>
      </Box>

      {/* Quality & Detail Section with More Trucks */}
      <Box sx={{ 
        py: { xs: 6, md: 8, lg: 10 },
        backgroundColor: '#f8f9fa',
      }}>
        <Container maxWidth="xl">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                letterSpacing: 2,
              }}
            >
              ATTENTION TO DETAIL
            </Typography>
            <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 700 }}>
              Every Stitch Matters
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Quality isn&apos;t just a promise—it&apos;s our standard. From material selection to final inspection, 
              every step of our process is designed to exceed expectations and deliver seats that last.
            </Typography>
          </MotionBox>

          {/* Clean 3-up grid of truck images */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
            {["/Gallery/Truckimages/u01.png","/Gallery/Truckimages/u07.png","/Gallery/Truckimages/u04.png"].map((src, idx) => (
              <MotionBox key={src} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: idx * 0.1 }} sx={{ position: 'relative', paddingTop: '70%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <Image src={src} alt={`Truck ${idx+1}`} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
              </MotionBox>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Our Work Pictures Section - Redesigned with Masonry-style Layout */}
      <Box sx={{ py: { xs: 6, md: 8, lg: 10 }, backgroundColor: 'white' }}>
        <Container maxWidth="xl">
          {/* Section Header */}
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                letterSpacing: 2,
              }}
            >
              FEATURED PROJECTS
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
              Our Beautiful Work
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
              Every seat tells a story of precision, passion, and perfection. Browse through our extensive portfolio.
            </Typography>
          </MotionBox>

          {/* Professional Gallery Grid */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
            justifyContent: 'center',
          }}>
            {workPictures.map((item, index) => (
              <MotionBox
                key={item.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ 
                  duration: 0.6, 
                  delay: (index % 12) * 0.05,
                  ease: [0.4, 0, 0.2, 1]
                }}
                sx={{ 
                  width: '100%',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(211, 47, 47, 0.2)',
                    '& .zoom-icon': {
                      opacity: 1,
                      transform: 'translate(-50%, -50%) scale(1)',
                    },
                    '& .gallery-image': {
                      transform: 'scale(1.08)',
                    },
                    '& .image-overlay': {
                      opacity: 1,
                    },
                  },
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={() => handleImageClick(item, index)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: { xs: '250px', sm: '300px', md: '350px', lg: '400px' },
                    height: { xs: '250px', sm: '300px', md: '350px', lg: '400px' },
                    overflow: 'hidden',
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.image && item.image.trim() !== '' ? (
                    <>
                      <img
                        src={item.image}
                        alt={`Gallery image ${item.id}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          backgroundColor: '#f5f5f5',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        className="gallery-image"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <Box
                        className="image-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.5s ease',
                        }}
                      />
                      
                      {/* Zoom Icon */}
                      <Box
                        className="zoom-icon"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%) scale(0.8)',
                          opacity: 0,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          backgroundColor: 'rgba(211, 47, 47, 0.95)',
                          borderRadius: '50%',
                          width: 56,
                          height: 56,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          zIndex: 2,
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 20px rgba(211, 47, 47, 0.4)',
                        }}
                      >
                        <ZoomIn sx={{ fontSize: 24 }} />
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        color: 'text.secondary',
                      }}
                    >
                      <Typography variant="body2">No image</Typography>
                    </Box>
                  )}
                </Box>
              </MotionBox>
            ))}
          </Box>
        </Container>
      </Box>
          
      {/* Image View Modal - Gallery Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 25px rgba(202, 38, 38, 0.2)',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.1)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(175, 40, 40, 0.3)',
              },
            }}
          >
            <Close />
          </IconButton>

          {selectedImage && (
            <Box sx={{ position: 'relative' }}>
              {selectedImage.image && selectedImage.image.trim() !== '' ? (
                <Image
                  src={selectedImage.image}
                  alt={`Gallery image ${selectedImage.id}`}
                  width={800}
                  height={600}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                  }}
                  priority
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="h6">No image available</Typography>
                </Box>
              )}
              
            </Box>
          )}
        </DialogContent>
      </Dialog>

      
      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default Gallery; 