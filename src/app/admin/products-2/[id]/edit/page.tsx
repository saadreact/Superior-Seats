'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  OutlinedInput,
  Checkbox,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import { lumbarTypesService } from '@/services/lumbar-types';
import { reclineTypesService } from '@/services/recline-types';
import { heatOptionsService } from '@/services/heat-options';
import { materialTypesService } from '@/services/material-types';
import { seatStitchPatternService } from '@/services/seat-stitch-pattern';

interface ProductPage2Form {
  // First Half - Product Fields
  name: string;
  category: string;
  description: string;
  basePrice: number;
  stock: number;
  images: File[];
  
  // Second Half - Variation Fields
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
}

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

const EditProduct2Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Form state
  const [formData, setFormData] = useState<ProductPage2Form>({
    name: '',
    category: '',
    description: '',
    basePrice: 0,
    stock: 0,
    images: [],
    seatType: [],
    armType: [],
    lumbarType: [],
    reclineType: [],
    heatOption: [],
    materialType: [],
    stitchPattern: [],
    seatItemType: [],
    color: [],
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [success, setSuccess] = useState('');

  // Data state for dropdowns
  const [categories, setCategories] = useState<{ name: string; price: number }[]>([]);
  const [seatTypes, setSeatTypes] = useState<{ name: string; price: number }[]>([]);
  const [armTypes, setArmTypes] = useState<{ name: string; price: number }[]>([]);
  const [lumbarTypes, setLumbarTypes] = useState<{ name: string; price: number }[]>([]);
  const [reclineTypes, setReclineTypes] = useState<{ name: string; price: number }[]>([]);
  const [heatOptions, setHeatOptions] = useState<{ name: string; price: number }[]>([]);
  const [materialTypes, setMaterialTypes] = useState<{ name: string; price: number }[]>([]);
  const [stitchPatterns, setStitchPatterns] = useState<{ name: string; price: number }[]>([]);
  const [seatItemTypes, setSeatItemTypes] = useState<{ name: string; price: number }[]>([]);
  const [colors, setColors] = useState<{ name: string; price: number }[]>([]);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      
      // Load all required data for dropdowns and the product
      const [
        categoriesRes,
        seatTypesRes,
        armTypesRes,
        lumbarTypesRes,
        reclineTypesRes,
        heatOptionsRes,
        materialTypesRes,
        stitchPatternsRes,
        seatItemTypesRes,
        colorsRes,
        productRes,
      ] = await Promise.all([
        apiService.getCategories(),
        apiService.getSeatTypes(),
        apiService.getArmTypes(),
        lumbarTypesService.getLumbarTypes(),
        reclineTypesService.getReclineTypes(),
        heatOptionsService.getHeatOptions(),
        materialTypesService.getMaterialTypes(),
        seatStitchPatternService.getSeatStitchPatterns(),
        apiService.getItemTypes(),
        apiService.getColors(),
        apiService.getProduct(parseInt(id)),
      ]);

      // Debug API responses
      console.log('Seat Types API Response:', seatTypesRes);
      console.log('Arm Types API Response:', armTypesRes);
      console.log('Categories API Response:', categoriesRes);
      
      // Convert API responses to the expected format { name, price }
      const convertToFormFormat = (items: any[]) => 
        Array.isArray(items) ? items.map(item => ({ 
          name: item.name || item.title || item.label || 'Unknown', 
          price: item.price || item.cost || 0 
        })) : [];
      
      // Ensure all responses are arrays and have the expected structure
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      setSeatTypes(convertToFormFormat(seatTypesRes));
      setArmTypes(convertToFormFormat(armTypesRes));
      setLumbarTypes(convertToFormFormat(lumbarTypesRes));
      setReclineTypes(convertToFormFormat(reclineTypesRes));
      setHeatOptions(convertToFormFormat(heatOptionsRes));
      setMaterialTypes(convertToFormFormat(materialTypesRes));
      setStitchPatterns(convertToFormFormat(stitchPatternsRes));
      setSeatItemTypes(convertToFormFormat(seatItemTypesRes));
      setColors(convertToFormFormat(colorsRes));

      // Set form data from product
      if (productRes) {
        setFormData({
          name: productRes.name || '',
          category: productRes.category || '',
          description: productRes.description || '',
          basePrice: productRes.basePrice || 0,
          stock: productRes.stock || 0,
          images: [],
          seatType: productRes.seatType || [],
          armType: productRes.armType || [],
          lumbarType: productRes.lumbarType || [],
          reclineType: productRes.reclineType || [],
          heatOption: productRes.heatOption || [],
          materialType: productRes.materialType || [],
          stitchPattern: productRes.stitchPattern || [],
          seatItemType: productRes.seatItemType || [],
          color: productRes.color || [],
          isActive: productRes.isActive ?? true,
        });
      }
    } catch (error: any) {
      console.error('Error loading initial data:', error);
      
      if (error.response?.status === 401 || error.message.includes('401') || error.message.includes('Unauthorized')) {
        setErrors({ submit: 'Authentication required. You will be redirected to the login page in 3 seconds.' });
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (error.response?.status === 403) {
        setErrors({ submit: 'Access denied. You do not have permission to edit products.' });
      } else if (error.response?.status === 404) {
        setErrors({ submit: 'Product not found. It may have been deleted.' });
      } else {
        setErrors({ submit: 'Failed to load product data. Please refresh the page.' });
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBackToList = () => {
    router.push('/admin/products-2');
  };

  const handleChange = (field: keyof ProductPage2Form) => (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleMultiSelectChange = (field: keyof ProductPage2Form) => (
    event: any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleNumberChange = (field: keyof ProductPage2Form) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSwitchChange = (field: keyof ProductPage2Form) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          images: 'Please select valid image files (JPEG, PNG, or GIF)',
        }));
        return false;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          images: 'Image size must be less than 2MB',
        }));
        return false;
      }
      
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: '',
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (formData.seatType.length === 0) {
      newErrors.seatType = 'At least one seat type is required';
    }

    if (formData.armType.length === 0) {
      newErrors.armType = 'At least one arm type is required';
    }

    if (formData.lumbarType.length === 0) {
      newErrors.lumbarType = 'At least one lumbar type is required';
    }

    if (formData.reclineType.length === 0) {
      newErrors.reclineType = 'At least one recline type is required';
    }

    if (formData.heatOption.length === 0) {
      newErrors.heatOption = 'At least one heat option is required';
    }

    if (formData.materialType.length === 0) {
      newErrors.materialType = 'At least one material type is required';
    }

    if (formData.stitchPattern.length === 0) {
      newErrors.stitchPattern = 'At least one stitch pattern is required';
    }

    if (formData.seatItemType.length === 0) {
      newErrors.seatItemType = 'At least one seat item type is required';
    }

    if (formData.color.length === 0) {
      newErrors.color = 'At least one color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Convert File objects to the format expected by API (no base64 conversion needed)
      const imageData = formData.images.map((file, index) => ({
        file: file, // Pass File object directly
        alt_text: `Product image ${index + 1}`,
        caption: `Product image ${index + 1}`,
        set_primary: index === 0, // First image is primary
      }));

      // Create product data object
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.basePrice,
        stock: formData.stock,
        is_active: formData.isActive,
        images: imageData,
        // Note: The API might need these as IDs rather than names
        // You may need to map the selected names to their corresponding IDs
        variation_ids: [], // This would need to be populated based on selected options
      };

      // Debug: Log the data being sent
      console.log('Products-2 edit data being sent to API:', {
        ...productData,
        images: productData.images?.map(img => ({
          file: `File(${img.file.name}, ${img.file.size} bytes)`,
          alt_text: img.alt_text,
          caption: img.caption,
          set_primary: img.set_primary
        }))
      });

      // Call API to update product
      await apiService.updateProduct(parseInt(id), productData);
      
      setSuccess('Product updated successfully!');
      
      setTimeout(() => {
        handleBackToList();
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderMultiSelectField = (
    field: keyof ProductPage2Form,
    label: string,
    options: { name: string; price: number }[],
    required = true
  ) => {
    // Safety check to ensure options is an array
    const safeOptions = Array.isArray(options) ? options : [];
    
    return (
      <FormControl fullWidth required={required} error={!!errors[field]}>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={formData[field] as string[]}
          onChange={handleMultiSelectChange(field)}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Box key={value} sx={{ 
                  backgroundColor: 'primary.main', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1, 
                  fontSize: '0.75rem' 
                }}>
                  {value}
                </Box>
              ))}
            </Box>
          )}
        >
          {safeOptions.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              <Checkbox checked={(formData[field] as string[]).indexOf(option.name) > -1} />
              <ListItemText 
                primary={`${option.name} (+$${option.price || 0})`} 
                secondary={(option.price || 0) > 0 ? `Additional cost: $${option.price || 0}` : 'No additional cost'}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Product - Products 2">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product - Products 2">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
              sx={{ color: 'text.secondary' }}
            >
              Back to Products 2
            </Button>
            <Typography variant="h4" component="h1">
              Edit Product
            </Typography>
          </Box>
        </Box>

        {/* Alerts */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* 🟢 First Half - Product Fields */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Product Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {/* Product Name */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    placeholder="Enter product name"
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Box>

                {/* Category */}
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth required error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={handleChange('category')}
                      label="Category"
                    >
                      {Array.isArray(categories) ? categories.map((category) => (
                        <MenuItem key={category.name} value={category.name}>
                          {category.name}
                        </MenuItem>
                      )) : []}
                    </Select>
                  </FormControl>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    required
                    placeholder="Enter product description"
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Box>

                {/* Base Price and Stock */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Base Price"
                    type="number"
                    value={formData.basePrice}
                    onChange={handleNumberChange('basePrice')}
                    required
                    placeholder="Enter base price"
                    InputProps={{
                      startAdornment: '$',
                    }}
                    error={!!errors.basePrice}
                    helperText={errors.basePrice}
                  />

                  <TextField
                    fullWidth
                    label="Stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleNumberChange('stock')}
                    required
                    placeholder="Enter stock quantity"
                    error={!!errors.stock}
                    helperText={errors.stock}
                  />
                </Box>

                {/* Product Images */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                    Product Images
                  </Typography>
                  
                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(8, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(16, 1fr)' }, gap: 0, mb: 2 }}>
                      {formData.images.map((image, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              aspectRatio: '1/1',
                              objectFit: 'cover',
                              borderRadius: 4,
                              border: '1px solid #e0e0e0',
                              maxWidth: 60,
                              maxHeight: 60,
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 8px;">Error</div>';
                            }}
                          />
                          <IconButton
                            onClick={() => removeImage(index)}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              bgcolor: 'rgba(255, 255, 255, 0.95)',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                              width: 16,
                              height: 16,
                              border: '1px solid #fff',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              },
                              transition: 'all 0.2s ease-in-out',
                              zIndex: 10,
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 10, color: '#666' }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  {/* Upload Button */}
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 1 }}
                      >
                        Upload Images
                      </Button>
                    </label>
                    {errors.images && (
                      <Typography variant="caption" color="error" display="block">
                        {errors.images}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block">
                      Supported formats: JPEG, PNG, GIF (Max 2MB each)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* 🔵 Second Half - Variation Fields */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Seat Configuration & Materials
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {/* Seat Configuration Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                    Seat Configuration
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                    {renderMultiSelectField('seatType', 'Seat Type', seatTypes)}
                    {renderMultiSelectField('armType', 'Arm Type', armTypes)}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    {renderMultiSelectField('lumbarType', 'Lumbar Type', lumbarTypes)}
                    {renderMultiSelectField('reclineType', 'Recline Type', reclineTypes)}
                  </Box>
                </Box>

                {/* Materials & Features Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                    Materials & Features
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                    {renderMultiSelectField('materialType', 'Material Type', materialTypes)}
                    {renderMultiSelectField('heatOption', 'Heat Option', heatOptions)}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                    {renderMultiSelectField('stitchPattern', 'Stitching Pattern', stitchPatterns)}
                    {renderMultiSelectField('seatItemType', 'Seat Item Type', seatItemTypes)}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    {renderMultiSelectField('color', 'Color', colors)}
                  </Box>
                </Box>

                {/* Product Status */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                    Product Status
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleSwitchChange('isActive')}
                      />
                    }
                    label="Active"
                  />
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  variant="outlined"
                  onClick={handleBackToList}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#DA291C',
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditProduct2Page;
