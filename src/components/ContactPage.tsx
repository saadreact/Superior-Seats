'use client';

import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { Person, Business, Send, Phone, Email, LocationOn, AccessTime } from '@mui/icons-material';
import { contactInfo, initialFormData, ContactFormData } from '@/data/ContactPage';
import { sendContactForm } from '@/services/contactpageapi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSectionCommon from './common/HeroSectionaCommon';


// Validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address i.e @gmail.com'),
  phone: z.string()
    .min(1, 'Phone number is required Digits only')
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
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  // Ensure form data is always valid (no null/undefined values)
  useEffect(() => {
    setFormData(prev => {
      const sanitized = { ...prev };
      Object.keys(sanitized).forEach(key => {
        if (sanitized[key as keyof ContactFormData] === null || sanitized[key as keyof ContactFormData] === undefined) {
          sanitized[key as keyof ContactFormData] = '';
        }
      });
      return sanitized;
    });
  }, []);

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
      // Ensure value is always a string, never null or undefined
      const stringValue = value || '';
      
      if (field === 'phone') {
        // Only allow digits for phone
        const digitsOnly = stringValue.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, [field]: digitsOnly }));
        value = digitsOnly;
      } else {
        setFormData(prev => ({ ...prev, [field]: stringValue }));
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
    const value = event.target.value || '';
    validateField(field, value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Validate the entire form
      const validatedData = contactFormSchema.parse(formData);
      
      // Set loading state
      setIsSubmitting(true);
      
      // Prepare the data for API
      const apiData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company || '',
        subject: validatedData.subject,
        message: validatedData.message,
      };
      
      // Make API call using the service
      const result = await sendContactForm(apiData);
      
      // Handle success
      if (result.success) {
        setSnackbarMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Reset form with safety check
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: ''
        });
        setErrors({} as ContactFormErrors);
      } else {
        // Handle API error
        setSnackbarMessage(result.message || 'An error occurred while sending your message. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
      
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      
      let errorMessage = 'An error occurred while sending your message. Please try again.';
      
      if (error instanceof z.ZodError) {
        // Validation error
        const newErrors: ContactFormErrors = {} as ContactFormErrors;
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ContactFormData;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        errorMessage = 'Please fix the errors in the form and try again.';
      }
      
      // Show error notification
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
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
          md: '80px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
          
          }}
           />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Contact Us' }
        ]}
      />
      
      {/* API Debug Component - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ py: 2, backgroundColor: '#fafafa' }}>
          <Container maxWidth="md">
    
          </Container>
        </Box>
      )}

      {/* Contact Form */}
      <Box sx={{  backgroundColor: '#fafafa' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'medium',
              mb: 2,
              mt: -2,
              color: 'text.primary',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem', lg: '2.5rem' ,xl: '2.5rem'},

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
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    onFocus={() => setIsPhoneFocused(true)}
                    onBlur={() => setIsPhoneFocused(false)}
                    required
                    variant="outlined"
                    size="small"
                    error={!!errors.phone}
                    helperText={errors.phone}
                    inputProps={{
                      inputMode: 'tel',
                      maxLength: 20,
                    }}
                    InputLabelProps={{
                      shrink: isPhoneFocused || Boolean(formData.phone),
                    }}
                    InputProps={{
                      notched: isPhoneFocused || Boolean(formData.phone),
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: '1rem' }}>🇺🇸</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>+1</Typography>
                            <Box sx={{ width: '1px', height: '20px', backgroundColor: 'rgba(0, 0, 0, 0.23)', ml: 0.5 }} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: 1,
                      ...commonTextFieldStyles,
                      '& .MuiInputLabel-root': {
                        transform: 'translate(60px, 5.5px) scale(1)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)'
                        },
                        '&.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)'
                        }
                      },
                      '& .MuiInputBase-input': {
                        paddingLeft: '8px !important'
                      }
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
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      disabled={isSubmitting}
                      disableRipple={false}
                      TouchRippleProps={{
                        center: true,
                        color: 'rgba(255, 255, 255, 0.3)',
                      }}
                      sx={{
                        px: { xs: 4, sm: 6 },
                        py: { xs: 1, sm: 1.5,lg: 1,md: 1.2 },
                        borderRadius: 2,
                        textTransform: 'none',
                        letterSpacing: 0.5,
                        transition: 'all 0.3s ease',
                        minWidth: { xs: 160, sm: 180 },
                        width: { xs: '100%', sm: 'auto' },
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: 'none',
                        },
                        '& .MuiTouchRipple-root': {
                          borderRadius: 2,
                        },
                        '&:disabled': {
                          opacity: 0.7,
                        },
                      }}
                    >
                     {isSubmitting ? 'Sending...' : 'Send Message'}
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

      
      {/* Map Section */}
      <Box sx={{ py: { xs: 2, md: 1, lg: 1, xl: 2 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'medium',
              mb: 3,
              color: 'text.primary',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem', lg: '2.5rem' ,xl: '2.5rem'},

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

      {/* Dynamic Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;