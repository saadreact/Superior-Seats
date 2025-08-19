'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress, Chip, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import { PriceTier } from '@/data/types';

interface ViewPriceTierPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ViewPriceTierPage = ({ params }: ViewPriceTierPageProps) => {
  const router = useRouter();
  const [priceTier, setPriceTier] = React.useState<PriceTier | null>(null);
  const [loading, setLoading] = React.useState(true);
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    const fetchPriceTier = async () => {
      try {
        const tierData = await apiService.getPriceTier(parseInt(resolvedParams.id));
        setPriceTier(tierData);
      } catch (error) {
        console.error('Error fetching price tier:', error);
        setPriceTier(null);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchPriceTier();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <AdminLayout title="Price Tier Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!priceTier) {
    return (
      <AdminLayout title="Price Tier Not Found">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">
            Price tier not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/price-tiers')}
            sx={{ mt: 2 }}
          >
            Back to Price Tiers
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Price Tier Details">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/price-tiers')}
          sx={{ mb: 2 }}
        >
          Back to Price Tiers
        </Button>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {priceTier.name}
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/admin/price-tiers/${priceTier.id}/edit`)}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Edit Price Tier
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Basic Information */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            Basic Information
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {priceTier.name}
              </Typography>
            </Box>
            
            {priceTier.description && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {priceTier.description}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Pricing Information */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            Pricing Settings
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2 
          }}>
                         <Box>
               <Typography variant="subtitle2" color="text.secondary">
                 Discount Off Retail Price
               </Typography>
               <Typography variant="body1">
                 {priceTier.discount_off_retail_price}%
               </Typography>
             </Box>
             
             <Box>
               <Typography variant="subtitle2" color="text.secondary">
                 Customers Count
               </Typography>
               <Typography variant="body1">
                 {priceTier.customers_count || 0}
               </Typography>
             </Box>
          </Box>
        </Paper>

        {/* Status Information */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            Status & Metadata
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 2 
          }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
                             <Chip
                 label={priceTier.is_active !== false ? 'Active' : 'Inactive'}
                 color={priceTier.is_active !== false ? 'success' : 'default'}
                 size="small"
               />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created Date
              </Typography>
              <Typography variant="body1">
                {new Date(priceTier.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1">
                {new Date(priceTier.updated_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default ViewPriceTierPage; 