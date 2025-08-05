'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

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

interface VariationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Variation, 'id' | 'createdAt'>) => void;
  variation?: Variation | null;
  isViewMode?: boolean;
}

// Dropdown options based on configuration
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

const VariationForm: React.FC<VariationFormProps> = ({
  open,
  onClose,
  onSubmit,
  variation,
  isViewMode = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  useEffect(() => {
    if (variation) {
      setFormData({
        name: variation.name,
        category: variation.category,
        armType: variation.armType,
        lumbar: variation.lumbar,
        reclineType: variation.reclineType,
        seatType: variation.seatType,
        materialType: variation.materialType,
        heatOption: variation.heatOption,
        seatItemType: variation.seatItemType,
        color: variation.color,
        isActive: variation.isActive,
      });
    } else {
      setFormData({
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
    }
  }, [variation]);

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const value = event.target.value as string;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSwitchChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.category !== '' &&
      formData.armType !== '' &&
      formData.lumbar !== '' &&
      formData.reclineType !== '' &&
      formData.seatType !== '' &&
      formData.materialType !== '' &&
      formData.heatOption !== '' &&
      formData.seatItemType !== '' &&
      formData.color !== ''
    );
  };

  const renderField = (
    field: keyof typeof formData,
    label: string,
    options: string[],
    required = true
  ) => (
    <FormControl fullWidth required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={formData[field] as string}
        label={label}
        onChange={handleChange(field)}
        disabled={isViewMode}
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          minHeight: isMobile ? '100vh' : 'auto',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {isViewMode ? 'View Variation' : variation ? 'Edit Variation' : 'Add Variation'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'grey.500',
            '&:hover': {
              color: 'grey.700',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Basic Information
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Variation Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                disabled={isViewMode}
                placeholder="Enter variation name"
              />

              {renderField('category', 'Category', categories)}
            </Box>

            {/* Seat Configuration */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                Seat Configuration
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              {renderField('seatType', 'Seat Type', seatTypes)}
              {renderField('armType', 'Arm Type', armTypes)}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              {renderField('lumbar', 'Lumbar', lumbarOptions)}
              {renderField('reclineType', 'Recline Type', reclineTypes)}
            </Box>

            {/* Material & Features */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                Material & Features
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              {renderField('materialType', 'Material Type', materialTypes)}
              {renderField('heatOption', 'Heat Option', heatOptions)}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              {renderField('seatItemType', 'Seat Item Type', seatItemTypes)}
              {renderField('color', 'Color', colors)}
            </Box>

            {/* Status */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                Status
              </Typography>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleSwitchChange('isActive')}
                    disabled={isViewMode}
                  />
                }
                label="Active"
              />
            </Box>
          </Box>
        </DialogContent>

        {!isViewMode && (
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid()}
              sx={{
                backgroundColor: '#DA291C',
                '&:hover': {
                  backgroundColor: '#B71C1C',
                },
              }}
            >
              {variation ? 'Update' : 'Create'} Variation
            </Button>
          </DialogActions>
        )}

        {isViewMode && (
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
};

export default VariationForm; 