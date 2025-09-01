'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Divider} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';

interface ReclineType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const ReclineTypeDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [reclineType, setReclineType] = useState<ReclineType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReclineType();
  }, [id]);

  const loadReclineType = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getReclineType(parseInt(id));
      setReclineType(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load recline type');
      console.error('Error loading recline type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/recline-types/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/recline-types');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Recline Type Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !reclineType) {
    return (
      <AdminLayout title="Recline Type Details">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            {error || 'Recline Type not found'}
          </Alert>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Recline Type Details">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Recline Types
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Recline Type Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Recline Type
          </Button>
        </Box>

        {/* Content */}
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {reclineType.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {reclineType.description || 'No description available'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 300 } }}>
              <Paper variant="outlined" sx={{ p: 3 }}>
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
                      {reclineType.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(reclineType.created_at)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(reclineType.updated_at)}
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

export default ReclineTypeDetailsPage; 