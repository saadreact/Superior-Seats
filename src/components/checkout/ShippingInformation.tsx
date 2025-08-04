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
          <Stack spacing={{ xs: 2, sm: 3 }}>
            {/* First Name and Last Name */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
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
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
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
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
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
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            
            {/* City, State, ZIP */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={handleInputChange('city')}
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={handleInputChange('state')}
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={formData.zipCode}
                onChange={handleInputChange('zipCode')}
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <FormControl fullWidth required>
                <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Country
                </InputLabel>
                <Select
                  value={formData.country}
                  onChange={(event) => setFormData(prev => ({ ...prev, country: event.target.value as string }))}
                  label="Country"
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.value} value={country.value} sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' } 
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
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Button
                variant="outlined"
                onClick={onBack}
                fullWidth
                sx={{ 
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ 
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
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