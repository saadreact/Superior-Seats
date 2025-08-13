'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeItem, updateQuantity } from '@/store/cartSlice';
import { CartItem } from '@/store/cartSlice';
import { processImageUrl } from '@/services/api';

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart) as { items: CartItem[]; totalItems: number; totalPrice: number };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleQuantityChange = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
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
          width: { xs: '100%', sm: 400, md: 450 },
          backgroundColor: '#ffffff',
          boxShadow: { xs: '-4px 0 16px rgba(0, 0, 0, 0.1)', sm: '-8px 0 32px rgba(0, 0, 0, 0.15)' },
          borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 2.5, md: 3 }, 
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
            fontSize: { xs: '1.25rem', sm: '1.4rem', md: '1.5rem' }
          }}>
            <ShoppingCart sx={{ 
              mr: { xs: 1, sm: 1.25, md: 1.5 }, 
              color: 'primary.main', 
              fontSize: { xs: '1.5rem', sm: '1.6rem', md: '1.8rem' } 
            }} />
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
        {items.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            p: { xs: 3, sm: 4 }
          }}>
            <ShoppingCart sx={{ 
              fontSize: { xs: '3.5rem', sm: '4rem', md: '5rem' }, 
              color: '#ccc', 
              mb: { xs: 2, sm: 3 },
              opacity: 0.6
            }} />
            <Typography variant="h6" sx={{ 
              color: '#666', 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
            }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#999',
              fontSize: { xs: '0.875rem', sm: '0.9rem', md: '0.95rem' },
              mb: 3
            }}>
              Add some items to get started
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
                router.push('/ShopGallery');
              }}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: { xs: '0.875rem', sm: '0.9rem', md: '0.95rem' },
                px: { xs: 2, sm: 2.5, md: 3 },
                py: { xs: 0.75, sm: 1, md: 1.25 },
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, sm: 2.5, md: 3 } }}>
              <List sx={{ p: 0 }}>
                {items.map((item: CartItem) => (
                  <Card key={item.id} sx={{ 
                    mb: { xs: 2, sm: 2.5, md: 3 }, 
                    boxShadow: { xs: '0 1px 8px rgba(0,0,0,0.06)', sm: '0 2px 12px rgba(0,0,0,0.08)' },
                    borderRadius: { xs: 1.5, sm: 2 },
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: { xs: '0 2px 12px rgba(0,0,0,0.1)', sm: '0 4px 20px rgba(0,0,0,0.12)' },
                      transform: 'translateY(-1px)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', p: { xs: 2, sm: 2.5, md: 3 } }}>
                      {/* Item Image */}
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: 70, sm: 80, md: 90 },
                          height: { xs: 70, sm: 80, md: 90 },
                          borderRadius: { xs: 1.5, sm: 2 },
                          objectFit: 'cover',
                          mr: { xs: 2, sm: 2.5, md: 3 },
                          boxShadow: { xs: '0 1px 4px rgba(0,0,0,0.08)', sm: '0 2px 8px rgba(0,0,0,0.1)' },
                          backgroundColor: '#f5f5f5',
                        }}
                        image={processImageUrl(item.image)}
                        alt={item.title}
                        onError={(e) => {
                          console.error('Image failed to load:', item.image);
                          console.error('Item details:', item);
                          // Set a fallback image or hide the image
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', item.image);
                        }}
                      />
                      
                      {/* Item Details */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600, 
                            mb: 0.5,
                            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                            color: '#1a1a1a'
                          }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: '#666', 
                            mb: 1.5,
                            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                            lineHeight: 1.4
                          }}>
                            {item.description}
                          </Typography>
                        </Box>
                        
                        {/* Quantity Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              sx={{ 
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                width: { xs: 28, sm: 30, md: 32 },
                                height: { xs: 28, sm: 30, md: 32 },
                                '&:hover': { 
                                  backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Remove fontSize="small" sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }} />
                            </IconButton>
                            <Typography sx={{ 
                              mx: { xs: 2, sm: 2.25, md: 2.5 }, 
                              minWidth: { xs: 20, sm: 22, md: 24 }, 
                              textAlign: 'center',
                              fontWeight: 600,
                              fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                              color: '#1a1a1a'
                            }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              sx={{ 
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                width: { xs: 28, sm: 30, md: 32 },
                                height: { xs: 28, sm: 30, md: 32 },
                                '&:hover': { 
                                  backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Add fontSize="small" sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' } }} />
                            </IconButton>
                          </Box>
                          
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                            color: 'primary.main',
                            ml: { xs: 1, sm: 1.5, md: 2 }
                          }}>
                            {formatPrice(item.price, item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Remove Button */}
                      <IconButton
                        onClick={() => dispatch(removeItem(item.id))}
                        sx={{ 
                          color: '#f44336',
                          width: { xs: 32, sm: 34, md: 36 },
                          height: { xs: 32, sm: 34, md: 36 },
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
              p: { xs: 2, sm: 2.5, md: 3 },
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: '#fafafa'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 2, sm: 2.5, md: 3 } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                  color: '#1a1a1a'
                }}>
                  Total ({totalItems} items):
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' }
                }}>
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5, md: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={() => {
                    onClose();
                    router.push('/ShopGallery');
                  }}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                    fontWeight: 600,
                    borderRadius: { xs: 1.5, sm: 2 },
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => {
                    onClose();
                    router.push('/checkout');
                  }}
                  sx={{
                    backgroundColor: 'primary.main',
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    borderRadius: { xs: 1.5, sm: 2 },
                    textTransform: 'none',
                    boxShadow: { xs: '0 2px 8px rgba(211, 47, 47, 0.25)', sm: '0 4px 12px rgba(211, 47, 47, 0.3)' },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      boxShadow: { xs: '0 4px 12px rgba(211, 47, 47, 0.35)', sm: '0 6px 20px rgba(211, 47, 47, 0.4)' },
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart; 