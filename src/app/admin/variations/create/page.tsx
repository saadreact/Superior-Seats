'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon, Save as SaveIcon } from '@mui/icons-material';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface FormOptions {
  stitch_patterns: Array<{
    name: string;
    image_url: string;
    description: string;
  }>;
  arm_types: string[];
  lumbar_options: string[];
  recline_types: string[];
  seat_types: string[];
  material_types: string[];
  heat_options: string[];
  seat_item_types: string[];
  colors: string[];
}

interface Variation {
  name: string;
  price: number;
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
  image?: File;
}

// Dropdown options - will be loaded from API
const categories: string[] = [];
const armTypes: string[] = [];
const lumbarOptions: string[] = [];
const reclineTypes: string[] = [];
const seatTypes: string[] = [];
const materialTypes: string[] = [];
const heatOptions: string[] = [];
const seatItemTypes: string[] = [];
const colors: string[] = [];

const CreateVariationPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState<Omit<Variation, 'id' | 'created_at'>>({
    name: '',
    price: 0,
    stitch_pattern: '',
    arm_type: '',
    lumbar: '',
    recline_type: '',
    seat_type: '',
    material_type: '',
    heat_option: '',
    seat_item_type: '',
    color: '',
    is_active: true,
    image: undefined,
  });

  const [options, setOptions] = useState<FormOptions>({
    stitch_patterns: [],
    arm_types: [],
    lumbar_options: [],
    recline_types: [],
    seat_types: [],
    material_types: [],
    heat_options: [],
    seat_item_types: [],
    colors: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setOptionsLoading(true);
      const response = await apiService.getVariationOptions();
      setOptions(response);
    } catch (err: any) {
      console.error('Error loading options:', err);
      setErrors({ submit: 'Failed to load form options. Please refresh the page.' });
    } finally {
      setOptionsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const value = event.target.value as string;
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

  const handleNumberChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
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

  const handleSwitchChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, or GIF)',
        }));
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 2MB',
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file,
      }));
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: '',
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Variation name is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.stitch_pattern) {
      newErrors.stitch_pattern = 'Stitch pattern is required';
    }

    if (!formData.arm_type) {
      newErrors.arm_type = 'Arm type is required';
    }

    if (!formData.lumbar) {
      newErrors.lumbar = 'Lumbar is required';
    }

    if (!formData.recline_type) {
      newErrors.recline_type = 'Recline type is required';
    }

    if (!formData.seat_type) {
      newErrors.seat_type = 'Seat type is required';
    }

    if (!formData.material_type) {
      newErrors.material_type = 'Material type is required';
    }

    if (!formData.heat_option) {
      newErrors.heat_option = 'Heat option is required';
    }

    if (!formData.seat_item_type) {
      newErrors.seat_item_type = 'Seat item type is required';
    }

    if (!formData.color) {
      newErrors.color = 'Color is required';
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
      // Convert File to base64 if image is provided
      let apiData = { ...formData };
      if (formData.image) {
        const base64 = await fileToBase64(formData.image);
        apiData = {
          ...formData,
          image: base64 as string,
        } as any;
      }

      const response = await apiService.createVariation(apiData as any);
      setSuccess('Variation created successfully!');
      setTimeout(() => {
        router.push('/admin/variations');
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create variation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    field: keyof typeof formData,
    label: string,
    optionsKey: keyof FormOptions,
    required = true
  ) => (
    <FormControl fullWidth required={required} error={!!errors[field]}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={formData[field] as string}
        label={label}
        onChange={handleChange(field)}
        disabled={optionsLoading}
      >
        {optionsKey === 'stitch_patterns' ? (
          options[optionsKey].map((option: any) => (
            <MenuItem key={option.name} value={option.name}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Image 
                  src={option.image_url} 
                  alt={option.name}
                  width={30}
                  height={30}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  onError={(e) => {
                    // Hide broken image
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        ) : (
          options[optionsKey].map((option: string) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );

  return (
    <AdminLayout title="Create Variation">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/admin/variations')}
              sx={{ color: 'text.secondary' }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1">
              Create Variation
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
        {optionsLoading ? (
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Variation Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    placeholder="Enter variation name"
                    error={!!errors.name}
                    helperText={errors.name}
                  />

                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={handleNumberChange('price')}
                    required
                    placeholder="Enter price"
                    InputProps={{
                      startAdornment: '$',
                    }}
                    error={!!errors.price}
                    helperText={errors.price}
                  />
                </Box>
              </Box>

              {/* Image Upload */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Variation Image
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Image Preview */}
                  {formData.image && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        style={{
                          width: 150,
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '2px solid #e0e0e0',
                        }}
                      />
                      <IconButton
                        onClick={removeImage}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                  
                  {/* Upload Button */}
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 1 }}
                      >
                        Upload Image
                      </Button>
                    </label>
                    {errors.image && (
                      <Typography variant="caption" color="error" display="block">
                        {errors.image}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block">
                      Supported formats: JPEG, PNG, GIF (Max 2MB)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Seat Configuration */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Seat Configuration
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  {renderField('seat_type', 'Seat Type', 'seat_types')}
                  {renderField('arm_type', 'Arm Type', 'arm_types')}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
                  {renderField('lumbar', 'Lumbar', 'lumbar_options')}
                  {renderField('recline_type', 'Recline Type', 'recline_types')}
                </Box>
              </Box>

              {/* Material & Features */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Material & Features
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  {renderField('material_type', 'Material Type', 'material_types')}
                  {renderField('heat_option', 'Heat Option', 'heat_options')}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
                  {renderField('stitch_pattern', 'Stitch Pattern', 'stitch_patterns')}
                  {renderField('seat_item_type', 'Seat Item Type', 'seat_item_types')}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
                  {renderField('color', 'Color', 'colors')}
                </Box>
              </Box>

              {/* Status */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={handleSwitchChange('is_active')}
                    />
                  }
                  label="Active"
                />
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
                  onClick={() => router.push('/admin/variations')}
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
                  {loading ? 'Creating...' : 'Create Variation'}
                </Button>
              </Box>
                          </Box>
            </form>
          </Paper>
        )}
      </Box>
    </AdminLayout>
  );
};

export default CreateVariationPage;

/**
 * Helper: convert File -> base64 string
 */
const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}; 
