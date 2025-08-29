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
  Zoom,
  Grid
} from '@mui/material';
import { Delete, ShoppingCart, LocalShipping, Security, CheckCircle } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeItem } from '@/store/cartSlice';

interface CartReviewProps {
  onNext: () => void;
}

const CartReview: React.FC<CartReviewProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) {
    return (
      <Fade in timeout={800}>
        <Box sx={{ 
          mt: { xs: 8, sm: 9, md: 10, lg: 11 }
        }}>
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 6, sm: 8, md: 12 },
            px: { xs: 1.5, sm: 2, md: 3 },
            maxWidth: { xs: '100%', sm: 400, md: 450 },
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
          <Typography variant="h4" gutterBottom fontWeight="medium" color="text.primary" sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 'regular'
          }}>
            Add some amazing seats to your cart to continue with checkout
          </Typography>
          <Button
            variant="contained"
            href="/shop"
           
            sx={{
           
              py: { xs: 1.5, sm: 2, md: 1.8, lg: 1.5, xl: 1.5 },
              px: { xs: 4, sm: 5, md: 6 },
              borderRadius: { xs: 3, sm: 4 },
              fontWeight: 'regular',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1rem' , lg: '1.2rem', xl: '1.2rem' },
              textTransform: 'none',
                             background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
               boxShadow: { xs: '0 4px 16px rgba(211, 47, 47, 0.3)', sm: '0 8px 25px rgba(211, 47, 47, 0.3)' },
               '&:hover': {
                 background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                transform: { xs: 'translateY(-2px)', sm: 'translateY(-3px)' },
                boxShadow: { xs: '0 6px 20px rgba(211, 47, 47, 0.4)', sm: '0 12px 35px rgba(211, 47, 47, 0.4)' },
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Continue Shopping
          </Button>
          </Box>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box sx={{ 
        mt: { xs: 2, sm: 2, md: 2, lg: 1 },
      }}>
                                   <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 2, sm: 2.5, md: 3, lg: 2.5 },
            width: { xs: '95%', sm: '92%', md: '90%', lg: '100%' ,xl: '95%'},
            mx: 'auto',
            px: { xs: 0.5, sm: 1, md: 1 },
            alignItems: 'flex-start'
          }}>
                         {/* Left Column - Cart Items */}
             <Box sx={{ flex: { lg: 2.2, xl: 2.5 }, width: '100%' }}>
            <Card sx={{ 
              borderRadius: { xs: 2, sm: 3, md: 4 }, 
              boxShadow: { xs: '0 4px 16px rgba(0,0,0,0.08)', sm: '0 8px 32px rgba(0,0,0,0.08)' }, 
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              overflow: 'hidden',
              height: 'fit-content',
            }}>
                     <Box sx={{ 
             p: { xs: 1.5, sm: 2, md: 1.8, lg: 1.5 }, 
             background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
             borderBottom: '1px solid',
             borderColor: 'divider'
           }}>
             <Typography variant="h6" fontWeight="medium" color="text.primary" sx={{ 
               fontSize: { xs: '0.9rem', sm: '1rem', md: '0.95rem', lg: '1rem' ,xl: '1.2rem'}
             }}>
               Cart Items ({items.length})
             </Typography>
           </Box>
          
           <Box sx={{ 
              height: '500px', 
              overflowY: 'auto',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '4px',
                '&:hover': {
                  background: '#a8a8a8',
                },
              },
            }}>
             <List sx={{ p: 0 }}>
               {items.map((item, index) => (
              <Zoom in timeout={300 + index * 100} key={item.id}>
                <Box>
                                       <ListItem
                       sx={{
                         py: { xs: 1.5, sm: 2, md: 1.8, lg: 1.5 },
                         px: { xs: 1.5, sm: 2, md: 2, lg: 1.8 },
                         transition: 'all 0.3s ease',
                         '&:hover': {
                           backgroundColor: 'action.hover',
                           transform: { xs: 'none', sm: 'translateX(4px)', md: 'translateX(2px)' },
                           boxShadow: { xs: 'none', sm: '0 4px 12px rgba(0,0,0,0.1)' },
                         },
                       }}
                     >
                    <ListItemAvatar>
                                             <Avatar
                         src={item.image && item.image.trim() !== '' ? item.image : undefined}
                         alt={item.title}
                         sx={{ 
                           width: { xs: 40, sm: 50, md: 55, lg: 50 }, 
                           height: { xs: 40, sm: 50, md: 55, lg: 50 }, 
                           mr: { xs: 1.5, sm: 2, md: 1.8, lg: 1.5 },
                           border: '2px solid',
                           borderColor: 'primary.100',
                           boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                         }}
                       >
                        {(!item.image || item.image.trim() === '') && (
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>
                            {item.title.charAt(0).toUpperCase()}
                          </Typography>
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                                                 <Typography variant="h6" fontWeight="medium" color="text.primary" gutterBottom sx={{ 
                           fontSize: { xs: '0.9rem', sm: '1rem', md: '0.95rem', lg: '0.9rem' }
                         }}>
                           {item.title}
                         </Typography>
                      }
                      secondary={
                        <Box>
                                                     <Typography variant="body2" color="text.secondary" sx={{ 
                             mb: { xs: 1.5, md: 1.2, lg: 1 }, 
                             lineHeight: 1.5,
                             fontWeight: 'regular',
                             fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.8rem', lg: '0.75rem' }
                           }}>
                             {item.description}
                           </Typography>
                                                     <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ 
                             gap: { xs: 1, sm: 1.5, md: 1.2, lg: 1 }
                           }}>
                                                         <Chip
                               label={`Quantity: ${item.quantity}`}
                               size="small"
                               color="error"
                               variant="filled"
                                                                sx={{ 
                                   fontWeight: 'medium',
                                   background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.75rem', lg: '0.7rem' },
                                  '& .MuiChip-label': {
                                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.75rem', lg: '0.7rem' }
                                  }
                                }}
                            />
                                                         <Typography variant="h5" color="error.main" fontWeight="medium" sx={{ 
                               fontSize: { xs: '1rem', sm: '1.1rem', md: '1rem', lg: '0.95rem' }
                             }}>
                               ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                             </Typography>
                                                         <Typography variant="body2" color="text.secondary" sx={{ 
                               fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.75rem', lg: '0.7rem' }
                             }}>
                               {item.price} each
                             </Typography>
                          </Stack>
                        </Box>
                      }
                      secondaryTypographyProps={{
                        component: 'div'
                      }}
                    />
                                         <IconButton
                       onClick={() => dispatch(removeItem(item.id))}
                       sx={{
                         color: 'error.main',
                         p: { xs: 1, sm: 1.2, md: 1, lg: 0.8 },
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
                                             <Delete sx={{ fontSize: { xs: 20, sm: 22, md: 20, lg: 18 } }} />
                    </IconButton>
                  </ListItem>
                                     {index < items.length - 1 && (
                     <Divider sx={{ 
                       mx: { xs: 2, sm: 2.5, md: 2, lg: 1.5 }, 
                       opacity: 0.3 
                     }} />
                   )}
                                 </Box>
               </Zoom>
             ))}
             </List>
           </Box>
            </Card>
          </Box>

                     {/* Right Column - Order Summary */}
           <Box sx={{ flex: { lg: 0.9, xl: 1 }, width: '100%' }}>
            <Card sx={{ 
              borderRadius: { xs: 2, sm: 3, md: 4 }, 
              boxShadow: { xs: '0 4px 16px rgba(0,0,0,0.08)', sm: '0 8px 32px rgba(0,0,0,0.08)' }, 
              border: '1px solid',
             
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              overflow: 'hidden',
              height: 'fit-content',
              position: 'sticky',
              top: 20,
            }}>
                     <Box sx={{ 
             p: { xs: 1.5, sm: 2, md: 1.8, lg: 1.9, xl: 2 }, 
             background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
             borderBottom: '1px solid',
            
             borderColor: 'divider'
           }}>
             <Typography variant="h3" fontWeight="medium" color="text.primary" sx={{ 
               fontSize: { xs: '0.9rem', sm: '1rem', md: '0.95rem', lg: '1rem' ,xl: '1.2rem'}
             }}>
               Order Summary
             </Typography>
           </Box>
          
          <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
            {/* Subtotal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ 
                fontSize: { xs: '0.8rem', sm: '1rem' }
              }}>
                Subtotal ({items.length} item{items.length > 1 ? 's' : ''}):
              </Typography>
                             <Typography variant="h3" fontWeight={400} color="error.main" sx={{ 
                 fontSize: { xs: '0.8rem', sm: '1rem' }
               }}>
                 ${totalPrice.toFixed(2)}
               </Typography>
            </Box>
            
            {/* Shipping */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1.5, sm: 2 } }}>
              <Typography variant="body1" color="text.secondary" sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                Shipping:
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {totalPrice > 500 ? 'Free' : '$29.99'}
              </Typography>
            </Box>
            
            {/* Tax */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 2, sm: 2.5 } }}>
              <Typography variant="body1" color="text.secondary" sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                Tax (8%):
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                ${(totalPrice * 0.08).toFixed(2)}
              </Typography>
            </Box>
            
            {/* Divider */}
            <Divider sx={{ mb: 2.5 }} />
            
            {/* Total */}
                         <Box sx={{ 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center',
               p: { xs: 1.5, sm: 2 },
              // background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
               borderRadius: { xs: 2, sm: 3 },
               border: '1px solid',
               borderColor: 'error.200',
             }}>
               <Typography variant="h5" fontWeight="medium" color="error.main" sx={{ 
                 fontSize: { xs: '1rem', sm: '1.25rem' }
               }}>
                 Total:
               </Typography>
               <Typography variant="h5" fontWeight="medium" color="error.main" sx={{ 
                 fontSize: { xs: '1rem', sm: '1.25rem' }
               }}>
                 ${(totalPrice + (totalPrice > 500 ? 0 : 29.99) + (totalPrice * 0.08)).toFixed(2)}
                               </Typography>
              </Box>
            </Box>

            {/* Continue Button inside Order Summary */}
            <Box sx={{ p: { xs: 1.5, sm: 2, md: 2, lg: 1.8 } }}>
              <Button
                variant="contained"
                onClick={onNext}
                disabled={items.length === 0}
                size="large"
                fullWidth
                sx={{
                  py: { xs: 1.5, sm: 1.5 },
                  px: { xs: 3, sm: 4, md: 3 },
                  borderRadius: { xs: 3, sm: 4, md: 4 ,lg: 2 ,xl: 2},
                  fontWeight: 'regular',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' ,lg: '1.2rem', xl: '1.2rem'},
                  textTransform: 'none',
                  backgroundColor: 'primary.main',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: { xs: 'translateY(-2px)', sm: 'translateY(-3px)' },
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.400',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                Continue to Shipping
              </Button>
            </Box>
          </Card>
        </Box>
        </Box>

        {/* Security Notice */}
        {/* <Box sx={{ 
          textAlign: 'center', 
          mt: { xs: 1.5, sm: 2 }, 
          width: '100%' 
        }}>
                     <Alert 
             severity="info" 
             icon={<Security />}
             sx={{ 
               borderRadius: { xs: 2, sm: 3 },
               background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
               border: '1px solid',
               borderColor: 'error.200',
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
        </Box> */}
      </Box>
    </Fade>
  );
};

export default CartReview; 