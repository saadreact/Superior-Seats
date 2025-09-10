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

interface CheckoutAddresses {
  shipping: ShippingFormData;
  billing: ShippingFormData;
  shippingMethod: string;
  notes: string;
}

interface ShippingInformationProps {
  onNext: (data: CheckoutAddresses) => void;
  onBack: () => void;
  initialData?: CheckoutAddresses;
}

const ShippingInformation: React.FC<ShippingInformationProps> = ({ onNext, onBack, initialData }) => {
  const [shipping, setShipping] = useState<ShippingFormData>(initialData?.shipping || defaultShippingData);
  const [billing, setBilling] = useState<ShippingFormData>(initialData?.billing || defaultShippingData);
  const [shippingMethod, setShippingMethod] = useState<string>(initialData?.shippingMethod || 'Standard');
  const [notes, setNotes] = useState<string>(initialData?.notes || '');

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
  } as const;

  const handleShippingChange = (field: keyof ShippingFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setShipping(prev => ({
      ...prev,
      [field]: event.target.value as string
    }));
  };

  const handleBillingChange = (field: keyof ShippingFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setBilling(prev => ({
      ...prev,
      [field]: event.target.value as string
    }));
  };

  const handleCopyFromShipping = () => {
    setBilling({ ...shipping });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onNext({ shipping, billing, shippingMethod, notes });
  };

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: "100%", md: "50%" ,lg: "50%", xl: "50%"}, 
      maxHeight: { xs: '100%', sm: "100%", md: "100%" ,lg: "100%", xl: "100%"},
      mx: 'auto', 
      p: { xs: 1, sm: 2, md: 1 ,lg: 0, xl: 0} 
    }}>
      <Typography variant="h4" sx={{ 
        mb: { xs: 2, sm: 3 ,md: 1,lg: 1, xl: 1}, 
        textAlign: 'center', 
        fontWeight: 'medium',
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem', lg: '2.5rem', xl: '2.5rem' }
      }}>
        Shipping & Billing
      </Typography>
      
      <Card sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: { xs: 2, sm: 3 } 
      }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Shipping Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Shipping Information</Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField fullWidth label="First Name" value={shipping.firstName} onChange={handleShippingChange('firstName')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                  <TextField fullWidth label="Last Name" value={shipping.lastName} onChange={handleShippingChange('lastName')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                </Box>
                <TextField fullWidth label="Email Address" type="email" value={shipping.email} onChange={handleShippingChange('email')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                <TextField fullWidth label="Phone Number" type="tel" value={shipping.phone} onChange={handleShippingChange('phone')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                <TextField fullWidth label="Street Address" value={shipping.streetAddress} onChange={handleShippingChange('streetAddress')} multiline rows={2} required variant="outlined" size="small" sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)', '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 }, '&.Mui-focused': { backgroundColor: 'white' } },
                  '& .MuiInputLabel-root': { color: 'text.secondary', '&.Mui-focused': { color: 'primary.main' } },
                }} />
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField fullWidth label="City" value={shipping.city} onChange={handleShippingChange('city')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                  <TextField fullWidth label="State" value={shipping.state} onChange={handleShippingChange('state')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField fullWidth label="ZIP Code" value={shipping.zipCode} onChange={handleShippingChange('zipCode')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                  <FormControl fullWidth required size="small">
                    <InputLabel sx={{ fontSize: '0.875rem' }}>Country</InputLabel>
                    <Select value={shipping.country} onChange={(event) => setShipping(prev => ({ ...prev, country: event.target.value as string }))} label="Country" sx={{ '& .MuiSelect-select': { fontSize: '0.875rem', padding: '8px 12px' } }}>
                      {countries.map((country) => (
                        <MenuItem key={country.value} value={country.value} sx={{ fontSize: '0.875rem' }}>{country.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>

            {/* Billing Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Billing Address</Typography>
                <Button size="small" variant="outlined" onClick={handleCopyFromShipping}>Copy from Shipping</Button>
              </Box>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField fullWidth label="First Name" value={billing.firstName} onChange={handleBillingChange('firstName')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                  <TextField fullWidth label="Last Name" value={billing.lastName} onChange={handleBillingChange('lastName')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                </Box>
                <TextField fullWidth label="Email Address" type="email" value={billing.email} onChange={handleBillingChange('email')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                <TextField fullWidth label="Phone Number" type="tel" value={billing.phone} onChange={handleBillingChange('phone')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                <TextField fullWidth label="Street Address" value={billing.streetAddress} onChange={handleBillingChange('streetAddress')} multiline rows={2} required variant="outlined" size="small" sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)', '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 }, '&.Mui-focused': { backgroundColor: 'white' } },
                  '& .MuiInputLabel-root': { color: 'text.secondary', '&.Mui-focused': { color: 'primary.main' } },
                }} />
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField fullWidth label="City" value={billing.city} onChange={handleBillingChange('city')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                  <TextField fullWidth label="State" value={billing.state} onChange={handleBillingChange('state')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField fullWidth label="ZIP Code" value={billing.zipCode} onChange={handleBillingChange('zipCode')} required variant="outlined" size="small" sx={commonTextFieldStyles} />
                  <FormControl fullWidth required size="small">
                    <InputLabel sx={{ fontSize: '0.875rem' }}>Country</InputLabel>
                    <Select value={billing.country} onChange={(event) => setBilling(prev => ({ ...prev, country: event.target.value as string }))} label="Country" sx={{ '& .MuiSelect-select': { fontSize: '0.875rem', padding: '8px 12px' } }}>
                      {countries.map((country) => (
                        <MenuItem key={country.value} value={country.value} sx={{ fontSize: '0.875rem' }}>{country.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>

            {/* Notes and Shipping Method */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Notes & Shipping Method</Typography>
              <Stack spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>Shipping Method</InputLabel>
                  <Select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value as string)} label="Shipping Method" sx={{ '& .MuiSelect-select': { fontSize: '0.875rem', padding: '8px 12px' } }}>
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Expedited">Expedited</MenuItem>
                    <MenuItem value="Express">Express</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Order Notes"
                  multiline
                  minRows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions?"
                />
              </Stack>
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
                  fontSize: { xs: '1rem', sm: '1rem' ,md: '1.1rem', lg: '1.2rem', xl: '1.25rem'},
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
                  fontSize: { xs: '0.8rem', sm: '0.8rem' ,md: '1rem', lg: '1rem', xl: '1rem'},
                  height:  { xs: '40px', sm: '40px', md: '40px', lg: '40px', xl: '40px' },
                 width: { xs: '100%', sm: '100%', md: '100%', lg: '50%', xl: '50%' },
                  backgroundColor: 'primary.main',
                  boxShadow: 'none',
                 
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    boxShadow: 'none',
                  },
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