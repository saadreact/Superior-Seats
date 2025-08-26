'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Instagram } from '@mui/icons-material';
import Link from 'next/link';

const MotionBox = motion.create(Box);

interface FooterProps {
  // Add any props if needed in the future
}

const Footer: React.FC<FooterProps> = () => {
  const theme = useTheme();
  
  return (
    <>
      {/* Cool Footer Section */}
                    <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                                                                   sx={{
                    py: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                                       background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: theme.palette.primary.contrastText || 'white',
                   backdropFilter: 'blur(10px)',
                   borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                   position: 'sticky',
                   bottom: 0,
                   zIndex: 1000,
                 }}
              >
                                 <Container maxWidth={false} disableGutters sx={{ width: '85%', mx: 'auto' }}>
                  {/* Main Footer Content */}
                                                                          <Box sx={{
                     display: 'flex',
                     flexDirection: { xs: 'column', md: 'row' },
                     justifyContent: 'space-between',
                     alignItems: { xs: 'center', md: 'flex-start' },
                     gap: { xs: 4, md: 0 },
                     px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                     width: '100%',
                    }}>
{/* Company Info */}
 <Box
   sx={{
     textAlign: { xs: 'center', md: 'left' },
     display: 'flex',
     flexDirection: 'column',
     gap: 2,
   }}
 >
     <Typography
     variant="h3"
     sx={{
       fontWeight: 'bold',
       fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1rem', lg: '1.5rem' ,xl: '2rem'},
       color: 'white',
       textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
       mb: 1,
     }}
   >
     Superior Seating LLC
   </Typography>

   {/* Quote */}
   <Typography
     variant="body2"
     sx={{
       opacity: 0.9,
       fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
       lineHeight: 1.4,
       fontStyle: 'italic',
       color: 'white',
       textAlign: { xs: 'center', md: 'left' },
       maxWidth: '300px'
     }}
   >
           &ldquo;Premium truck, RV, and van seating with <br /> custom options and superior craftsmanship&rdquo;
   </Typography>
 </Box>



                                         {/* Quick Links */}
                     <Box sx={{
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: { xs: 'center', md: 'flex-start' },
                       gap: 2,
                     }}>
                                             <Typography variant="h3" sx={{
                         fontWeight: 'bold',
                         fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1rem', lg: '1.3rem' ,xl: '2rem'},
                         color: 'white',
                         textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                         textAlign: { xs: 'center', md: 'left' }
                       }}>
                         Quick Links
                       </Typography>
                                             <Box sx={{
                         display: 'flex',
                         flexDirection: 'column',
                         gap: 1.5,
                         alignItems: { xs: 'center', md: 'flex-start' }
                       }}>
                        <Link href="/privacy-policy" style={{ textDecoration: 'none', outline: 'none' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
                              opacity: 0.95,
                              fontWeight: 550,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              outline: 'none',
                              '&:focus': {
                                outline: 'none',
                              },
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
                        <Link href="/terms-of-service" style={{ textDecoration: 'none', outline: 'none' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
                              opacity: 0.95,
                              fontWeight: 550,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              outline: 'none',
                              '&:focus': {
                                outline: 'none',
                              },
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
                        <Link href="/warranty" style={{ textDecoration: 'none', outline: 'none' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
                              opacity: 0.95,
                              fontWeight: 550,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              outline: 'none',
                              '&:focus': {
                                outline: 'none',
                              },
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

                                                                                   {/* Contact */}
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        gap: 2,
                      }}>
                        <Typography variant="h3" sx={{
                          fontWeight: 'bold',
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1rem', lg: '1.3rem' ,xl: '2rem'},
                          color: 'white',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                          textAlign: { xs: 'center', md: 'left' }
                        }}>
                          Contact
                        </Typography>
                                                 <Box sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 1.5,
                           alignItems: { xs: 'center', sm: 'flex-start' }
                         }}>
                           <Typography
                            
                             sx={{
                               opacity: 0.95,
                               fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
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
                            
                             sx={{
                               opacity: 0.95,
                               fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
                               lineHeight: 1.3,
                               mb: 0.5,
                               fontWeight: 550,
                               color: 'white'
                             }}
                           >
                             P. 574-389-9011
                           </Typography>
                           <Typography
                           
                             sx={{
                               opacity: 0.99,
                               fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
                               lineHeight: 1.3,
                               mb: 0.5,
                               fontWeight: 600,
                               color: 'white'
                             }}
                           >
                             info@superiorseatingllc.com
                           </Typography>
                         </Box>
                                             </Box>

                                                                                                           {/* Office Hours */}
                       <Box sx={{
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: { xs: 'center', md: 'flex-start' },
                         gap: 2,
                                                   marginLeft: { md: '-2rem', lg: '-2.5rem', xl: '-3rem' },
                       }}>
                        <Typography variant="h3" sx={{
                          fontWeight: 'bold',
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1rem', lg: '1.3rem' ,xl: '2rem'},
                          color: 'white',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                          textAlign: { xs: 'center', md: 'left' }
                        }}>
                                                     Office Hours
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                          alignItems: { xs: 'center', sm: 'flex-start' }
                        }}>
                          <Typography
                            sx={{
                              opacity: 0.95,
                              fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
                              lineHeight: 1.3,
                              fontWeight: 550,
                              color: 'white',
                              mb: 0.25,
                            }}
                          >
                            Tuesday - Friday
                          </Typography>
                          <Typography
                            sx={{
                              opacity: 0.95,
                              fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem', lg: '0.89rem', xl: '1rem' },
                              lineHeight: 1.3,
                              fontWeight: 550,
                              color: 'white',
                            }}
                          >
                            7:00AM - 5:00PM
                          </Typography>
                        </Box>
                      </Box>

                                                                                                                                                                      {/* Social Media */}
           <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: { xs: 'center', md: 'flex-start' },
                          gap: 2,
                      //  border: '1px solid white'
                          
                        }}>
                          {/* Follow Us Text */}
                          <Typography variant="h3" sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1rem', lg: '1.3rem' ,xl: '2rem'},
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            textAlign: { xs: 'center', md: 'left' }
                          }}>
                            Follow Us
                          </Typography>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                          alignItems: { xs: 'center', md: 'flex-start' }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            gap: { xs: 2, sm: 2.5 },
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            flexWrap: 'wrap',
                          }}>
                                                   <IconButton
                             component="a"
                             href="https://www.facebook.com/people/Superior-Seating-LLC/61576399660914/"
                             target="_blank"
                             rel="noopener noreferrer"
                                                           sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.5)',
                                borderRadius: '12px',
                                '&:hover': {
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  transform: 'scale(1.05) translateY(-1px)',
                                  boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
                                  border: '1px solid rgba(255,255,255,0.3)',
                                },
                                transition: 'all 0.3s ease',
                                width: { xs: '48px', sm: '48px', md: '42px' ,lg: '45px', xl: '50px'},
                                height: { xs: '48px', sm: '48px', md: '42px' ,lg: '45px', xl: '50px'},
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
                                 backgroundColor: 'rgba(255,255,255,0.1)',
                                 backdropFilter: 'blur(10px)',
                                 border: '1px solid rgba(255, 255, 255, 0.5)',
                                 borderRadius: '12px',
                                 '&:hover': {
                                   backgroundColor: 'rgba(255,255,255,0.2)',
                                   transform: 'scale(1.05) translateY(-1px)',
                                   boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
                                   border: '1px solid rgba(255,255,255,0.3)',
                                 },
                                 transition: 'all 0.3s ease',
                                 width: { xs: '48px', sm: '48px', md: '42px' ,lg: '45px', xl: '50px'},
                                 height: { xs: '48px', sm: '48px', md: '42px' ,lg: '45px', xl: '50px'},
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
                                 backgroundColor: 'rgba(255,255,255,0.1)',
                                 backdropFilter: 'blur(10px)',
                                 border: '1px solid rgba(255,255,255,0.5)',
                                 borderRadius: '12px',
                                 '&:hover': {
                                   backgroundColor: 'rgba(255,255,255,0.2)',
                                   transform: 'scale(1.05) translateY(-1px)',
                                   boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
                                   border: '1px solid rgba(255,255,255,0.3)',
                                 },
                                 transition: 'all 0.3s ease',
                                 width: { xs: '48px', sm: '48px', md: '42px' ,lg: '45px', xl: '50px'},
                                 height: { xs: '48px', sm: '48px', md: '42px' ,lg: '45px', xl: '50px'},
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
                  </Box>

                                     {/* Copyright */}
                   <Box sx={{
                                           mt: { xs: 2.5, md: 3 },
                                           pt: { xs: 1.5, md: 2 },
                     borderTop: '1px solid rgba(255,255,255,0.15)',
                     textAlign: 'center',
                                           px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
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