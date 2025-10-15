'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Business,
  Engineering,
  LocalShipping,
  Security,
  Support,
  Star,
  CheckCircle,
  TrendingUp,
  People,
  AutoAwesome,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// import Breadcrumbs from '@/components/Breadcrumbs'; // Temporarily disabled
import { stats, values, process } from '@/data/About';

const MotionTypography = motion.create(Typography);
const MotionBox = motion.create(Box);

const AboutPage = () => {
  // Icon mapping function
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      TrendingUp: <TrendingUp />,
      CheckCircle: <CheckCircle />,
      Star: <Star />,
      People: <People />,
      AutoAwesome: <AutoAwesome />,
      Support: <Support />,
      Engineering: <Engineering />,
    };
    return iconMap[iconName] || <CheckCircle />;
  };
 

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
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '2.5rem', xl: '5rem' },
                fontWeight: 'bold',
                mb: { xs: 0.5, sm: 1, md: 1, lg: 1, xl: 1.5 },
                textAlign: 'center',
                color: 'white',
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4, lg: 1.5, xl: 1.5 },
                px: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 },
              }}
            >
              Superior Seating LLC
            </MotionTypography>
           
            <MotionTypography
              variant="h3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              sx={{
                mb: { xs: 1, sm: 1.5, md: 1, lg: 1, xl: 1.5 },
                opacity: 0.9,
                maxWidth: { xs: '100%', sm: '90%', md: '85%', lg: 800, xl: 800 },
                mx: 'auto',
                lineHeight: { xs: 1.4, sm: 1.5, md: 1.6, lg: 1.6, xl: 1.6 },
                fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem', lg: '1.5rem', xl: '2.2rem' },
                textAlign: 'center',
                color: 'white',
                fontWeight: '400',
                px: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 },
              }}
            >
              Crafting the perfect seat for every driver, Ensuring comfort meets quality
            </MotionTypography>
            
            <MotionTypography
              variant="h3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.6rem', md: '2.2rem', lg: '2.5rem', xl: '2.5rem' },
                fontWeight: '500',
                textAlign: 'center',
                color: 'white',
                px: { xs: 1, sm: 2, md: 3, lg: 1, xl: 1.5 },
                width: '100%',
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4, lg: 1.4, xl: 1.4 },
              }}
            >
              Sit Better
            </MotionTypography>
          </Box>
        </Container>
      </Box>

      {/* Breadcrumbs - Temporarily disabled */}
      {/* <Box sx={{ backgroundColor: 'white' }}>
        <Breadcrumbs
          items={[
            { label: 'About Us' }
          ]}
        />
      </Box> */}

      {/* Our Story - Parent (Heading + Two-column content) */}
      <Box sx={{ backgroundColor: 'white', py: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 } }}>
        <Container maxWidth="lg" sx={{ py: 0 }}>
          <MotionTypography 
            variant="h3" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{ 
              textAlign: 'center', 
              fontWeight: 'medium', 
              py: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 3.5 },
              mb: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 },
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3.5rem', xl: '3.5rem' },
              px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 },
            }}
          >
            Our Story
          </MotionTypography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 3, sm: 4, md: 5, lg: 5 }, 
            alignItems: { xs: 'center', lg: 'stretch' }, 
            justifyContent: 'space-between', 
            py: { xs: 2, sm: 3, md: 4, lg: 3, xl: 3 },
            px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 }
          }}>
            {/* Left - Company Stats */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row', md: 'column', lg: 'column' },
              flexWrap: { xs: 'wrap', sm: 'nowrap', md: 'nowrap' },
              justifyContent: { xs: 'center', sm: 'center', md: 'flex-start', lg: 'flex-start' },
              gap: { xs: 2, sm: 2.5, md: 3, lg: '10px', xl: '10px' },
              width: { xs: '100%', sm: '100%', md: '100%', lg: '350px', xl: '400px' },
              order: { xs: 2, lg: 1 },
              maxWidth: { xs: '100%', lg: '400px' }
            }}>
              {stats.map((stat, index) => (
                <Card key={index} sx={{ 
                  textAlign: 'center', 
                  p: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 }, 
                  height: { xs: 100, sm: 120, md: 140, lg: 150, xl: 150 },
                  width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 12px)', md: '100%', lg: '100%', xl: '100%' },
                  minWidth: { xs: '140px', sm: '160px', md: 'auto', lg: 'auto', xl: 'auto' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  cursor: 'pointer',
                  borderRadius: { xs: 2, sm: 2.5, md: 3, lg: 3, xl: 3 },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.05)',
                    boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                    '& .stat-icon': {
                      transform: 'rotate(360deg) scale(1.2)',
                    },
                    '& .stat-value': {
                      color: '#d32f2f',
                    },
                    '& .stat-label': {
                      color: '#d32f2f',
                    },
                  },
                }}>
                  <Box 
                    className="stat-icon"
                    sx={{ 
                      color: 'primary.main', 
                      mb: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xl: 2 },
                      fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem', lg: '2rem', xl: '2rem' },
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    {getIcon(stat.icon)}
                  </Box>
                  <Typography 
                    className="stat-value"
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'medium', 
                      color: 'primary.main', 
                      mb: { xs: 0.25, sm: 0.5, md: 0.75, lg: 1, xl: 1 },
                      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem', lg: '2rem', xl: '2rem' },
                      transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      lineHeight: { xs: 1.1, sm: 1.2, md: 1.3, lg: 1.3, xl: 1.3 },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    className="stat-label"
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem', lg: '0.9rem', xl: '0.9rem' },
                      transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      lineHeight: { xs: 1.2, sm: 1.3, md: 1.4, lg: 1.4, xl: 1.4 },
                      textAlign: 'center',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              ))}
            </Box>

            {/* Right - Our Story with background image */}
            <Box sx={{ 
              flex: 1,
              backgroundColor: '#fafafa',
              minHeight: { xs: 'auto', md: '400px', lg: 'auto', xl: 'auto' },
              backgroundSize: {
                xs: 'cover',
                sm: 'cover',
                md: 'cover',
                lg: 'cover',
              },
              backgroundPosition: {
                xs: 'center',
                sm: 'center',
                md: 'center',
                lg: 'center',
              },
              backgroundRepeat: 'no-repeat',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: { xs: 2, sm: 2.5, md: 3, lg: 2, xl: 2 },
              order: { xs: 1, lg: 2 },
              width: { xs: '100%', lg: 'auto' },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.75) 100%)',
                zIndex: 1,
              }
            }}>
              <Box sx={{ 
                position: 'relative', 
                zIndex: 2,
                px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                py: { xs: 3, sm: 4, md: 5, lg: 0, xl: 0 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 4 },
                height: '100%',
                justifyContent: 'center'
              }}>
                <MotionBox sx={{ 
                  textAlign: { xs: 'center', md: 'left' },
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <MotionTypography 
                    variant="h6" 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    sx={{ 
                      mb: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 2.5 }, 
                      fontWeight: '550',
                      color: 'text.secondary', 
                      lineHeight: { xs: 1.4, sm: 1.5, md: 1.6, lg: 1.8, xl: 1.8 },
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.2rem', xl: '1.2rem' },
                    }}
                  >
                    At Superior Seating, every seat begins with your vision. We combine cutting-edge technology, timeless craftsmanship, and a deep passion for design to deliver seating solutions that are as unique as the people who use them.
                  </MotionTypography>
                  
                  <MotionTypography 
                    variant="body1" 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    sx={{ 
                      mb: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 2.5 }, 
                      fontWeight: '550',
                      color: 'text.secondary', 
                      lineHeight: { xs: 1.4, sm: 1.5, md: 1.6, lg: 1.8, xl: 1.8 },
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem', lg: '1.1rem', xl: '1.1rem' },
                    }}
                  >
                    Driven by comfort, defined by style, and tailored to your exact needs, our custom seats are built to enhance every journey—whether it&apos;s in a Semitruck, Sprinter, RV, or limousine. With over 20 signature styles and endless layout possibilities, our team works closely with you to bring your ideas to life using only the highest-quality materials and advanced manufacturing techniques.
                  </MotionTypography>
                  
                  <MotionTypography 
                    variant="body1" 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                    sx={{ 
                      mb: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }, 
                      fontWeight: '550',
                      color: 'text.secondary', 
                      lineHeight: { xs: 1.4, sm: 1.5, md: 1.6, lg: 1.8, xl: 1.8 },
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem', lg: '1.1rem', xl: '1.1rem' },
                    }}
                  >
                    From start to finish, we focus on what matters most: exceptional comfort, personalized design, and a seamless experience that puts the customer first. Discover how your vision can become reality—one seat at a time.
                  </MotionTypography>
                </MotionBox>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* Our Values */}
      <Box sx={{ py: { xs: 3, sm: 4, md: 5, lg: 1, xl: 1 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 } }}>
          <MotionTypography 
            variant="h3" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{ 
              textAlign: 'center', 
              fontWeight: 'medium', 
              mb: { xs: 3, sm: 4, md: 5, lg: 3.5, xl: 3.5 },
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3.5rem', xl: '3.5rem' },
              px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 }
            }}
          >
            Our Values
          </MotionTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: { xs: 2, sm: 2.5, md: 3, lg: 3, xl: 3 },
              maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: 1200, xl: 1200 },
              width: '100%',
              justifyContent: 'center',
              px: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 }
            }}>
              {values.map((value, index) => (
                                 <Card
                   key={index}
                   sx={{
                     width: '100%',
                     height: { xs: 140, sm: 150, md: 160, lg: 145, xl: 145 },
                     textAlign: 'center',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     alignItems: 'center',
                     p: { xs: 1, sm: 1.5, md: 2, lg: 1.5, xl: 1.5 },
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    borderRadius: { xs: 2, sm: 2.5, md: 3, lg: 3, xl: 3 },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.05)',
                      boxShadow: '0 12px 40px rgba(230, 63, 63, 0.2)',
                      '& .icon': {
                        transform: 'rotate(360deg) scale(1.2)',
                        color: 'primary.main',
                      },
                      '& .title': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <Box 
                    className="icon"
                    sx={{ 
                      color: 'primary.main', 
                      mb: { xs: 0.5, sm: 0.75, md: 1, lg: 0, xl: 0 },
                      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2rem', xl: '2rem' },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                     {getIcon(value.icon)}
                   </Box>
                  <Typography 
                    className="title"
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: { xs: 0.5, sm: 0.75, md: 1, lg: 0.5, xl: 0.5 }, 
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '0.9rem', xl: '0.9rem' },
                      transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      lineHeight: { xs: 1.2, sm: 1.3, md: 1.4, lg: 1.4, xl: 1.4 },
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      lineHeight: { xs: 1.3, sm: 1.4, md: 1.5, lg: 1.4, xl: 1.4 }, 
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.75rem', xl: '0.75rem' },
                      px: { xs: 0.5, sm: 0.75, md: 1, lg: 0.5, xl: 0.5 },
                      textAlign: 'center',
                    }}
                  >
                    {value.description}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

    {/* Our Process */}
<Box sx={{ py: { xs: 3, sm: 4, md: 5, lg: 3.5, xl: 3.5 }, backgroundColor: 'white' }}>
  <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 } }}>
    
    {/* Section Title */}
    <MotionTypography 
      variant="h3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      sx={{ 
        textAlign: 'center', 
        fontWeight: 'medium', 
        mb: { xs: 3, sm: 4, md: 5, lg: 3.5, xl: 3.5 },
        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3.5rem', xl: '3.5rem' },
        px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 }
      }}
    >
      Our Process
    </MotionTypography>

    {/* Card Grid */}
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: { xs: 2, sm: 2.5, md: 3, lg: 4, xl: 4 },
          width: '100%',
          maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: 1400, xl: 1400 },
          px: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 }
        }}
      >
        {process.map((step, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              minHeight: { xs: 200, sm: 220, md: 240, lg: 280, xl: 280 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              textAlign: 'center',
              p: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 },
              boxShadow: '0 4px 20px rgba(0,0,0,0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              borderRadius: { xs: 2, sm: 2.5, md: 3, lg: 3, xl: 3 },
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                '& .icon': {
                  transform: 'rotate(360deg) scale(1.1)',
                },
                '& .title': {
                  color: '#d32f2f',
                },
              },
            }}
          >
            {/* Step Circle */}
            <Box
              className="icon"
              sx={{
                position: 'relative',
                width: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                height: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                borderRadius: '50%',
                backgroundColor: '#d32f2f',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' },
                fontWeight: 'bold',
                mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                border: { xs: '2px solid white', sm: '3px solid white', md: '3px solid white', lg: '3px solid white', xl: '3px solid white' },
                boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                  left: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                  right: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                  bottom: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                  zIndex: -1,
                  opacity: 0.8,
                  transform: 'scale(0.8)',
                  transition: 'all 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                  transform: 'scale(1.1)',
                },
              }}
            >
              {String(step.step).padStart(2, '0')}
            </Box>

            {/* Title */}
            <Typography
              className="title"
              variant="h6"
              sx={{
                fontWeight: 'medium',
                mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.2rem', xl: '1.3rem' },
                transition: 'color 0.3s ease',
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4, lg: 1.4, xl: 1.4 },
                textAlign: 'center',
              }}
            >
              {step.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem', xl: '0.9rem' },
                lineHeight: { xs: 1.3, sm: 1.4, md: 1.5, lg: 1.5, xl: 1.5 },
                flexGrow: 1,
                textAlign: 'center',
                px: { xs: 0.5, sm: 1, md: 1.5, lg: 1.5, xl: 1.5 },
              }}
            >
              {step.description}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  </Container>
