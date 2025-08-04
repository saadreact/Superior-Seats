'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useCart } from '@/contexts/CartContext';
import { CartReview, ShippingInformation, PaymentMethod, OrderConfirmation } from './checkout/index';

// Steps array with proper spacing and comments
const steps = [
  'Cart Review',           // Step 1: Review cart items
  'Shipping Information',  // Step 2: Enter shipping details
  'Payment Method',        // Step 3: Choose payment method
  'Order Confirmation'     // Step 4: Confirm order
];

const Checkout = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, clearCart } = useCart();
  
  const [activeStep, setActiveStep] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = () => {
    // Simulate order processing
    setTimeout(() => {
      setOrderComplete(true);
      clearCart();
      handleNext();
    }, 2000);
  };

  // Empty cart state
  if (state.items.length === 0 && !orderComplete) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, px: { xs: 2, sm: 4, md: 6 } }}>
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
        return <ShippingInformation onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <PaymentMethod onNext={handlePlaceOrder} onBack={handleBack} />;
      case 3:
        return <OrderConfirmation onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
          color: 'white',
          py: { xs: 4, sm: 6 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Checkout
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Complete your order with secure payment
          </Typography>
        </Container>
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ 
        py: { xs: 2, sm: 4, md: 6 }, 
        px: { xs: 1, sm: 2, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: { xs: 'calc(100vh - 150px)', md: 'calc(100vh - 200px)' },
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          width: '100%',
          maxWidth: { xs: '100%', sm: '800px', md: '900px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Stepper Section */}
          <Box sx={{ width: '100%', mb: { xs: 2, sm: 3, md: 4 } }}>
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
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
              mb: { xs: 2, sm: 3 }, 
              textAlign: 'center',
              px: 2
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' }
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
              p: { xs: 2, sm: 3, md: 4 },
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
      </Container>
    </Box>
  );
};

export default Checkout; 