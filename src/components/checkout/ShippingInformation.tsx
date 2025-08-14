import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import { countries, defaultShippingData, ShippingFormData } from '@/data/checkoutData';

interface ShippingInformationProps {
  onNext: () => void;
  onBack: () => void;
}

const ShippingInformation: React.FC<ShippingInformationProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState<ShippingFormData>(defaultShippingData);

  // Common styles for text fields (same as ContactPage)
  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      height: '40px',
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
      transform: 'translate(14px, 8px) scale(1)',
      '&.Mui-focused': {
        color: 'primary.main',
        transform: 'translate(14px, -9px) scale(0.75)',
      },
      '&.MuiFormLabel-filled': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
  };

  const handleInputChange = (field: keyof ShippingFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value as string
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onNext();
  };

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: 450, md: 500 }, 
      mx: 'auto', 
      p: { xs: 1, sm: 2, md: 3 ,lg: 0, xl: 0} 
    }}>
      <Typography variant="h4" sx={{ 
        mb: { xs: 2, sm: 3 }, 
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
      }}>
        Shipping Information
      </Typography>
      
      <Card sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: { xs: 2, sm: 3 } 
      }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* First Name and Last Name */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              
            }}>
                             <TextField
                 fullWidth
                 label="First Name"
                 value={formData.firstName}
                 onChange={handleInputChange('firstName')}
                 required
                 variant="outlined"
                 size="small"
                 sx={commonTextFieldStyles}
               />
                             <TextField
                 fullWidth
                 label="Last Name"
                 value={formData.lastName}
                 onChange={handleInputChange('lastName')}
                 required
                 variant="outlined"
                 size="small"
                 sx={commonTextFieldStyles}
               />
            </Box>
            
            {/* Email */}
                         <TextField
               fullWidth
               label="Email Address"
               type="email"
               value={formData.email}
               onChange={handleInputChange('email')}
               required
               variant="outlined"
               size="small"
               sx={commonTextFieldStyles}
             />
            
            {/* Phone */}
                         <TextField
               fullWidth
               label="Phone Number"
               type="tel"
               value={formData.phone}
               onChange={handleInputChange('phone')}
               required
               variant="outlined"
               size="small"
               sx={commonTextFieldStyles}
             />
            
            {/* Street Address */}
                         <TextField
               fullWidth
               label="Street Address"
               value={formData.streetAddress}
               onChange={handleInputChange('streetAddress')}
               multiline
               rows={2}
               required
               variant="outlined"
               size="small"
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
            
            {/* City, State, ZIP */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
                             <TextField
                 fullWidth
                 label="City"
                 value={formData.city}
                 onChange={handleInputChange('city')}
                 required
                 variant="outlined"
                 size="small"
                 sx={commonTextFieldStyles}
               />
                             <TextField
                 fullWidth
                 label="State"
                 value={formData.state}
                 onChange={handleInputChange('state')}
                 required
                 variant="outlined"
                 size="small"
                 sx={commonTextFieldStyles}
               />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
                             <TextField
                 fullWidth
                 label="ZIP Code"
                 value={formData.zipCode}
                 onChange={handleInputChange('zipCode')}
                 required
                 variant="outlined"
                 size="small"
                 sx={commonTextFieldStyles}
               />
              <FormControl fullWidth required size="small">
                <InputLabel sx={{ fontSize: '0.875rem' }}>
                  Country
                </InputLabel>
                <Select
                  value={formData.country}
                  onChange={(event) => setFormData(prev => ({ ...prev, country: event.target.value as string }))}
                  label="Country"
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: '0.875rem',
                      padding: '8px 12px'
                    }
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.value} value={country.value} sx={{ 
                      fontSize: '0.875rem' 
                    }}>
                      {country.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }, 
              mt: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Button
                variant="outlined"
                onClick={onBack}
                size="medium"
                sx={{ 
                  py: { xs: 1, sm: 1.25 },
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  minWidth: { xs: '120px', sm: '140px' },
                  height:  { xs: '40px', sm: '40px', md: '40px', lg: '40px', xl: '40px' },
                  width: { xs: '100%', sm: '100%', md: '100%', lg: '50%', xl: '50%' }
                }}
              >
                Back
              </Button>
                             <Button
                 type="submit"
                 variant="contained"
                 size="medium"
                 sx={{ 
                   py: { xs: 1, sm: 1.25 },
                   px: { xs: 2, sm: 3 },
                   fontSize: { xs: '0.8rem', sm: '0.9rem' },
                   minWidth: { xs: '120px', sm: '140px' },
                   height: '40px',
                   width: '50%',
                   whiteSpace: 'nowrap',
                   textOverflow: 'ellipsis',
                 }}
               >
                 Continue to Payment
               </Button>
            </Box>
          </Stack>
        </form>
      </Card>
    </Box>
  );
};

export default ShippingInformation; 