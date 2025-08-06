'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';

interface Variation {
  id: number;
  name: string;
  category: string;
  armType: string;
  lumbar: string;
  reclineType: string;
  seatType: string;
  materialType: string;
  heatOption: string;
  seatItemType: string;
  color: string;
  isActive: boolean;
  createdAt: string;
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

const CreateVariationPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState<Omit<Variation, 'id' | 'createdAt'>>({
    name: '',
    category: '',
    armType: '',
    lumbar: '',
    reclineType: '',
    seatType: '',
    materialType: '',
    heatOption: '',
    seatItemType: '',
    color: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

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

  const handleSwitchChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Variation name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.armType) {
      newErrors.armType = 'Arm type is required';
    }

    if (!formData.lumbar) {
      newErrors.lumbar = 'Lumbar is required';
    }

    if (!formData.reclineType) {
      newErrors.reclineType = 'Recline type is required';
    }

    if (!formData.seatType) {
      newErrors.seatType = 'Seat type is required';
    }

    if (!formData.materialType) {
      newErrors.materialType = 'Material type is required';
    }

    if (!formData.heatOption) {
      newErrors.heatOption = 'Heat option is required';
    }

    if (!formData.seatItemType) {
      newErrors.seatItemType = 'Seat item type is required';
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Variation created successfully!');
      setTimeout(() => {
        router.push('/admin/variations');
      }, 1500);
    } catch (error) {
      setErrors({ submit: 'Failed to create variation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    field: keyof typeof formData,
    label: string,
    options: string[],
    required = true
  ) => (
    <FormControl fullWidth required={required} error={!!errors[field]}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={formData[field] as string}
        label={label}
        onChange={handleChange(field)}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
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

                  {renderField('category', 'Category', categories)}
                </Box>
              </Box>

              {/* Seat Configuration */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Seat Configuration
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  {renderField('seatType', 'Seat Type', seatTypes)}
                  {renderField('armType', 'Arm Type', armTypes)}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
                  {renderField('lumbar', 'Lumbar', lumbarOptions)}
                  {renderField('reclineType', 'Recline Type', reclineTypes)}
                </Box>
              </Box>

              {/* Material & Features */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Material & Features
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  {renderField('materialType', 'Material Type', materialTypes)}
                  {renderField('heatOption', 'Heat Option', heatOptions)}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
                  {renderField('seatItemType', 'Seat Item Type', seatItemTypes)}
                  {renderField('color', 'Color', colors)}
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
                      checked={formData.isActive}
                      onChange={handleSwitchChange('isActive')}
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
      </Box>
    </AdminLayout>
  );
};

export default CreateVariationPage; 