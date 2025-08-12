'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
} from '@mui/material';
import { Person, Business, Send, Phone, Email, LocationOn, AccessTime } from '@mui/icons-material';
import { contactInfo, initialFormData, ContactFormData } from '@/data/ContactPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSectionCommon from './common/HeroSectionaCommon';

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Helper function to get icon component
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Phone,
      Email,
      LocationOn,
      AccessTime,
    };
    return icons[iconName] || Phone;
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate that company name is provided for wholesale customers
    if (formData.customerType === 'wholesale' && !formData.company.trim()) {
      alert('Company name is required for wholesale customers.');
      return;
    }
    
    console.log('Form submitted:', formData);
    setSnackbarOpen(true);
    setFormData(initialFormData);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
            <Header />
       <HeroSectionCommon
         title="Get In Touch"
         description="Contact us today for a free consultation and quote. We're here to help bring your vision to life."
         height={{
           xs: '18vh',
           sm: '20vh',
           md: '18vh',
           lg: '20vh'
          }}
           />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Contact Us' }
        ]}
      />
      

      {/* Contact Form */}
      <Box sx={{ py: { xs: 2, md: 2 }, backgroundColor: '#fafafa' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 2,
              color: 'text.primary',
            }}
          >
            Send Us a Message
          </Typography>
       
                                           <Card
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                borderRadius: { xs: 2, md: 3 },
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                border: '1px solid rgba(211, 47, 47, 0.08)',
                maxWidth: { xs: '100%', sm: 500, md: 600 },
                mx: 'auto',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #d32f2f 0%, #9a0007 100%)',
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
                         <form onSubmit={handleSubmit}>
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                

                                 {/* Name Fields */}
                 <Box sx={{ 
                   display: 'flex', 
                   gap: { xs: 2, sm: 3 },
                   flexDirection: { xs: 'column', sm: 'row' }
                 }}>
                   <TextField
                     label="First Name"
                     value={formData.firstName}
                     onChange={handleInputChange('firstName')}
                     required
                     variant="outlined"
                     size="small"
                     sx={{
                       flex: 1,
                       '& .MuiOutlinedInput-root': {
                         borderRadius: 2,
                         height: '50px',
                         backgroundColor: 'rgba(255,255,255,0.8)',
                         '&:hover fieldset': {
                           borderColor: 'primary.main',
                         },
                         '&.Mui-focused fieldset': {
                           borderColor: 'primary.main',
                           borderWidth: 2,
                         },
                         '&.Mui-focused': {
                           backgroundColor: 'white',
                         },
                       },
                       '& .MuiInputLabel-root': {
                         color: 'text.secondary',
                         '&.Mui-focused': {
                           color: 'primary.main',
                         },
                       },
                     }}
                   />
                   <TextField
                     label="Last Name"
                     value={formData.lastName}
                     onChange={handleInputChange('lastName')}
                     required
                     variant="outlined"
                     size="small"
                     sx={{
                       flex: 1,
                       '& .MuiOutlinedInput-root': {
                         borderRadius: 2,
                         height: '50px',
                         backgroundColor: 'rgba(255,255,255,0.8)',
                         '&:hover fieldset': {
                           borderColor: 'primary.main',
                         },
                         '&.Mui-focused fieldset': {
                           borderColor: 'primary.main',
                           borderWidth: 2,
                         },
                         '&.Mui-focused': {
                           backgroundColor: 'white',
                         },
                       },
                       '& .MuiInputLabel-root': {
                         color: 'text.secondary',
                         '&.Mui-focused': {
                           color: 'primary.main',
                         },
                       },
                     }}
                   />
                 </Box>

                                 {/* Contact Fields */}
                 <Box sx={{ 
                   display: 'flex', 
                   gap: { xs: 2, sm: 3 },
                   flexDirection: { xs: 'column', md: 'row' }
                 }}>
                  <TextField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    variant="outlined"
                    size="small"
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: '50px',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />
                  <TextField
                    label="Phone"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    required
                    variant="outlined"
                    size="small"
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: '50px',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />
                </Box>

                                 {/* Company Field */}
                 <TextField
                   fullWidth
                   label="Company (Optional)"
                   value={formData.company}
                   onChange={handleInputChange('company')}
                   required={false}
                   variant="outlined"
                   size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: '50px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  }}
                />

                {/* Subject */}
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={handleInputChange('subject')}
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: '50px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  }}
                />

                {/* Message */}
                <TextField
                  fullWidth
                  label="Message"
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  size="small"
                  placeholder="Tell us about your project, requirements, or any questions you have..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  }}
                />

                {/* Submit Button */}
                                 <Box sx={{ 
                   textAlign: 'center', 
                   mt: { xs: 3, sm: 4 },
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   gap: { xs: 1.5, sm: 2 },
                 }}>
                   <Button
                     type="submit"
                     variant="contained"
                     size="medium"
                     startIcon={<Send />}
                     sx={{
                       background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
                       px: { xs: 4, sm: 6 },
                       py: { xs: 1.2, sm: 1.5 },
                       fontSize: { xs: '0.9rem', sm: '1rem' },
                       fontWeight: 'bold',
                       borderRadius: 2,
                       boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)',
                       textTransform: 'none',
                       letterSpacing: 0.5,
                       '&:hover': {
                         background: 'linear-gradient(135deg, #b71c1c 0%, #7b0000 100%)',
                         transform: 'translateY(-2px)',
                         boxShadow: '0 8px 30px rgba(211, 47, 47, 0.4)',
                       },
                       transition: 'all 0.3s ease',
                       minWidth: { xs: 160, sm: 180 },
                       width: { xs: '100%', sm: 'auto' },
                     }}
                   >
                     Send Message
                   </Button>
                                     <Typography
                     variant="caption"
                     sx={{
                       color: 'text.secondary',
                       fontSize: { xs: '0.7rem', sm: '0.75rem' },
                       opacity: 0.7,
                       textAlign: 'center',
                       px: { xs: 2, sm: 0 },
                     }}
                   >
                     We&apos;ll get back to you within 24 hours
                   </Typography>
                </Box>
              </Box>
            </form>
          </Card>
        </Container>
      </Box>
     {/* Contact Information */}
   <Box sx={{ py: { xs: 2, md: 2 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 3.5,
              color: 'text.primary',
            }}
          >
            Contact Information
          </Typography>
                     <Box sx={{ 
             display: 'grid',
             gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
             gap: { xs: 2, sm: 3, md: 4 },
             justifyContent: 'center',
             maxWidth: 1200,
             mx: 'auto',
           }}>
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                                 sx={{
                   height: '100%',
                   textAlign: 'center',
                   p: { xs: 1.5, sm: 2 },
                   transition: 'all 0.3s ease',
                   boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                   borderRadius: { xs: 2, sm: 3 },
                   cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                    '& .icon-container': {
                      transform: 'scale(1.1) rotate(5deg)',
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    },
                    '& .icon': {
                      transform: 'scale(1.2)',
                      color: 'primary.main',
                    },
                    '& .card-content': {
                      transform: 'translateY(-5px)',
                    },
                  },
                }}
              >
                <Box 
                  className="icon-container"
                                     sx={{ 
                     mb: { xs: 2, sm: 3 },
                     display: 'inline-flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     width: { xs: 60, sm: 80 },
                     height: { xs: 60, sm: 80 },
                     borderRadius: '50%',
                     backgroundColor: 'rgba(211, 47, 47, 0.05)',
                     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                     position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, rgba(211, 47, 47, 0.1), rgba(211, 47, 47, 0.05))',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    className="icon"
                    sx={{
                      fontSize: 40,
                      color: 'primary.main',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    {(() => {
                      const IconComponent = getIcon(info.icon);
                                           return <IconComponent sx={{ 
                       fontSize: { xs: 30, sm: 40 },
                       transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }} />;
                    })()}
                  </Box>
                </Box>
                <Box className="card-content" sx={{ transition: 'transform 0.3s ease' }}>
                                     <Typography
                     variant="h6"
                     sx={{
                       fontWeight: 'bold',
                       mb: { xs: 2, sm: 3 },
                       color: 'text.primary',
                       fontSize: { xs: '1rem', sm: '1.2rem' },
                     }}
                   >
                     {info.title}
                   </Typography>
                  {info.details.map((detail, idx) => (
                                         <Typography
                       key={idx}
                       variant="body2"
                       sx={{
                         color: 'text.secondary',
                         lineHeight: 1.6,
                         mb: 1,
                         fontSize: { xs: '0.85rem', sm: '0.95rem' },
                         transition: 'color 0.3s ease',
                       }}
                     >
                       {detail}
                     </Typography>
                  ))}
                </Box>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
      {/* Map Section */}
      <Box sx={{ py: { xs: 2, md: 3 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 3.5,
              color: 'text.primary',
            }}
          >
            Find Us
          </Typography>
          <Box
            sx={{
              height: { xs: 300, sm: 350, md: 400 },
              borderRadius: { xs: 1, sm: 2 },
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.1)',
              position: 'relative',
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2990.274257380935!2d-85.97568268459367!3d41.68250697923919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8811b5b0256b1b8f%3A0x403d81bc47e5b9b!2s21468%20C%20St%2C%20Elkhart%2C%20IN%2046516%2C%20USA!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Superior Seating LLC Location"
            />
          </Box>
        
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;