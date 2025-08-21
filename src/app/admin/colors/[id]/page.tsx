'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Alert,
  Paper,
  Button,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface Color {
  id: number;
  name: string;
  hex_code: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const ColorDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const colorId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState<Color | null>(null);

  useEffect(() => {
    const loadColor = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const colorData = await apiService.getColor(parseInt(colorId));
        setColor(colorData);
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

  const handleEdit = () => {
    router.push(`/admin/colors/${colorId}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/colors');
  };

  if (loading) {
    return (
      <AdminLayout title="Color Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !color) {
    return (
      <AdminLayout title="Color Details">
        <Box>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Color not found'}
          </Alert>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back to Colors
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Color Details">
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back to Colors
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Color
          </Button>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                backgroundColor: color.hex_code || '#ccc',
                border: 1,
                borderColor: 'divider',
                mr: 3,
              }}
            />
            <Typography variant="h4" component="h1">
              {color.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {color.description || 'No description available'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={color.is_active ? 'Active' : 'Inactive'}
                        color={color.is_active ? 'success' : 'default'}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        Sort Order
                      </Typography>
                      <Typography variant="body1">
                        {color.sort_order}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        Hex Code
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        {color.hex_code || 'No hex code set'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        ID
                      </Typography>
                      <Typography variant="body1">
                        {color.id}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Timestamps
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {new Date(color.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(color.updated_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 300 } }}>
              <Typography variant="h6" gutterBottom>
                Color Preview
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  borderRadius: 2,
                  backgroundColor: color.hex_code || '#ccc',
                  border: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: color.hex_code ? 'white' : 'black',
                    textShadow: color.hex_code ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none',
                  }}
                >
                  {color.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                {color.hex_code || 'No hex code'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default ColorDetailPage; 