'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Typography,
} from '@mui/material';

interface ProductFormProps {
  product?: any;
  categories: string[];
  onSubmit: (product: any) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'Seats',
    price: product?.price || '',
    stock: product?.stock || '',
    isActive: product?.isActive ?? true,
    image: product?.image || '',
    specifications: product?.specifications || {
      material: '',
      color: '',
      weight: '',
      dimensions: ''
    }
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSpecificationChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [field]: event.target.value,
      },
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={handleChange('name')}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={handleSelectChange('category')}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
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
            onChange={handleChange('price')}
            InputProps={{
              startAdornment: '$',
            }}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={handleChange('stock')}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <TextField
            fullWidth
            label="Image URL"
            value={formData.image}
            onChange={handleChange('image')}
            sx={{ mb: 2 }}
          />
        </Box>
        
        {/* Specifications */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Specifications
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Material"
            value={formData.specifications.material}
            onChange={handleSpecificationChange('material')}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Color"
            value={formData.specifications.color}
            onChange={handleSpecificationChange('color')}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Weight"
            value={formData.specifications.weight}
            onChange={handleSpecificationChange('weight')}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Dimensions"
            value={formData.specifications.dimensions}
            onChange={handleSpecificationChange('dimensions')}
            sx={{ mb: 2 }}
          />
        </Box>
        
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
            }
            label="Active"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm; 