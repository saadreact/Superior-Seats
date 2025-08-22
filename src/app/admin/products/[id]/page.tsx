'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  Container,
  Avatar,
  Stack,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as PriceIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import Image from 'next/image';

interface Variation {
  id: number;
  name: string;
  stitch_pattern: string;
  arm_type: string;
  lumbar: string;
  recline_type: string;
  seat_type: string;
  material_type: string;
  heat_option: string;
  seat_item_type: string;
  color: string;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
    description: string;
    slug: string;
    image_url: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
  } | null;
  price: string;
  stock: number;
  images?: string[];
  product_images?: Array<{
    id: number;
    product_id: number;
    image_path: string;
    image_url: string;
    alt_text: string;
    caption: string | null;
    sort_order: number;
    is_primary: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
  primary_image?: {
    id: number;
    product_id: number;
    image_path: string;
    image_url: string;
    alt_text: string;
    caption: string | null;
    sort_order: number;
    is_primary: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variations: Variation[];
}

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProduct(parseInt(productId));
      console.log('Product view API response:', response);
      
      // Handle the new response structure
      let productData;
      if (response && response.data) {
        productData = response.data;
      } else if (response) {
        productData = response;
      } else {
        throw new Error('Invalid response structure');
      }
      
      setProduct(productData);
    } catch (err: any) {
      if (err.message.includes('404') || err.message.includes('not found')) {
        setError('Product not found');
      } else {
        setError(err.message || 'Failed to load product');
      }
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleEdit = () => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <AdminLayout title="Product Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout title="Product Details">
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Product not found'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
          >
            Back to Products
          </Button>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Product: ${product.name}`}>
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                variant="outlined"
                sx={{ 
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    bgcolor: '#f1f5f9'
                  }
                }}
              >
                Back to Products
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{ 
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)'
                }}
              >
                Edit Product
              </Button>
            </Stack>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                color: '#1e293b', 
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                {product.name}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#64748b', 
                fontWeight: 400,
                mb: 2
              }}>
                {product.description}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Chip 
                icon={<CategoryIcon />}
                label={product.category?.name || 'No Category'} 
                sx={{ 
                  borderRadius: '20px',
                  bgcolor: '#dbeafe',
                  color: '#1e40af',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: '#3b82f6' }
                }}
              />
              <Chip 
                icon={<VisibilityIcon />}
                label={product.is_active ? 'Active' : 'Inactive'} 
                sx={{ 
                  borderRadius: '20px',
                  bgcolor: product.is_active ? '#dcfce7' : '#fef2f2',
                  color: product.is_active ? '#166534' : '#dc2626',
                  fontWeight: 600,
                  '& .MuiChip-icon': { 
                    color: product.is_active ? '#22c55e' : '#ef4444' 
                  }
                }}
              />
            </Stack>
          </Box>

          <Grid container spacing={4}>
            {/* Left Column - Images */}
            <Grid item xs={12} lg={8}>
              {product.product_images && product.product_images.length > 0 ? (
                <Box>
                  {/* Primary Image */}
                  {product.primary_image && (
                    <Paper sx={{ 
                      p: 0, 
                      mb: 3, 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0'
                    }}>
                      <Box sx={{ 
                        position: 'relative',
                        width: '100%',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f8fafc'
                      }}>
                        <Image
                          src={product.primary_image.image_url}
                          alt={product.primary_image.alt_text || `${product.name} - Primary Image`}
                          width={600}
                          height={400}
                          style={{ 
                            objectFit: 'contain', 
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            bgcolor: '#3b82f6',
                            color: 'white',
                            px: 3,
                            py: 1,
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          Primary Image
                        </Box>
                      </Box>
                    </Paper>
                  )}

                  {/* Image Gallery */}
                  <Paper sx={{ 
                    p: 4, 
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    bgcolor: 'white'
                  }}>
                    <Typography variant="h6" sx={{ 
                      mb: 3, 
                      fontWeight: 700, 
                      color: '#1e293b'
                    }}>
                      Product Gallery ({product.product_images.length} images)
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {product.product_images.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} key={image.id}>
                          <Box sx={{ position: 'relative' }}>
                            <Paper sx={{ 
                              borderRadius: '12px', 
                              overflow: 'hidden',
                              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                              border: image.is_primary ? '3px solid #3b82f6' : '1px solid #e2e8f0',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                              }
                            }}>
                              <Box sx={{
                                width: '100%',
                                height: '180px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#f8fafc',
                                position: 'relative'
                              }}>
                                <Image
                                  src={image.image_url}
                                  alt={image.alt_text || `${product.name} - Image ${index + 1}`}
                                  width={200}
                                  height={150}
                                  style={{ 
                                    objectFit: 'contain', 
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    width: 'auto',
                                    height: 'auto'
                                  }}
                                />
                              {image.is_primary && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    bgcolor: '#3b82f6',
                                    color: 'white',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    boxShadow: '0 2px 4px 0 rgba(59, 130, 246, 0.3)',
                                  }}
                                >
                                  Primary
                                </Box>
                              )}
                            </Box>
                            </Paper>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mt: 1, 
                                textAlign: 'center',
                                color: '#64748b',
                                fontWeight: 500,
                                fontSize: '0.875rem'
                              }}
                            >
                              {image.alt_text || `Image ${index + 1}`}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              ) : (
                <Paper sx={{ 
                  p: 6, 
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  bgcolor: 'white',
                  textAlign: 'center'
                }}>
                  <Box sx={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%', 
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    <TagIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#475569', fontWeight: 600 }}>
                    No Images Available
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    This product doesn't have any images uploaded yet.
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Right Column - Product Info */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                {/* Key Metrics */}
                <Paper sx={{ 
                  p: 4, 
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  bgcolor: 'white'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
                    Product Metrics
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: '#dbeafe', 
                      borderRadius: '12px',
                      border: '1px solid #bfdbfe'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48 }}>
                          <PriceIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e40af' }}>
                            ${product.price}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Product Price
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: '#dcfce7', 
                      borderRadius: '12px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#22c55e', width: 48, height: 48 }}>
                          <InventoryIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: '#166534' }}>
                            {product.stock}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Units in Stock
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>

                {/* Product Details */}
                <Paper sx={{ 
                  p: 4, 
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  bgcolor: 'white'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
                    Product Details
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Category
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {product.category?.name || 'No category'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Status
                      </Typography>
                      <Chip 
                        label={product.is_active ? 'Active' : 'Inactive'} 
                        size="small"
                        sx={{ 
                          bgcolor: product.is_active ? '#dcfce7' : '#fef2f2',
                          color: product.is_active ? '#166534' : '#dc2626',
                          fontWeight: 600,
                          borderRadius: '12px'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Created
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {new Date(product.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        Updated
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {new Date(product.updated_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>

          {/* Variations Section */}
          <Box sx={{ mt: 6 }}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              bgcolor: 'white'
            }}>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, color: '#1e293b' }}>
                Product Variations ({product.variations.length})
              </Typography>
              
              {product.variations.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  border: '2px dashed #e2e8f0',
                  borderRadius: '12px',
                  bgcolor: '#f8fafc'
                }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    <TagIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#475569', fontWeight: 600 }}>
                    No Variations Available
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    This product doesn't have any variations associated with it.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {product.variations.map((variation) => (
                    <Grid item xs={12} sm={6} md={4} key={variation.id}>
                      <Card sx={{ 
                        borderRadius: '12px', 
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ 
                            mb: 2, 
                            fontWeight: 700, 
                            color: '#1e293b',
                            fontSize: '1.1rem'
                          }}>
                            {variation.name}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            mb: 3, 
                            color: '#64748b',
                            lineHeight: 1.6
                          }}>
                            {variation.stitch_pattern} - {variation.material_type} {variation.color}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip 
                              label={variation.seat_type} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                borderRadius: '12px',
                                borderColor: '#cbd5e1',
                                color: '#475569',
                                fontWeight: 500
                              }}
                            />
                            <Chip 
                              label={variation.arm_type} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                borderRadius: '12px',
                                borderColor: '#cbd5e1',
                                color: '#475569',
                                fontWeight: 500
                              }}
                            />
                            <Chip 
                              label={variation.heat_option} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                borderRadius: '12px',
                                borderColor: '#cbd5e1',
                                color: '#475569',
                                fontWeight: 500
                              }}
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default ProductDetailPage; 