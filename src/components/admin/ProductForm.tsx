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
  category_id?: number;
  vehicle_trim_id?: number;
  price: number;
  stock: number;
  images?: string[];
  is_active: boolean;
  variation_ids?: number[];
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: {
    name: string;
    description: string;
    category_id?: number;
    vehicle_trim_id?: number;
    price: number;
    stock: number;
    images?: string[];
    is_active: boolean;
    variation_ids?: number[];
    newImages?: File[];
    primaryImageIndex?: number;
    removedImages?: string[];
  }) => void;
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
    category_id: product?.category_id || 1,
    vehicle_trim_id: product?.vehicle_trim_id || 1,
    price: product?.price || 0,
    stock: product?.stock || 0,
    images: product?.images || [],
    is_active: product?.is_active ?? true,
    variation_ids: product?.variation_ids || [],
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0); // Track primary image
  const [removedImages, setRemovedImages] = useState<string[]>([]); // Track removed images
  const [variations, setVariations] = useState<Variation[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [vehicleTrims, setVehicleTrims] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingVehicleTrims, setLoadingVehicleTrims] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVariations();
    loadCategories();
    loadVehicleTrims();
  }, []);

  // Update formData when product prop changes (for edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || 1,
        vehicle_trim_id: product.vehicle_trim_id || 1,
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

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setError(null);
      const response = await apiService.getCategories();
      // Ensure we always have an array, even if the API returns something else
      const categoriesArray = Array.isArray(response) ? response : [];
      setCategories(categoriesArray);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      // Set empty array as fallback
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadVehicleTrims = async () => {
    try {
      setLoadingVehicleTrims(true);
      setError(null);
      const response = await apiService.getVehicleTrims();
      // Ensure we always have an array, even if the API returns something else
      const trimsArray = Array.isArray(response) ? response : [];
      setVehicleTrims(trimsArray);
    } catch (err: any) {
      console.error('Error loading vehicle trims:', err);
      // Set empty array as fallback
      setVehicleTrims([]);
    } finally {
      setLoadingVehicleTrims(false);
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
      
      // Add new images to existing ones (don't clear existing images)
      setNewImages(prev => [...prev, ...fileArray]);
      setImageErrors([]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedImages);
  };

  const removeCurrentImage = (index: number) => {
    const imageToRemove = formData.images?.[index];
    const updatedImages = formData.images?.filter((_, i) => i !== index) || [];
    
    setFormData({
      ...formData,
      images: updatedImages,
    });
    
    // Track the removed image
    if (imageToRemove) {
      setRemovedImages(prev => [...prev, imageToRemove]);
    }
    
    // Adjust primary image index if needed
    if (index <= primaryImageIndex && primaryImageIndex > 0) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    } else if (index < primaryImageIndex) {
      // No change needed
    } else if (updatedImages.length === 0) {
      setPrimaryImageIndex(0);
    }
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      newImages: newImages.length > 0 ? newImages : undefined,
      primaryImageIndex: primaryImageIndex,
      removedImages: removedImages.length > 0 ? removedImages : undefined,
    });
  };

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
              value={formData.category_id}
              onChange={handleSelectChange('category_id')}
              label="Category"
              disabled={loadingCategories}
            >
              {loadingCategories ? (
                <MenuItem disabled>Loading categories...</MenuItem>
              ) : (
                (Array.isArray(categories) ? categories : []).map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Vehicle Trim</InputLabel>
            <Select
              value={formData.vehicle_trim_id}
              onChange={handleSelectChange('vehicle_trim_id')}
              label="Vehicle Trim"
              disabled={loadingVehicleTrims}
            >
              {loadingVehicleTrims ? (
                <MenuItem disabled>Loading vehicle trims...</MenuItem>
              ) : (
                (Array.isArray(vehicleTrims) ? vehicleTrims : []).map((trim) => (
                  <MenuItem key={trim.id} value={trim.id}>
                    {trim.name}
                  </MenuItem>
                ))
              )}
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
          
          {/* Image Upload Info */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              • The first image uploaded will be set as the primary image
              • You can upload multiple images (JPEG, PNG, GIF up to 2MB each)
              • Uploading new images will replace all existing images for this product
            </Typography>
          </Alert>
          
          {/* Current Images Display */}
          {formData.images && formData.images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Current Images (Click to set as primary):
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.images.map((image, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      position: 'relative',
                      cursor: 'pointer',
                      border: index === primaryImageIndex ? '3px solid #1976d2' : '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'visible', // Changed from 'hidden' to 'visible' to show cross button
                    }}
                    onClick={() => setPrimaryImage(index)}
                  >
                    <Image
                      src={`https://superiorseats.ali-khalid.com${image}`}
                      alt={`Product image ${index + 1}`}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCurrentImage(index);
                      }}
                      sx={{
                        position: 'absolute',
                        top: -16,
                        right: -16,
                        bgcolor: 'error.main',
                        color: 'white',
                        width: 28,
                        height: 28,
                        '&:hover': { bgcolor: 'error.dark' },
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    {index === primaryImageIndex && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          bgcolor: 'primary.main',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Primary
                      </Box>
                    )}
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
                  New Images to Add:
                </Typography>
                {formData.images && formData.images.length > 0 && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    New images will be added to the existing ones. You can remove any images using the delete buttons.
                  </Alert>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {newImages.map((file, index) => {
                    const newImageIndex = (formData.images?.length || 0) + index;
                    return (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 100,
                          height: 100,
                          borderRadius: 1,
                          overflow: 'visible', // Changed from 'hidden' to 'visible' to show cross button
                          border: newImageIndex === primaryImageIndex ? '3px solid #1976d2' : '1px solid #ddd',
                          cursor: 'pointer',
                        }}
                        onClick={() => setPrimaryImage(newImageIndex)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
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
                        {newImageIndex === primaryImageIndex && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 4,
                              left: 4,
                              bgcolor: 'primary.main',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                            }}
                          >
                            Primary
                          </Box>
                        )}
                      </Box>
                    );
                  })}
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