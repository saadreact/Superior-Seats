'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
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
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  ZoomIn,
  Close as CloseIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import {
  categories,
  seatTypes,
  armTypes,
  lumbarTypes,
  reclineTypes,
  heatOptions,
  materialTypes,
  stitchPatterns,
  seatItemTypes,
  colors,
  sampleProducts,
} from '@/data/products2';

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

// Helper function to calculate total price based on selections
const calculateTotalPrice = (formData: ProductPage2Form): number => {
  let totalPrice = formData.basePrice;
  
  // Add category price
  const categoryItem = categories.find(cat => cat.name === formData.category);
 
  
  // Add seat type prices
  formData.seatType.forEach(seatType => {
    const seatTypeItem = seatTypes.find(st => st.name === seatType);
    if (seatTypeItem) totalPrice += seatTypeItem.price;
  });
  
  // Add arm type prices
  formData.armType.forEach(armType => {
    const armTypeItem = armTypes.find(at => at.name === armType);
    if (armTypeItem) totalPrice += armTypeItem.price;
  });
  
  // Add lumbar type prices
  formData.lumbarType.forEach(lumbarType => {
    const lumbarTypeItem = lumbarTypes.find(lt => lt.name === lumbarType);
    if (lumbarTypeItem) totalPrice += lumbarTypeItem.price;
  });
  
  // Add recline type prices
  formData.reclineType.forEach(reclineType => {
    const reclineTypeItem = reclineTypes.find(rt => rt.name === reclineType);
    if (reclineTypeItem) totalPrice += reclineTypeItem.price;
  });
  
  // Add heat option prices
  formData.heatOption.forEach(heatOption => {
    const heatOptionItem = heatOptions.find(ho => ho.name === heatOption);
    if (heatOptionItem) totalPrice += heatOptionItem.price;
  });
  
  // Add material type prices
  formData.materialType.forEach(materialType => {
    const materialTypeItem = materialTypes.find(mt => mt.name === materialType);
    if (materialTypeItem) totalPrice += materialTypeItem.price;
  });
  
  // Add stitch pattern prices
  formData.stitchPattern.forEach(stitchPattern => {
    const stitchPatternItem = stitchPatterns.find(sp => sp.name === stitchPattern);
    if (stitchPatternItem) totalPrice += stitchPatternItem.price;
  });
  
  // Add seat item type prices
  formData.seatItemType.forEach(seatItemType => {
    const seatItemTypeItem = seatItemTypes.find(sit => sit.name === seatItemType);
    if (seatItemTypeItem) totalPrice += seatItemTypeItem.price;
  });
  
  // Add color prices
  formData.color.forEach(color => {
    const colorItem = colors.find(c => c.name === color);
    if (colorItem) totalPrice += colorItem.price;
  });
  
  return totalPrice;
};

// Helper function to calculate total price for existing products
const calculateProductTotalPrice = (product: ProductItem): number => {
  let totalPrice = product.basePrice;
  
  // Add category price
  const categoryItem = categories.find(cat => cat.name === product.category);

  
  // Add seat type prices
  product.seatType.forEach(seatType => {
    const seatTypeItem = seatTypes.find(st => st.name === seatType);
    if (seatTypeItem) totalPrice += seatTypeItem.price;
  });
  
  // Add arm type prices
  product.armType.forEach(armType => {
    const armTypeItem = armTypes.find(at => at.name === armType);
    if (armTypeItem) totalPrice += armTypeItem.price;
  });
  
  // Add lumbar type prices
  product.lumbarType.forEach(lumbarType => {
    const lumbarTypeItem = lumbarTypes.find(lt => lt.name === lumbarType);
    if (lumbarTypeItem) totalPrice += lumbarTypeItem.price;
  });
  
  // Add recline type prices
  product.reclineType.forEach(reclineType => {
    const reclineTypeItem = reclineTypes.find(rt => rt.name === reclineType);
    if (reclineTypeItem) totalPrice += reclineTypeItem.price;
  });
  
  // Add heat option prices
  product.heatOption.forEach(heatOption => {
    const heatOptionItem = heatOptions.find(ho => ho.name === heatOption);
    if (heatOptionItem) totalPrice += heatOptionItem.price;
  });
  
  // Add material type prices
  product.materialType.forEach(materialType => {
    const materialTypeItem = materialTypes.find(mt => mt.name === materialType);
    if (materialTypeItem) totalPrice += materialTypeItem.price;
  });
  
  // Add stitch pattern prices
  product.stitchPattern.forEach(stitchPattern => {
    const stitchPatternItem = stitchPatterns.find(sp => sp.name === stitchPattern);
    if (stitchPatternItem) totalPrice += stitchPatternItem.price;
  });
  
  // Add seat item type prices
  product.seatItemType.forEach(seatItemType => {
    const seatItemTypeItem = seatItemTypes.find(sit => sit.name === seatItemType);
    if (seatItemTypeItem) totalPrice += seatItemTypeItem.price;
  });
  
  // Add color prices
  product.color.forEach(color => {
    const colorItem = colors.find(c => c.name === color);
    if (colorItem) totalPrice += colorItem.price;
  });
  
  return totalPrice;
};

