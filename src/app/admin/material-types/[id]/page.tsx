'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { materialTypesService } from '@/services/material-types';

interface MaterialType {
  id: number;
  name: string;
  description: string;
  cost: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const MaterialTypeDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materialtypes, setMaterialType] = useState<MaterialType | null>(null);

  useEffect(() => {
    loadMaterialType();
  }, [id]);

  const loadMaterialType = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await materialTypesService.getMaterialType(parseInt(id));
      setMaterialType(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load material type');
      console.error('Error loading material type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/material-types/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/material-types');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'});
  };

  // Helper function to safely format price values
  const formatPrice = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  if (loading) {
    return (
      <AdminLayout title="Material Type Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !materialtypes) {
    return (
      <AdminLayout title="Material Type Details">
        <Box>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ color: 'text.secondary' }}
            >
              Back
            </Button>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Material Type not found'}
          </Alert>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Material Type Details">
      <Box>
        {/* Header */}
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ 
              color: 'text.secondary',
              alignSelf: { xs: 'flex-start', sm: 'auto' }
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              minHeight: { xs: 44, sm: 'auto' },
              fontSize: { xs: '0.95rem', sm: '0.875rem' },
              alignSelf: { xs: 'stretch', sm: 'auto' }
            }}
          >
            Edit Material Type
          </Button>
        </Box>

        {/* Content */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Name
                  </Typography>
                  <Typography variant="body1" sx={{
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {materialtypes.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {materialtypes.description || 'No description available'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    In Store Price
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    ${formatPrice(materialtypes.price)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Status
                  </Typography>
                  <Chip
                    label={materialtypes.is_active ? 'Active' : 'Inactive'}
                    color={materialtypes.is_active ? 'success' : 'default'}
                    size="small"
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.75rem' }
                    }}
                  />
                </Box>

              </Stack>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 300 } }}>
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
                  Information
                </Typography>
                <Divider sx={{ mb: 2 }} /> 
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.9rem', sm: '0.875rem' }
                    }}>
                      ID
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
                      {materialtypes.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.9rem', sm: '0.875rem' }
                    }}>
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
                      {formatDate(materialtypes.created_at)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.9rem', sm: '0.875rem' }
                    }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
                      {formatDate(materialtypes.updated_at)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default MaterialTypeDetailPage;