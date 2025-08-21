'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import Image from 'next/image';

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
  id: number;
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
  image?: string;
  created_at: string;
  updated_at: string;
}

// Dropdown options
const categories = [
  'Truck Seats',
  'Car Seats',
  'Racing Seats',
  'Office Chairs',
  'Gaming Chairs',
  'Sofas',
];

const armTypes = [
  'Fixed',
  'Removable',
  'Adjustable',
  'None',
];

const lumbarOptions = [
  'Fixed',
  'Adjustable',
  'None',
];

const reclineTypes = [
  'Manual',
  'Power',
  'Fixed',
  'Reclining',
];

const seatTypes = [
  'Bucket',
  'Bench',
  'Split Bench',
  'Captain',
  'Jump Seat',
];

const materialTypes = [
  'Leather',
  'Fabric',
  'Vinyl',
  'Alcantara',
  'Mesh',
  'Suede',
];

const heatOptions = [
  'Yes',
  'No',
];

const seatItemTypes = [
  'Driver',
  'Passenger',
  'Both',
];

const colors = [
  'Black',
  'Gray',
  'Beige',
  'Brown',
  'Blue',
  'Red',
  'White',
  'Custom',
];

const EditVariationPage = () => {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

      const [formData, setFormData] = useState<Omit<Variation, 'id' | 'created_at' | 'updated_at'> & { newImage?: File }>({
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
      image: '',
      newImage: undefined,
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load options first
        const optionsResponse = await apiService.getVariationOptions();
        setOptions(optionsResponse);
        setOptionsLoading(false);

        // Then load variation data
        const variationId = Number(params.id);
        const response = await apiService.getVariation(variationId);
        const variation = response.variation;
        
        if (!variation) {
          setNotFound(true);
          return;
        }

        setFormData({
          name: variation.name,
          price: variation.price || 0,
          stitch_pattern: variation.stitch_pattern,
          arm_type: variation.arm_type,
          lumbar: variation.lumbar,
          recline_type: variation.recline_type,
          seat_type: variation.seat_type,
          material_type: variation.material_type,
          heat_option: variation.heat_option,
          seat_item_type: variation.seat_item_type,
          color: variation.color,
          is_active: variation.is_active,
          image: variation.image || '',
          newImage: undefined,
        });
      } catch (error: any) {
        setErrors({ submit: error.message || 'Failed to load variation. Please try again.' });
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [params.id]);

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
        newImage: file,
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
      newImage: undefined,
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
      const variationId = Number(params.id);
      
      // Prepare the update data with all required fields
      let updateData = {
        name: formData.name,
        price: formData.price,
        stitch_pattern: formData.stitch_pattern,
        arm_type: formData.arm_type,
        lumbar: formData.lumbar,
        recline_type: formData.recline_type,
        seat_type: formData.seat_type,
        material_type: formData.material_type,
        heat_option: formData.heat_option,
        seat_item_type: formData.seat_item_type,
        color: formData.color,
        is_active: formData.is_active,
      };
      
      // Convert File to base64 if new image is uploaded
      if (formData.newImage) {
        const base64 = await fileToBase64(formData.newImage);
        updateData = {
          ...updateData,
          image: base64 as string,
        } as any;
      }
      
      const response = await apiService.updateVariation(variationId, updateData);
      setSuccess('Variation updated successfully!');
      setTimeout(() => {
        router.push('/admin/variations');
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update variation. Please try again.' });
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
                <img 
                  src={option.image_url} 
                  alt={option.name}
                  style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4 }}
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

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Variation">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout title="Variation Not Found">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Variation Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The variation you&apos;re looking for doesn&apos;t exist.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/admin/variations')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Variations
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Variation">
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
              Edit Variation
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
                  {/* Current Image */}
                  {formData.image && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Current Image:
                      </Typography>
                      <Image
                        src={`https://superiorseats.ali-khalid.com${formData.image}`}
                        alt="Current variation image"
                        width={200}
                        height={150}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </Box>
                  )}
                  
                  {/* New Image Preview */}
                  {formData.newImage && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={URL.createObjectURL(formData.newImage)}
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
                        {formData.image ? 'Change Image' : 'Upload Image'}
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
                  {loading ? 'Updating...' : 'Update Variation'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditVariationPage;

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