</Box>

             {/* Why Choose Us */}
       <Box sx={{ py: { xs: 3, sm: 4, md: 5, lg: 5, xl: 5 }, backgroundColor: 'white' }}>
         <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 } }}>
           <MotionTypography 
             variant="h3" 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: false, amount: 0.1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             sx={{ 
               textAlign: 'center', 
               fontWeight: 'medium', 
               mb: { xs: 3, sm: 4, md: 5, lg: 6, xl: 6 },
               fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3.5rem', xl: '3.5rem' },
               px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 }
             }}
           >
             Why Choose Superior Seats?
           </MotionTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(5, 1fr)',
                },
                gap: { xs: 2, sm: 2.5, md: 3, lg: 4, xl: 4 },
                width: '100%',
                maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: 1400, xl: 1400 },
                px: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 }
              }}
            >
               {/* Custom Fit Design */}
               <Card
                 sx={{
                   height: { xs: 'auto', sm: '100%', md: '100%', lg: '100%', xl: '100%' },
                   minHeight: { xs: 180, sm: 220, md: 240, lg: 280, xl: 280 },
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'flex-start',
                   alignItems: 'center',
                   textAlign: 'center',
                   p: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 },
                   boxShadow: '0 4px 20px rgba(0,0,0,0)',
                   transition: 'all 0.3s ease',
                   cursor: 'pointer',
                   borderRadius: { xs: 2, sm: 2.5, md: 3, lg: 3, xl: 3 },
                   '&:hover': {
                     transform: 'translateY(-4px) scale(1.02)',
                     boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                     '& .icon': {
                       transform: 'rotate(360deg) scale(1.1)',
                     },
                     '& .title': {
                       color: '#d32f2f',
                     },
                   },
                 }}
               >
                 {/* Icon Circle */}
                 <Box
                   className="icon"
                   sx={{
                     position: 'relative',
                     width: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     height: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     borderRadius: '50%',
                     backgroundColor: '#d32f2f',
                     color: 'white',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' },
                     fontWeight: 'bold',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     border: { xs: '2px solid white', sm: '3px solid white', md: '3px solid white', lg: '3px solid white', xl: '3px solid white' },
                     boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                     transition: 'all 0.3s ease',
                     '&::before': {
                       content: '""',
                       position: 'absolute',
                       top: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       left: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       right: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       bottom: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       borderRadius: '50%',
                       background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                       zIndex: -1,
                       opacity: 0.8,
                       transform: 'scale(0.8)',
                       transition: 'all 0.3s ease',
                     },
                     '&:hover::before': {
                       opacity: 1,
                       transform: 'scale(1.1)',
                     },
                   }}
                 >
                   <CheckCircle sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem', lg: '1.5rem', xl: '1.5rem' } }} />
                 </Box>

                 {/* Title */}
                 <Typography
                   className="title"
                   variant="h6"
                   sx={{
                     fontWeight: 'medium',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.1rem' },
                     transition: 'color 0.3s ease',
                   }}
                 >
                   Custom Fit Design
                 </Typography>

                 {/* Description */}
                 <Typography
                   variant="body1"
                   sx={{
                     color: 'text.secondary',
                     fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem', xl: '0.9rem' },
                     lineHeight: 1.5,
                     flexGrow: 1,
                     fontWeight: 'regular',
                   }}
                 >
                   Designed specifically for your vehicle and body type.
                 </Typography>
               </Card>

               {/* Premium Materials */}
               <Card
                 sx={{
                   height: { xs: 'auto', sm: '100%', md: '100%', lg: '100%', xl: '100%' },
                   minHeight: { xs: 160, sm: 250, md: 280 },
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'flex-start',
                   alignItems: 'center',
                   textAlign: 'center',
                   p: { xs: 1.5, sm: 2.5, md: 3 },
                   boxShadow: '0 4px 20px rgba(0,0,0,0)',
                   transition: 'all 0.3s ease',
                   cursor: 'pointer',
                   '&:hover': {
                     transform: 'translateY(-4px) scale(1.02)',
                     boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                     '& .icon': {
                       transform: 'rotate(360deg) scale(1.1)',
                     },
                     '& .title': {
                       color: '#d32f2f',
                     },
                   },
                 }}
               >
                 {/* Icon Circle */}
                 <Box
                   className="icon"
                   sx={{
                     position: 'relative',
                     width: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     height: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     borderRadius: '50%',
                     backgroundColor: '#d32f2f',
                     color: 'white',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' },
                     fontWeight: 'bold',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     border: { xs: '2px solid white', sm: '3px solid white', md: '3px solid white', lg: '3px solid white', xl: '3px solid white' },
                     boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                     transition: 'all 0.3s ease',
                     '&::before': {
                       content: '""',
                       position: 'absolute',
                       top: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       left: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       right: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       bottom: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       borderRadius: '50%',
                       background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                       zIndex: -1,
                       opacity: 0.8,
                       transform: 'scale(0.8)',
                       transition: 'all 0.3s ease',
                     },
                     '&:hover::before': {
                       opacity: 1,
                       transform: 'scale(1.1)',
                     },
                   }}
                 >
                   <CheckCircle sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem', lg: '1.5rem', xl: '1.5rem' } }} />
                 </Box>

                 {/* Title */}
                 <Typography
                   className="title"
                   variant="h6"
                   sx={{
                     fontWeight: 'medium',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.1rem' },
                     transition: 'color 0.3s ease',
                   
                   }}
                 >
                   Premium Materials
                 </Typography>

                 {/* Description */}
                 <Typography
                   variant="body1"
                   sx={{
                     color: 'text.secondary',
                     fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem', xl: '0.9rem' },
                     lineHeight: 1.5,
                     flexGrow: 1,
                     fontWeight: 'regular',
                   }}
                 >
                   Highest quality leather, fabric, and materials.
                 </Typography>
               </Card>

               {/* Expert Craftsmanship */}
               <Card
                 sx={{
                   height: { xs: 'auto', sm: '100%', md: '100%', lg: '100%', xl: '100%' },
                   minHeight: { xs: 160, sm: 250, md: 280 },
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'flex-start',
                   alignItems: 'center',
                   textAlign: 'center',
                   p: { xs: 1.5, sm: 2.5, md: 3 },
                   boxShadow: '0 4px 20px rgba(0,0,0,0)',
                   transition: 'all 0.3s ease',
                   cursor: 'pointer',
                   '&:hover': {
                     transform: 'translateY(-4px) scale(1.02)',
                     boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                     '& .icon': {
                       transform: 'rotate(360deg) scale(1.1)',
                     },
                     '& .title': {
                       color: '#d32f2f',
                     },
                   },
                 }}
               >
                 {/* Icon Circle */}
                 <Box
                   className="icon"
                   sx={{
                     position: 'relative',
                     width: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     height: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     borderRadius: '50%',
                     backgroundColor: '#d32f2f',
                     color: 'white',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' },
                     fontWeight: 'bold',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     border: { xs: '2px solid white', sm: '3px solid white', md: '3px solid white', lg: '3px solid white', xl: '3px solid white' },
                     boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                     transition: 'all 0.3s ease',
                     '&::before': {
                       content: '""',
                       position: 'absolute',
                       top: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       left: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       right: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       bottom: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       borderRadius: '50%',
                       background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                       zIndex: -1,
                       opacity: 0.8,
                       transform: 'scale(0.8)',
                       transition: 'all 0.3s ease',
                     },
                     '&:hover::before': {
                       opacity: 1,
                       transform: 'scale(1.1)',
                     },
                   }}
                 >
                   <CheckCircle sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem', lg: '1.5rem', xl: '1.5rem' } }} />
                 </Box>

                 {/* Title */}
                 <Typography
                   className="title"
                   variant="h6"
                   sx={{
                     fontWeight: 'medium',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.1rem' },
                     transition: 'color 0.3s ease',
                   }}
                 >
                   Expert Craftsmanship
                 </Typography>

                 {/* Description */}
                 <Typography
                   variant="body1"
                   sx={{
                     color: 'text.secondary',
                     fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem', xl: '0.9rem' },
                     lineHeight: 1.5,
                     flexGrow: 1,
                     fontWeight: 'regular',
                   }}
                 >
                   Skilled artisans handcraft each seat with precision.
                 </Typography>
               </Card>

               {/* Comprehensive Warranty */}
               <Card
                 sx={{
                   height: { xs: 'auto', sm: '100%', md: '100%', lg: '100%', xl: '100%' },
                   minHeight: { xs: 160, sm: 250, md: 280 },
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'flex-start',
                   alignItems: 'center',
                   textAlign: 'center',
                   p: { xs: 1.5, sm: 2.5, md: 3 },
                   boxShadow: '0 4px 20px rgba(0,0,0,0)',
                   transition: 'all 0.3s ease',
                   cursor: 'pointer',
                   '&:hover': {
                     transform: 'translateY(-4px) scale(1.02)',
                     boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                     '& .icon': {
                       transform: 'rotate(360deg) scale(1.1)',
                     },
                     '& .title': {
                       color: '#d32f2f',
                     },
                   },
                 }}
               >
                 {/* Icon Circle */}
                 <Box
                   className="icon"
                   sx={{
                     position: 'relative',
                     width: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     height: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     borderRadius: '50%',
                     backgroundColor: '#d32f2f',
                     color: 'white',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' },
                     fontWeight: 'bold',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     border: { xs: '2px solid white', sm: '3px solid white', md: '3px solid white', lg: '3px solid white', xl: '3px solid white' },
                     boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                     transition: 'all 0.3s ease',
                     '&::before': {
                       content: '""',
                       position: 'absolute',
                       top: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       left: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       right: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       bottom: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       borderRadius: '50%',
                       background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                       zIndex: -1,
                       opacity: 0.8,
                       transform: 'scale(0.8)',
                       transition: 'all 0.3s ease',
                     },
                     '&:hover::before': {
                       opacity: 1,
                       transform: 'scale(1.1)',
                     },
                   }}
                 >
                   <CheckCircle sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem', lg: '1.5rem', xl: '1.5rem' } }} />
                 </Box>

                 {/* Title */}
                 <Typography
                   className="title"
                   variant="h6"
                   sx={{
                     fontWeight: 'medium',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.1rem' },
                     transition: 'color 0.3s ease',
                   }}
                 >
                   Comprehensive Warranty
                 </Typography>

                 {/* Description */}
                 <Typography
                   variant="body1"
                   sx={{
                     color: 'text.secondary',
                     fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem', xl: '0.9rem' },
                     lineHeight: 1.5,
                     flexGrow: 1,
                     fontWeight: 'regular',
                   }}
                 >
                   We stand behind our work with full warranty.
                 </Typography>
              </Card>

              {/* Ongoing Support */}
               <Card
                 sx={{
                   height: { xs: 'auto', sm: '100%', md: '100%', lg: '100%', xl: '100%' },
                   minHeight: { xs: 160, sm: 250, md: 280 },
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'flex-start',
                   alignItems: 'center',
                   textAlign: 'center',
                   p: { xs: 1.5, sm: 2.5, md: 3 },
                   boxShadow: '0 4px 20px rgba(0,0,0,0)',
                   transition: 'all 0.3s ease',
                   cursor: 'pointer',
                   '&:hover': {
                     transform: 'translateY(-4px) scale(1.02)',
                     boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                     '& .icon': {
                       transform: 'rotate(360deg) scale(1.1)',
                     },
                     '& .title': {
                       color: '#d32f2f',
                     },
                   },
                 }}
               >
                 {/* Icon Circle */}
                 <Box
                   className="icon"
                   sx={{
                     position: 'relative',
                     width: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     height: { xs: 50, sm: 55, md: 60, lg: 60, xl: 60 },
                     borderRadius: '50%',
                     backgroundColor: '#d32f2f',
                     color: 'white',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' },
                     fontWeight: 'bold',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     border: { xs: '2px solid white', sm: '3px solid white', md: '3px solid white', lg: '3px solid white', xl: '3px solid white' },
                     boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                     transition: 'all 0.3s ease',
                     '&::before': {
                       content: '""',
                       position: 'absolute',
                       top: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       left: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       right: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       bottom: { xs: '-4px', sm: '-5px', md: '-6px', lg: '-6px', xl: '-6px' },
                       borderRadius: '50%',
                       background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                       zIndex: -1,
                       opacity: 0.8,
                       transform: 'scale(0.8)',
                       transition: 'all 0.3s ease',
                     },
                     '&:hover::before': {
                       opacity: 1,
                       transform: 'scale(1.1)',
                     },
                   }}
                 >
                   <CheckCircle sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem', lg: '1.5rem', xl: '1.5rem' } }} />
                 </Box>

                 {/* Title */}
                 <Typography
                   className="title"
                   variant="h6"
                   sx={{
                     fontWeight: 'medium',
                     mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
                     fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.1rem' },
                     transition: 'color 0.3s ease',
                   }}
                 >
                   Ongoing Support
                 </Typography>

                 {/* Description */}
                 <Typography
                   variant="body1"
                   sx={{
                     color: 'text.secondary',
                     fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem', xl: '0.9rem' },
                     lineHeight: 1.5,
                     flexGrow: 1,
                     fontWeight: 'regular',
                   }}
                 >
                   We&apos;re here for you even after purchase.
                 </Typography>
               </Card>
             </Box>
           </Box>
         </Container>
       </Box>

             {/* Footer Component */}
       <Footer />
    </Box>
  );
};

export default AboutPage; 