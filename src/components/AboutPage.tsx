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
          backgroundImage: 'url(../TruckImages/Seatset.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
          textAlign: 'center',
          position: 'relative',
          mx: { xs: 2, md: 4 },
          my: { xs: 2, md: 4 },
          borderRadius: { xs: '16px', md: '24px' },
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'heroPulse 3s ease-in-out infinite',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(211, 47, 47, 0.3) 100%)',
            zIndex: 1,
            animation: 'gradientShift 4s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            right: '-50%',
            bottom: '-50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            zIndex: 1,
            animation: 'lightSweep 6s ease-in-out infinite',
          },
          '@keyframes heroPulse': {
            '0%, 100%': {
              transform: 'scale(1)',
            },
            '50%': {
              transform: 'scale(1.02)',
            },
          },
          '@keyframes gradientShift': {
            '0%, 100%': {
              opacity: 0.8,
            },
            '50%': {
              opacity: 0.95,
            },
          },
       
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              mb: 3,
              animation: 'textGlow 2s ease-in-out infinite',
              textShadow: '0 0 20px rgba(255,255,255,0.5)',
              '@keyframes textGlow': {
                '0%, 100%': {
                  textShadow: '0 0 20px rgba(255,255,255,0.5)',
                },
                '50%': {
                  textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 40px rgba(211, 47, 47, 0.6)',
                },
              },
            }}
          >
            About Superior Seats
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              opacity: 0.9,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 3.8,
              animation: 'fadeInUp 1s ease-out 0.5s both',
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                '100%': {
                  opacity: 0.9,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            Crafting the perfect seat for every driver, ensuring comfort meets quality
          </Typography>
        </Container>
      </Box>

      {/* Company Stats */}
      <Box sx={{ 
        py: { xs: 4, md: 6 }, 
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid 
            container 
            spacing={4} 
            sx={{ 
              maxWidth: 1200,
              justifyContent: 'center',
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4
            }}
          >
            {stats.map((stat, index) => (
              <Grid key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
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
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Story */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4 }}>
                Our Story
              </Typography>
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
                  height: 400,
                  background: 'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  Company Image Placeholder
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Values */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
            Our Values
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1400 }}>
              {values.map((value, index) => (
                <Card
                  key={index}
                  sx={{
                    width: 350,
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
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
            Our Process
          </Typography>
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
             {/* First Row - 3 steps */}
             <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
               {process.slice(0, 3).map((step, index) => (
                 <Card
                   key={index}
                   sx={{
                     width: 280,
                     height: 220,
                     textAlign: 'center',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     alignItems: 'center',
                     p: 3,
                     boxShadow: '0 4px 20px rgba(179, 21, 21, 0.1)',
                     cursor: 'pointer',
                     '&:hover': {
                       transform: 'translateY(1px) scale(0.95)',
                       boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                       '& .icon': {
                         transform: 'rotate(360deg) scale(0.95)',
                       },
                       '& .title': {
                         color: '#d32f2f',
                       },
                     },
                   }}
                 >
                   <Chip
                     label={step.step}
                     sx={{
                       backgroundColor: 'primary.main',
                       color: 'white',
                       fontSize: '1rem',
                       fontWeight: 'bold',
                       mb: 2,
                       width: 45,
                       height: 45,
                       borderRadius: '50%',
                     }}
                   />
                   <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.1rem' }}>
                     {step.title}
                   </Typography>
                   <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.9rem' }}>
                     {step.description}
                   </Typography>
                 </Card>
               ))}
             </Box>
             
             {/* Second Row - 2 steps */}
             <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
               {process.slice(3, 5).map((step, index) => (
                 <Card
                   key={index + 3}
                   sx={{
                     width: 320,
                     height: 220,
                     textAlign: 'center',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     alignItems: 'center',
                     p: 3,
                     boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                     cursor: 'pointer',
                     '&:hover': {
                       transform: 'translateY(-4px) scale(0.9)',
                       boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                       '& .icon': {
                         transform: 'rotate(360deg) scale(0.9)',
                       },
                       '& .title': {
                         color: '#d32f2f',
                       },
                     },
                   }}
                 >
                   <Chip
                     label={step.step}
                     sx={{
                       backgroundColor: 'primary.main',
                       color: 'white',
                       fontSize: '1rem',
                       fontWeight: 'bold',
                       mb: 2,
                       width: 45,
                       height: 45,
                       borderRadius: '50%',
                     }}
                   />
                   <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.1rem' }}>
                     {step.title}
                   </Typography>
                   <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.9rem' }}>
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
           <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
             Why Choose Superior Seats?
           </Typography>
           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1400 }}>
               {/* Custom Fit Design */}
               <Card sx={{ 
                 width: 200, 
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
                 width: 200, 
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
                 width: 200, 
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
                 width: 200, 
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
                 width: 200, 
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
                 width: 200, 
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
                   We're here for you even after purchase.
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
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
              Ready to Experience Superior Comfort?
            </Typography>
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
                onClick={() => window.location.href = '/customize-your-seat'}
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
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage; 