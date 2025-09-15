import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Alert,
  Divider
} from '@mui/material';
import { CheckCircle, Home, ShoppingCart } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/cartSlice';
import { useRouter } from 'next/navigation';

interface OrderConfirmationProps {
  onBack: () => void;
  paymentId?: string;
  order?: any;
  errors?: string[];
  notices?: string[];
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onBack, paymentId, order, errors = [], notices = [] }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const orderNumber = order?.order_number || order?.id || '';
  const totalAmount = order?.total_amount || order?.cartSummary?.grandTotal || '';
  const status = order?.status || (paymentId ? 'completed' : 'pending');
  const shippingAddress = order?.shipping_address || order?.addresses?.find((a: any) => a.type === 'shipping');
  const billingAddress = order?.billing_address || order?.addresses?.find((a: any) => a.type === 'billing');
  const payment = Array.isArray(order?.payments) ? order.payments[0] : null;

  const handleContinueShopping = () => {
    dispatch(clearCart());
    router.push('/ShopGallery');
  };

  const handleGoHome = () => {
    dispatch(clearCart());
    router.push('/');
  };

  const renderAddress = (addr: any) => {
    if (!addr) return 'N/A';
    if (typeof addr === 'string') return addr;
    return [addr.first_name, addr.last_name, addr.street, addr.city, addr.state, addr.postal_code, addr.country]
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 4, lg: 6 } }}>
      <Box sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'success.50', borderRadius: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'success.100', mb: 2, display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
        <Box sx={{ p: { xs: 1, sm: 1.5 }, borderRadius: { xs: 1.5, sm: 2 }, backgroundColor: 'success.main', mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
          <CheckCircle sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="success.main" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } }}>
            Order Confirmed!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Thank you for your purchase. Your order has been successfully placed.
          </Typography>
        </Box>
      </Box>

      {notices.length > 0 && (
        <Alert severity="info" sx={{ mb: 1 }}>
          {notices.join(' | ')}
        </Alert>
      )}
      {errors.length > 0 && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          {errors.join(' | ')}
        </Alert>
      )}

      <Alert severity="success" sx={{ mb: 2, borderRadius: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'success.light', backgroundColor: 'success.50', fontSize: { xs: '0.875rem', sm: '1rem' }, '& .MuiAlert-icon': { color: 'success.main' } }}>
        🎉 Your order has been placed successfully! You will receive a confirmation email shortly.
      </Alert>

      <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 2, sm: 3 }, boxShadow: { xs: '0 2px 12px rgba(0,0,0,0.08)', sm: '0 4px 20px rgba(0,0,0,0.08)' }, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', maxWidth: { xs: '100%', sm: 700 }, mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', mb: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <CheckCircle sx={{ fontSize: { xs: 40, sm: 48, md: 56 }, color: 'success.main', mb: 1 }} />
          <Typography variant="h4" fontWeight="medium" color="success.main" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
            Order #{orderNumber}
          </Typography>
          {paymentId && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mb: 1 }}>
              Payment ID: {paymentId}
            </Typography>
          )}
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Total Amount: ${String(totalAmount || '').toString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">Status: {String(status).toUpperCase()}</Typography>
        </Box>

        <Divider sx={{ width: '100%', mb: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Shipping Address</Typography>
            <Typography variant="body2" color="text.secondary">{renderAddress(shippingAddress)}</Typography>
          </Card>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Billing Address</Typography>
            <Typography variant="body2" color="text.secondary">{renderAddress(billingAddress)}</Typography>
          </Card>
        </Box>

        {payment && (
          <Card sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Payment</Typography>
            <Typography variant="body2" color="text.secondary">Method: {payment.method}</Typography>
            <Typography variant="body2" color="text.secondary">Status: {payment.status}</Typography>
            <Typography variant="body2" color="text.secondary">Amount Paid: ${payment.amount_paid}</Typography>
          </Card>
        )}

        <Stack direction="column" spacing={1.5} sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400 }, mt: 2, mx: 'auto' }}>
          <Button variant="contained" onClick={handleContinueShopping} startIcon={<ShoppingCart />} sx={{ py: { xs: 1.25, sm: 1.5 }, px: { xs: 2.5, sm: 3 }, borderRadius: { xs: 2, sm: 3 }, fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' }, textTransform: 'none' }}>
            Continue Shopping
          </Button>
          <Button variant="outlined" onClick={handleGoHome} startIcon={<Home />} sx={{ py: { xs: 1.25, sm: 1.5 }, px: { xs: 2.5, sm: 3 }, borderRadius: { xs: 2, sm: 3 }, fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' }, textTransform: 'none', borderWidth: 2 }}>
            Go to Home
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default OrderConfirmation; 