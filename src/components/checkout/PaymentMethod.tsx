import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Alert
} from '@mui/material';
import { paymentMethods, defaultPaymentData, PaymentFormData } from '@/data/checkoutData';

interface PaymentMethodProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState<PaymentFormData>(defaultPaymentData);

  const handleInputChange = (field: keyof PaymentFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onNext();
  };

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: 500, md: 600 }, 
      mx: 'auto', 
      p: { xs: 1, sm: 2, md: 3 } 
    }}>
      <Typography variant="h4" sx={{ 
        mb: { xs: 2, sm: 3 }, 
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
      }}>
        Payment Information
      </Typography>
      
      <Card sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: { xs: 2, sm: 3 } 
      }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 3, sm: 4 }}>
            {/* Square Payment Info */}
            <Alert severity="info" sx={{ 
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              💳 Secure payment processing powered by Square
            </Alert>

            {/* Card Details */}
            <Box>
              <Typography variant="h6" sx={{ 
                mb: { xs: 2, sm: 3 }, 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                Card Details
              </Typography>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={formData.cardNumber}
                  onChange={handleInputChange('cardNumber')}
                  placeholder="1234 5678 9012 3456"
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
                  label="Cardholder Name"
                  value={formData.cardHolderName}
                  onChange={handleInputChange('cardHolderName')}
                  placeholder="John Doe"
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
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={handleInputChange('expiryDate')}
                    placeholder="MM/YY"
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
                    label="CVV"
                    value={formData.cvv}
                    onChange={handleInputChange('cvv')}
                    placeholder="123"
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
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.saveCard}
                      onChange={handleInputChange('saveCard')}
                    />
                  }
                  label="Save this card for future purchases"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Stack>
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
                Process Payment
              </Button>
            </Box>
          </Stack>
        </form>
      </Card>
    </Box>
  );
};

export default PaymentMethod; 