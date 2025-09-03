'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  Alert,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface Color {
  id: number;
  name: string;
  hex_code: string;
  description: string;
  color_vendor_id: number;
  is_active: boolean;
  price_tier_ids: number[];
  
  created_at: string;
  updated_at: string;
}

interface ColorVendor {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
}

interface PriceTier {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  discount_off_retail_price: number;
  minimum_order_amount?: number;
  is_active: boolean;
}

const ColorsPage = () => {
  
  const [colors, setColors] = useState<Color[]>([]);
  const [colorVendors, setColorVendors] = useState<ColorVendor[]>([]);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hex_code: '',
    description: '',
    color_vendor_id: 0,
    is_active: 'true' as string,
    price_tier_ids: [] as number[],
  });

  // Debug effect for form data
  useEffect(() => {
    console.log('Form data state changed:', formData);
  }, [formData]);

  // Debug effect for editing color
  useEffect(() => {
    if (editingColor) {
      console.log('Editing color changed to:', editingColor);
    }
  }, [editingColor]);

  const loadColors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await apiService.getColors(params);
      
      // Handle the response structure
      if (response && response.data) {
        setColors(response.data);
      } else if (Array.isArray(response)) {
        setColors(response);
      } else {
        setColors([]);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please log in to access this page');
      } else {
        setError(err.message || 'Failed to load colors. Please try again later.');
      }
      console.error('Error loading colors:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const loadColorVendors = useCallback(async () => {
    try {
      const response = await apiService.getColorVendors();
      setColorVendors(response || []);
    } catch (err: any) {
      console.error('Error loading color vendors:', err);
      setColorVendors([]);
    }
  }, []);

  const loadPriceTiers = useCallback(async () => {
    try {
      const response = await apiService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err: any) {
      console.error('Error loading price tiers:', err);
      setPriceTiers([]);
    }
  }, []);

  useEffect(() => {
    loadColors();
    loadColorVendors();
    loadPriceTiers();
  }, [loadColors, loadColorVendors, loadPriceTiers]);

  // Debug effect for form visibility
  useEffect(() => {
    console.log('showAddForm state changed to:', showAddForm);
  }, [showAddForm]);

  const handleAdd = () => {
    console.log('handleAdd called - setting showAddForm to true');
    setShowAddForm(true);
    setEditingColor(null);
    resetForm();
    setAlert(null); // Clear any previous alerts
    console.log('Form state after handleAdd:', { showAddForm: true, editingColor: null });
  };

  const handleEdit = (color: Color) => {
    console.log('Editing color:', color);
    setEditingColor(color);
    setShowAddForm(true);
    const editFormData = {
      name: color.name,
      hex_code: color.hex_code,
      description: color.description,
      color_vendor_id: color.color_vendor_id,
      is_active: color.is_active.toString(),
      price_tier_ids: color.price_tier_ids || [], // Ensure it's always an array
    };
    setFormData(editFormData);
    console.log('Set form data for editing:', editFormData);
  };



  const handleDelete = (color: Color) => {
    setColorToDelete(color);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    console.log('resetForm called - resetting form data');
    const defaultFormData = {
      name: '',
      hex_code: '',
      description: '',
      color_vendor_id: 0,
      is_active: 'true' as string,
      price_tier_ids: [] as number[],
    };
    setFormData(defaultFormData);
    console.log('Form data reset to:', defaultFormData);
  };

  const handleFormChange = (field: string) => (event: any) => {
    let value = event.target.value;
    
    // Handle hex code input - ensure it has # prefix
    if (field === 'hex_code') {
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
    }
    
    // Don't convert is_active here - keep it as string for the form state
    // The conversion will happen in handleSubmit when preparing the API data
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelectChange = (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      price_tier_ids: typeof value === 'string' ? value.split(',').map(Number) : (value || []),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Current form data:', formData);
    
    // Validation
    if (!formData.name.trim()) {
      console.log('Validation failed: Color name is required');
      setAlert({ type: 'error', message: 'Color name is required' });
      return;
    }
    
    if (!formData.hex_code.trim()) {
      console.log('Validation failed: Hex code is required');
      setAlert({ type: 'error', message: 'Hex code is required' });
      return;
    }
    
    // Ensure hex code has # prefix and validate format
    let hexCode = formData.hex_code.trim();
    if (!hexCode.startsWith('#')) {
      hexCode = '#' + hexCode;
    }
    
    console.log('Hex code after processing:', hexCode);
    
    // Validate hex code format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexCode)) {
      console.log('Validation failed: Invalid hex code format');
      setAlert({ type: 'error', message: 'Please enter a valid hex color code (e.g., 000000 or #000000)' });
      return;
    }
    
    if (!formData.description.trim()) {
      console.log('Validation failed: Description is required');
      setAlert({ type: 'error', message: 'Description is required' });
      return;
    }
    
    if (!formData.color_vendor_id) {
      console.log('Validation failed: Color vendor is required');
      setAlert({ type: 'error', message: 'Color vendor is required' });
      return;
    }
    
    if (!formData.price_tier_ids || formData.price_tier_ids.length === 0) {
      console.log('Validation failed: Price tiers are required');
      setAlert({ type: 'error', message: 'At least one price tier is required' });
      return;
    }
    
    try {
      console.log('Validation passed, preparing to submit data');
      
      // Convert form data to match API schema exactly
      const submitData = {
        name: formData.name.trim(),
        hex_code: hexCode,
        description: formData.description.trim(),
        color_vendor_id: Number(formData.color_vendor_id),
        is_active: formData.is_active === 'true',
        price_tier_ids: (formData.price_tier_ids || []).map(id => Number(id)),
      };
      
      // For updates, ensure all fields are included
      if (editingColor) {
        console.log('Preparing update data for color ID:', editingColor.id);
        console.log('Original color data:', editingColor);
        console.log('Form data:', formData);
        console.log('Final update data:', submitData);
      }
      
      console.log('Prepared submit data:', submitData);
      console.log('Types check:', {
        name: typeof submitData.name,
        hex_code: typeof submitData.hex_code,
        description: typeof submitData.description,
        color_vendor_id: typeof submitData.color_vendor_id,
        is_active: typeof submitData.is_active,
        price_tier_ids: Array.isArray(submitData.price_tier_ids) ? 'array' : typeof submitData.price_tier_ids,
        price_tier_ids_content: submitData.price_tier_ids,
      });
      
      // Debug logging
      console.log('Submitting color data:', submitData);
      console.log('Form data state:', formData);
      console.log('Color vendors available:', colorVendors);
      console.log('Price tiers available:', priceTiers);
      console.log('Selected color vendor ID:', formData.color_vendor_id);
      console.log('Selected price tier IDs:', formData.price_tier_ids);
      
      if (editingColor) {
        // Update existing color
        console.log('Updating color with ID:', editingColor.id);
        console.log('Update data being sent:', submitData);
        
        try {
          const result = await apiService.updateColor(editingColor.id, submitData);
          console.log('Update color result:', result);
          setAlert({ type: 'success', message: 'Color updated successfully' });
        } catch (updateError: any) {
          console.error('Update color failed:', updateError);
          
          // Try to get more specific error information
          if (updateError.response?.data) {
            console.error('Server response data:', updateError.response.data);
            
            if (updateError.response.data.errors) {
              console.error('Validation errors:', updateError.response.data.errors);
              const errorMessages = Object.values(updateError.response.data.errors).flat();
              throw new Error(`Update validation failed: ${errorMessages.join(', ')}`);
            }
            
            if (updateError.response.data.message) {
              throw new Error(updateError.response.data.message);
            }
          }
          
          throw updateError; // Re-throw if we can't handle it
        }
      } else {
        // Create new color
        console.log('Creating new color');
        console.log('Final submit data structure:', JSON.stringify(submitData, null, 2));
        
        try {
          const result = await apiService.createColor(submitData);
          console.log('Create color result:', result);
          setAlert({ type: 'success', message: 'Color created successfully' });
        } catch (createError: any) {
          console.error('Create color failed:', createError);
          
          // Try to get more specific error information
          if (createError.response?.data) {
            console.error('Server response data:', createError.response.data);
            
            if (createError.response.data.errors) {
              console.error('Validation errors:', createError.response.data.errors);
              const errorMessages = Object.values(createError.response.data.errors).flat();
              throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
            }
            
            if (createError.response.data.message) {
              throw new Error(createError.response.data.message);
            }
          }
          
          throw createError; // Re-throw if we can't handle it
        }
      }
      
      setShowAddForm(false);
      setEditingColor(null);
      resetForm();
      setAlert(null);
      loadColors();
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      setAlert({ type: 'error', message: err.message || 'Failed to save color' });
    }
  };

  const handleBackToList = () => {
    console.log('Closing form and resetting');
    setShowAddForm(false);
    setEditingColor(null);
    resetForm();
    setAlert(null); // Clear any alerts
  };



  const confirmDelete = async () => {
    if (colorToDelete) {
      try {
        setDeleting(true);
        await apiService.deleteColor(colorToDelete.id);
        setColors(prev => prev.filter(c => c.id !== colorToDelete.id));
        setAlert({ type: 'success', message: 'Color deleted successfully' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete color');
        console.error('Error deleting color:', err);
      } finally {
        setDeleting(false);
      }
    }
    setIsDeleteDialogOpen(false);
    setColorToDelete(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <AdminLayout title="Colors">
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Colors
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ 
              alignSelf: { xs: 'stretch', sm: 'auto' }
            }}
          >
            Add Color
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search colors..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )}}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Colors Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : colors.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No colors found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add Color" to create your first color.'}
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }, 
            gap: 3 
          }}>
            {colors.map((color) => (
              <Card 
                key={color.id}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'},
                  transition: 'all 0.3s ease-in-out'}}
              >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        backgroundColor: color.hex_code || '#ccc',
                        border: 1,
                        borderColor: 'divider',
                        mr: 2}}
                    />
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        flex: 1}}
                    >
                      {color.name}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '3rem'}}
                  >
                    {color.description || 'No description available'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={color.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={color.is_active ? 'success' : 'default'}
                    />
                    <Typography variant="body2" color="text.secondary">
                      
                    </Typography>
                  </Box>

                  {color.hex_code && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Hex: {color.hex_code}
                    </Typography>
                  )}

                  {/* Color Vendor */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Vendor: {colorVendors.find(v => v.id === color.color_vendor_id)?.name || 'Unknown'}
                  </Typography>

                  {/* Price Tiers */}
                  {color.price_tier_ids && color.price_tier_ids.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Price Tiers:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {color.price_tier_ids.map((tierId) => {
                          const tier = priceTiers.find(t => t.id === tierId);
                          return tier ? (
                            <Chip
                              key={tierId}
                              label={tier.name}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                          ) : null;
                        })}
                      </Box>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(color)}
                    title="Edit"
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(color)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}

                 {/* Add/Edit Form Modal */}
         <Dialog 
           open={showAddForm} 
           onClose={handleBackToList}
           maxWidth="md"
           fullWidth
         >
           <Box sx={{ p: 4 }}>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                {editingColor ? 'Edit Color' : 'Add New Color'}
              </Typography>
              <IconButton 
                onClick={handleBackToList}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: 'grey.100',
                  '&:hover': {
                    backgroundColor: 'grey.200',
                  },
                  width: 32,
                  height: 32,
                }}
                size="small"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Color Name"
                  value={formData.name}
                  onChange={handleFormChange('name')}
                  fullWidth
                  required
                  placeholder="e.g. Midnight Black"
                />
                
                <TextField
                  label="Hex Code"
                  value={formData.hex_code.replace('#', '')}
                  onChange={handleFormChange('hex_code')}
                  fullWidth
                  required
                  placeholder="000000"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2" color="text.secondary">#</Typography>
                      </InputAdornment>
                    )}}
                />
                
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={handleFormChange('description')}
                  fullWidth
                  multiline
                  rows={3}
                  required
                  placeholder="e.g. Deep black color for luxury vehicles"
                />

                <FormControl fullWidth required>
                  <InputLabel>Color Vendor</InputLabel>
                  <Select
                    value={formData.color_vendor_id}
                    onChange={handleFormChange('color_vendor_id')}
                    label="Color Vendor"
                  >
                    <MenuItem value={0} disabled>
                      <em>Select a vendor</em>
                    </MenuItem>
                    {colorVendors.map((vendor) => (
                      <MenuItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Price Tiers</InputLabel>
                  <Select
                    multiple
                    value={formData.price_tier_ids}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput label="Price Tiers" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as number[] || []).map((value) => {
                          const tier = priceTiers.find(t => t.id === value);
                          return (
                            <Chip key={value} label={tier?.name || value} size="small" />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {priceTiers.map((tier) => (
                      <MenuItem key={tier.id} value={tier.id}>
                        <Checkbox checked={(formData.price_tier_ids || []).indexOf(tier.id) > -1} />
                        <ListItemText
                          primary={tier.name}
                          secondary={`${tier.discount_off_retail_price}% off retail`}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_active === 'true'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        is_active: e.target.checked ? 'true' : 'false'
                      }))}
                      color="primary"
                    />
                  }
                  label="Active"
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                  <Button onClick={handleBackToList} variant="outlined" size="large">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? 'Saving...' : editingColor ? 'Update Color' : 'Create Color'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Confirm Delete
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to delete &quot;{colorToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </Stack>
          </Box>
        </Dialog>

                          
      </Box>
    </AdminLayout>
  );
};

export default ColorsPage; 
