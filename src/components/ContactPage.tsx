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
// import Breadcrumbs from '@/components/Breadcrumbs'; // Temporarily disabled
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
      borderRadius: { xs: 1.5, sm: 2 },
      height: { xs: '48px', sm: '46px', md: '44px' },
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
    '& .MuiOutlinedInput-input': {
      height: { xs: '48px', sm: '46px', md: '44px' },
      lineHeight: { xs: '48px', sm: '46px', md: '44px' },
      paddingTop: 0,
      paddingBottom: 0,
      fontSize: { xs: '0.95rem', sm: '1rem' },
    },
    // Center only the placeholder text for inputs and textareas
    '& input::placeholder': {
      textAlign: 'center',
      opacity: 0.8,
      fontSize: { xs: '0.9rem', sm: '1rem' },
    },
    '& textarea::placeholder': {
      textAlign: 'center',
      opacity: 0.8,
      fontSize: { xs: '0.9rem', sm: '1rem' },
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      transform: 'translate(14px, 10px) scale(1)',
      fontSize: { xs: '0.95rem', sm: '1rem' },
      '&.Mui-focused': {
        color: 'primary.main',
        transform: 'translate(14px, -9px) scale(0.75)',
      },
      '&.MuiFormLabel-filled': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
    '& .MuiFormHelperText-root': {
      fontSize: { xs: '0.7rem', sm: '0.75rem' },
      marginLeft: { xs: 0, sm: '14px' },
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

  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});

  const handleInputChange = (field: keyof ContactFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || '';
    // live update value, but only validate if field has been touched after blur or after submit
    if (field === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [field]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // We intentionally avoid per-field blur validation to only show errors after submit

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Mark all fields touched so validation messages show only after submit
      setTouched({ firstName: true, lastName: true, email: true, phone: true, company: true, subject: true, message: true });

      // Run validation for all fields before submit
      (Object.keys(formData) as (keyof ContactFormData)[]).forEach((key) => {
        validateField(key, formData[key] || '');
      });

      // Validate the entire form
      const validatedData = contactFormSchema.parse(formData);
      
      // Set loading state
      setIsSubmitting(true);
      
      // Prepare API data
      const apiData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company || '',
        subject: validatedData.subject,
        message: validatedData.message,
      };
      
      // Send data to API
      const response = await sendContactForm(apiData);
      
      if (response.success) {
        // Show success message
        setSnackbarMessage('Your message has been sent successfully! We will get back to you soon.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Reset form after a short delay
        setTimeout(() => {
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
        }, 2000);
      } else {
        // Handle API error response
        setSnackbarMessage(response.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
      
    } catch (error: unknown) {
      console.error('Form validation error:', error);
      
      let errorMessage = 'Please fix the errors in the form and try again.';
      
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
         description="Contact us today for design help and a quote.  We're here to help bring your vision to life."
         height={{
          xs: '80px',
          sm: '75px', 
          md: '85px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
          }}
           />

      {/* Breadcrumbs - Temporarily disabled */}
      {/* <Breadcrumbs
        items={[
          { label: 'Contact Us' }
        ]}
      /> */}
 
      {/* Contact Form */}
     <Box sx={{ backgroundColor: '#fafafa', py: { xs: 3, sm: 4, md: 5, lg: 3, xl: 3 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'medium',
              mb: { xs: 2, sm: 3, md: 4, lg: 4 ,xl: 4},
              mt: { xs: 0, sm: -1, md: -2 ,lg: -1 ,xl: -1},
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' ,xl: '3.5rem'},
              px: { xs: 2, sm: 0 },
            }}
          >
            Send Us a Messages
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: { xs: 2, sm: 2.5, md: 3 }, 
            alignItems: { xs: 'center', md: 'stretch' },
            px: { xs: 2, sm: 0 },
          }}>
            {/* Left image (direct image element) */}
            <Box
              sx={{
                flex: { xs: '0 0 auto', md: 1 },
                maxWidth: { xs: '100%', sm: '400px', md: '340px', lg: '360px' },
                width: { xs: '100%', md: 'auto' },
                height: { xs: '250px', sm: '300px', md: '100%' },
                minHeight: { xs: '250px', sm: '300px', md: 'auto' },
                padding: '0px',
                margin: { xs: '0 auto', md: '0px' },
                display: 'block',
                borderRadius: 2,
                backgroundColor: '#ffffff',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: { xs: 3, md: 4 },
                  background: 'linear-gradient(90deg, #d32f2f 0%, #9a0007 100%)',
                  borderRadius: '3px 3px 0 0',
                  zIndex: 1,
                },
              }}
            >
              <Box
                component="img"
                src="/Gallery/Truckimages/Americanseat.png"
                alt="Contact illustration"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: 2,
                }}
              />
            </Box>

            {/* Right form panel */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', width: '100%' }}>
              <Card
              sx={{
                p: { xs: 2, sm: 3, md: 4, lg: 5 },
                boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', md: '0 10px 40px rgba(0,0,0,0.08)' },
                borderRadius: { xs: 2, md: 3 },
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                border: '1px solid rgba(211, 47, 47, 0.08)',
                width: '100%',
                height: { xs: 'auto', md: '100%' },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: { xs: 3, md: 4 },
                  background: 'linear-gradient(90deg, #d32f2f 0%, #9a0007 100%)',
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
                         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: { xs: 1.5, sm: 2, md: 1.8, lg: 2 },
              }}>
                

                                 {/* Name Fields */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1.5, sm: 2 },
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
                  gap: { xs: 1.5, sm: 2 },
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.3, sm: 0.5 }, pr: { xs: 0.5, sm: 1 } }}>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>🇺🇸</Typography>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, fontWeight: 500 }}>+1</Typography>
                            <Box sx={{ width: '1px', height: { xs: '18px', sm: '20px' }, backgroundColor: 'rgba(0, 0, 0, 0.23)', ml: { xs: 0.3, sm: 0.5 } }} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: 1,
                      ...commonTextFieldStyles,
                      '& .MuiInputLabel-root': {
                        transform: { xs: 'translate(70px, 12px) scale(1)', sm: 'translate(60px, 10px) scale(1)' },
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)'
                        },
                        '&.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)'
                        }
                      },
                      '& .MuiInputBase-input': {
                        paddingLeft: '8px !important',
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                      },
                      '& .MuiInputAdornment-root': {
                        '& .MuiTypography-root': {
                          fontSize: { xs: '0.85rem', sm: '1rem' },
                        }
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
                      borderRadius: { xs: 1.5, sm: 2 },
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
                    '& .MuiOutlinedInput-inputMultiline': {
                      paddingTop: { xs: '12px', sm: '10px' },
                      paddingBottom: { xs: '12px', sm: '10px' },
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                    },
                    // Ensure multiline placeholder is centered
                    '& textarea::placeholder': {
                      textAlign: 'center',
                      opacity: 0.8,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      marginLeft: { xs: 0, sm: '14px' },
                    },
                  }}
                />

                {/* Submit Button */}
                                 <Box sx={{ 
                   textAlign: 'center', 
                   mt: { xs: 1, sm: 1.5, md: 0.5 },
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   gap: { xs: 1.5, sm: 2, md: 1.5 },
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
                       px: { xs: 3, sm: 5, md: 6 },
                       py: { xs: 1.2, sm: 1.5, md: 1.2, lg: 1 },
                       borderRadius: { xs: 1.5, sm: 2 },
                       textTransform: 'none',
                       letterSpacing: 0.5,
                       fontSize: { xs: '0.95rem', sm: '1rem' },
                       fontWeight: 500,
                       transition: 'all 0.3s ease',
                       minWidth: { xs: '100%', sm: 180 },
                       width: { xs: '100%', sm: 'auto' },
                       maxWidth: { xs: '100%', sm: '300px' },
                       boxShadow: 'none',
                       '&:hover': {
                         boxShadow: 'none',
                       },
                       '& .MuiTouchRipple-root': {
                         borderRadius: { xs: 1.5, sm: 2 },
                       },
                       '&:disabled': {
                         opacity: 0.7,
                       },
                       '& .MuiButton-startIcon': {
                         marginRight: { xs: 0.5, sm: 1 },
                       },
                     }}
                   >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </Button>
                   
                   
                   {/* Alternative Email Contact */}
                   <Box sx={{ 
                     width: '100%',
                     px: { xs: 1, sm: 0 },
                   }}>
                     <Typography
                       variant="body2"
                       sx={{
                         color: 'text.secondary',
                         fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.85rem' },
                         mb: { xs: 0.75, sm: 1, md: 0.5 },
                       }}
                     >
                       Or
                     </Typography>
                     <Typography
                       variant="body2"
                       sx={{
                         color: 'text.secondary',
                         fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.85rem' },
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         gap: { xs: 0.3, sm: 0.5 },
                         flexWrap: 'wrap',
                         textAlign: 'center',
                         lineHeight: { md: 1.4 },
                       }}
                     >
                       <Box component="span" sx={{ whiteSpace: { xs: 'normal', sm: 'nowrap' } }}>
                         You can contact us through the Email:
                       </Box>
                       <Typography
                         component="a"
                         href="mailto:info@superiorseatingllc.com"
                         variant="body2"
                         sx={{
                           color: 'primary.main',
                           fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.85rem' },
                           textDecoration: 'none',
                           fontWeight: 500,
                           wordBreak: 'break-word',
                           '&:hover': {
                             textDecoration: 'underline',
                           },
                         }}
                       >
                         info@superiorseatingllc.com
                       </Typography>
                     </Typography>
                   </Box>
                </Box>
              </Box>
            </form>
          </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      
      {/* Map Section */}
      <Box sx={{ py: { xs: 3, sm: 4, md: 5, lg: 5, xl: 6 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 'medium',
              mb: { xs: 2, sm: 3, md: 4 },
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' ,xl: '3.5rem'},
              px: { xs: 2, sm: 0 },
            }}
          >
            Visit Our Location
          </Typography>
          <Box
            sx={{
              height: { xs: 250, sm: 300, md: 350, lg: 400, xl: 450 },
              borderRadius: { xs: 1, sm: 2 },
              overflow: 'hidden',
              boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', md: '0 8px 32px rgba(0,0,0,0.1)' },
              border: '1px solid rgba(0,0,0,0.1)',
              position: 'relative',
              mx: { xs: 2, sm: 0 },
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
        sx={{
          '& .MuiSnackbar-root': {
            top: { xs: '60px', sm: '70px', md: '80px' },
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ 
            width: { xs: 'calc(100% - 32px)', sm: 'auto' },
            minWidth: { xs: '90%', sm: '400px' },
            maxWidth: { xs: '95%', sm: '600px' },
            fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
            '& .MuiAlert-message': {
              fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
              padding: { xs: '6px 0', sm: '8px 0' },
            },
            '& .MuiAlert-icon': {
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              padding: { xs: '6px 0', sm: '7px 0' },
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;