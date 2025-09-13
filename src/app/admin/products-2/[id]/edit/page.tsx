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
import { productApi } from '@/services/productapi';
import { apiService } from '@/utils/api';

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
  seatStyle: string[];
  color: string[];
  
  // Special Shop Field
  showOnSpecialShop: boolean;
  
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
  show_on_special_shop: boolean;
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
    seatStyle: [],
    color: [],
    showOnSpecialShop: false,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Data state for dropdowns
  const [categories, setCategories] = useState<{ id: number; name: string; price: number }[]>([]);
  const [seatTypes, setSeatTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [armTypes, setArmTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [lumbarTypes, setLumbarTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [reclineTypes, setReclineTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [heatOptions, setHeatOptions] = useState<{ id: number; name: string; price: number }[]>([]);
  const [materialTypes, setMaterialTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [stitchPatterns, setStitchPatterns] = useState<{ id: number; name: string; price: number }[]>([]);
  const [seatItemTypes, setSeatItemTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [seatStyles, setSeatStyles] = useState<{ id: number; name: string; price: number }[]>([]);
  const [colors, setColors] = useState<{ id: number; name: string; price: number }[]>([]);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      
      console.log('🔍 Loading initial data for product ID:', id);
      
      // Load all required data for dropdowns and the product using productApi with fallbacks
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
        seatStylesRes,
        colorsRes,
        productRes,
      ] = await Promise.all([
        productApi.getCategories(),
        productApi.getSeatTypes().catch(() => apiService.getSeatTypes()),
        productApi.getArmTypes().catch(() => apiService.getArmTypes()),
        productApi.getLumbarTypes(),
        productApi.getReclineTypes(),
        productApi.getHeatOptions(),
        productApi.getMaterialTypes(),
        productApi.getStitchPatterns(),
        productApi.getItemTypes().catch(() => apiService.getItemTypes()),
        productApi.getSeatStyles().catch(() => apiService.getSeatStyles()),
        productApi.getColors(),
        productApi.getProduct(parseInt(id)),
      ]);

      console.log('🔍 Product API Response:', productRes);
      console.log('🔍 Product variations:', productRes?.variations);
      console.log('🔍 Product images:', productRes?.images);
      console.log('🔍 Product primary_image:', productRes?.primary_image);
      
      // Convert API responses to the expected format { id, name, price }
      const convertToFormFormat = (items: any[], hasPrice = true) => 
        Array.isArray(items) ? items.map(item => ({ 
          id: item.id || 0,
          name: item.name || item.title || item.label || 'Unknown', 
          price: hasPrice ? (item.price || item.cost || 0) : 0
        })) : [];
      
      // Ensure all responses are arrays and have the expected structure
      setCategories(convertToFormFormat(categoriesRes));
      setSeatTypes(convertToFormFormat(seatTypesRes));
      setArmTypes(convertToFormFormat(armTypesRes));
      setLumbarTypes(convertToFormFormat(lumbarTypesRes));
      setReclineTypes(convertToFormFormat(reclineTypesRes));
      setHeatOptions(convertToFormFormat(heatOptionsRes));
      setMaterialTypes(convertToFormFormat(materialTypesRes));
      setStitchPatterns(convertToFormFormat(stitchPatternsRes));
      setSeatItemTypes(convertToFormFormat(seatItemTypesRes));
      setSeatStyles(convertToFormFormat(seatStylesRes, false)); // Seat styles don't have price
      setColors(convertToFormFormat(colorsRes));

      // Helper function to extract variation names from API response
      const extractVariationNames = (variations: any[], fieldName: string): string[] => {
        if (!variations || !Array.isArray(variations)) {
          console.log(`🔍 No variations array for ${fieldName}`);
          return [];
        }
        console.log(`🔍 Processing ${fieldName} from ${variations.length} variations:`, variations);
        const names = variations
          .map((v, index) => {
            console.log(`🔍 Variation ${index} for ${fieldName}:`, v);
            const value = v[fieldName] || v[`${fieldName}_name`] || v[`${fieldName}_type`] || v.name;
            console.log(`🔍 Extracted value for ${fieldName}:`, value);
            return value;
          })
          .filter(Boolean)
          .filter((name, index, arr) => arr.indexOf(name) === index);
        console.log(`🔍 Final extracted ${fieldName}:`, names);
        return names;
      };


      // Set form data from product
      if (productRes) {
        console.log('🔍 Setting form data from product response');
        
        // Handle existing images
        const existingImageUrls: string[] = [];
        if (productRes.images && Array.isArray(productRes.images)) {
          console.log('🔍 Processing existing images:', productRes.images);
          existingImageUrls.push(...productRes.images.map((img: any) => 
            typeof img === 'string' ? img : img.image_path || img.image_url || ''
          ).filter(Boolean));
        }
        
        // Also check for primary_image
        if (productRes.primary_image?.image_path) {
          const primaryImageUrl = productRes.primary_image.image_path;
          if (!existingImageUrls.includes(primaryImageUrl)) {
            existingImageUrls.unshift(primaryImageUrl); // Add primary image first
          }
        }
        
        console.log('🔍 Existing image URLs:', existingImageUrls);
        setExistingImages(existingImageUrls);

        setFormData({
          name: productRes.name || '',
          category: productRes.category?.name || '',
          description: productRes.description || '',
          basePrice: parseFloat(productRes.price) || 0,
          stock: productRes.stock || 0,
          images: [], // Start with empty array for new file uploads
          seatType: extractVariationNames(productRes.variations || [], 'seat_type'),
          armType: extractVariationNames(productRes.variations || [], 'arm_type'),
          lumbarType: extractVariationNames(productRes.variations || [], 'lumbar'),
          reclineType: extractVariationNames(productRes.variations || [], 'recline_type'),
          heatOption: extractVariationNames(productRes.variations || [], 'heat_option'),
          materialType: extractVariationNames(productRes.variations || [], 'material_type'),
          stitchPattern: extractVariationNames(productRes.variations || [], 'stitch_pattern'),
          seatItemType: extractVariationNames(productRes.variations || [], 'seat_item_type'),
          seatStyle: extractVariationNames(productRes.variations || [], 'seat_style'),
          color: extractVariationNames(productRes.variations || [], 'color'),
          showOnSpecialShop: (productRes as any).show_on_special_shop ?? false,
          isActive: productRes.is_active ?? true,
        });
        
        console.log('🔍 Form data set successfully');
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
    
    // Regular handling for fields (store names)
    const selectedValues: string[] = typeof value === 'string' ? value.split(',') : value;
    
    // Check if "None" is being selected
    const isSelectingNone = selectedValues.includes('None');
    const wasNoneSelected = (formData[field] as string[]).includes('None');
    
    let finalValues: string[];
    
    if (isSelectingNone && !wasNoneSelected) {
      // If "None" is being selected and it wasn't selected before, clear all other selections
      finalValues = ['None'];
    } else if (isSelectingNone && wasNoneSelected) {
      // If "None" is being deselected, keep other selections
      finalValues = selectedValues.filter(val => val !== 'None');
    } else if (!isSelectingNone && wasNoneSelected) {
      // If selecting other options while "None" was selected, remove "None" and keep new selections
      finalValues = selectedValues.filter(val => val !== 'None');
    } else {
      // Normal selection without "None" involved
      finalValues = selectedValues;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: finalValues,
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
    
    console.log('📁 handleImageChange called with files:', files);
    console.log('📁 Files count:', files.length);
    
    // Validate files
    const validFiles = files.filter(file => {
      console.log('📁 Validating file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        isFile: file instanceof File
      });
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        console.log('❌ Invalid file type:', file.type);
        setErrors(prev => ({
          ...prev,
          images: 'Please select valid image files (JPEG, PNG, or GIF)',
        }));
        return false;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        console.log('❌ File too large:', file.size);
        setErrors(prev => ({
          ...prev,
          images: 'Image size must be less than 2MB',
        }));
        return false;
      }
      
      console.log('✅ File is valid');
      return true;
    });
    
    console.log('📁 Valid files count:', validFiles.length);
    console.log('📁 Valid files:', validFiles);
    
    setFormData(prev => {
      const newImages = [...prev.images, ...validFiles];
      console.log('📁 Setting new images array:', newImages);
      console.log('📁 New images count:', newImages.length);
      return {
        ...prev,
        images: newImages,
      };
    });
    
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

    // Helper function to check if field has valid selection (either has options or "None")
    const hasValidSelection = (field: string[] | number[]) => field.length > 0;

    if (!hasValidSelection(formData.seatType)) {
      newErrors.seatType = 'Please select at least one seat type or "None"';
    }

    if (!hasValidSelection(formData.armType)) {
      newErrors.armType = 'Please select at least one arm type or "None"';
    }

    if (!hasValidSelection(formData.lumbarType)) {
      newErrors.lumbarType = 'Please select at least one lumbar type or "None"';
    }

    if (!hasValidSelection(formData.reclineType)) {
      newErrors.reclineType = 'Please select at least one recline type or "None"';
    }

    if (!hasValidSelection(formData.heatOption)) {
      newErrors.heatOption = 'Please select at least one heat option or "None"';
    }

    if (!hasValidSelection(formData.materialType)) {
      newErrors.materialType = 'Please select at least one material type or "None"';
    }

    if (!hasValidSelection(formData.stitchPattern)) {
      newErrors.stitchPattern = 'Please select at least one stitch pattern or "None"';
    }

    if (!hasValidSelection(formData.seatItemType)) {
      newErrors.seatItemType = 'Please select at least one seat item type or "None"';
    }

    if (!hasValidSelection(formData.seatStyle)) {
      newErrors.seatStyle = 'Please select at least one seat style or "None"';
    }

    if (!hasValidSelection(formData.color)) {
      newErrors.color = 'Please select at least one color or "None"';
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
      // Helper function to map variation names to IDs (excluding "None")
      const mapNamesToIds = (selectedNames: string[], availableOptions: { id: number; name: string; price: number }[]): number[] => {
        return selectedNames
          .filter(name => name !== 'None') // Filter out "None" selections
          .map(name => {
            const option = availableOptions.find(opt => opt.name === name);
            return option?.id;
          })
          .filter((id): id is number => id !== undefined);
      };

      // Find selected category ID
      const selectedCategory = categories.find(cat => cat.name === formData.category);
      const categoryId = selectedCategory?.id;

      // Create product data object using simple File array (like create page)
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.basePrice,
        stock: formData.stock,
        is_active: formData.isActive,
        show_on_special_shop: formData.showOnSpecialShop,
        category_id: categoryId,
        images: formData.images, // Simple File array like create page
        
        // Map variation names to IDs
        seat_type_ids: mapNamesToIds(formData.seatType, seatTypes),
        arm_type_ids: mapNamesToIds(formData.armType, armTypes),
        lumbar_type_ids: mapNamesToIds(formData.lumbarType, lumbarTypes),
        recline_type_ids: mapNamesToIds(formData.reclineType, reclineTypes),
        heat_option_ids: mapNamesToIds(formData.heatOption, heatOptions),
        material_type_ids: mapNamesToIds(formData.materialType, materialTypes),
        seat_stitch_pattern_ids: mapNamesToIds(formData.stitchPattern, stitchPatterns),
        item_type_ids: mapNamesToIds(formData.seatItemType, seatItemTypes),
        seat_style_ids: mapNamesToIds(formData.seatStyle, seatStyles),
        color_ids: mapNamesToIds(formData.color, colors),
      };

      // Debug: Log the data being sent
      console.log('🔄 Products-2 data being sent to new productApi:', {
        ...productData,
        images: productData.images?.map(file => `File(${file.name}, ${file.size} bytes)`)
      });
      
      // Debug: Check if images are actually present
      console.log('🔄 FormData.images length:', formData.images.length);
      console.log('🔄 FormData.images:', formData.images);
      console.log('🔄 FormData.images type:', typeof formData.images);
      console.log('🔄 FormData.images is array:', Array.isArray(formData.images));
      console.log('🔄 ProductData.images length:', productData.images?.length);
      console.log('🔄 ProductData.images:', productData.images);
      console.log('🔄 ProductData.images type:', typeof productData.images);
      console.log('🔄 ProductData.images is array:', Array.isArray(productData.images));
      
      // Check each image individually
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((file, index) => {
          console.log(`🔄 Image ${index}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
            isFile: file instanceof File,
            constructor: file.constructor.name
          });
        });
      } else {
        console.log('❌ No images in productData.images');
      }

      // Call the new productApi to update product
      await productApi.updateProduct(parseInt(id), productData);
      
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
    options: { id: number; name: string; price: number }[],
    required = true
  ) => {
    // Safety check to ensure options is an array
    const safeOptions = Array.isArray(options) ? options : [];
    
    // Debug logging for seat styles specifically
    if (field === 'seatStyle') {
      console.log(`Rendering ${label} field:`, {
        field,
        options,
        safeOptions,
        optionsLength: options?.length,
        safeOptionsLength: safeOptions.length
      });
    }
    
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
          {/* None option */}
          <MenuItem key="none" value="None">
            <Checkbox checked={(formData[field] as string[]).indexOf('None') > -1} />
            <ListItemText 
              primary="None"
              sx={{ fontStyle: 'italic', color: 'text.secondary' }}
            />
          </MenuItem>
          
          {/* Regular options */}
          {safeOptions.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              <Checkbox checked={(formData[field] as string[]).indexOf(option.name) > -1} />
              <ListItemText 
                primary={`${option.name} (+$${option.price || 0})`}
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
    <AdminLayout title="Edit Product">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
              sx={{ color: 'text.secondary' }}
            >
              Back 
            </Button>
           
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
                {/* Header Row with Product Information and Switches */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2,
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 0 }
                }}>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    Product Information
                  </Typography>
                  
                  {/* Right Side - Status Switches in same row */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    '& .MuiFormControlLabel-root': {
                      margin: 0
                    }
                  }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isActive}
                          onChange={handleSwitchChange('isActive')}
                          color="error"
                        />
                      }
                      label="Active"
                      labelPlacement="start"
                      sx={{ 
                        gap: 1,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }
                      }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.showOnSpecialShop}
                          onChange={handleSwitchChange('showOnSpecialShop')}
                          color="error"
                        />
                      }
                      label="Special Shop"
                      labelPlacement="start"
                      sx={{ 
                        gap: 1,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>
                </Box>
                
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
                  
                  {/* Debug: Show current images state */}
                  <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Debug: Images count: {formData.images.length}
                    </Typography>
                    {formData.images.length > 0 && (
                      <Box>
                        {formData.images.map((img, idx) => (
                          <Typography key={idx} variant="caption" display="block">
                            Image {idx}: {img?.name || 'No name'} ({img?.size || 0} bytes) - {img instanceof File ? 'File' : typeof img}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                  
                  {/* Existing Images Preview */}
                  {existingImages.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                        Existing Images:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(8, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(16, 1fr)' }, gap: 0, mb: 2 }}>
                        {existingImages.map((imageUrl, index) => (
                          <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                            <img
                              src={imageUrl.startsWith('http') ? imageUrl : `https://superiorseats.ali-khalid.com${imageUrl}`}
                              alt={`Existing ${index + 1}`}
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
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 2,
                                left: 2,
                                bgcolor: 'primary.main',
                                color: 'white',
                                px: 0.5,
                                py: 0.25,
                                borderRadius: 0.5,
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {index === 0 ? 'PRIMARY' : 'EXISTING'}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* New Images Preview */}
                  {formData.images.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                        New Images:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(8, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(16, 1fr)' }, gap: 0, mb: 2 }}>
                        {formData.images.map((image, index) => {
                          console.log(`🖼️ Rendering image ${index}:`, {
                            image,
                            type: typeof image,
                            isFile: image instanceof File,
                            name: image?.name,
                            size: image?.size
                          });
                          
                          return (
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
                                  console.log(`❌ Image ${index} failed to load:`, e);
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 8px;">Error</div>';
                                }}
                                onLoad={() => {
                                  console.log(`✅ Image ${index} loaded successfully`);
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
                          );
                        })}
                      </Box>
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

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                    {renderMultiSelectField('seatStyle', 'Seat Style', seatStyles)}
                    {renderMultiSelectField('color', 'Color', colors)}
                  </Box>
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
