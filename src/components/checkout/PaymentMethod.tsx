import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { paymentMethods, defaultPaymentData, PaymentFormData } from '@/data/checkoutData';

interface PaymentMethodProps {
  onNext: () => void;
  onBack: () => void;
  amount?: number;
  currency?: string;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ onNext, onBack, amount = 0, currency = 'USD' }) => {
  // Ensure amount is a valid number
  const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  
  const [formData, setFormData] = useState<PaymentFormData>(defaultPaymentData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (field: keyof PaymentFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      // In a real implementation, you would integrate with your payment gateway
      // For now, we'll simulate the payment process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment (replace with actual payment gateway integration)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: validAmount,
          currency: currency,
          email: formData.email || undefined,
          billingAddress: {
            address: formData.billingAddress?.addressLine1,
            address2: formData.billingAddress?.addressLine2,
            city: formData.billingAddress?.city,
            state: formData.billingAddress?.state,
            zipCode: formData.billingAddress?.postalCode,
            country: formData.billingAddress?.country,
          }
        }),
      });

      const paymentResult = await response.json();

      if (paymentResult.success) {
        setSnackbar({
          open: true,
          message: 'Payment processed successfully!',
          severity: 'success'
        });
        
        // Clear form
        setFormData(defaultPaymentData);
        
        // Proceed to next step
        setTimeout(() => {
          onNext();
        }, 2000);
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Payment processing failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: 500, md: 600 }, 
      mx: 'auto', 
      p: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 } 
    }}>
      <Typography variant="h4" sx={{ 
        mb: { xs: 2, sm: 3 }, 
        textAlign: 'center', 
        fontWeight: 'medium',
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem', lg: '2rem', xl: '2rem' }
      }}>
        Payment Information
      </Typography>
      
      <Card sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: { xs: 2, sm: 3 } 
      }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
            {/* Payment Info */}
            <Alert severity="info" sx={{ 
              mb: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              💳 Secure payment processing
            </Alert>

            {/* Card Details */}
            <Box>
              <Typography variant="h6" sx={{ 
                mb: { xs: 2, sm: 3, md: 3, lg: 0, xl: 0 }, 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                Card Details
              </Typography>
              
                          {/* Credit Card Input Fields */}
            <TextField
              fullWidth
              label="Card Number"
              value={formData.cardNumber}
              onChange={handleInputChange('cardNumber')}
              placeholder="1234 5678 9012 3456"
              required
              sx={{
                mb: 2,
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
              
              <TextField
                fullWidth
                label="Cardholder Name"
                value={formData.cardHolderName}
                onChange={handleInputChange('cardHolderName')}
                placeholder="John Doe"
                required
                sx={{
                  mb: 2,
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              
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
            </Box>

                         {/* Navigation Buttons */}
             <Box sx={{ 
               display: 'flex', 
               gap: { xs: 2, sm: 2 }, 
               mt: { xs: 2, sm: 2 },
               flexDirection: { xs: 'column', sm: 'row' },
               justifyContent: 'center',
               alignItems: 'center'
             }}>
               <Button
                 variant="outlined"
                 onClick={onBack}
                 disabled={isProcessing}
                 sx={{ 
                   py: { xs: 1, sm: 1.25 },
                   px: { xs: 2, sm: 3 },
                   fontSize: { xs: '0.9rem', sm: '1rem' },
                   minWidth: { xs: '120px', sm: '140px' },
                   height: { xs: '45px', sm: '40px', md: '40px', lg: '40px', xl: '40px' },
                   width: { xs: '100%', sm: '100%', md: '100%', lg: '50%', xl: '50%' }
                 }}
               >
                 Back
               </Button>
               <Button
                 type="submit"
                 variant="contained"
                 disabled={isProcessing}
                 sx={{ 
                   py: { xs: 1, sm: 1.25 },
                   px: { xs: 2, sm: 3 },
                   fontSize: { xs: '0.9rem', sm: '1rem' },
                   minWidth: { xs: '120px', sm: '140px' },
                   height: { xs: '45px', sm: '40px', md: '40px', lg: '40px', xl: '40px' },
                   width: { xs: '100%', sm: '100%', md: '100%', lg: '50%', xl: '50%' },
                   backgroundColor: 'primary.main',
                   boxShadow: 'none',
                   '&:hover': {
                     backgroundColor: 'primary.dark',
                     boxShadow: 'none',
                   },
                   '&:disabled': {
                     backgroundColor: 'grey.400',
                     boxShadow: 'none',
                   }
                 }}
               >
                {isProcessing ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Processing...
                  </>
                ) : (
                  `Pay ${currency} ${validAmount.toFixed(2)}`
                )}
              </Button>
            </Box>
          </Stack>
        </form>
      </Card>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentMethod; 