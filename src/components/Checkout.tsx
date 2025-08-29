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
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);
  
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
      dispatch(clearCart());
      handleNext();
    }, 2000);
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