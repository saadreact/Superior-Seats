'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Close } from '@mui/icons-material';

const MotionBox = motion.create(Box);

interface FooterProps {
  showPrivacyModal?: boolean;
  onPrivacyModalClose?: () => void;
}

const Footer: React.FC<FooterProps> = ({ showPrivacyModal = false, onPrivacyModalClose }) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  const handleClosePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
    if (onPrivacyModalClose) {
      onPrivacyModalClose();
    }
  };

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
                }}
              >
                <Container maxWidth="lg">
                  {/* Main Footer Content */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: { xs: 2, md: 4 }
                  }}>
                    {/* Company Info */}
                    <Box sx={{
                      textAlign: { xs: 'center', md: 'left' },
                      flex: { md: '1' }
                    }}>
                      <Typography variant="h3" sx={{
                        fontWeight: 'bold',
                        mb: 0.5,
                        fontSize: { xs: '1rem', sm: '1.125rem' , md: '1.25rem', lg: '1.5rem'},
                        background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        Superior Seating LLC
                      </Typography>
                      <Typography variant="body1" sx={{
                        opacity: 0.9,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        mb: 0.5,
                        lineHeight: 1.4
                      }}>
                        Crafting comfort, one seat at a time
                      </Typography>
                      <Typography variant="body2" sx={{
                        opacity: 0.7,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.3,
                        mb: 0.5
                      }}>
                        21468 C Street<br />
                        Elkhart, IN 46516
                      </Typography>
                      <Typography variant="body2" sx={{
                        opacity: 0.7,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.3,
                        mb: 0.5
                      }}>
                        P. 574-389-9011
                      </Typography>
                      <Typography variant="body2" sx={{
                        opacity: 0.7,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.3,
                        mb: 0.5
                      }}>
                        info@superiorseatingllc.com
                      </Typography>
                      <Typography variant="body2" sx={{
                        opacity: 0.7,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.3,
                        fontWeight: 'bold',
                        mt: 1
                      }}>
                        Office Hours
                      </Typography>
                      <Typography variant="body2" sx={{
                        opacity: 0.7,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.3
                      }}>
                        Tuesday to Friday<br />
                        7:00am to 5:00pm
                      </Typography>
                    </Box>

                    {/* Quick Links */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'center', md: 'flex-start' },
                      flex: { md: '1' }
                    }}>
                                             <Typography variant="h3" sx={{
                         fontWeight: 'bold',
                         mb: 0.5,
                         fontSize: { xs: '1rem', sm: '1.125rem' , md: '1.25rem', lg: '1.5rem'},
                         textAlign: { xs: 'center', md: 'left' }
                       }}>
                         Quick Links
                       </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        alignItems: { xs: 'center', md: 'flex-start' }
                      }}>
                        <Typography
                          component="a"
                          href="#"
                          onClick={handlePrivacyClick}
                                                     sx={{
                             color: 'white',
                             textDecoration: 'none',
                             fontSize: { xs: '0.875rem', sm: '1rem' },
                             opacity: 0.8,
                             transition: 'all 0.3s ease',
                             cursor: 'pointer',
                             '&:hover': {
                               opacity: 1,
                               textDecoration: 'underline',
                               transform: 'translateX(5px)'
                             }
                           }}
                        >
                          Privacy Policy
                        </Typography>
                                                 <Typography
                           component="a"
                           href="/terms-of-service"
                           sx={{
                             color: 'white',
                             textDecoration: 'none',
                             fontSize: { xs: '0.875rem', sm: '1rem' },
                             opacity: 0.8,
                             transition: 'all 0.3s ease',
                             '&:hover': {
                               opacity: 1,
                               textDecoration: 'underline',
                               transform: 'translateX(5px)'
                             }
                           }}
                         >
                           Terms of Service
                         </Typography>
                                                 <Typography
                           component="a"
                           href="/warranty"
                           sx={{
                             color: 'white',
                             textDecoration: 'none',
                             fontSize: { xs: '0.875rem', sm: '1rem' },
                             opacity: 0.8,
                             transition: 'all 0.3s ease',
                             '&:hover': {
                               opacity: 1,
                               textDecoration: 'underline',
                               transform: 'translateX(5px)'
                             }
                           }}
                         >
                           Warranty
                         </Typography>
                                                 <Typography
                           component="a"
                           href="/contact"
                           sx={{
                             color: 'white',
                             textDecoration: 'none',
                             fontSize: { xs: '0.875rem', sm: '1rem' },
                             opacity: 0.8,
                             transition: 'all 0.3s ease',
                             '&:hover': {
                               opacity: 1,
                               textDecoration: 'underline',
                               transform: 'translateX(5px)'
                             }
                           }}
                         >
                           Contact Us
                         </Typography>
                      </Box>
                    </Box>

                    {/* Social Media */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'center', md: 'flex-start' },
                      flex: { md: '1' }
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
                        gap: 2,
                        justifyContent: 'center'
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
                               width: { xs: 48, sm: 52 },
                               height: { xs: 48, sm: 52 },
                             
                             }}
                           >
                          <Box component="span" sx={{
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            fontWeight: 'bold'
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
                             }}
                           >
                          <Box component="span" sx={{
                            fontSize: { xs: '1.5rem', sm: '1.75rem' }
                          }}>📷</Box>
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
                             }}
                           >
                          <Box component="span" sx={{
                            fontSize: { xs: '1.5rem', sm: '1.75rem' }
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
                       opacity: 0.8,
                       fontSize: { xs: '0.75rem', sm: '0.875rem' },
                       fontWeight: 500
                     }}>
                       © 2024 Superior Seating LLC. All rights reserved.
                     </Typography>
                   </Box>
                </Container>
              </MotionBox>

      {/* Privacy Policy Modal */}
      <Dialog
        open={isPrivacyModalOpen}
        onClose={handleClosePrivacyModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '80vh',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#DA291C',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            Privacy Policy
          </Typography>
          <IconButton
            onClick={handleClosePrivacyModal}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#DA291C' }}>
              Your Privacy Matters
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              At Superior Seating LLC, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 'bold' }}>
              Information We Collect
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              We collect information you provide directly to us, such as when you:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Contact us through our website forms
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Request quotes or place orders
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Sign up for our newsletter
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Create an account on our platform
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 'bold' }}>
              How We Use Your Information
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              We use the information we collect to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Provide and improve our services
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Process your orders and payments
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Communicate with you about your orders
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Send you marketing communications (with your consent)
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 'bold' }}>
              Information Sharing
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 'bold' }}>
              Data Security
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 'bold' }}>
              Your Rights
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              You have the right to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Access your personal information
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Correct inaccurate information
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Request deletion of your information
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Opt out of marketing communications
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              Superior Seating LLC<br />
              21468 C Street, Elkhart, IN 46516<br />
              Email: privacy@superiorseating.com<br />
              Phone: (555) 123-4567
            </Typography>

            <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic', color: 'text.secondary' }}>
              This Privacy Policy was last updated on January 1, 2024.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f5f5f5' }}>
          <Button
            onClick={handleClosePrivacyModal}
            variant="contained"
            sx={{
              backgroundColor: '#DA291C',
              '&:hover': {
                backgroundColor: '#B71C1C'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Footer; 