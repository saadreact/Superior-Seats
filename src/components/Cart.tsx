'use client';

import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  List,
  IconButton,
  Button,
  Card,
  CardMedia,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Delete,
  ShoppingCart,
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
  const { state, removeItem, updateQuantity } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleQuantityChange = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const formatPrice = (price: string, quantity: number) => {
    const numericPrice = parseFloat(price.replace('$', ''));
    return `$${(numericPrice * quantity).toFixed(2)}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : 450,
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
          borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: '#fafafa',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center',
            color: '#1a1a1a',
            fontSize: '1.5rem'
          }}>
            <ShoppingCart sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.8rem' }} />
            Shopping Cart
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="large"
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                color: '#333'
              }
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        {state.items.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            p: 4
          }}>
            <ShoppingCart sx={{ 
              fontSize: '5rem', 
              color: '#ccc', 
              mb: 3,
              opacity: 0.6
            }} />
            <Typography variant="h6" sx={{ 
              color: '#666', 
              mb: 1,
              fontWeight: 500,
              fontSize: '1.2rem'
            }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#999',
              fontSize: '0.95rem'
            }}>
              Add some items to get started
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              <List sx={{ p: 0 }}>
                {state.items.map((item) => (
                  <Card key={item.id} sx={{ 
                    mb: 3, 
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                      transform: 'translateY(-1px)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', p: 3 }}>
                      {/* Item Image */}
                      <CardMedia
                        component="img"
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: 2,
                          objectFit: 'cover',
                          mr: 3,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                        image={item.image}
                        alt={item.title}
                      />
                      
                      {/* Item Details */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600, 
                            mb: 0.5,
                            fontSize: '1.1rem',
                            color: '#1a1a1a'
                          }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: '#666', 
                            mb: 1.5,
                            fontSize: '0.9rem',
                            lineHeight: 1.4
                          }}>
                            {item.description}
                          </Typography>
                          <Chip
                            label={item.price}
                            size="small"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              height: 24,
                              '& .MuiChip-label': {
                                px: 1.5
                              }
                            }}
                          />
                        </Box>
                        
                        {/* Quantity Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              sx={{ 
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                width: 32,
                                height: 32,
                                '&:hover': { 
                                  backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Remove fontSize="small" sx={{ fontSize: '1rem' }} />
                            </IconButton>
                            <Typography sx={{ 
                              mx: 2.5, 
                              minWidth: 24, 
                              textAlign: 'center',
                              fontWeight: 600,
                              fontSize: '1rem',
                              color: '#1a1a1a'
                            }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              sx={{ 
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                width: 32,
                                height: 32,
                                '&:hover': { 
                                  backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Add fontSize="small" sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Box>
                          
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: 'primary.main'
                          }}>
                            {formatPrice(item.price, item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Remove Button */}
                      <IconButton
                        onClick={() => removeItem(item.id)}
                        sx={{ 
                          color: '#f44336',
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          transition: 'all 0.2s ease',
                          '&:hover': { 
                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                            transform: 'scale(1.1)',
                            color: '#d32f2f'
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>

                    </Box>
                  </Card>
                ))}
              </List>
            </Box>

            {/* Cart Summary */}
            <Box sx={{ 
              mt: 'auto', 
              p: 3,
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: '#fafafa'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#1a1a1a'
                }}>
                  Total ({state.totalItems} items):
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  fontSize: '1.3rem'
                }}>
                  ${state.totalPrice.toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  backgroundColor: 'primary.main',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart; 