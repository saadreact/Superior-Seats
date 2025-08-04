import React from 'react';
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Button,
  Stack,
  Chip,
  Alert,
  Paper,
  Fade,
  Zoom
} from '@mui/material';
import { Delete, ShoppingCart, LocalShipping, Security, CheckCircle } from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';

interface CartReviewProps {
  onNext: () => void;
}

const CartReview: React.FC<CartReviewProps> = ({ onNext }) => {
  const { state, removeItem } = useCart();
  const { items, totalPrice } = state;

  if (items.length === 0) {
    return (
      <Fade in timeout={800}>
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 6, sm: 8, md: 12 },
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: { xs: '100%', sm: 450, md: 500 },
          mx: 'auto'
        }}>
          <Zoom in timeout={1000}>
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
              <ShoppingCart sx={{ 
                fontSize: { xs: 60, sm: 70, md: 80 }, 
                color: 'text.secondary', 
                mb: { xs: 1, sm: 2 },
                opacity: 0.6
              }} />
            </Box>
          </Zoom>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary" sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            fontSize: { xs: '1rem', sm: '1.1rem' }
          }}>
            Add some amazing seats to your cart to continue with checkout
          </Typography>
          <Button
            variant="contained"
            href="/shop"
            size="large"
            sx={{
              py: { xs: 1.5, sm: 2 },
              px: { xs: 4, sm: 5, md: 6 },
              borderRadius: { xs: 3, sm: 4 },
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              textTransform: 'none',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: { xs: '0 4px 16px rgba(25, 118, 210, 0.3)', sm: '0 8px 25px rgba(25, 118, 210, 0.3)' },
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                transform: { xs: 'translateY(-2px)', sm: 'translateY(-3px)' },
                boxShadow: { xs: '0 6px 20px rgba(25, 118, 210, 0.4)', sm: '0 12px 35px rgba(25, 118, 210, 0.4)' },
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: { xs: '100%', sm: '700px', md: '800px' },
        mx: 'auto',
        width: '100%',
        px: { xs: 1, sm: 2, md: 3 }
      }}>
                 {/* Enhanced Cart Review Header */}
         <Paper elevation={0} sx={{ 
           p: { xs: 2, sm: 2.5, md: 3, lg: 4 }, 
           background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
           borderRadius: { xs: 2, sm: 3, md: 4 }, 
           border: '2px solid',
           borderColor: 'primary.100',
           mb: { xs: 2, sm: 3, md: 4 },
           display: 'flex',
           alignItems: 'center',
           position: 'relative',
           overflow: 'hidden',
           width: '100%',
           flexDirection: { xs: 'column', sm: 'row' },
           textAlign: { xs: 'center', sm: 'left' },
           gap: { xs: 2, sm: 3 },
           '&::before': {
             content: '""',
             position: 'absolute',
             top: 0,
             left: 0,
             right: 0,
             height: '4px',
             background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
           }
         }}>
           <Box sx={{ 
             p: { xs: 1.5, sm: 2, md: 2.5 }, 
             borderRadius: { xs: 2, sm: 3 }, 
             background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
             mr: { xs: 0, sm: 2, md: 3 },
             mb: { xs: 2, sm: 0 },
             boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
             minWidth: { xs: '60px', sm: '70px', md: '80px' },
             height: { xs: '60px', sm: '70px', md: '80px' },
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <ShoppingCart sx={{ 
               color: 'white', 
               fontSize: { xs: 24, sm: 28, md: 32 } 
             }} />
           </Box>
           <Box sx={{ 
             flex: 1,
             display: 'flex',
             flexDirection: 'column',
             alignItems: { xs: 'center', sm: 'flex-start' },
             gap: { xs: 1.5, sm: 2 }
           }}>
             <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom sx={{ 
               fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' },
               textAlign: { xs: 'center', sm: 'left' },
               lineHeight: { xs: 1.2, sm: 1.3 }
             }}>
               Review Your Cart
             </Typography>
             <Typography variant="body1" color="text.secondary" sx={{ 
               mb: { xs: 2, sm: 1.5 },
               fontSize: { xs: '0.875rem', sm: '1rem' },
               textAlign: { xs: 'center', sm: 'left' },
               lineHeight: 1.5,
               maxWidth: { xs: '100%', sm: '90%' }
             }}>
               Please review your selected items before proceeding to checkout
             </Typography>
             <Stack 
               direction="row" 
               spacing={2} 
               alignItems="center" 
               flexWrap="wrap" 
               sx={{ 
                 gap: { xs: 1, sm: 1.5, md: 2 },
                 justifyContent: { xs: 'center', sm: 'flex-start' },
                 width: '100%'
               }}
             >
               <Chip 
                 icon={<CheckCircle />} 
                 label={`${items.length} item${items.length > 1 ? 's' : ''}`} 
                 color="primary" 
                 variant="outlined"
                 size="small"
                 sx={{ 
                   fontSize: { xs: '0.75rem', sm: '0.875rem' },
                   '& .MuiChip-label': {
                     fontSize: { xs: '0.75rem', sm: '0.875rem' }
                   },
                   height: { xs: '28px', sm: '32px' }
                 }}
               />
               <Chip 
                 icon={<LocalShipping />} 
                 label="Free shipping on orders over $500" 
                 color="success" 
                 variant="outlined"
                 size="small"
                 sx={{ 
                   fontSize: { xs: '0.75rem', sm: '0.875rem' },
                   '& .MuiChip-label': {
                     fontSize: { xs: '0.75rem', sm: '0.875rem' }
                   },
                   height: { xs: '28px', sm: '32px' }
                 }}
               />
             </Stack>
           </Box>
         </Paper>

        {/* Enhanced Cart Items */}
        <Card sx={{ 
          borderRadius: { xs: 2, sm: 3, md: 4 }, 
          boxShadow: { xs: '0 4px 16px rgba(0,0,0,0.08)', sm: '0 8px 32px rgba(0,0,0,0.08)' }, 
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          mb: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
          width: '100%',
        }}>
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              Cart Items ({items.length})
            </Typography>
          </Box>
          
          <List sx={{ p: 0 }}>
            {items.map((item, index) => (
              <Zoom in timeout={300 + index * 100} key={item.id}>
                <Box>
                  <ListItem
                    sx={{
                      py: { xs: 2, sm: 3 },
                      px: { xs: 2, sm: 3, md: 4 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: { xs: 'none', sm: 'translateX(8px)' },
                        boxShadow: { xs: 'none', sm: '0 4px 12px rgba(0,0,0,0.1)' },
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={item.image}
                        alt={item.title}
                        sx={{ 
                          width: { xs: 50, sm: 60, md: 70 }, 
                          height: { xs: 50, sm: 60, md: 70 }, 
                          mr: { xs: 2, sm: 3 },
                          border: '2px solid',
                          borderColor: 'primary.100',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom sx={{ 
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            mb: 2, 
                            lineHeight: 1.6,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}>
                            {item.description}
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ 
                            gap: { xs: 1, sm: 2 }
                          }}>
                            <Chip
                              label={`Quantity: ${item.quantity}`}
                              size="small"
                              color="primary"
                              variant="filled"
                              sx={{ 
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                '& .MuiChip-label': {
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }
                              }}
                            />
                            <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ 
                              fontSize: { xs: '1.125rem', sm: '1.5rem' }
                            }}>
                              ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                              {item.price} each
                            </Typography>
                          </Stack>
                        </Box>
                      }
                    />
                    <IconButton
                      onClick={() => removeItem(item.id)}
                      sx={{
                        color: 'error.main',
                        p: { xs: 1, sm: 1.5 },
                        border: '2px solid',
                        borderColor: 'error.light',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'error.main',
                          color: 'white',
                          transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
                          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
                        },
                      }}
                    >
                      <Delete sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                  </ListItem>
                  {index < items.length - 1 && (
                    <Divider sx={{ 
                      mx: { xs: 2, sm: 3, md: 4 }, 
                      opacity: 0.3 
                    }} />
                  )}
                </Box>
              </Zoom>
            ))}
          </List>
        </Card>

        {/* Price Breakdown */}
        <Card sx={{ 
          borderRadius: { xs: 2, sm: 3, md: 4 }, 
          boxShadow: { xs: '0 4px 16px rgba(0,0,0,0.08)', sm: '0 8px 32px rgba(0,0,0,0.08)' }, 
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          mb: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
          width: '100%',
        }}>
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              Order Summary
            </Typography>
          </Box>
          
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Subtotal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1.25rem' }
              }}>
                Subtotal ({items.length} item{items.length > 1 ? 's' : ''}):
              </Typography>
              <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1.25rem' }
              }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
            
            {/* Shipping */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 2, sm: 3 } }}>
              <Typography variant="body1" color="text.secondary" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Shipping:
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                {totalPrice > 500 ? 'Free' : '$29.99'}
              </Typography>
            </Box>
            
            {/* Tax */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 3, sm: 4 } }}>
              <Typography variant="body1" color="text.secondary" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Tax (8%):
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                ${(totalPrice * 0.08).toFixed(2)}
              </Typography>
            </Box>
            
            {/* Divider */}
            <Divider sx={{ mb: 4 }} />
            
            {/* Total */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
              borderRadius: { xs: 2, sm: 3 },
              border: '1px solid',
              borderColor: 'primary.200',
            }}>
              <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ 
                fontSize: { xs: '1.125rem', sm: '1.5rem' }
              }}>
                Total:
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ 
                fontSize: { xs: '1.125rem', sm: '1.5rem' }
              }}>
                ${(totalPrice + (totalPrice > 500 ? 0 : 29.99) + (totalPrice * 0.08)).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Enhanced Continue Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: { xs: 2, sm: 3, md: 4 },
          mb: 2,
          width: '100%'
        }}>
          <Button
            variant="contained"
            onClick={onNext}
            disabled={items.length === 0}
            size="large"
            sx={{
              py: { xs: 2, sm: 2.5 },
              px: { xs: 4, sm: 6, md: 8 },
              borderRadius: { xs: 3, sm: 4 },
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              boxShadow: { xs: '0 4px 16px rgba(25, 118, 210, 0.3)', sm: '0 8px 25px rgba(25, 118, 210, 0.3)' },
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                transform: { xs: 'translateY(-2px)', sm: 'translateY(-3px)' },
                boxShadow: { xs: '0 6px 20px rgba(25, 118, 210, 0.4)', sm: '0 12px 35px rgba(25, 118, 210, 0.4)' },
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #bdbdbd 0%, #e0e0e0 100%)',
                transform: 'none',
                boxShadow: 'none',
              },
            }}
          >
            Continue to Shipping
          </Button>
        </Box>

        {/* Security Notice */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: { xs: 2, sm: 3 }, 
          width: '100%' 
        }}>
          <Alert 
            severity="info" 
            icon={<Security />}
            sx={{ 
              borderRadius: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
              border: '1px solid',
              borderColor: 'primary.200',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '& .MuiAlert-message': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          >
            <Typography variant="body2" fontWeight="medium" sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              Your payment information is secure and encrypted. We use industry-standard security protocols.
            </Typography>
          </Alert>
        </Box>
      </Box>
    </Fade>
  );
};

export default CartReview; 