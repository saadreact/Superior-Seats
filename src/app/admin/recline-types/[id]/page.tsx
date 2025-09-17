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
  Divider,
  Chip,
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { reclineTypesService } from '@/services/recline-types';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

interface ReclineType {
  id: number;
  name: string;
  description: string;
  cost: number;
  price: number;
  image: string;
  price_tiers: Array<{
    id: number;
    name: string;
    display_name: string;
    discount_off_retail_price: number;
    pivot: {
      price_adjustment: number;
    };
  }>;
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
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);

  useEffect(() => {
    loadReclineType();
  }, [id]);

  const loadReclineType = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await reclineTypesService.getReclineType(parseInt(id));
      setReclineType(data);
      
      // Create calculated price tiers from existing data
      const priceTiers: CalculatedPriceTier[] = data.price_tiers?.map((tier: any) => ({
        id: tier.id,
        name: tier.name,
        display_name: tier.display_name,
        discount_off_retail_price: tier.discount_off_retail_price,
        calculated_price: tier.pivot?.price_adjustment || 0,
        override_price: undefined,
        is_overridden: false
      })) || [];
      setCalculatedPriceTiers(priceTiers);
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
            Back
          </Button>
        
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
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

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Pricing
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        In Shop Price
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ${VariantsCalculation.formatPrice(reclineType.price)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {calculatedPriceTiers.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Based on base price: ${VariantsCalculation.formatPrice(reclineType.price)}
                    </Typography>
                    <Stack spacing={2}>
                      {VariantsCalculation.sortByDiscountPercentage(calculatedPriceTiers).map((tier) => (
                        <Paper key={tier.id} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {tier.display_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {parseFloat(tier.discount_off_retail_price) > 0 
                                  ? `${tier.discount_off_retail_price}% discount` 
                                  : 'No discount'
                                }
                              </Typography>
                              {tier.is_overridden && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  Calculated: ${VariantsCalculation.formatPrice(tier.calculated_price)}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                color: tier.is_overridden ? 'warning.main' : 'primary.main'
                              }}>
                                ${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(tier))}
                              </Typography>
                              {tier.is_overridden && (
                                <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                                  Overridden
                                </Typography>
                              )}
                              {!tier.is_overridden && tier.discount_amount > 0 && (
                                <Typography variant="caption" color="success.main">
                                  Save: ${VariantsCalculation.formatPrice(tier.discount_amount)}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}

                {reclineType.image && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Image
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ 
                      border: '2px solid #e0e0e0', 
                      borderRadius: 2, 
                      p: 1,
                      backgroundColor: '#fafafa',
                      display: 'inline-block'
                    }}>
                      <img
                        src={`https://superiorseats.ali-khalid.com/${reclineType.image}`}
                        alt={reclineType.name}
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          display: 'block'
                        }}
                        onError={(e) => {
                          console.log('Image load error for:', `https://superiorseats.ali-khalid.com/${reclineType.image}`);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Image not available</div>';
                          }
                        }}
                      />
                    </Box>
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