'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
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
import { stats, values, process } from '@/data/About';

const MotionTypography = motion(Typography);

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
          height: '70vh',
          backgroundImage: 'url(../TruckImages/Seatset.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 6, md: 8 },
          px: { xs: 2, md: 4 },
          textAlign: 'center',
          position: 'relative',
          mx: { xs: 1, md: 2 },
          my: { xs: 1, md: 2 },
          borderRadius: { xs: '12px', md: '20px' },
          overflow: 'hidden',
          boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(211, 47, 47, 0.3) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <MotionTypography
            variant="h1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
              fontSize: { xs: '2.2rem', md: '3.5rem' },
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Superior Seating LLc
          </MotionTypography>
          <MotionTypography
            variant="h5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
              mb: 3,
              opacity: 0.9,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Crafting the perfect seat for every driver, ensuring comfort meets quality
          </MotionTypography>
        </Container>
      </Box>

      {/* Company Stats */}
      <Box sx={{ 
        py: { xs: 3, md: 4 }, 
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 2, md: 4 },
            maxWidth: 1200,
            width: '100%',
            justifyContent: 'center'
          }}>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  height: 200,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  cursor: 'pointer',
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
                      mb: 2,
                      fontSize: '2.5rem',
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                                     >
                     {getIcon(stat.icon)}
                   </Box>
                  <Typography 
                    className="stat-value"
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'primary.main', 
                      mb: 1,
                      transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    className="stat-label"
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Our Story */}
      <Box sx={{ py: { xs: 6, md: 8 ,height: '70vh'}, backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <MotionTypography 
                variant="h3" 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                sx={{ fontWeight: 'bold', mb: 4 ,justifyContent: 'center',alignItems: 'center',textAlign: 'center' }}
              >
                Our Story
              </MotionTypography>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8 }}>
              At Superior Seating, every seat begins with your vision. We combine cutting-edge technology, timeless craftsmanship, and a deep passion for design to deliver seating solutions that are as unique as the people who use them.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.7 }}>
              Driven by comfort, defined by style, and tailored to your exact needs, our custom seats are built to enhance every journey—whether it’s in a Semitruck, Sprinter, RV, or limousine. With over 20 signature styles and endless layout possibilities, our team works closely with you to bring your ideas to life using only the highest-quality materials and advanced manufacturing techniques.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              From start to finish, we focus on what matters most: exceptional comfort, personalized design, and a seamless experience that puts the customer first. Discover how your vision can become reality—one seat at a time.
              </Typography>
            </Grid>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <Box
                sx={{
                  height: 50,
                  background: 'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
               
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Values */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <MotionTypography 
            variant="h3" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}
          >
            Our Values
          </MotionTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
              maxWidth: 1200,
              width: '100%',
              justifyContent: 'center'
            }}>
              {values.map((value, index) => (
                                 <Card
                   key={index}
                   sx={{
                     width: '100%',
                     height: 200,
                     textAlign: 'center',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     alignItems: 'center',
                     p: 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
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
                      mb: 1.5,
                      fontSize: '2rem',
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
                      mb: 1, 
                      fontSize: '1rem',
                      transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      lineHeight: 1.4, 
                      fontSize: '0.8rem',
                      px: 1,
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
<Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa' }}>
  <Container maxWidth="lg">
    
    {/* Section Title */}
    <MotionTypography 
      variant="h3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}
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
          gap: { xs: 3, md: 4 },
          width: '100%',
          maxWidth: 1400,
        }}
      >
        {process.map((step, index) => (
          <Card
            key={index}
            sx={{
              height: '100%', // Make card fill height of its grid cell
              minHeight: 280, // Optional: makes heights more stable
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              textAlign: 'center',
              p: 3,
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
            {/* Step Circle */}
            <Box
              className="icon"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#d32f2f',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                mb: 2,
                boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              {String(step.step).padStart(2, '0')}
            </Box>

            {/* Title */}
            <Typography
              className="title"
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: '1.1rem',
                transition: 'color 0.3s ease',
              }}
            >
              {step.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                flexGrow: 1, // Push footer content if you add any
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
       <Box sx={{ py: { xs: 6, md: 8  }, backgroundColor: 'white' }}>
         <Container maxWidth="lg">
           <MotionTypography 
             variant="h3" 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: false, amount: 0.1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}
           >
             Why Choose Superior Seats?
           </MotionTypography>
                       <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
                gap: { xs: 3, md: 4 },
                maxWidth: 1400,
                width: '100%',
                justifyContent: 'center'
              }}>
                                 {/* Custom Fit Design */}
                 <Card sx={{ 
                   width: '100%', 
                   height: 180, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: 2,
                   boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                   transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   cursor: 'pointer',
                   '&:hover': {
                     transform: 'translateY(-8px) scale(1.05)',
                     boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                     '& .icon': {
                       transform: 'rotate(360deg) scale(1.2)',
                     },
                     '& .title': {
                       color: '#d32f2f',
                     },
                   },
                 }}>
                 <CheckCircle 
                   className="icon"
                   sx={{ 
                     color: 'primary.main', 
                     mb: 1, 
                     fontSize: '2rem',
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem', transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                   Custom Fit Design
                 </Typography>
                 <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.3, fontSize: '0.8rem' }}>
                   Designed specifically for your vehicle and body type.
                 </Typography>
               </Card>

                                {/* Premium Materials */}
                 <Card sx={{ 
                   width: '100%', 
                   height: 180, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: 2,
                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                 transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                 cursor: 'pointer',
                 '&:hover': {
                   transform: 'translateY(-8px) scale(1.05)',
                   boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                   '& .icon': {
                     transform: 'rotate(360deg) scale(1.2)',
                   },
                   '& .title': {
                     color: '#d32f2f',
                   },
                 },
               }}>
                 <CheckCircle 
                   className="icon"
                   sx={{ 
                     color: 'primary.main', 
                     mb: 1, 
                     fontSize: '2rem',
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem', transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                   Premium Materials
                 </Typography>
                 <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.3, fontSize: '0.8rem' }}>
                   Highest quality leather, fabric, and materials.
                 </Typography>
               </Card>

                                {/* Expert Craftsmanship */}
                 <Card sx={{ 
                   width: '100%', 
                   height: 180, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: 2,
                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                 transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                 cursor: 'pointer',
                 '&:hover': {
                   transform: 'translateY(-8px) scale(1.05)',
                   boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                   '& .icon': {
                     transform: 'rotate(360deg) scale(1.2)',
                   },
                   '& .title': {
                     color: '#d32f2f',
                   },
                 },
               }}>
                 <CheckCircle 
                   className="icon"
                   sx={{ 
                     color: 'primary.main', 
                     mb: 1, 
                     fontSize: '2rem',
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem', transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                   Expert Craftsmanship
                 </Typography>
                 <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.3, fontSize: '0.8rem' }}>
                   Skilled artisans handcraft each seat with precision.
                 </Typography>
               </Card>

                                {/* Comprehensive Warranty */}
                 <Card sx={{ 
                   width: '100%', 
                   height: 180, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: 2,
                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                 transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                 cursor: 'pointer',
                 '&:hover': {
                   transform: 'translateY(-8px) scale(1.05)',
                   boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                   '& .icon': {
                     transform: 'rotate(360deg) scale(1.2)',
                   },
                   '& .title': {
                     color: '#d32f2f',
                   },
                 },
               }}>
                 <CheckCircle 
                   className="icon"
                   sx={{ 
                     color: 'primary.main', 
                     mb: 1, 
                     fontSize: '2rem',
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem', transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                   Comprehensive Warranty
                 </Typography>
                 <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.3, fontSize: '0.8rem' }}>
                   We stand behind our work with full warranty.
                 </Typography>
               </Card>

                                {/* Professional Installation */}
                 <Card sx={{ 
                   width: '100%', 
                   height: 180, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: 2,
                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                 transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                 cursor: 'pointer',
                 '&:hover': {
                   transform: 'translateY(-8px) scale(1.05)',
                   boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                   '& .icon': {
                     transform: 'rotate(360deg) scale(1.2)',
                   },
                   '& .title': {
                     color: '#d32f2f',
                   },
                 },
               }}>
                 <CheckCircle 
                   className="icon"
                   sx={{ 
                     color: 'primary.main', 
                     mb: 1, 
                     fontSize: '2rem',
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem', transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                   Professional Installation
                 </Typography>
                 <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.3, fontSize: '0.8rem' }}>
                   Expert installation and setup for optimal performance.
                 </Typography>
               </Card>

                                {/* Ongoing Support */}
                 <Card sx={{ 
                   width: '100%', 
                   height: 180, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: 2,
                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                 transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                 cursor: 'pointer',
                 '&:hover': {
                   transform: 'translateY(-8px) scale(1.05)',
                   boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                   '& .icon': {
                     transform: 'rotate(360deg) scale(1.2)',
                   },
                   '& .title': {
                     color: '#d32f2f',
                   },
                 },
               }}>
                 <CheckCircle 
                   className="icon"
                   sx={{ 
                     color: 'primary.main', 
                     mb: 1, 
                     fontSize: '2rem',
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem', transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                   Ongoing Support
                 </Typography>
                 <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.3, fontSize: '0.8rem' }}>
                   We&apos;re here for you even after purchase.
                 </Typography>
               </Card>
             </Box>
           </Box>
         </Container>
       </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <MotionTypography 
              variant="h3" 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Ready to Experience Superior Comfort?
            </MotionTypography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Start customizing your perfect seat today with our interactive 3D configurator
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                label="Start Customizing"
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontSize: '1.1rem',
                  px: 3,
                  py: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
                onClick={() => window.location.href = '/custom-seats'}
              />
              <Chip
                label="Contact Us"
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontSize: '1.1rem',
                  px: 3,
                  py: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
                onClick={() => window.location.href = '/contact'}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage; 