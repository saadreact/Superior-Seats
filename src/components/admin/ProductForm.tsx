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
  is_customize_3d_product?: boolean;
  model_file_path?: string;
  customizable_meshes?: string[];
  material_types?: MaterialType[];
}

interface MaterialType {
  id: number;
  name: string;
  image?: string;
  shader_id?: string;
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
    // 3D customization fields
    is_customize_3d_product?: boolean;
    glbFile?: File;
    customizable_meshes?: string[];
    material_type_ids?: number[];
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
    is_customize_3d_product: product?.is_customize_3d_product || false,
    model_file_path: product?.model_file_path || '',
    customizable_meshes: product?.customizable_meshes || [],
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
  
  // 3D Customization state
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [glbError, setGlbError] = useState<string>('');
  const [customizableMeshes, setCustomizableMeshes] = useState<string>('');
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);
  const [allMaterials, setAllMaterials] = useState<MaterialType[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  useEffect(() => {
    loadVariations();
    loadCategories();
    loadVehicleTrims();
    loadMaterialTypes();
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
        is_customize_3d_product: product.is_customize_3d_product || false,
        model_file_path: product.model_file_path || '',
        customizable_meshes: product.customizable_meshes || [],
      });
      // Clear new images when switching to edit mode
      setNewImages([]);
      setImageErrors([]);
      
      // Load 3D customization data
      if (product.customizable_meshes && Array.isArray(product.customizable_meshes)) {
        setCustomizableMeshes(product.customizable_meshes.join(', '));
      } else {
        setCustomizableMeshes('');
      }
      
      // Load selected materials
      if (product.material_types && product.material_types.length > 0) {
        setSelectedMaterials(product.material_types.map((m) => m.id));
      }
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

  const loadMaterialTypes = async () => {
    try {
      setLoadingMaterials(true);
      setError(null);
      const response = await apiService.getMaterialTypes({ is_active: true });
      const materialsArray = Array.isArray(response) ? response : [];
      setAllMaterials(materialsArray);
      
      // Select all materials by default (only on initial load, not when editing)
      if (!product && materialsArray.length > 0 && selectedMaterials.length === 0) {
        setSelectedMaterials(materialsArray.map((m) => m.id));
      }
    } catch (err: any) {
      console.error('Error loading material types:', err);
      setAllMaterials([]);
    } finally {
      setLoadingMaterials(false);
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

  const handleGlbFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validType = 'model/gltf-binary';
    const validExtension = file.name.toLowerCase().endsWith('.glb');
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!validExtension) {
      setGlbError('Please select a valid GLB file (.glb)');
      setGlbFile(null);
      return;
    }

    if (file.size > maxSize) {
      setGlbError('GLB file size must be less than 20MB');
      setGlbFile(null);
      return;
    }

    setGlbFile(file);
    setGlbError(null);
  };

  const handleSubmit = () => {
    // Prepare customizable meshes array from comma-separated string
    const meshesArray = customizableMeshes
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    onSubmit({
      ...formData,
      newImages: newImages.length > 0 ? newImages : undefined,
      primaryImageIndex: primaryImageIndex,
      removedImages: removedImages.length > 0 ? removedImages : undefined,
      // 3D customization data
      glbFile: glbFile || undefined,
      customizable_meshes: formData.is_customize_3d_product && meshesArray.length > 0 ? meshesArray : undefined,
      material_type_ids: formData.is_customize_3d_product && selectedMaterials.length > 0 ? selectedMaterials : undefined,
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
                      src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${image}`}
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
                          src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${variation.image}`}
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

        {/* 3D Customization Section */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_customize_3d_product}
                onChange={(e) => setFormData({...formData, is_customize_3d_product: e.target.checked})}
              />
            }
            label="Enable 3D Customization"
          />
        </Box>

        {/* 3D Fields - Show only when 3D customization is enabled */}
        {formData.is_customize_3d_product && (
          <>
            {/* GLB File Upload */}
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                3D Model Configuration
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <input
                  accept=".glb"
                  style={{ display: 'none' }}
                  id="glb-file-input"
                  type="file"
                  onChange={handleGlbFileChange}
                />
                <label htmlFor="glb-file-input">
                  <Button
                    variant="outlined"
                    component="span"
                  >
                    Upload GLB Model File
                  </Button>
                </label>
                
                {glbFile && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Selected: {glbFile.name} ({(glbFile.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setGlbFile(null);
                        setGlbError(null);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                
                {formData.model_file_path && !glbFile && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Current file: {formData.model_file_path}
                  </Typography>
                )}
                
                {glbError && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {glbError}
                  </Typography>
                )}
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Upload a GLB file (max 20MB)
                </Typography>
              </Box>
            </Box>

            {/* Customizable Meshes */}
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <TextField
                fullWidth
                label="Customizable Meshes"
                multiline
                rows={3}
                value={customizableMeshes}
                onChange={(e) => setCustomizableMeshes(e.target.value)}
                placeholder="Enter mesh names separated by commas (e.g., seat_cushion, backrest, armrest)"
                helperText="Specify which mesh parts of the 3D model can be customized. Leave empty to allow all meshes."
              />
            </Box>

            {/* Material Types Selection */}
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Material Types
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Select which material types are available for this 3D product
              </Typography>
              
              {loadingMaterials ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {allMaterials.map((material) => (
                    <FormControlLabel
                      key={material.id}
                      control={
                        <Switch
                          checked={selectedMaterials.includes(material.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMaterials([...selectedMaterials, material.id]);
                            } else {
                              setSelectedMaterials(selectedMaterials.filter(id => id !== material.id));
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {material.image && (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${material.image}`}
                              alt={material.name}
                              width={30}
                              height={30}
                              style={{ objectFit: 'cover', borderRadius: 4 }}
                            />
                          )}
                          <Typography variant="body2">{material.name}</Typography>
                        </Box>
                      }
                    />
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}
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