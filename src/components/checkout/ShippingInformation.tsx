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
      p: { xs: 1, sm: 2, md: 3 } 
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
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
                size="medium"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    height: '1.4375em'
                  }
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
                size="medium"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    height: '1.4375em'
                  }
                }}
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
              size="medium"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem'
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                  height: '1.4375em'
                }
              }}
            />
            
            {/* Phone */}
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              required
              size="medium"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem'
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                  height: '1.4375em'
                }
              }}
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
              size="medium"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem'
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem'
                }
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
                size="medium"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    height: '1.4375em'
                  }
                }}
              />
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={handleInputChange('state')}
                required
                size="medium"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    height: '1.4375em'
                  }
                }}
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
                size="medium"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    height: '1.4375em'
                  }
                }}
              />
              <FormControl fullWidth required size="medium">
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
                      height: '1.4375em'
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
              gap: { xs: 1, sm: 2 }, 
              mt: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center'
            }}>
              <Button
                variant="outlined"
                onClick={onBack}
                size="medium"
                sx={{ 
                  py: { xs: 1, sm: 1.25 },
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  minWidth: { xs: '120px', sm: '140px' }
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
                  minWidth: { xs: '120px', sm: '140px' }
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