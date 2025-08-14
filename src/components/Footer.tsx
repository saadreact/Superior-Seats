'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Instagram } from '@mui/icons-material';
import Link from 'next/link';

const MotionBox = motion.create(Box);

interface FooterProps {
  // Add any props if needed in the future
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <>
      {/* Cool Footer Section */}
                    <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                sx={{
                  py: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                  background: 'linear-gradient(135deg, #DA291C 0%, #B71C1C 100%)', // Pantone 485C gradient
                  color: 'white',
                  //py:1,
                  
                }}
              >
                <Container maxWidth="lg">
                  {/* Main Footer Content */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: { xs: 3, md: 0 },
                  }}>
{/* Company Info */}
<Box
  sx={{
    textAlign: { xs: 'center', md: 'left' },
    flex: { md: '1' }
  }}
>
  <Typography
    variant="h1"
    sx={{
      fontWeight: 'bold',
      mb: 0.5,
      fontSize: {
        xs: '1rem',
        sm: '1.125rem',
        md: '1.25rem',
        lg: '1.5rem'
      },
      background: 'linear-gradient(45deg, #ffffff 30%,rgb(255, 255, 255) 90%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}
  >
    Superior Seating LLC
  </Typography>

  {/* Address + Office Hours in parallel */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 4 },
      py: { xs: 1.5, sm: 1 },
      alignItems: { xs: 'center', sm: 'flex-start' },
      justifyContent: 'flex-start'
    }}
  >
    {/* Address */}
    <Box>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.95,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          lineHeight: 1.3,
          mb: 0.5,
          fontWeight: 550,
          color: 'white'
        }}
      >
        21468 C Street<br />
        Elkhart, IN 46516
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.95,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          lineHeight: 1.3,
          mb: 0.5,
          fontWeight: 550,
          color: 'white'
        }}
      >
        P. 574-389-9011
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.99,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          lineHeight: 1.3,
          mb: 0.5,
          fontWeight: 600,
          color: 'white'
        }}
      >
        info@superiorseatingllc.com
      </Typography>
    </Box>

    {/* Office Hours */}
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: { xs: 'center', sm: 'flex-start' }
    }}>
      <Typography
        variant="body2"
        sx={{
          opacity: 1,
          fontSize: { xs: '0.75rem', sm: '0.875rem' ,md: '0.875rem', lg: '1rem'},
          lineHeight: 1.3,
          fontWeight: 'bold',
          mb: 0.5,
          color: 'white'
        }}
      >
        Office Hours
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.95,
          fontSize: { xs: '0.75rem', sm: '0.875rem'},
          lineHeight: 1.3,
          fontWeight: 550,
          color: 'white',
          mb: 0.25,
             minWidth: '150px',
        }}
      >
        Tuesday - Friday
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.95,
          fontSize: { xs: '0.75rem', sm: '0.875rem' ,},
          lineHeight: 1.3,
          fontWeight: 550,
          color: 'white',
          minWidth: '200px'
        }}
      >
         7:00AM - 5:00PM
      </Typography>
    </Box>
  </Box>
