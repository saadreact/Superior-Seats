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
      
      {/* Hero Section */}
      <Box sx={{ mt: { xs: 8, sm: 9, md: 10, lg: 11 } }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
          color: 'white',
          height: { xs: '30vh', sm: '32vh', md: '28vh', lg: '30vh' },
          py: { xs: 4, sm: 5, md: 6, lg: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: { xs: 2, sm: 3, md: 4, lg: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem', lg: '3rem', xl: '3.5rem' },
              fontWeight: 'bold',
              mb: { xs: 1, sm: 1.5, md: 2, lg: 3 },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              lineHeight: { xs: 1.2, sm: 1.3, md: 1.2, lg: 1.1 },
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              minWidth: 0,
            }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: { xs: 1, sm: 2, md: 3, lg: 4 },
              opacity: 0.9,
              maxWidth: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
              mx: 'auto',
              lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.5rem' },
              px: { xs: 1, sm: 0 },
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
           Contact us today for a free consultation and quote. We&apos;re here to help bring your vision to life.
          </Typography>
        </Container>
      </Box>

     

      {/* Contact Form */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa' }}>
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
               p: { xs: 3, sm: 4, md: 6 },
               boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
               borderRadius: { xs: 2, md: 3 },
               background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
               border: '1px solid rgba(211, 47, 47, 0.08)',
               maxWidth: { xs: '100%', sm: 600, md: 800 },
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
  <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 6,
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
                    }}
                  >
                    {(() => {
                      const IconComponent = getIcon(info.icon);
                                           return <IconComponent sx={{ 
                       fontSize: { xs: 30, sm: 40 },
                       transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 6,
              color: 'text.primary',
            }}
          >
            Find Us
          </Typography>
                     <Box
             sx={{
               height: { xs: 300, sm: 350, md: 400 },
               backgroundColor: '#e0e0e0',
               borderRadius: { xs: 1, sm: 2 },
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               border: '2px dashed #ccc',
             }}
           >
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Map will be embedded here
            </Typography>
          </Box>
        </Container>
      </Box>

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
    </Box>
  );
};

export default ContactPage;