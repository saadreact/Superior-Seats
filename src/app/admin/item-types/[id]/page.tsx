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
import { apiService } from '@/utils/api';

interface ItemType {
  id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

const ItemTypeDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemtypes, setItemType] = useState<ItemType | null>(null);

  useEffect(() => {
    loadItemType();
  }, [id]);

  const loadItemType = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getItemType(parseInt(id));
      setItemType(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load item type');
      console.error('Error loading item type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/item-types/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/item-types');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'});
  };

  if (loading) {
    return (
      <AdminLayout title="Seat Base Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !itemtypes) {
    return (
      <AdminLayout title="Seat Base Details">
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
            {error || 'Seat Base not found'}
          </Alert>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Seat Base Details">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            fullWidth={isMobile}
            sx={{
              minHeight: { xs: 44, sm: 'auto' },
              fontSize: { xs: '0.95rem', sm: '0.875rem' },
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Edit Seat Base
          </Button>
        </Box>

        {/* Content */}
        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                {/* Image */}
                {itemtypes.image && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Image
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 300,
                        height: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/${itemtypes.image}`}
                        alt={itemtypes.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div style="padding: 16px; color: #666; text-align: center;">Image failed to load</div>';
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {itemtypes.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {itemtypes.description || 'No description available'}
                  </Typography>
                </Box>


              </Stack>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 300 } }}>
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {itemtypes.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(itemtypes.created_at)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(itemtypes.updated_at)}
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

export default ItemTypeDetailPage;