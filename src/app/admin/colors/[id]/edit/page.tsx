'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  CircularProgress,
  InputAdornment} from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface ColorFormData {
  name: string;
  hex_code: string;
  description: string;
  is_active: boolean;
  
}

const EditColorPage = () => {
  const router = useRouter();
  const params = useParams();
  const colorId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ColorFormData>({
    name: '',
    hex_code: '',
    description: '',
    is_active: true});

  useEffect(() => {
    const loadColor = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const color = await apiService.getColor(parseInt(colorId));
        
        setFormData({
          name: color.name || '',
          hex_code: color.hex_code || '',
          description: color.description || '',
          is_active: color.is_active ?? true});
      } catch (err: any) {
        setError(err.message || 'Failed to load color');
        console.error('Error loading color:', err);
      } finally {
        setLoading(false);
      }
    };

    if (colorId) {
      loadColor();
    }
  }, [colorId]);

  const handleChange = (field: keyof ColorFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value}));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Color name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await apiService.updateColor(parseInt(colorId), formData);

      setSuccess('Color updated successfully!');
      setTimeout(() => {
        router.push('/admin/colors');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update color');
      console.error('Error updating color:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/colors');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Color">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Color">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Color
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
                <Button onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={saving || !formData.name.trim()}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditColorPage; 