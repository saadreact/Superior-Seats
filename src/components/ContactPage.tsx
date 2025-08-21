'use client';

import React, { useState } from 'react';
import { z } from 'zod';
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

// Validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  company: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
});

type ContactFormErrors = {
  [K in keyof ContactFormData]: string;
};

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({} as ContactFormErrors);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Common styles for text fields (excluding Message field)
  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      height: '35px',
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
      transform: 'translate(14px, 5.5px) scale(1)',
      '&.Mui-focused': {
        color: 'primary.main',
        transform: 'translate(14px, -9px) scale(0.75)',
      },
      '&.MuiFormLabel-filled': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
  };

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

  const validateField = (field: keyof ContactFormData, value: string) => {
    try {
      if (field === 'phone') {
        // Only allow digits for phone
        const digitsOnly = value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, [field]: digitsOnly }));
        value = digitsOnly;
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
      
      // Validate the field
      if (field in contactFormSchema.shape) {
        const fieldSchema = contactFormSchema.shape[field as keyof typeof contactFormSchema.shape];
        if (fieldSchema) {
          fieldSchema.parse(value);
          setErrors(prev => ({ ...prev, [field]: '' }));
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const handleInputChange = (field: keyof ContactFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateField(field, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Validate the entire form
      const validatedData = contactFormSchema.parse(formData);
      console.log('Form submitted:', validatedData);
      setSnackbarOpen(true);
      setFormData(initialFormData);
      setErrors({} as ContactFormErrors);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ContactFormErrors = {} as ContactFormErrors;
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ContactFormData;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
            <Header />
       <HeroSectionCommon
         title="Get In Touch"
         description="Contact us today for design help and a quote.  We’re here to help bring your vision to life."
         height={{
          xs: '75px',
            sm: '70px', 
            md: '75px',
            lg: '90px',
            xl: '100px',
            xxl: '110px'
          
          }}
           />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Contact Us' }
        ]}
      />
      

      {/* Contact Form */}
      <Box sx={{ py: { xs: 2, md: 2, lg: 2, xl: 4 }, backgroundColor: '#fafafa' }}>
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
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      sx={{
                        flex: 1,
                        ...commonTextFieldStyles,
                      }}
                    />
                                       <TextField
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      required
                      variant="outlined"
                      size="small"
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      sx={{
                        flex: 1,
                        ...commonTextFieldStyles,
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
                     error={!!errors.email}
                     helperText={errors.email}
                     sx={{
                       flex: 1,
                       ...commonTextFieldStyles,
                     }}
                   />
                                     <TextField
                     label="Phone"
                     value={formData.phone}
                     onChange={handleInputChange('phone')}
                     required
                     variant="outlined"
                     size="small"
                     error={!!errors.phone}
                     helperText={errors.phone}
                     inputProps={{
                       inputMode: 'numeric',
                       pattern: '[0-9]*'
                     }}
                     sx={{
                       flex: 1,
                       ...commonTextFieldStyles,
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
                    sx={commonTextFieldStyles}
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
                   error={!!errors.subject}
                   helperText={errors.subject}
                   sx={commonTextFieldStyles}
                 />

                {/* Message */}
                <TextField
                  fullWidth
                  label="Message"
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  required
                  multiline
                  rows={3}
                  variant="outlined"
                  size="small"
                  error={!!errors.message}
                  helperText={errors.message}
                  placeholder="Tell us about your query, requirements, or any questions you have..."
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
                   mt: { xs: 1, sm: 1 ,lg: 0,md: 1},
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
                     // background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
                     background: 'primary.main',
                       px: { xs: 4, sm: 6 },
                       py: { xs: 1, sm: 1.5,lg: 1,md: 1.2 },
                       fontSize: { xs: '0.9rem', sm: '1rem' },
                       fontWeight: 'bold',
                       borderRadius: 2,
                       boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)',
                       textTransform: 'none',
                       letterSpacing: 0.5,
                       '&:hover': {
                       //  background: 'linear-gradient(135deg, #b71c1c 0%, #7b0000 100%)',
                         transform: 'translateY(-2px)',
                         boxShadow: '0 8px 30px rgba(231, 43, 43, 0.4)',
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
   {/* <Box sx={{ py: { xs: 2, md: 2 }, backgroundColor: 'white' }}>
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
      </Box> */}
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