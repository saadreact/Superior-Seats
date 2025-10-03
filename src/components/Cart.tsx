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
  Tooltip,
  Snackbar,
  Alert,
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
import { useAppSelector } from '@/store/hooks';
import AuthModal from './AuthModal';
import { apiService } from '@/utils/api';

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart) as { items: CartItem[]; totalItems: number; totalPrice: number };
  const { isAuthenticated } = useAppSelector((s: any) => s.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  const [stockError, setStockError] = React.useState<string | null>(null);

  const handleQuantityChange = async (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) return;
    // On increment, validate against stock from API
    if (change > 0) {
      try {
        const product = await apiService.getProduct(id as any);
        const stock = Number((product as any)?.stock ?? NaN);
        if (Number.isFinite(stock) && stock >= 0 && newQuantity > stock) {
          setStockError(`Only ${stock} in stock for this product.`);
          return;
        }
      } catch {}
    }
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const formatPrice = (price: string, quantity: number) => {
    const numericPrice = parseFloat(price.replace(/[$,]/g, ''));
    const totalPrice = numericPrice * quantity;
    return `$${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420, md: 480 },
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
              mb: { xs: 3, sm: 4 }
            }}>
              Add some items to get started
            </Typography>
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                onClose();
                router.push('/shop-now');
              }}
              sx={{
                backgroundColor: 'primary.main',
                py: { xs: 1, sm: 1.25, md: 1.5 },
                px: { xs: 2, sm: 2.5, md: 3 },
                fontSize: { xs: '0.875rem', sm: '0.9rem', md: '0.95rem' },
                fontWeight: 600,
                borderRadius: 1,
                textTransform: 'none',
                boxShadow: '0 2px 4px rgba(211, 47, 47, 0.2)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: '0 4px 8px rgba(211, 47, 47, 0.3)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Add to Cart
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              pr: { xs: 0.5, sm: 1, md: 1.5 } // Minimal padding on right to prevent cutoff
            }}>
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
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: { xs: 1.5, sm: 2, md: 2.5 },
                      pr: { xs: 0.5, sm: 1, md: 1.5 }, // Minimal padding on right
                      gap: { xs: 1.5, sm: 2, md: 2.5 }
                    }}>
                      {/* Item Image */}
                      <Box sx={{ 
                        position: 'relative', 
                        width: { xs: 60, sm: 70, md: 80 },
                        height: { xs: 60, sm: 70, md: 80 },
                        borderRadius: { xs: 1.5, sm: 2 },
                        boxShadow: { xs: '0 1px 4px rgba(0,0,0,0.08)', sm: '0 2px 8px rgba(0,0,0,0.1)' },
                        backgroundColor: '#f8f9fa',
                        border: '1px solid rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {item.image && item.image !== '/placeholder-image.jpg' ? (
                          <>
                            <CardMedia
                              component="img"
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              image={item.image}
                              alt={item.title}
                              onError={(e: any) => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = 'none';
                                const fallback = img.parentElement?.querySelector('.cart-no-image-fallback');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                            {/* Hidden fallback shown when image fails to load */}
                            <Box
                              className="cart-no-image-fallback"
                              sx={{
                                display: 'none',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid rgba(0,0,0,0.05)',
                                borderRadius: { xs: 1.5, sm: 2 },
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                                  fontWeight: 'medium',
                                  textAlign: 'center',
                                }}
                              >
                                No Image
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid rgba(0,0,0,0.05)',
                              borderRadius: { xs: 1.5, sm: 2 },
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                                fontWeight: 'medium',
                                textAlign: 'center',
                              }}
                            >
                              No Image
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      {/* Item Details */}
                      <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center',
                        minHeight: { xs: 60, sm: 70, md: 80 }
                      }}>
                        {/* Product Title */}
                        <Box sx={{ mb: 2 }}>
                          <Tooltip 
                            title={item.title}
                            placement="top"
                            arrow
                            sx={{
                              '& .MuiTooltip-tooltip': {
                                backgroundColor: 'rgba(0, 0, 0, 0.87)',
                                color: 'white',
                                fontSize: '0.875rem',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                maxWidth: '300px',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                textAlign: 'center',
                              },
                              '& .MuiTooltip-arrow': {
                                color: 'rgba(0, 0, 0, 0.87)',
                              }
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 600, 
                              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                              color: '#1a1a1a',
                              lineHeight: 1.3,
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              hyphens: 'auto',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'help'
                            }}>
                              {item.title}
                            </Typography>
                          </Tooltip>
                        </Box>
                        
                        {/* Bottom Row: Quantity Controls and Price */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mt: 'auto'
                        }}>
                          {/* Quantity Controls */}
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
                          
                          {/* Price */}
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                            color: 'primary.main'
                          }}>
                            {formatPrice(item.price, item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Remove Button */}
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: 36, sm: 40, md: 44 }, // Ensure enough space
                        height: { xs: 60, sm: 70, md: 80 }, // Match item height
                        flexShrink: 0
                      }}>
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
                  Total ({items.reduce((sum, item) => sum + item.quantity, 0)} items):
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' }
                }}>
                  ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              {!isAuthenticated ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => {
                    setAuthModalOpen(true);
                  }}
                  sx={{
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    height: { xs: '30px', sm: '30px', md: '40px', lg: '40px', xl: '40px' },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 'medium',
                    borderRadius: { xs: 1.5, sm: 2 },
                    textTransform: 'none',
                    backgroundColor: 'primary.main',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Sign In to Create Order
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => {
                    onClose();
                    router.push('/shop/orders/create');
                  }}
                  sx={{
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    height: { xs: '30px', sm: '30px', md: '40px', lg: '40px', xl: '40px' },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 'medium',
                    borderRadius: { xs: 1.5, sm: 2 },
                    textTransform: 'none',
                    backgroundColor: 'primary.main',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Create Order
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
      
      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </Drawer>
    {/* Stock error snackbar */}
    <Snackbar open={!!stockError} autoHideDuration={3000} onClose={() => setStockError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={() => setStockError(null)} severity="error" sx={{ width: '100%' }}>
        {stockError}
      </Alert>
    </Snackbar>
    </>
  );
};

export default Cart; 