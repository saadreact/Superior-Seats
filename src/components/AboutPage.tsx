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
          height: { xs: '50vh', sm: '60vh', md: '70vh' },
          backgroundImage: 'url(../TruckImages/Seatset.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          mt: { xs: '56px', sm: '64px', md: '64px' },
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
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3.5rem' },
              fontWeight: 'bold',
              mb: { xs: 1, sm: 2 },
            }}
          >
            Superior Seating LLc
          </MotionTypography>
          <MotionTypography
            variant="h1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
              fontSize: { xs: '1.5rem', sm: '2.0rem', md: '2.5rem' },
              fontWeight: 'bold',
              mb: { xs: 1, sm: 2 },
            }}
          >
            Sit Better
          </MotionTypography>
          <MotionTypography
            variant="h5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
              mb: { xs: 2, sm: 3 },
              opacity: 0.9,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
            }}
          >
            Crafting the perfect seat for every driver, ensuring comfort meets quality
          </MotionTypography>
        </Container>
      </Box>

      {/* Company Stats */}
      <Box sx={{ 
        py: { xs: 3, sm: 4, md: 6 }, 
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, sm: 2, md: 4 },
            maxWidth: 1200,
            width: '100%',
            justifyContent: 'center'
          }}>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ 
                  textAlign: 'center', 
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  height: { xs: 150, sm: 180, md: 200 },
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
                      mb: { xs: 1, sm: 1.5, md: 2 },
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
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
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
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
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' },
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
      <Box sx={{ 
        md: { xs: 2, sm: 3, md: 7, lg: 5 }, 
        px: { xs: 0.5, sm: 1.5, md: 2.5, lg: 3.5 },
        backgroundColor: '#fafafa', 
        backgroundImage: {
          xs: 'url(/Gallery/Patriotism/pngwing.com.png)',
          sm: 'url(/Gallery/Patriotism/pngwing.com.png)',
          md: 'url(/Gallery/Patriotism/pngwing.com.png)',
          lg: 'url(/Gallery/Patriotism/pngwing.com.png)',
        }, 
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
        minHeight: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
          zIndex: 1,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: { xs: 1.5, sm: 2.5, md: 4, lg: 5 }, alignItems: 'center' }}>
            <Box sx={{ 
              textAlign: 'center', 
              maxWidth: { xs: '92%', sm: '88%', md: 800 }, 
              mx: 'auto',
              px: { xs: 0.25, sm: 0.75, md: 1.5, lg: 0 },
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              overflow: 'hidden'
            }}>
             {/* Section Title */}
    <MotionTypography 
      variant="h3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        mb: { xs: 1.5, sm: 2, md: 3 },
        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
        mt: { xs: 1, sm: 3, md: 1.5, lg: 2 }
      }}
    >
      Our Story
    </MotionTypography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: { xs: 1, sm: 2, md: 2.5 }, 
                  color: 'text.secondary', 
                  lineHeight: { xs: 1.1, sm: 1.6, md: 1.8 },
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem', lg: '1.1rem' },
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxWidth: '100%'
                }}
              >
              At Superior Seating, every seat begins with your vision. We combine cutting-edge technology, timeless craftsmanship, and a deep passion for design to deliver seating solutions that are as unique as the people who use them.
              </Typography>
                             <Typography 
                 variant="body1" 
                 sx={{ 
                   mb: { xs: 1, sm: 1.5, md: 2, lg: 3 }, 
                   color: 'text.secondary', 
                   lineHeight: { xs: 1.2, sm: 1.4, md: 1.6, lg: 1.7 },
                   fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '1rem' },
                   wordWrap: 'break-word',
                   overflowWrap: 'break-word',
                   hyphens: 'auto',
                   maxWidth: '100%',
                   pb: { xs: 0.5, sm: 1 }
                 }}
               >
               Driven by comfort, defined by style, and tailored to your exact needs, our custom seats are built to enhance every journey—whether it&apos;s in a Semitruck, Sprinter, RV, or limousine. With over 20 signature styles and endless layout possibilities, our team works closely with you to bring your ideas to life using only the highest-quality materials and advanced manufacturing techniques.
               </Typography>
               <Typography 
                 variant="body1" 
                 sx={{ 
                   color: 'text.secondary',
                    mb: { xs: 1, sm: 1.3, md: 2, lg: 3 },  
                   lineHeight: { xs: 1.2, sm: 1.4, md: 1.4, lg: 1.5 },
                   fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '1rem' },
                   wordWrap: 'break-word',
                   overflowWrap: 'break-word',
                   hyphens: 'auto',
                   maxWidth: '100%',
                   pb: { xs: 0.5, sm: 1 }
                 }}
               >
               From start to finish, we focus on what matters most: exceptional comfort, personalized design, and a seamless experience that puts the customer first. Discover how your vision can become reality—one seat at a time.
               </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Our Values */}
      <Box sx={{ py: { xs: 1.5, sm: 2, md: 3.5 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <MotionTypography 
            variant="h3" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{ 
              textAlign: 'center', 
              fontWeight: 'bold', 
              mb: { xs: 2, sm: 2.5, md: 2 },
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' }
            }}
          >
            Our Values
          </MotionTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 1.5, sm: 2, md: 3 },
             
              maxWidth: 1200,
              width: '100%',
              justifyContent: 'center'
            }}>
              {values.map((value, index) => (
                                 <Card
                   key={index}
                   sx={{
                     width: '100%',
                     height: { xs: 130, sm: 135, md: 145 },
                     textAlign: 'center',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     alignItems: 'center',
                     p: { xs: 0.75, sm: 1, md: 1.5 },
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
                      mb: { xs: 0, sm: 0.25, md: 0 },
                      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
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
                      mb: { xs: 0.25, sm: 0.5 }, 
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
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
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
                      px: { xs: 0.25, sm: 0.5 },
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
<Box sx={{ py: { xs: 2, sm: 3, md: 3.5}, backgroundColor: '#fafafa' }}>
  <Container maxWidth="lg">
    
    {/* Section Title */}
    <MotionTypography 
      variant="h3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        mb: { xs: 1.5, sm: 2, md: 3.5 },
        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' }
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
          gap: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: 1400,
        }}
      >
        {process.map((step, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              minHeight: { xs: 220, sm: 250, md: 280 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              textAlign: 'center',
              p: { xs: 2, sm: 2.5, md: 3 },
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
                position: 'relative',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#d32f2f',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                mb: { xs: 1.5, sm: 2 },
                border: '3px solid white',
                boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-6px',
                  left: '-6px',
                  right: '-6px',
                  bottom: '-6px',
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
                fontWeight: 'bold',
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
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
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                lineHeight: 1.5,
                flexGrow: 1,
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
       <Box sx={{ py: { xs: 2, sm: 3, md: 4, lg: 5 }, backgroundColor: 'white' }}>
         <Container maxWidth="lg">
           <MotionTypography 
             variant="h3" 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: false, amount: 0.1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             sx={{ 
               textAlign: 'center', 
               fontWeight: 'bold', 
               mb: { xs: 3, sm: 4, md: 6 },
               fontSize: { xs: '1.6rem', sm: '2rem', md: '3rem' }
             }}
           >
             Why Choose Superior Seats?
           </MotionTypography>
                       <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)', 
                  lg: 'repeat(6, 1fr)' 
                },
                gap: { xs: 2, sm: 3, md: 4 },
                maxWidth: 1400,
                width: '100%',
                justifyContent: 'center'
              }}>
                                 {/* Custom Fit Design */}
                 <Card sx={{ 
                   width: '100%', 
                   height: { xs: 150, sm: 160, md: 180 }, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: { xs: 1.5, sm: 2 },
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
                     mb: { xs: 0.5, sm: 1 }, 
                     fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ 
                   fontWeight: 'bold', 
                   mb: { xs: 0.5, sm: 1 }, 
                   fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' }, 
                   transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                 }}>
                   Custom Fit Design
                 </Typography>
                 <Typography variant="body2" sx={{ 
                   color: 'text.secondary', 
                   lineHeight: 1.3, 
                   fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' } 
                 }}>
                   Designed specifically for your vehicle and body type.
                 </Typography>
               </Card>

                                {/* Premium Materials */}
                 <Card sx={{ 
                   width: '100%', 
                   height: { xs: 150, sm: 160, md: 180 }, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: { xs: 1.5, sm: 2 },
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
                     mb: { xs: 0.5, sm: 1 }, 
                     fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ 
                   fontWeight: 'bold', 
                   mb: { xs: 0.5, sm: 1 }, 
                   fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' }, 
                   transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                 }}>
                   Premium Materials
                 </Typography>
                 <Typography variant="body2" sx={{ 
                   color: 'text.secondary', 
                   lineHeight: 1.3, 
                   fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' } 
                 }}>
                   Highest quality leather, fabric, and materials.
                 </Typography>
               </Card>

                                {/* Expert Craftsmanship */}
                 <Card sx={{ 
                   width: '100%', 
                   height: { xs: 150, sm: 160, md: 180 }, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: { xs: 1.5, sm: 2 },
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
                     mb: { xs: 0.5, sm: 1 }, 
                     fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ 
                   fontWeight: 'bold', 
                   mb: { xs: 0.5, sm: 1 }, 
                   fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' }, 
                   transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                 }}>
                   Expert Craftsmanship
                 </Typography>
                 <Typography variant="body2" sx={{ 
                   color: 'text.secondary', 
                   lineHeight: 1.3, 
                   fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' } 
                 }}>
                   Skilled artisans handcraft each seat with precision.
                 </Typography>
               </Card>

                                {/* Comprehensive Warranty */}
                 <Card sx={{ 
                   width: '100%', 
                   height: { xs: 150, sm: 160, md: 180 }, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: { xs: 1.5, sm: 2 },
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
                     mb: { xs: 0.5, sm: 1 }, 
                     fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ 
                   fontWeight: 'bold', 
                   mb: { xs: 0.5, sm: 1 }, 
                   fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' }, 
                   transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                 }}>
                   Comprehensive Warranty
                 </Typography>
                 <Typography variant="body2" sx={{ 
                   color: 'text.secondary', 
                   lineHeight: 1.3, 
                   fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' } 
                 }}>
                   We stand behind our work with full warranty.
                 </Typography>
               </Card>

               {/* Professional Installation */}
                 <Card sx={{ 
                   width: '100%', 
                   height: { xs: 150, sm: 160, md: 180 }, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: { xs: 1.5, sm: 2 },
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
                     mb: { xs: 0.5, sm: 1 }, 
                     fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ 
                   fontWeight: 'bold', 
                   mb: { xs: 0.5, sm: 1 }, 
                   fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' }, 
                   transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                 }}>
                   Professional Installation
                 </Typography>
                 <Typography variant="body2" sx={{ 
                   color: 'text.secondary', 
                   lineHeight: 1.3, 
                   fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' } 
                 }}>
                   Expert installation and setup for optimal performance.
                 </Typography>
               </Card>

                                {/* Ongoing Support */}
                 <Card sx={{ 
                   width: '100%', 
                   height: { xs: 150, sm: 160, md: 180 }, 
                   textAlign: 'center', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   p: { xs: 1.5, sm: 2 },
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
                     mb: { xs: 0.5, sm: 1 }, 
                     fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                     transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   }} 
                 />
                 <Typography className="title" variant="h6" sx={{ 
                   fontWeight: 'bold', 
                   mb: { xs: 0.5, sm: 1 }, 
                   fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' }, 
                   transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                 }}>
                   Ongoing Support
                 </Typography>
                 <Typography variant="body2" sx={{ 
                   color: 'text.secondary', 
                   lineHeight: 1.3, 
                   fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' } 
                 }}>
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