const Products2Page = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Static products data
  const [products, setProducts] = useState<ProductItem[]>(sampleProducts);

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
  const [success, setSuccess] = useState('');

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingProduct(null);
    resetForm();
  };

  const handleEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setShowAddForm(true);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      basePrice: product.basePrice,
      stock: product.stock,
      images: [],
      seatType: product.seatType,
      armType: product.armType,
      lumbarType: product.lumbarType,
      reclineType: product.reclineType,
      heatOption: product.heatOption,
      materialType: product.materialType,
      stitchPattern: product.stitchPattern,
      seatItemType: product.seatItemType,
      color: product.color,
      isActive: product.isActive,
    });
  };

  const handleDelete = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const handleView = (product: ProductItem) => {
    setSelectedProduct(product);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  const handleBackToList = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
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
    setErrors({});
    setSuccess('');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingProduct) {
        // Update existing product
        setProducts(prev => prev.map(product => 
          product.id === editingProduct.id 
            ? {
                ...product,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                basePrice: formData.basePrice,
                stock: formData.stock,
                seatType: formData.seatType,
                armType: formData.armType,
                lumbarType: formData.lumbarType,
                reclineType: formData.reclineType,
                heatOption: formData.heatOption,
                materialType: formData.materialType,
                stitchPattern: formData.stitchPattern,
                seatItemType: formData.seatItemType,
                color: formData.color,
                isActive: formData.isActive,
              }
            : product
        ));
        setSuccess('Product updated successfully!');
      } else {
        // Add new product
        const newProduct: ProductItem = {
          id: Date.now().toString(),
          name: formData.name,
          category: formData.category,
          description: formData.description,
          basePrice: formData.basePrice,
          stock: formData.stock,
          images: formData.images.length > 0 
            ? formData.images.map(image => URL.createObjectURL(image))
            : ['/api/placeholder/150/150'],
          seatType: formData.seatType,
          armType: formData.armType,
          lumbarType: formData.lumbarType,
          reclineType: formData.reclineType,
          heatOption: formData.heatOption,
          materialType: formData.materialType,
          stitchPattern: formData.stitchPattern,
          seatItemType: formData.seatItemType,
          color: formData.color,
          isActive: formData.isActive,
          createdAt: new Date().toISOString().split('T')[0],
        };
        
        setProducts(prev => [newProduct, ...prev]);
        setSuccess('Product created successfully!');
      }
      
      setTimeout(() => {
        handleBackToList();
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderMultiSelectField = (
    field: keyof ProductPage2Form,
    label: string,
    options: { name: string; price: number }[],
    required = true
  ) => (
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
              <Chip key={value} label={value} size="small" />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            <Checkbox checked={(formData[field] as string[]).indexOf(option.name) > -1} />
            <ListItemText 
              primary={`${option.name} (+$${option.price})`} 
              secondary={option.price > 0 ? `Additional cost: $${option.price}` : 'No additional cost'}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show Add/Edit Product Form
  if (showAddForm) {
    return (
      <AdminLayout title={editingProduct ? "Edit Product - Products 2" : "Add Product - Products 2"}>
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
                {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                        {categories.map((category) => (
                          <MenuItem key={category.name} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))}
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
                    {loading ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Update Product' : 'Create Product')}
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Box>
      </AdminLayout>
    );
  }

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
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
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
                       label={`$${calculateProductTotalPrice(product).toFixed(2)}`}
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
                      {product.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={product.category || 'No Category'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Stock: {product.stock}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {product.description.substring(0, 60)}...
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
                      label={`$${calculateProductTotalPrice(selectedProduct).toFixed(2)}`}
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
                     {selectedProduct.name}
                   </Typography>
                   <Typography variant="body1" color="text.secondary" sx={{ 
                     lineHeight: 1.7,
                     fontSize: '1rem',
                     mb: 3
                   }}>
                     {selectedProduct.description}
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
                        ${calculateProductTotalPrice(selectedProduct).toFixed(2)}
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
                       {selectedProduct.stock}
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
                       {selectedProduct.category}
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
                       {selectedProduct.createdAt}
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
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedProduct.seatType.join(', ')}</Typography>
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
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedProduct.armType.join(', ')}</Typography>
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
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedProduct.lumbarType.join(', ')}</Typography>
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
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedProduct.reclineType.join(', ')}</Typography>
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
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedProduct.materialType.join(', ')}</Typography>
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
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedProduct.heatOption.join(', ')}</Typography>
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
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedProduct.stitchPattern.join(', ')}</Typography>
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
                       <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedProduct.color.join(', ')}</Typography>
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
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>${selectedProduct.basePrice.toFixed(2)}</Typography>
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
                           {selectedProduct.seatType.join(', ')} (+${selectedProduct.seatType.reduce((sum, st) => sum + (seatTypes.find(s => s.name === st)?.price || 0), 0)})
                         </Typography>
                       </Box>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Material</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
                           {selectedProduct.materialType.join(', ')} (+${selectedProduct.materialType.reduce((sum, mt) => sum + (materialTypes.find(m => m.name === mt)?.price || 0), 0)})
                         </Typography>
                       </Box>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Heat Option</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
                           {selectedProduct.heatOption.join(', ')} (+${selectedProduct.heatOption.reduce((sum, ho) => sum + (heatOptions.find(h => h.name === ho)?.price || 0), 0)})
                         </Typography>
                       </Box>
                       <Box>
                         <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Recline Type</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
                           {selectedProduct.reclineType.join(', ')} (+${selectedProduct.reclineType.reduce((sum, rt) => sum + (reclineTypes.find(r => r.name === rt)?.price || 0), 0)})
                         </Typography>
                       </Box>
                     </Box>
                     
                     <Divider sx={{ my: 2 }} />
                     
                     <Box sx={{ textAlign: 'center', pt: 2 }}>
                       <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700 }}>
                         Total Price: ${calculateProductTotalPrice(selectedProduct).toFixed(2)}
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
      </Box>
    </AdminLayout>
  );
};

export default Products2Page;

