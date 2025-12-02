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
  useTheme,
  useMediaQuery,
} from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
          const multiplier = parseFloat(tier.discount_off_retail_price) || 1;
          const calculatedPriceFromMultiplier = Math.round((basePrice * multiplier) * 100) / 100;
          const discountAmount = Math.round((basePrice - calculatedPriceFromMultiplier) * 100) / 100;
          const actualPrice = tier.pivot?.price_adjustment ? parseFloat(tier.pivot.price_adjustment) : calculatedPriceFromMultiplier;
          const isOverridden = Math.abs(actualPrice - calculatedPriceFromMultiplier) > 0.01;
          
          return {
            id: tier.id,
            name: tier.name,
            display_name: tier.display_name,
            discount_off_retail_price: tier.discount_off_retail_price,
            created_at: tier.created_at,
            updated_at: tier.updated_at,
            customers_count: 0,
            calculated_price: calculatedPriceFromMultiplier,
            discount_amount: discountAmount,
            override_price: isOverridden ? Math.round(actualPrice * 100) / 100 : undefined,
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
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }
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
              fontSize: { xs: '0.95rem', sm: '0.875rem' }
            }}
          >
            Edit Heat Option
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
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Name
                  </Typography>
                  <Typography variant="body1" sx={{
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {heatoptions.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '0.875rem' }
                  }}>
                    {heatoptions.description || 'No description available'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Pricing
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{
                        fontSize: { xs: '0.95rem', sm: '0.875rem' }
                      }}>
                        Cost (Wholesale)
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: 'success.main',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}>
                        ${formatPrice(heatoptions.cost)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{
                        fontSize: { xs: '0.95rem', sm: '0.875rem' }
                      }}>
                        Price (Retail)
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: 'primary.main',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}>
                        ${formatPrice(heatoptions.price)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {calculatedPriceTiers.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}>
                      Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      mb: 2, 
                      color: 'text.secondary',
                      fontSize: { xs: '0.95rem', sm: '0.875rem' }
                    }}>
                      Based on base price: ${formatPrice(heatoptions.price)}
                    </Typography>
                    <Stack spacing={2}>
                      {VariantsCalculation.sortByDiscountPercentage(calculatedPriceTiers).map((tier) => (
                        <Paper key={tier.id} variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 0 }
                          }}>
                            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                              <Typography variant="subtitle2" sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '0.95rem', sm: '0.875rem' }
                              }}>
                                {tier.display_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{
                                fontSize: { xs: '0.85rem', sm: '0.75rem' }
                              }}>
                                Multiplier: {parseFloat(tier.discount_off_retail_price) || 1} × Base Price
                              </Typography>
                              {tier.is_overridden && (
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  fontSize: { xs: '0.75rem', sm: '0.7rem' }
                                }}>
                                  Calculated: ${VariantsCalculation.formatPrice(tier.calculated_price)}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                color: tier.is_overridden ? 'warning.main' : 'primary.main',
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                              }}>
                                ${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(tier))}
                              </Typography>
                              {tier.is_overridden && (
                                <Typography variant="caption" color="warning.main" sx={{ 
                                  display: 'block',
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                }}>
                                  Overridden
                                </Typography>
                              )}
                              {!tier.is_overridden && tier.discount_amount > 0 && (
                                <Typography variant="caption" color="success.main" sx={{
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                }}>
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
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.95rem', sm: '0.875rem' }
                    }}>
                      ID
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
                      {heatoptions.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.95rem', sm: '0.875rem' }
                    }}>
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
                      {formatDate(heatoptions.created_at)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.95rem', sm: '0.875rem' }
                    }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}>
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