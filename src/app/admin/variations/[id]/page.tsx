'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import Image from 'next/image';

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

const ViewVariationPage = () => {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [variation, setVariation] = useState<Variation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadVariation = async () => {
      try {
        const variationId = Number(params.id);
        const response = await apiService.getVariation(variationId);
        const foundVariation = response.variation;
        
        if (!foundVariation) {
          setNotFound(true);
          return;
        }

        setVariation(foundVariation);
      } catch (error: any) {
        console.error('Failed to load variation:', error);
        setError(error.message || 'Failed to load variation');
      } finally {
        setLoading(false);
      }
    };

    loadVariation();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin/variations/${params.id}/edit`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this variation?')) {
      // Mock delete - replace with actual API call
      router.push('/admin/variations');
    }
  };

  const renderField = (label: string, value: string | boolean) => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', sm: 'center' },
      py: 1,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}>
      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
        {label}:
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : value}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <AdminLayout title="View Variation">
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

  if (!variation) {
    return null;
  }

  return (
    <AdminLayout title="View Variation">
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
              View Variation
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Content */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header Info */}
            <Box>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                {variation.name}
              </Typography>
              <Chip
                label={variation.is_active ? 'Active' : 'Inactive'}
                color={variation.is_active ? 'success' : 'default'}
                size="small"
              />
            </Box>

            {/* Variation Image */}
            {variation.image && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Variation Image
                </Typography>
                <Image
                  src={`https://superiorseats.ali-khalid.com${variation.image}`}
                  alt={variation.name}
                  width={200}
                  height={150}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
            )}

            <Divider />

            {/* Basic Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Basic Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderField('Name', variation.name)}
                {renderField('Price', `$${variation.price}`)}
              </Box>
            </Box>

            {/* Seat Configuration */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Seat Configuration
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderField('Seat Type', variation.seat_type)}
                {renderField('Arm Type', variation.arm_type)}
                {renderField('Lumbar', variation.lumbar)}
                {renderField('Recline Type', variation.recline_type)}
              </Box>
            </Box>

            {/* Material & Features */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Material & Features
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderField('Material Type', variation.material_type)}
                {renderField('Heat Option', variation.heat_option)}
                {renderField('Stitch Pattern', variation.stitch_pattern)}
                {renderField('Seat Item Type', variation.seat_item_type)}
                {renderField('Color', variation.color)}
              </Box>
            </Box>

            {/* Status */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderField('Status', variation.is_active)}
                {renderField('Created At', new Date(variation.created_at).toLocaleDateString())}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default ViewVariationPage; 