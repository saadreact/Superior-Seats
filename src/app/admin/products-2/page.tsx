'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  ZoomIn,
  Close as CloseIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';


interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  stock: number;
  images: string[];
  seatType: string[];
  armType: string[];
  lumbarType: string[];
  reclineType: string[];
  heatOption: string[];
  materialType: string[];
  stitchPattern: string[];
  seatItemType: string[];
  color: string[];
  isActive: boolean;
  createdAt: string;
}

// Helper function to calculate total price for existing products
const calculateProductTotalPrice = (product: ProductItem): number => {
  // For now, return base price. This can be enhanced with API data later
  return product.basePrice || 0;
};

const Products2Page = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Products data
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products data
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProducts();
      
      if (response && response.data) {
        setProducts(response.data);
      } else if (Array.isArray(response)) {
        setProducts(response);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
      
      if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication required. You will be redirected to the login page in 3 seconds.');
        // Redirect to home page where user can login
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view products.');
      } else if (err.response?.status === 404) {
        setError('Products endpoint not found. Please contact support.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to load products. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAdd = () => {
    router.push('/admin/products-2/create');
  };

  const handleEdit = (product: ProductItem) => {
    router.push(`/admin/products-2/${product.id}/edit`);
  };

  const handleDelete = async (productId: string) => {
    try {
      await apiService.deleteProduct(parseInt(productId));
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const handleView = (product: ProductItem) => {
    setSelectedProduct(product);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show Products List
  return (
    <AdminLayout title="Products 2">
      <Box>
        {/* Add Product Button */}
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'flex-end', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            className="gradient-style"
            sx={{ 
              alignSelf: { xs: 'stretch', sm: 'auto' },
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                  loadProducts();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Products Cards Grid */}
        {filteredProducts.length > 0 && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(1, 1fr)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }, 
            gap: 3 
          }}>
            {filteredProducts.map((product) => (
              <Box key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                      '& .card-media': {
                        transform: 'scale(1.05)',
                      },
                      '& .zoom-icon': {
                        opacity: 1,
                      },
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                  onClick={() => handleView(product)}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0] || '/api/placeholder/150/150'}
                      alt={product.name}
                      className="card-media"
                      sx={{
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5',
                        transition: 'transform 0.3s ease',
                        height: { xs: 180, sm: 200 },
                      }}
                    />
                    
                    {/* Zoom Icon Overlay */}
                    <Box
                      className="zoom-icon"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        backgroundColor: 'rgba(211, 47, 47, 0.9)',
                        borderRadius: '50%',
                        p: 1,
                        color: 'white',
                        display: { xs: 'none', sm: 'flex' },
                      }}
                    >
                      <ZoomIn sx={{ fontSize: 24 }} />
                    </Box>

                    {/* Status Chip */}
                    <Chip
                      label={product.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={product.isActive ? 'success' : 'default'}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        fontWeight: 'bold',
                      }}
                    />

                                         {/* Price Chip */}
                     <Chip
                       label={`$${(calculateProductTotalPrice(product) || 0).toFixed(2)}`}
                       sx={{
                         position: 'absolute',
                         top: 8,
                         right: 8,
                         backgroundColor: 'primary.main',
                         color: 'white',
                         fontWeight: 'bold',
                       }}
                     />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '2.5rem',
                      }}
                    >
                      {product.name || 'Unnamed Product'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={typeof product.category === 'string' ? product.category : ((product.category as any)?.name || 'No Category')}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Stock: {product.stock || 0}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {(product.description || '').substring(0, 60)}...
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(product);
                      }}
                      title="View Details"
                      sx={{ color: 'primary.main' }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                      title="Edit"
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id);
                      }}
                      title="Delete"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        {filteredProducts.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            border: '2px dashed #ccc'
          }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No products found matching your search' : 'No products available'}
            </Typography>
          </Box>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <Box sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, sm: 2 }
          }}>
            <Paper sx={{ 
              maxWidth: 1200, 
              width: '100%', 
              maxHeight: '95vh', 
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Close Button */}
              <IconButton
                onClick={handleCloseProductModal}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 15,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#666',
                  width: 40,
                  height: 40,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    color: '#333',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
              
                             {/* Left Side - Product Image */}
               <Box sx={{ 
                 width: { xs: '100%', md: '45%' }, 
                 height: { xs: '350px', md: 'auto' },
                 position: 'relative',
                 backgroundColor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                 background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 overflow: 'hidden'
               }}>
                 <img
                   src={selectedProduct.images[0] || '/api/placeholder/150/150'}
                   alt={selectedProduct.name}
                   style={{
                     width: '85%',
                     height: '85%',
                     objectFit: 'contain',
                     borderRadius: '12px',
                     boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                   }}
                 />
                 
                 {/* Status and Price Overlay */}
                 <Box sx={{ 
                   position: 'absolute', 
                   top: 20, 
                   left: 20, 
                   display: 'flex', 
                   flexDirection: 'column', 
                   gap: 1 
                 }}>
                   <Chip
                     label={selectedProduct.isActive ? 'Active' : 'Inactive'}
                     size="small"
                     color={selectedProduct.isActive ? 'success' : 'default'}
                     sx={{ 
                       fontWeight: 'bold',
                       boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                       '& .MuiChip-label': {
                         px: 1.5,
                       }
                     }}
                   />
                                       <Chip
                      label={`$${(calculateProductTotalPrice(selectedProduct) || 0).toFixed(2)}`}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '& .MuiChip-label': {
                          px: 1.5,
                        }
                      }}
                    />
                 </Box>
               </Box>
              
                             {/* Right Side - Product Details */}
               <Box sx={{ 
                 width: { xs: '100%', md: '55%' }, 
                 p: { xs: 2, sm: 3, md: 4 }, 
                 overflow: 'auto',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: 3,
                 backgroundColor: '#ffffff'
               }}>
                 {/* Product Name and Description */}
                 <Box>
                   <Typography variant="h4" gutterBottom sx={{ 
                     fontWeight: 700, 
                     color: 'primary.main',
                     fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                     mb: 2
                   }}>
                     {selectedProduct.name || 'Unnamed Product'}
                   </Typography>
                   <Typography variant="body1" color="text.secondary" sx={{ 
                     lineHeight: 1.7,
                     fontSize: '1rem',
                     mb: 3
                   }}>
                     {selectedProduct.description || 'No description available'}
                   </Typography>
                 </Box>

                                 {/* Basic Info Grid */}
                 <Box sx={{ 
                   display: 'grid', 
                   gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
                   gap: 2 
                 }}>
                                       <Box sx={{ 
                      textAlign: 'center', 
                      p: 2.5, 
                      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <Typography variant="caption" display="block" sx={{ opacity: 0.9, mb: 0.5 }}>Total Price</Typography>
                      <Typography variant="h6" fontWeight={700}>
                        ${(calculateProductTotalPrice(selectedProduct) || 0).toFixed(2)}
                      </Typography>
                    </Box>
                   <Box sx={{ 
                     textAlign: 'center', 
                     p: 2.5, 
                     backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                     background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                     borderRadius: 3,
                     color: 'white',
                     boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
                     transition: 'transform 0.2s ease-in-out',
                     '&:hover': {
                       transform: 'translateY(-2px)',
                     }
                   }}>
                     <Typography variant="caption" display="block" sx={{ opacity: 0.9, mb: 0.5 }}>Stock</Typography>
                     <Typography variant="h6" fontWeight={700}>
                       {selectedProduct.stock || 0}
                     </Typography>
                   </Box>
                   <Box sx={{ 
                     textAlign: 'center', 
                     p: 2.5, 
                     backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                     background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                     borderRadius: 3,
                     color: 'white',
                     boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                     transition: 'transform 0.2s ease-in-out',
                     '&:hover': {
                       transform: 'translateY(-2px)',
                     }
                   }}>
                     <Typography variant="caption" display="block" sx={{ opacity: 0.9, mb: 0.5 }}>Category</Typography>
                     <Typography variant="h6" fontWeight={700}>
                       {typeof selectedProduct.category === 'string' ? selectedProduct.category : ((selectedProduct.category as any)?.name || 'No Category')}
                     </Typography>
                   </Box>
                   <Box sx={{ 
                     textAlign: 'center', 
                     p: 2.5, 
                     backgroundColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                     background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                     borderRadius: 3,
                     color: 'white',
                     boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
                     transition: 'transform 0.2s ease-in-out',
                     '&:hover': {
                       transform: 'translateY(-2px)',
                     }
                   }}>
                     <Typography variant="caption" display="block" sx={{ opacity: 0.9, mb: 0.5 }}>Created</Typography>
                     <Typography variant="h6" fontWeight={700}>
                       {selectedProduct.createdAt || 'Unknown'}
                     </Typography>
                   </Box>
                                   </Box>

                                     {/* Seat Configuration Section */}
                 <Box>
                   <Typography variant="h6" gutterBottom sx={{ 
                     fontWeight: 700, 
                     color: 'primary.main', 
                     mb: 3,
                     fontSize: '1.25rem',
                     display: 'flex',
                     alignItems: 'center',
                     gap: 1
                   }}>
                     🪑 Seat Configuration
                   </Typography>
                   <Box sx={{ 
                     display: 'grid', 
                     gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }, 
                     gap: 2.5 
                   }}>
                     <Box sx={{ 
                       p: 2.5, 
                       backgroundColor: '#f8f9fa', 
                       borderRadius: 3,
                       border: '1px solid #e9ecef',
                       transition: 'all 0.2s ease-in-out',
                       '&:hover': {
                         backgroundColor: '#e9ecef',
                         transform: 'translateY(-1px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       }
                     }}>
                       <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Seat Type</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{(selectedProduct.seatType || []).join(', ')}</Typography>
                     </Box>
                     <Box sx={{ 
                       p: 2.5, 
                       backgroundColor: '#f8f9fa', 
                       borderRadius: 3,
                       border: '1px solid #e9ecef',
                       transition: 'all 0.2s ease-in-out',
                       '&:hover': {
                         backgroundColor: '#e9ecef',
                         transform: 'translateY(-1px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       }
                     }}>
                       <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Arm Type</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{(selectedProduct.armType || []).join(', ')}</Typography>
                     </Box>
                     <Box sx={{ 
                       p: 2.5, 
                       backgroundColor: '#f8f9fa', 
                       borderRadius: 3,
                       border: '1px solid #e9ecef',
                       transition: 'all 0.2s ease-in-out',
                       '&:hover': {
                         backgroundColor: '#e9ecef',
                         transform: 'translateY(-1px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       }
                     }}>
                       <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Lumbar Type</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{(selectedProduct.lumbarType || []).join(', ')}</Typography>
                     </Box>
                     <Box sx={{ 
                       p: 2.5, 
                       backgroundColor: '#f8f9fa', 
                       borderRadius: 3,
                       border: '1px solid #e9ecef',
                       transition: 'all 0.2s ease-in-out',
                       '&:hover': {
                         backgroundColor: '#e9ecef',
                         transform: 'translateY(-1px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       }
                     }}>
                       <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Recline Type</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{(selectedProduct.reclineType || []).join(', ')}</Typography>
                     </Box>
                   </Box>
                 </Box>

                                 {/* Materials & Features Section */}
                 <Box>
                   <Typography variant="h6" gutterBottom sx={{ 
                     fontWeight: 700, 
                     color: 'primary.main', 
                     mb: 3,
                     fontSize: '1.25rem',
                     display: 'flex',
                     alignItems: 'center',
                     gap: 1
                   }}>
                     🎨 Materials & Features
                   </Typography>
                   <Box sx={{ 
                     display: 'grid', 
                     gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }, 
                     gap: 2.5 
                   }}>
                     <Box sx={{ 
                       p: 2.5, 
                       backgroundColor: '#f8f9fa', 
                       borderRadius: 3,
                       border: '1px solid #e9ecef',
                       transition: 'all 0.2s ease-in-out',
                       '&:hover': {
                         backgroundColor: '#e9ecef',
                         transform: 'translateY(-1px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       }
                     }}>
                       <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Material Type</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{(selectedProduct.materialType || []).join(', ')}</Typography>
                     </Box>
                     <Box sx={{ 
                       p: 2.5, 
                       backgroundColor: '#f8f9fa', 
                       borderRadius: 3,
                       border: '1px solid #e9ecef',
                       transition: 'all 0.2s ease-in-out',
                       '&:hover': {
                         backgroundColor: '#e9ecef',
                         transform: 'translateY(-1px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       }
                     }}>
                       <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Heat Option</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{(selectedProduct.heatOption || []).join(', ')}</Typography>
                     </Box>
                     <Box sx={{ 
                       p: 2.5, 
                       backgroundColor: '#f8f9fa', 
                       borderRadius: 3,
                       border: '1px solid #e9ecef',
                       transition: 'all 0.2s ease-in-out',
                       '&:hover': {
                         backgroundColor: '#e9ecef',
                         transform: 'translateY(-1px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       }
                     }}>
                       <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Stitch Pattern</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{(selectedProduct.stitchPattern || []).join(', ')}</Typography>
                     </Box>
                     <Box sx={{ 
                       p: 2.5, 
                       backgroundColor: '#f8f9fa', 
                       borderRadius: 3,
                       border: '1px solid #e9ecef',
                       transition: 'all 0.2s ease-in-out',
                       '&:hover': {
                         backgroundColor: '#e9ecef',
                         transform: 'translateY(-1px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                       }
                     }}>
                       <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Color</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{(selectedProduct.color || []).join(', ')}</Typography>
                     </Box>
                   </Box>
                 </Box>

                                 {/* Price Breakdown Section */}
                 <Box>
                   <Typography variant="h6" gutterBottom sx={{ 
                     fontWeight: 700, 
                     color: 'primary.main', 
                     mb: 3,
                     fontSize: '1.25rem',
                     display: 'flex',
                     alignItems: 'center',
                     gap: 1
                   }}>
                     💰 Price Breakdown
                   </Typography>
                   <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', border: '2px solid #e3f2fd' }}>
                     <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Base Price</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>${(selectedProduct.basePrice || 0).toFixed(2)}</Typography>
                       </Box>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Category</Typography>
                     
                       </Box>
                     </Box>
                     
                     <Divider sx={{ my: 2 }} />
                     
                     <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Seat Type</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
                           {(selectedProduct.seatType || []).join(', ')}
                         </Typography>
                       </Box>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Material</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
                           {(selectedProduct.materialType || []).join(', ')}
                         </Typography>
                       </Box>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Heat Option</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
                           {(selectedProduct.heatOption || []).join(', ')}
                         </Typography>
                       </Box>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Recline Type</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
                           {(selectedProduct.reclineType || []).join(', ')}
                         </Typography>
                       </Box>
                     </Box>
                     
                     <Divider sx={{ my: 2 }} />
                     
                     <Box sx={{ textAlign: 'center', pt: 2 }}>
                       <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700 }}>
                         Total Price: ${(calculateProductTotalPrice(selectedProduct) || 0).toFixed(2)}
                       </Typography>
                       <Typography variant="caption" color="text.secondary">
                         *Includes base price plus all selected options
                       </Typography>
                     </Box>
                   </Paper>
                 </Box>

             {/* Action Buttons */}
                 <Box sx={{ 
                   display: 'flex', 
                   gap: 3, 
                   justifyContent: 'center',
                   pt: 3,
                   borderTop: '2px solid #e9ecef',
                   mt: 'auto'
                 }}>
                   <Button
                     variant="outlined"
                     startIcon={<EditIcon />}
                     onClick={() => {
                       handleEdit(selectedProduct);
                       handleCloseProductModal();
                     }}
                     sx={{
                       px: 4,
                       py: 1.5,
                       borderRadius: 2,
                       borderWidth: 2,
                       fontWeight: 600,
                       fontSize: '1rem',
                       '&:hover': {
                         borderWidth: 2,
                         transform: 'translateY(-2px)',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                       },
                       transition: 'all 0.2s ease-in-out',
                     }}
                   >
                     Edit Product
                   </Button>
                   <Button
                     variant="contained"
                     color="error"
                     startIcon={<DeleteIcon />}
                     onClick={() => {
                       handleDelete(selectedProduct.id);
                       handleCloseProductModal();
                     }}
                     sx={{
                       px: 4,
                       py: 1.5,
                       borderRadius: 2,
                       fontWeight: 600,
                       fontSize: '1rem',
                       backgroundColor: '#dc3545',
                       '&:hover': {
                         backgroundColor: '#c82333',
                         transform: 'translateY(-2px)',
                         boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                       },
                       transition: 'all 0.2s ease-in-out',
                     }}
                   >
                     Delete Product
                   </Button>
                 </Box>
              </Box>
            </Paper>
          </Box>
        )}
          </>
        )}
      </Box>
    </AdminLayout>
  );
};

export default Products2Page;

