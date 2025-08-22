'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Alert,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  InputAdornment,
} from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface ColorFormData {
  name: string;
  hex_code: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

const CreateColorPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ColorFormData>({
    name: '',
    hex_code: '',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  const handleChange = (field: keyof ColorFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'sort_order' ? parseInt(value as string) || 0 : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Color name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await apiService.createColor(formData);

      setSuccess('Color created successfully!');
      setTimeout(() => {
        router.push('/admin/colors');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create color');
      console.error('Error creating color:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/colors');
  };

  return (
    <AdminLayout title="Create Color">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Color
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Color Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                error={!formData.name.trim() && formData.name !== ''}
                helperText={!formData.name.trim() && formData.name !== '' ? 'Color name is required' : ''}
              />

              <TextField
                fullWidth
                label="Hex Code"
                value={formData.hex_code}
                onChange={handleChange('hex_code')}
                placeholder="#000000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 1,
                          backgroundColor: formData.hex_code || '#ccc',
                          border: 1,
                          borderColor: 'divider',
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                helperText="Color hex code (e.g., #FF0000 for red)"
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={3}
              />

              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sort_order}
                onChange={handleChange('sort_order')}
                helperText="Display order (lower numbers appear first)"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleChange('is_active')}
                  />
                }
                label="Active"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !formData.name.trim()}
                >
                  {loading ? 'Creating...' : 'Create Color'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default CreateColorPage; 