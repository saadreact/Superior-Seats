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
  Card,
  CardContent,
  Container,
  Avatar,
  Stack,
  Grid,
  Divider,
  Badge,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  LocalOffer as TagIcon,
  Image as ImageIcon,
  ZoomIn as ZoomInIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { productApi } from '@/services/productapi';
import { apiService } from '@/utils/api';

interface Variation {
  id: number;
  name: string;
  stitch_pattern?: string;
  arm_type: string;
  lumbar: string;
  recline_type: string;
  seat_type: string;
  material_type: string;
  heat_option: string;
  seat_item_type: string;
  seat_style?: string;
  color: string;
  price?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pivot?: {
    product_id: number;
    variation_id: number;
  };
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vehicle_trim_id?: number | null;
  category_id?: number | null;
  vehicle_trim?: any | null;
  primary_image?: {
    id: number;
    product_id: number;
    image_path: string;
    alt_text: string | null;
    caption: string | null;
    sort_order: number;
    is_primary: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  variations?: Variation[];
}

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading product details for ID:', productId);
      
      // Use productApi with fallback to apiService
      let response;
      try {
        response = await productApi.getProduct(parseInt(productId));
        console.log('🔍 ProductApi response:', response);
      } catch (productApiError) {
        console.log('🔍 ProductApi failed, trying apiService:', productApiError);
        response = await apiService.getProduct(parseInt(productId));
        console.log('🔍 ApiService response:', response);
      }
      
      // Handle the response structure
      let productData;
      if (response && response.data) {
        productData = response.data;
      } else if (response) {
        productData = response;
      } else {
        throw new Error('Invalid response structure');
      }
      
