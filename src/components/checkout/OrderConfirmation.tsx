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
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

interface OrderConfirmationProps {
  onBack: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onBack }) => {
  const { state, clearCart } = useCart();
  const { totalPrice } = state;
  const router = useRouter();

  const handleContinueShopping = () => {
    clearCart();
    router.push('/ShopGallery');
  };

  const handleGoHome = () => {
    clearCart();
    router.push('/');
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 4, lg: 6 } }}>
      {/* Order Confirmation Header */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        backgroundColor: 'success.50', 
        borderRadius: { xs: 2, sm: 3 }, 
        border: '1px solid', 
        borderColor: 'success.100',
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        textAlign: { xs: 'center', sm: 'left' }
      }}>
        <Box sx={{ 
          p: { xs: 1, sm: 1.5 }, 
          borderRadius: { xs: 1.5, sm: 2 }, 
          backgroundColor: 'success.main', 
          mr: { xs: 0, sm: 2 },
          mb: { xs: 1, sm: 0 }
        }}>
          <CheckCircle sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="success.main" sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
          }}>
            Order Confirmed!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Thank you for your purchase. Your order has been successfully placed.
          </Typography>
        </Box>
      </Box>

      {/* Success Alert */}
      <Alert 
        severity="success" 
        sx={{ 
          mb: 2,
          borderRadius: { xs: 2, sm: 3 },
          border: '1px solid',
          borderColor: 'success.light',
          backgroundColor: 'success.50',
          fontSize: { xs: '0.875rem', sm: '1rem' },
          '& .MuiAlert-icon': {
            color: 'success.main',
          },
        }}
      >
        🎉 Your order has been placed successfully! You will receive a confirmation email shortly.
      </Alert>

      {/* Order Details Card */}
      <Card sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: { xs: 2, sm: 3 }, 
        boxShadow: { xs: '0 2px 12px rgba(0,0,0,0.08)', sm: '0 4px 20px rgba(0,0,0,0.08)' }, 
        border: '1px solid', 
        borderColor: 'divider', 
        backgroundColor: 'background.paper',
        maxWidth: { xs: '100%', sm: 600, md: 700 },
        mx: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 2
      }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <CheckCircle sx={{ 
            fontSize: { xs: 40, sm: 48, md: 56 }, 
            color: 'success.main', 
            mb: 1 
          }} />
          <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}>
            Order #12345
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ 
            mb: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}>
            Total Amount: ${totalPrice.toFixed(2)}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Estimated delivery: 3-5 business days
          </Typography>
        </Box>

        <Divider sx={{ width: '100%', mb: 2 }} />

        {/* Order Summary */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ 
            mb: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}>
            What happens next?
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                width: { xs: 20, sm: 24 }, 
                height: { xs: 20, sm: 24 }, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mr: { xs: 1.5, sm: 2 },
                flexShrink: 0,
                mt: { xs: 0.5, sm: 0 }
              }}>
                <Typography variant="body2" color="white" fontWeight="bold" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  1
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.4
              }}>
                You&apos;ll receive an order confirmation email
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                width: { xs: 20, sm: 24 }, 
                height: { xs: 20, sm: 24 }, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mr: { xs: 1.5, sm: 2 },
                flexShrink: 0,
                mt: { xs: 0.5, sm: 0 }
              }}>
                <Typography variant="body2" color="white" fontWeight="bold" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  2
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.4
              }}>
                We&apos;ll process your order and prepare it for shipping
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                width: { xs: 20, sm: 24 }, 
                height: { xs: 20, sm: 24 }, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mr: { xs: 1.5, sm: 2 },
                flexShrink: 0,
                mt: { xs: 0.5, sm: 0 }
              }}>
                <Typography variant="body2" color="white" fontWeight="bold" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  3
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.4
              }}>
                You&apos;ll receive tracking information once shipped
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack direction="column" spacing={1.5} sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400 } }}>
          <Button
            variant="contained"
            onClick={handleContinueShopping}
            startIcon={<ShoppingCart />}
            sx={{
              py: { xs: 1.25, sm: 1.5 },
              px: { xs: 2.5, sm: 3 },
              borderRadius: { xs: 2, sm: 3 },
              fontWeight: 'bold',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textTransform: 'none',
              boxShadow: { xs: '0 2px 8px rgba(25, 118, 210, 0.3)', sm: '0 4px 12px rgba(25, 118, 210, 0.3)' },
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: { xs: 'translateY(-1px)', sm: 'translateY(-2px)' },
                boxShadow: { xs: '0 4px 12px rgba(25, 118, 210, 0.4)', sm: '0 6px 20px rgba(25, 118, 210, 0.4)' },
              },
            }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            onClick={handleGoHome}
            startIcon={<Home />}
            sx={{
              py: { xs: 1.25, sm: 1.5 },
              px: { xs: 2.5, sm: 3 },
              borderRadius: { xs: 2, sm: 3 },
              fontWeight: 'bold',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: { xs: 'translateY(-1px)', sm: 'translateY(-1px)' },
              },
            }}
          >
            Go to Home
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default OrderConfirmation; 