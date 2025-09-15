'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  
  // Vehicle Information Fields
  vehicleMake: string;
  vehicleModel: string;
  vehicleTrim: string;
  
  // Second Half - Variation Fields
  seatType: string[];
  armType: string[];
  lumbarType: string[];
  reclineType: string[];
  heatOption: string[];
  materialType: string[];
  stitchPattern: string[];
  seatItemType: string[];
  seatStyle: string[]; // Added new field
  color: string[];
  
  // Special Shop Field
  showOnSpecialShop: boolean;
  
  // Price Tiers Fields
  enablePriceTiers: boolean;
  wholesalePrice: number;
  retailPrice: number;
  
  isActive: boolean;
}

const CreateProduct2Page = () => {
  const router = useRouter();
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
    vehicleMake: '',
    vehicleModel: '',
    vehicleTrim: '',
    seatType: [],
    armType: [],
    lumbarType: [],
    reclineType: [],
    heatOption: [],
    materialType: [],
    stitchPattern: [],
    seatItemType: [],
    seatStyle: [], // Added new field
    color: [],
    showOnSpecialShop: false,
    enablePriceTiers: false,
    wholesalePrice: 0,
    retailPrice: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

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
  const [seatStyles, setSeatStyles] = useState<{ id: number; name: string; price: number }[]>([]); // Added new field
  const [colors, setColors] = useState<{ id: number; name: string; price: number }[]>([]);
  
  // Vehicle data state
  const [vehicleMakes, setVehicleMakes] = useState<{ id: number; name: string }[]>([]);
  const [vehicleModels, setVehicleModels] = useState<{ id: number; name: string; vehicle_make_id: number }[]>([]);
  const [vehicleTrims, setVehicleTrims] = useState<{ id: number; name: string; vehicle_model_id: number }[]>([]);
  

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      
      // Load all required data for dropdowns using the new productApi with fallbacks
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
        vehicleMakesRes,
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
        apiService.getVehicleMakes(),
      ]);

      // Debug API responses
      console.log('=== API RESPONSES DEBUG ===');
      console.log('Seat Types API Response:', seatTypesRes);
      console.log('Arm Types API Response:', armTypesRes);
      console.log('Item Types API Response:', seatItemTypesRes);
      console.log('Seat Styles API Response:', seatStylesRes);
      console.log('Categories API Response:', categoriesRes);
      console.log('===========================');
      
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
      const processedSeatStyles = convertToFormFormat(seatStylesRes, false); // Seat styles don't have price
      console.log('Processed Seat Styles:', processedSeatStyles);
      setSeatStyles(processedSeatStyles);
      setColors(convertToFormFormat(colorsRes));
      
      // Set vehicle makes data
      const vehicleMakesData = Array.isArray(vehicleMakesRes?.data) ? vehicleMakesRes.data : 
                              Array.isArray(vehicleMakesRes) ? vehicleMakesRes : [];
      setVehicleMakes(vehicleMakesData.map((make: any) => ({
        id: make.id,
        name: make.name
      })));
    } catch (error: any) {
      console.error('Error loading initial data:', error);
      
      if (error.response?.status === 401 || error.message.includes('401') || error.message.includes('Unauthorized')) {
        setErrors({ submit: 'Authentication required. You will be redirected to the login page in 3 seconds.' });
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (error.response?.status === 403) {
        setErrors({ submit: 'Access denied. You do not have permission to create products.' });
      } else {
        setErrors({ submit: 'Failed to load form data. Please refresh the page.' });
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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  // Vehicle change handlers
  const handleVehicleMakeChange = async (event: any) => {
    const makeId = event.target.value;
    setFormData(prev => ({
      ...prev,
      vehicleMake: makeId,
      vehicleModel: '', // Reset model when make changes
      vehicleTrim: '', // Reset trim when make changes
    }));
    
    // Load models for selected make
    if (makeId) {
      try {
        const modelsResponse = await apiService.getVehicleModels(Number(makeId));
        const modelsData = Array.isArray(modelsResponse?.data) ? modelsResponse.data : 
                          Array.isArray(modelsResponse) ? modelsResponse : [];
        setVehicleModels(modelsData.map((model: any) => ({
          id: model.id,
          name: model.name,
          vehicle_make_id: model.vehicle_make_id
        })));
        setVehicleTrims([]); // Clear trims when make changes
      } catch (error) {
        console.error('Error loading vehicle models:', error);
        setVehicleModels([]);
        setVehicleTrims([]);
      }
    } else {
      setVehicleModels([]);
      setVehicleTrims([]);
    }
  };

  const handleVehicleModelChange = async (event: any) => {
    const modelId = event.target.value;
    setFormData(prev => ({
      ...prev,
      vehicleModel: modelId,
      vehicleTrim: '', // Reset trim when model changes
    }));
    
    // Load trims for selected model
    if (modelId) {
      try {
        const trimsResponse = await apiService.getVehicleTrims(Number(modelId));
        const trimsData = Array.isArray(trimsResponse?.data) ? trimsResponse.data : 
                         Array.isArray(trimsResponse) ? trimsResponse : [];
        setVehicleTrims(trimsData.map((trim: any) => ({
          id: trim.id,
          name: trim.name,
          vehicle_model_id: trim.vehicle_model_id
        })));
      } catch (error) {
        console.error('Error loading vehicle trims:', error);
        setVehicleTrims([]);
      }
    } else {
      setVehicleTrims([]);
    }
  };

  const handleVehicleTrimChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      vehicleTrim: event.target.value,
    }));
  };

  // Price tiers handlers
  const handlePriceTiersToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setFormData(prev => ({
      ...prev,
      enablePriceTiers: enabled,
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

      // Create product data object using simple File array (like lumbar types)
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.basePrice,
        stock: formData.stock,
        is_active: formData.isActive,
        show_on_special_shop: formData.showOnSpecialShop,
        category_id: categoryId,
        images: formData.images, // Simple File array like lumbar types
        
        // Vehicle information - only pass trim ID
        vehicle_trim_id: formData.vehicleTrim ? Number(formData.vehicleTrim) : undefined,
        
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
        
        // Price tiers - like lumbar type implementation
        price_tier_ids: [],
        price_adjustments: undefined,
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

      // Call the new productApi to create product
      await productApi.createProduct(productData);
      
      setSuccess('Product created successfully!');
      
      setTimeout(() => {
        handleBackToList();
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create product. Please try again.' });
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
      <AdminLayout title="Create Product">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Create Product">
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
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, basePrice: value }));
                    }}
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
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, stock: value }));
                    }}
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
                  
                  {/* Image Preview */}
                  {formData.images.length > 0 && (
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

              {/* 🚗 Vehicle Information Section */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Vehicle Figments
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Vehicle Make</InputLabel>
                    <Select
                      value={formData.vehicleMake}
                      onChange={handleVehicleMakeChange}
                      label="Vehicle Make"
                    >
                      <MenuItem value="">
                        <em>Select Make</em>
                      </MenuItem>
                      {vehicleMakes.map((make) => (
                        <MenuItem key={make.id} value={make.id}>
                          {make.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth disabled={!formData.vehicleMake}>
                    <InputLabel>Vehicle Model</InputLabel>
                    <Select
                      value={formData.vehicleModel}
                      onChange={handleVehicleModelChange}
                      label="Vehicle Model"
                    >
                      <MenuItem value="">
                        <em>Select Model</em>
                      </MenuItem>
                      {vehicleModels.map((model) => (
                        <MenuItem key={model.id} value={model.id}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth disabled={!formData.vehicleModel}>
                    <InputLabel>Vehicle Trim</InputLabel>
                    <Select
                      value={formData.vehicleTrim}
                      onChange={handleVehicleTrimChange}
                      label="Vehicle Trim"
                    >
                      <MenuItem value="">
                        <em>Select Trim</em>
                      </MenuItem>
                      {vehicleTrims.map((trim) => (
                        <MenuItem key={trim.id} value={trim.id}>
                          {trim.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* 💰 Price Tiers Section */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
                  Price Tiers
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.enablePriceTiers}
                      onChange={handlePriceTiersToggle}
                      color="primary"
                    />
                  }
                  label="Enable Price Tiers"
                />

                {formData.enablePriceTiers && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Tier Pricing
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Retail Price"
                        type="number"
                        value={formData.retailPrice}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, retailPrice: value }));
                        }}
                        required
                        fullWidth
                        placeholder="Enter retail price"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                      <TextField
                        label="Wholesale Price"
                        type="number"
                        value={formData.wholesalePrice}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, wholesalePrice: value }));
                        }}
                        required
                        fullWidth
                        placeholder="Enter wholesale price"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Box>
                  </Box>
                )}
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
                  {loading ? 'Creating...' : 'Create Product'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateProduct2Page;