      console.log('🔍 Final product data:', productData);
      setProduct(productData);
    } catch (err: any) {
      console.error('Error loading product:', err);
      
      if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication required. You will be redirected to the login page in 3 seconds.');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view this product.');
      } else if (err.response?.status === 404 || err.message.includes('404') || err.message.includes('not found')) {
        setError('Product not found. It may have been deleted.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to load product. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [productId, router]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleBack = () => {
    router.push('/admin/products-2');
  };

  const getProductImages = (product: Product) => {
    const images: string[] = [];
    
    // Add primary image first
    if (product.primary_image?.image_path) {
      images.push(`https://superiorseats.ali-khalid.com${product.primary_image.image_path}`);
    }
    
    // Add other images
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(image => {
        const imageUrl = typeof image === 'string' ? image : (image as any)?.image_path || (image as any)?.image_url || '';
        if (imageUrl && !images.includes(`https://superiorseats.ali-khalid.com${imageUrl}`)) {
          images.push(`https://superiorseats.ali-khalid.com${imageUrl}`);
        }
      });
    }
    
    return images;
  };

  const openImageDialog = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };

  const closeImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage('');
  };

  const getVariationCounts = (variations: Variation[] = []) => {
    const counts = {
      seatTypes: new Set<string>(),
      armTypes: new Set<string>(),
      lumbarTypes: new Set<string>(),
      reclineTypes: new Set<string>(),
      heatOptions: new Set<string>(),
      materialTypes: new Set<string>(),
      stitchPatterns: new Set<string>(),
      seatItemTypes: new Set<string>(),
      seatStyles: new Set<string>(),
      colors: new Set<string>(),
    };

    variations.forEach(variation => {
      if (variation.seat_type) counts.seatTypes.add(variation.seat_type);
      if (variation.arm_type) counts.armTypes.add(variation.arm_type);
      if (variation.lumbar) counts.lumbarTypes.add(variation.lumbar);
      if (variation.recline_type) counts.reclineTypes.add(variation.recline_type);
      if (variation.heat_option) counts.heatOptions.add(variation.heat_option);
      if (variation.material_type) counts.materialTypes.add(variation.material_type);
      if (variation.stitch_pattern) counts.stitchPatterns.add(variation.stitch_pattern);
      if (variation.seat_item_type) counts.seatItemTypes.add(variation.seat_item_type);
      if (variation.seat_style) counts.seatStyles.add(variation.seat_style);
      if (variation.color) counts.colors.add(variation.color);
    });

    return {
      seatTypes: Array.from(counts.seatTypes),
      armTypes: Array.from(counts.armTypes),
      lumbarTypes: Array.from(counts.lumbarTypes),
      reclineTypes: Array.from(counts.reclineTypes),
      heatOptions: Array.from(counts.heatOptions),
      materialTypes: Array.from(counts.materialTypes),
      stitchPatterns: Array.from(counts.stitchPatterns),
      seatItemTypes: Array.from(counts.seatItemTypes),
      seatStyles: Array.from(counts.seatStyles),
      colors: Array.from(counts.colors),
    };
  };

  if (loading) {
    return (
      <AdminLayout title="Product Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Product Details">
        <Container maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                  loadProduct();
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Container>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Product Details">
        <Container maxWidth="lg">
          <Alert severity="warning">
            Product not found
          </Alert>
        </Container>
      </AdminLayout>
    );
  }

  const images = getProductImages(product);
  const variationCounts = getVariationCounts(product.variations);

  return (
    <AdminLayout title="Product Details">
      <Container maxWidth="xl">
        {/* Header Actions */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              mb: 2,
              py: 1.5,
              borderColor: '#cbd5e1',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f1f5f9'
              }
            }}
          >
            Back
          </Button>
          
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
              label={typeof product.category === 'string' ? product.category : ((product.category as any)?.name || 'No Category')} 
              sx={{ 
                borderRadius: '20px',
                bgcolor: '#f0f9ff',
                color: '#0369a1',
                border: '1px solid #bae6fd'
              }}
            />
            <Chip 
              icon={<PriceIcon />}
              label={`$${product.price}`}
              sx={{ 
                borderRadius: '20px',
                bgcolor: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0'
              }}
            />
            <Chip 
              icon={<InventoryIcon />}
              label={`${product.stock} in stock`}
              sx={{ 
                borderRadius: '20px',
                bgcolor: '#fefce8',
                color: '#a16207',
                border: '1px solid #fde68a'
              }}
            />
            <Chip 
              icon={product.is_active ? <CheckCircleIcon /> : <CancelIcon />}
              label={product.is_active ? 'Active' : 'Inactive'}
              color={product.is_active ? 'success' : 'default'}
              sx={{ borderRadius: '20px' }}
            />
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Product Images */}
          <Box sx={{ flex: { xs: '1', md: '1' } }}>
            <Card sx={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                  Product Images
                </Typography>
                
                {images.length > 0 ? (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                    {images.map((imageUrl, index) => (
                      <Box key={index}>
                        <Box
                          sx={{
                            position: 'relative',
                            aspectRatio: '1/1',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: '2px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#DA291C',
                              transform: 'scale(1.02)',
                              boxShadow: '0 8px 25px rgba(218, 41, 28, 0.15)'
                            }
                          }}
                          onClick={() => openImageDialog(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt={`Product ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          {index === 0 && (
                            <Badge
                              badgeContent="Primary"
                              color="primary"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                '& .MuiBadge-badge': {
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold'
                                }
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'rgba(0, 0, 0, 0.5)',
                              borderRadius: '50%',
                              p: 0.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ZoomInIcon sx={{ color: 'white', fontSize: '1rem' }} />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 4,
                      bgcolor: '#f8fafc',
                      borderRadius: '12px',
                      border: '2px dashed #cbd5e1'
                    }}
                  >
                    <ImageIcon sx={{ fontSize: '3rem', color: '#94a3b8', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No images available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Product Information */}
          <Box sx={{ flex: { xs: '1', md: '1' } }}>
            <Card sx={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              mb: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
                  Product Information
                </Typography>
                
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Product ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      #{product.id}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Category
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {typeof product.category === 'string' ? product.category : ((product.category as any)?.name || 'No Category')}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Base Price
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#DA291C' }}>
                      ${product.price}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Stock Quantity
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {product.stock} units
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Status
                    </Typography>
                    <Chip
                      label={product.is_active ? 'Active' : 'Inactive'}
                      color={product.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Created
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {new Date(product.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {new Date(product.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Variations Configuration */}
        <Box sx={{ mt: 4 }}>
            <Card sx={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
                  Seat Configuration & Materials
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  {/* Seat Configuration */}
                  <Box sx={{ flex: { xs: '1', md: '1' } }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
                      Seat Configuration
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Seat Types ({variationCounts.seatTypes.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.seatTypes.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Arm Types ({variationCounts.armTypes.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.armTypes.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Lumbar Types ({variationCounts.lumbarTypes.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.lumbarTypes.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Recline Types ({variationCounts.reclineTypes.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.reclineTypes.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Materials & Features */}
                  <Box sx={{ flex: { xs: '1', md: '1' } }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
                      Materials & Features
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Material Types ({variationCounts.materialTypes.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.materialTypes.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Heat Options ({variationCounts.heatOptions.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.heatOptions.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Stitch Patterns ({variationCounts.stitchPatterns.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.stitchPatterns.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Seat Item Types ({variationCounts.seatItemTypes.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.seatItemTypes.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Seat Styles ({variationCounts.seatStyles.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.seatStyles.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Colors ({variationCounts.colors.length})
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {variationCounts.colors.map((type, index) => (
                            <Chip key={index} label={type} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Card>
        </Box>

        {/* Variations List */}
        {product.variations && product.variations.length > 0 && (
          <Box sx={{ mt: 4 }}>
              <Card sx={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
                    Product Variations ({product.variations.length})
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                    {product.variations.map((variation, index) => (
                      <Box key={variation.id || index}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            '&:hover': {
                              borderColor: '#DA291C',
                              boxShadow: '0 4px 12px rgba(218, 41, 28, 0.1)'
                            }
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Variation #{index + 1}
                          </Typography>
                          <Stack spacing={1}>
                            <Typography variant="caption" color="text.secondary">
                              Seat: {variation.seat_type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Arm: {variation.arm_type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Material: {variation.material_type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Color: {variation.color}
                            </Typography>
                            {variation.price && (
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#DA291C' }}>
                                Price: ${variation.price}
                              </Typography>
                            )}
                          </Stack>
                        </Paper>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
          </Box>
        )}

        {/* Image Dialog */}
        <Dialog
          open={imageDialogOpen}
          onClose={closeImageDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Product Image</Typography>
            <IconButton onClick={closeImageDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Product"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default ProductDetailPage;
