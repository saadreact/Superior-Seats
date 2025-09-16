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
import { heatOptionsService } from '@/services/heat-options';

interface HeatOption {
  id: number;
  name: string;
  description: string;
  cost: number | string;
  price: number | string;
  price_adjustments?: Record<string, number | string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  price_tiers?: Array<{
    id: number;
    name: string;
    display_name: string;
    discount_off_retail_price: string;
    created_at: string;
    updated_at: string;
    pivot: {
      heat_option_id: number;
      price_tier_id: number;
      created_at: string;
      updated_at: string;
    };
  }>;
}

const HeatOptionDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heatoptions, setHeatOption] = useState<HeatOption | null>(null);

  useEffect(() => {
    loadHeatOption();
  }, [id]);

  const loadHeatOption = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await heatOptionsService.getHeatOption(parseInt(id));
      setHeatOption(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load heat option');
      console.error('Error loading heat option:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/heat-options/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/heat-options');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to safely format numbers
  const formatPrice = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  if (loading) {
    return (
      <AdminLayout title="Heat Option Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !heatoptions) {
    return (
      <AdminLayout title="Heat Option Details">
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
            {error || 'Heat Option not found'}
          </Alert>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Heat Option Details">
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
       
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Heat Option
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
                    {heatoptions.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {heatoptions.description || 'No description available'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Pricing
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Cost (Wholesale)
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ${formatPrice(heatoptions.cost)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Price (Retail)
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ${formatPrice(heatoptions.price)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {heatoptions.price_tiers && heatoptions.price_tiers.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Price Tiers
                    </Typography>
                    <Stack spacing={1}>
                      {heatoptions.price_tiers.map((tier) => (
                        <Box key={tier.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 500 }}>
                            {tier.display_name}:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {heatoptions.price_adjustments?.[tier.id.toString()] 
                              ? `+$${formatPrice(heatoptions.price_adjustments[tier.id.toString()])}`
                              : 'No adjustment'
                            }
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
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
                      {heatoptions.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(heatoptions.created_at)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(heatoptions.updated_at)}
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

export default HeatOptionDetailPage;