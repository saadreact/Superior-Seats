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
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

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
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);

  useEffect(() => {
    loadHeatOption();
  }, [id]);

  const loadHeatOption = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await heatOptionsService.getHeatOption(parseInt(id));
      setHeatOption(data);
      
      // Create calculated price tiers from existing data (show actual prices from API)
      if (data.price_tiers && data.price_tiers.length > 0 && data.price > 0) {
        const basePrice = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
        
        const existingCalculatedTiers = data.price_tiers.map((tier: any) => {
          const discountPercentage = parseFloat(tier.discount_off_retail_price) || 0;
          const discountAmount = (basePrice * discountPercentage) / 100;
          const calculatedPrice = basePrice - discountAmount;
          const actualPrice = tier.pivot?.price_adjustment ? parseFloat(tier.pivot.price_adjustment) : calculatedPrice;
          const isOverridden = actualPrice !== calculatedPrice;
          
          return {
            id: tier.id,
            name: tier.name,
            display_name: tier.display_name,
            discount_off_retail_price: tier.discount_off_retail_price,
            created_at: tier.created_at,
            updated_at: tier.updated_at,
            customers_count: 0,
            calculated_price: calculatedPrice,
            discount_amount: discountAmount,
            override_price: isOverridden ? actualPrice : undefined,
            is_overridden: isOverridden
          };
        });
        
        setCalculatedPriceTiers(existingCalculatedTiers);
      }
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

                {calculatedPriceTiers.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Based on base price: ${formatPrice(heatoptions.price)}
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