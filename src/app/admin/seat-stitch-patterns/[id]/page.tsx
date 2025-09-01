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

interface SeatStitchPattern {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const SeatStitchPatternDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [seatStitchPattern, setSeatStitchPattern] = useState<SeatStitchPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSeatStitchPattern();
  }, [id]);

  const loadSeatStitchPattern = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getSeatStitchPattern(parseInt(id));
      setSeatStitchPattern(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load seat stitch pattern');
      console.error('Error loading seat stitch pattern:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/seat-stitch-patterns/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/seat-stitch-patterns');
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
      <AdminLayout title="Seat Stitch Pattern Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !seatStitchPattern) {
    return (
      <AdminLayout title="Seat Stitch Pattern Details">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            {error || 'Seat Stitch Pattern not found'}
          </Alert>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Seat Stitch Pattern Details">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Seat Stitch Patterns
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Seat Stitch Pattern Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Seat Stitch Pattern
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
                    {seatStitchPattern.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {seatStitchPattern.description || 'No description available'}
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
                      {seatStitchPattern.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(seatStitchPattern.created_at)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(seatStitchPattern.updated_at)}
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

export default SeatStitchPatternDetailsPage; 