</Box>



                    {/* Quick Links */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'center', md: 'flex-start' },
                      flex: { md: '1' },
                      ml: { xs: 0, md: 8 },
                    }}>
                                             <Typography variant="h3" sx={{
                         fontWeight: 'bold',
                         mb: 1,
                        
                         fontSize: { xs: '1rem', sm: '1.125rem' , md: '1.25rem', lg: '1.5rem'},
                         textAlign: { xs: 'center', md: 'left' }
                       }}>
                         Quick Links
                       </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1, md: 0.5 },
                        alignItems: { xs: 'center', md: 'flex-start' }
                      }}>
                        <Link href="/privacy-policy" style={{ textDecoration: 'none' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              opacity: 0.95,
                              fontWeight: 550,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 1,
                                textDecoration: 'none',
                                transform: 'scale(1.05) translateY(-2px)',
                                fontWeight: 600,
                               // boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
                                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)'
                              }
                            }}
                          >
                            Privacy Policy
                          </Typography>
                        </Link>
                        <Link href="/terms-of-service" style={{ textDecoration: 'none' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              opacity: 0.95,
                              fontWeight: 550,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 1,
                                textDecoration: 'none',
                                transform: 'scale(1.05) translateY(-2px)',
                                fontWeight: 600,
                             //   boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
                                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)'
                              }
                            }}
                          >
                            Terms of Service
                          </Typography>
                        </Link>
                        <Link href="/warranty" style={{ textDecoration: 'none' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              opacity: 0.95,
                              fontWeight: 550,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 1,
                                textDecoration: 'none',
                                transform: 'scale(1.05) translateY(-2px)',
                                fontWeight: 600,
                              //  boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
                                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)'
                              }
                            }}
                          >
                            Warranty
                          </Typography>
                        </Link>
                       
                      </Box>
                    </Box>

                    {/* Social Media */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'center', md: 'flex-start' },
                      flex: { md: '1' },
                    
                    }}>
                                             <Typography variant="h3" sx={{
                         fontWeight: 'bold',
                         mb: 1,
                         fontSize: { xs: '1rem', sm: '1.125rem' , md: '1.25rem', lg: '1.5rem'},
                         textAlign: { xs: 'center', md: 'left' }
                       }}>
                         Follow Us
                       </Typography>
                      <Box sx={{
                        display: 'flex',
                        gap: { xs: 1.5, sm: 2 },
                        justifyContent: 'center',
                        py: { xs: 1.5, sm: 1.2 },
                      }}>
                                                   <IconButton
                             component="a"
                             href="https://www.facebook.com/people/Superior-Seating-LLC/61576399660914/"
                             target="_blank"
                             rel="noopener noreferrer"
                             sx={{
                               color: 'white',
                               backgroundColor: 'rgba(255,255,255,0.15)',
                               backdropFilter: 'blur(10px)',
                               border: '1px solid rgba(255,255,255,0.2)',
                               '&:hover': {
                                 backgroundColor: 'rgba(255,255,255,0.25)',
                                 transform: 'scale(1.1) translateY(-2px)',
                                 boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
                               },
                               transition: 'all 0.3s ease',
                               width: { xs: 44, sm: 48, md: 52 },
                               height: { xs: 44, sm: 48, md: 52 },
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               p: 0
                             }}
                           >
                          <Box component="span" sx={{
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            lineHeight: 1,
                            textAlign: 'center',
                            position: 'relative',
                            top: '1px'
                          }}>f</Box>
                        </IconButton>

                                                                                                                                                                                                               <IconButton
                               component="a"
                               href="https://instagram.com"
                               target="_blank"
                               rel="noopener noreferrer"
                               sx={{
                                 color: 'white',
                                 backgroundColor: 'rgba(255,255,255,0.15)',
                                 backdropFilter: 'blur(10px)',
                                 border: '1px solid rgba(255,255,255,0.2)',
                                 '&:hover': {
                                   backgroundColor: 'rgba(255,255,255,0.25)',
                                   transform: 'scale(1.1) translateY(-2px)',
                                   boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
                                 },
                                 transition: 'all 0.3s ease',
                                 width: { xs: 48, sm: 52 },
                                 height: { xs: 48, sm: 52 },
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 p: 0
                               }}
                             >
                                                                                                                                                                                                                                       <Instagram sx={{
                                 fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center'
                               }} />
                          </IconButton>

                                                                                                                                                                                                               <IconButton
                               component="a"
                               href="https://youtube.com"
                               target="_blank"
                               rel="noopener noreferrer"
                               sx={{
                                 color: 'white',
                                 backgroundColor: 'rgba(255,255,255,0.15)',
                                 backdropFilter: 'blur(10px)',
                                 border: '1px solid rgba(255,255,255,0.2)',
                                 '&:hover': {
                                   backgroundColor: 'rgba(255,255,255,0.25)',
                                   transform: 'scale(1.1) translateY(-2px)',
                                   boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
                                 },
                                 transition: 'all 0.3s ease',
                                 width: { xs: 48, sm: 52 },
                                 height: { xs: 48, sm: 52 },
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 p: 0
                               }}
                             >
                            <Box component="span" sx={{
                              fontSize: { xs: '1.5rem', sm: '1.75rem' },
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                              lineHeight: 1,
                              textAlign: 'center',
                              position: 'relative',
                              top: '1px',
                              left: '1px'
                            }}>▶</Box>
                          </IconButton>

                        
                      </Box>
                    </Box>
                  </Box>

                                     {/* Copyright */}
                   <Box sx={{
                     mt: { xs: 1.5, md: 1.5 },
                     pt: { xs: 1.5, md: 1.5 },
                     borderTop: '1px solid rgba(255,255,255,0.2)',
                     textAlign: 'center'
                   }}>
                     <Typography variant="body2" sx={{
                       opacity: 0.95,
                       fontSize: { xs: '0.75rem', sm: '0.875rem' },
                       fontWeight: 500,
                       color: 'white'
                     }}>
                       © 2024 Superior Seating LLC. All rights reserved.
                     </Typography>
                   </Box>
                </Container>
              </MotionBox>
    </>
  );
};
export default Footer; 