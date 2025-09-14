'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroSectionCommon from './common/HeroSectionaCommon';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  ShoppingCart,
} from '@mui/icons-material';
import Header from '@/components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { clearCart } from '@/store/cartSlice';
import { CartReview, ShippingInformation, PaymentMethod, OrderConfirmation } from './checkout/index';
import type { PaymentFormData } from '@/data/checkoutData';
import { ShippingFormData } from '@/data/checkoutData';
import { apiService } from '@/utils/api';
import squareApi from '@/services/SquareApi';

// Steps array with proper spacing and comments
const steps = [
  'Cart Review',
  'Shipping Information',
  // 'Payment Method', // disabled for now
  'Order Confirmation'
];

const Checkout = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);
  
  const [activeStep, setActiveStep] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentId, setPaymentId] = useState<string>('');
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [postPayErrors, setPostPayErrors] = useState<string[]>([]);
  const [postPayNotices, setPostPayNotices] = useState<string[]>([]);
  const [shipping, setShipping] = useState<ShippingFormData | null>(null);
  const [billing, setBilling] = useState<ShippingFormData | null>(null);
  const [shippingMethod, setShippingMethod] = useState<string>('Standard');
  const [notes, setNotes] = useState<string>('');
  // const [paymentForm, setPaymentForm] = useState<PaymentFormData>({ cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '', saveCard: false });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const createOrderFromCart = async (method: 'cash' | 'card', paidRef?: string) => {
    const subTotal = totalPrice;
    const shippingCost = totalPrice > 500 ? 0 : 29.99;
    const tax = totalPrice * 0.08;
    const grandTotal = subTotal + shippingCost + tax;

    const payload = {
      cartItems: items.map(ci => ({
        itemId: String(ci.id),
        productId: ci.id,
        variationId: undefined,
        name: ci.title,
        quantity: ci.quantity,
        unitPrice: parseFloat(ci.price.replace(/[$,]/g, '')),
        total: parseFloat(ci.price.replace(/[$,]/g, '')) * ci.quantity,
        totalPrice: parseFloat(ci.price.replace(/[$,]/g, '')) * ci.quantity,
      })),
      customerInfo: {
        firstName: shipping?.firstName || 'Customer',
        lastName: shipping?.lastName || 'Name',
        email: shipping?.email || '',
        phone: shipping?.phone || '',
        shippingAddress: {
          street: shipping?.streetAddress || '',
          city: shipping?.city || '',
          state: shipping?.state || '',
          postalCode: shipping?.zipCode || '',
          country: shipping?.country || 'US',
        },
        billingAddress: {
          street: billing?.streetAddress || shipping?.streetAddress || '',
          city: billing?.city || shipping?.city || '',
          state: billing?.state || shipping?.state || '',
          postalCode: billing?.zipCode || shipping?.zipCode || '',
          country: billing?.country || shipping?.country || 'US',
        },
      },
      paymentInfo: {
        method: method === 'cash' ? 'cash' : 'square',
        amountPaid: grandTotal,
        currency: 'USD',
      },
      cartSummary: {
        subTotal,
        tax,
        discount: 0,
        grandTotal,
      },
      notes: [notes, shippingMethod ? `(Ship: ${shippingMethod})` : '', paidRef ? `(Payment: ${paidRef})` : '']
        .filter(Boolean)
        .join(' '),
    };

    const response = await apiService.createOrder(payload as any);
    return response;
  };

  const handleShippingNext = (data: { shipping: ShippingFormData; billing: ShippingFormData; shippingMethod: string; notes: string }) => {
    setShipping(data.shipping);
    setBilling(data.billing);
    setShippingMethod(data.shippingMethod || 'Standard');
    setNotes(data.notes || '');
    // Skip payment for now; place a cash order immediately
    handlePlaceOrder(undefined, undefined);
  };

  const handlePlaceOrder = async (paidId?: string, extra?: { sourceToken?: string; status?: string }) => {
    // Store payment ID and process order
    if (paidId) setPaymentId(paidId);

    try {
      const orderRes = await createOrderFromCart(paidId ? 'card' : 'cash', paidId);
      const orderPayload = (orderRes?.data?.order) || orderRes?.order || orderRes?.data || orderRes;
      const newOrderId = Number(orderPayload?.id || orderPayload?.order_id || 0) || null;
      setCreatedOrderId(newOrderId);
      setOrderData(orderPayload);

      // If we paid by card and have a paymentId, report it to backend and save card
      if (paidId && newOrderId) {
        try {
          const proc = await squareApi.processPayment({ order_id: newOrderId, amount: Number((orderPayload?.total_amount || totalPrice).toString()), currency: 'USD', payment_id: paidId, status: extra?.status || 'COMPLETED' });
          if (proc?.success === false && proc?.errors) {
            const errs = Object.values(proc.errors as any).flat().map(String);
            setPostPayErrors(prev => [...prev, ...errs]);
          }
        } catch (e: any) {
          const msg = e?.response?.data?.message || e?.message || 'Failed to report payment to server';
          const errs = e?.response?.data?.errors;
          const flatted = errs ? (Object.values(errs).flat() as any[]).map(String) : [];
          setPostPayErrors(prev => [...prev, msg, ...flatted]);
        }
        if (extra?.sourceToken) {
          try {
            const save = await squareApi.addCustomerCard({ token: extra.sourceToken, set_as_default: false, card_data: { brand: (extra as any).cardBrand, last4: (extra as any).last4, expMonth: (extra as any).expMonth, expYear: (extra as any).expYear } });
            if (save?.success === false && save?.errors) {
              const errs = Object.values(save.errors as any).flat().map(String);
              setPostPayErrors(prev => [...prev, ...errs]);
            } else {
              setPostPayNotices(prev => [...prev, 'Card saved for future use']);
            }
          } catch (e: any) {
            const msg = e?.response?.data?.message || e?.message || 'Failed to save card';
            const errs = e?.response?.data?.errors;
            const flatted = errs ? (Object.values(errs).flat() as any[]).map(String) : [];
            setPostPayErrors(prev => [...prev, msg, ...flatted]);
          }
        }
      }
      setOrderComplete(true);
      dispatch(clearCart());
      handleNext();
    } catch (e) {
      // If order creation fails, keep the user on payment step or show error
      console.error('Order creation failed', e);
      setOrderComplete(false);
    }
  };

  // Empty cart state
  if (items.length === 0 && !orderComplete) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, px: { xs: 2, sm: 4, md: 6, lg: 2, xl: 2 } }}>
          <Box sx={{ textAlign: 'center' }}>
            <ShoppingCart sx={{ fontSize: 80, color: '#ccc', mb: 3 }} />
            <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
              Your cart is empty
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Add some items to your cart before proceeding to checkout.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/ShopGallery')}
              sx={{
                backgroundColor: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // Render step content using modular components
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CartReview onNext={handleNext} />;
      case 1:
        return <ShippingInformation onNext={handleShippingNext as any} onBack={handleBack} initialData={shipping && billing ? { shipping, billing, shippingMethod, notes } : undefined} />;
      // case 2: return (<PaymentMethod onNext={handlePlaceOrder} onBack={handleBack} amount={totalPrice} currency={'USD'} formData={paymentForm} onFormDataChange={setPaymentForm} />);
      case 2:
        return <OrderConfirmation onBack={handleBack} paymentId={paymentId} order={orderData} errors={postPayErrors} notices={postPayNotices} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '120vh', backgroundColor: '#fafafa', width: '100%' }}>
      <Header />
      
      <HeroSectionCommon
         title="Checkout"
         description="Complete your purchase with ease"
         height={{
          xs: '75px',
          sm: '70px', 
          md: '80px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
          }}
          />

             {/* Main Content Container */}
       <Box 
         sx={{ 
          py: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }, 
          px: { xs: 1, sm: 2, md: 6 },
          display: 'flex',
         
          width: { xs: '100%', sm: '100%', md: '100%', lg: '95%', xl: '85%' },
          maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '95%', xl: '85%' },
          maxHeight: { xs: '100%', sm: "100%", md: "100%" ,lg: "100%", xl: "100%"},
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: { xs: 'calc(100vh - 150px)', md: 'calc(100vh - 200px)' },
          justifyContent: 'flex-start',
          mx: 'auto',
          mt: 3
        }}>
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Stepper Section */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
             
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center'
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '& .MuiStepLabel-label': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }
                  }}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {/* Mobile Step Indicator */}
            <Box sx={{ 
              display: { xs: 'block', md: 'none' }, 
              mb: 1, 
              textAlign: 'center',
              px: 2
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'medium', 
                mb: 0.5,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {steps.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      height: { xs: 3, sm: 4 },
                      backgroundColor: index <= activeStep ? 'primary.main' : 'grey.300',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ width: '100%' }}>
            <Card sx={{ 
              p: { xs: 1.5, sm: 2, md: 3 },
              borderRadius: { xs: 2, sm: 3 },
              boxShadow: { xs: '0 4px 16px rgba(0,0,0,0.08)', sm: '0 8px 32px rgba(0,0,0,0.1)' },
              border: '1px solid',
              borderColor: 'divider',
              mx: { xs: 1, sm: 0 }
            }}>
              {renderStepContent(activeStep)}
            </Card>
                    </Box>
        </Box>
      </Box>
   </Box>
  );
};

export default Checkout; 