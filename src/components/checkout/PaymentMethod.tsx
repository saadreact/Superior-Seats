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
      // Simulate Square payment processing
      // In a real implementation, you would integrate with Square's Web Payments SDK
      // For now, we'll simulate the payment process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment (replace with actual Square integration)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: 'simulated_token_' + Date.now(),
          amount: validAmount,
          currency: currency,
          buyerEmailAddress: formData.email || undefined,
          billingAddress: {
            addressLine1: formData.billingAddress?.addressLine1,
            addressLine2: formData.billingAddress?.addressLine2,
            locality: formData.billingAddress?.city,
            administrativeDistrictLevel1: formData.billingAddress?.state,
            postalCode: formData.billingAddress?.postalCode,
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
              
              {/* Square Card Container - Placeholder */}
              <Box
                sx={{
                  minHeight: '200px',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  💳 Square Payment Integration
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Card input fields will be rendered here when Square SDK is integrated
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Currently using simulated payment processing
                </Typography>
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
              gap: { xs: 1, sm: 2 }, 
              mt: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Button
                variant="outlined"
                onClick={onBack}
                disabled={isProcessing}
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
                disabled={isProcessing}
                fullWidth
                sx={{ 
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
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