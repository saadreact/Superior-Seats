import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import SquareCard, { SquareCardHandle } from './SquareCard';
import type { PaymentFormData } from '@/data/checkoutData';

interface PaymentMethodProps {
  onNext: (paymentId?: string, extra?: { sourceToken?: string; status?: string }) => void;
  onBack: () => void;
  amount?: number;
  currency?: string;
  formData: PaymentFormData;
  onFormDataChange: (data: PaymentFormData) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ onNext, onBack, amount = 0, currency = 'USD' }) => {
  const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;

  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const squareRef = useRef<SquareCardHandle | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      if (!squareRef.current) throw new Error('Payment form not ready');
      const { token, details } = await squareRef.current.tokenize();

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: validAmount, currency, sourceId: token }),
      });
      const paymentResult = await response.json();
      if (!response.ok || !paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      setSnackbar({ open: true, message: 'Payment processed successfully!', severity: 'success' });
      const cardBrand = details?.card?.brand || details?.cardBrand || undefined;
      const last4 = details?.card?.last4 || details?.last4 || undefined;
      const expMonth = details?.expMonth || details?.card?.expMonth || undefined;
      const expYear = details?.expYear || details?.card?.expYear || undefined;
      setTimeout(() => { onNext(paymentResult.paymentId, { sourceToken: token, status: paymentResult.status, ...(cardBrand ? { cardBrand } : {}), ...(last4 ? { last4 } : {}), ...(expMonth ? { expMonth } : {}), ...(expYear ? { expYear } : {}) }); }, 400);
    } catch (error: any) {
      console.error('Payment error:', error);
      setSnackbar({ open: true, message: error.message || 'Payment processing failed. Please try again.', severity: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <Box sx={{ maxWidth: { xs: '100%', sm: 500, md: 600 }, mx: 'auto', p: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 } }}>
      <Typography variant="h4" sx={{ mb: { xs: 2, sm: 3 }, textAlign: 'center', fontWeight: 'medium', fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem', lg: '2rem', xl: '2rem' } }}>
        Payment Information
      </Typography>

      <Card sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: { xs: 2, sm: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
            <Alert severity="info" sx={{ mb: { xs: 1, sm: 2, md: 3, lg: 0, xl: 0 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              💳 Enter your card details to complete payment
            </Alert>

            <Box>
              <Typography variant="h6" sx={{ mb: { xs: 2, sm: 3, md: 1.5, lg: 1.5, xl: 1.5 }, fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Card Details
              </Typography>
              <SquareCard ref={squareRef} amount={validAmount} />
            </Box>

            <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2 }, mt: { xs: 2, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', alignItems: 'center' }}>
              <Button variant="outlined" onClick={onBack} disabled={isProcessing} sx={{ py: { xs: 1, sm: 1.25 }, px: { xs: 2, sm: 3 }, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, minWidth: { xs: '120px', sm: '140px' }, height: { xs: '45px', sm: '40px', md: '40px', lg: '40px', xl: '40px' }, width: { xs: '100%', sm: '100%', md: '100%', lg: '50%', xl: '50%' } }}>
                Back
              </Button>
              <Button type="submit" variant="contained" disabled={isProcessing} sx={{ py: { xs: 1, sm: 1.25 }, px: { xs: 2, sm: 3 }, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, minWidth: { xs: '120px', sm: '140px' }, height: { xs: '45px', sm: '40px', md: '40px', lg: '40px', xl: '40px' }, width: { xs: '100%', sm: '100%', md: '100%', lg: '50%', xl: '50%' }, backgroundColor: 'primary.main', boxShadow: 'none', '&:hover': { backgroundColor: 'primary.dark', boxShadow: 'none' }, '&:disabled': { backgroundColor: 'grey.400', boxShadow: 'none' } }}>
                {isProcessing ? (<><CircularProgress size={20} sx={{ mr: 1, color: 'white' }} /> Processing...</>) : `Pay $ ${validAmount.toFixed(2)}`}
              </Button>
            </Box>
          </Stack>
        </form>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentMethod; 