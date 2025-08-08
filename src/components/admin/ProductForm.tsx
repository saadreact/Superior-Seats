'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Image from 'next/image';
import { apiService } from '@/utils/api';

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
  image?: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images?: string[];
  is_active: boolean;
  variation_ids?: number[];
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product & { newImages?: File[] }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'Truck Seats',
    price: product?.price || 0,
    stock: product?.stock || 0,
    images: product?.images || [],
    is_active: product?.is_active ?? true,
    variation_ids: product?.variation_ids || [],
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVariations();
  }, []);

  // Update formData when product prop changes (for edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'Truck Seats',
        price: product.price || 0,
        stock: product.stock || 0,
        images: product.images || [],
        is_active: product.is_active ?? true,
        variation_ids: product.variation_ids || [],
      });
      // Clear new images when switching to edit mode
      setNewImages([]);
      setImageErrors([]);
    }
  }, [product]);

  const loadVariations = async () => {
    try {
      setLoadingVariations(true);
      setError(null);
      const response = await apiService.getVariations();
      setVariations(response || []);
    } catch (err: any) {
      setError('Failed to load variations');
      console.error('Error loading variations:', err);
    } finally {
      setLoadingVariations(false);
    }
  };

  const handleChange = (field: keyof Product) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleNumberChange = (field: keyof Product) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: parseFloat(event.target.value) || 0,
    });
  };

  const handleSelectChange = (field: keyof Product) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleVariationChange = (event: any) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      variation_ids: typeof value === 'string' ? [] : value,
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const errors: string[] = [];
      
      // Validate each file
      fileArray.forEach((file, index) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        
        if (!validTypes.includes(file.type)) {
          errors.push(`File ${index + 1}: Please select a valid image file (JPEG, PNG, or GIF)`);
        }
        
        if (file.size > maxSize) {
          errors.push(`File ${index + 1}: Image size must be less than 2MB`);
        }
      });
      
      if (errors.length > 0) {
        setImageErrors(errors);
        return;
      }
      
      // Override existing images with new ones
      setNewImages(fileArray);
      setFormData(prev => ({
        ...prev,
        images: [], // Clear existing images when new ones are uploaded
      }));
      setImageErrors([]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedImages);
  };

  const removeCurrentImage = (index: number) => {
    const updatedImages = formData.images?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      newImages: newImages.length > 0 ? newImages : undefined,
    });
  };

  const categories = [
    'Truck Seats',
    'Car Seats', 
    'Racing Seats',
    'Office Chairs',
    'Gaming Chairs',
    'Sofas',
    'Accessories',
    'Safety',
    'Maintenance'
  ];

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={handleChange('name')}
            required
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={handleSelectChange('category')}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleNumberChange('price')}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={handleNumberChange('stock')}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Multiple Image Upload */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Product Images
          </Typography>
          
          {/* Current Images Display */}
          {formData.images && formData.images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Current Images:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.images.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Image
                      src={`https://superiorseats.ali-khalid.com${image}`}
                      alt={`Product image ${index + 1}`}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeCurrentImage(index)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* New Images Upload */}
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="product-images-input"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="product-images-input">
              <Button
                variant="outlined"
                component="span"
                sx={{ mb: 2 }}
              >
                Upload Images
              </Button>
            </label>
            
            {/* New Images Preview */}
            {newImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  New Images {formData.images && formData.images.length > 0 ? '(will override existing images):' : ':'}
                </Typography>
                {formData.images && formData.images.length > 0 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Uploading new images will replace all existing images for this product.
                  </Alert>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {newImages.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        width={100}
                        height={100}
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          minWidth: 'auto',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          p: 0,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Image Errors */}
          {imageErrors.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {imageErrors.map((error, index) => (
                <Typography key={index} color="error" variant="caption" sx={{ display: 'block' }}>
                  {error}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
        
        {/* Variations Selection */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Associated Variations
          </Typography>
          {loadingVariations ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <FormControl fullWidth>
              <InputLabel>Select Variations</InputLabel>
              <Select
                multiple
                value={formData.variation_ids || []}
                onChange={handleVariationChange}
                input={<OutlinedInput label="Select Variations" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const variation = variations.find(v => v.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={variation?.name || `Variation ${value}`}
                          size="small" 
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {variations.map((variation) => (
                  <MenuItem key={variation.id} value={variation.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      {variation.image && (
                        <Image
                          src={`https://superiorseats.ali-khalid.com${variation.image}`}
                          alt={variation.name}
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                      <ListItemText
                        primary={variation.name}
                        secondary={`${variation.stitch_pattern} - ${variation.material_type} ${variation.color}`}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
            }
            label="Active"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.name}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            product ? 'Update Product' : 'Add Product'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm; 