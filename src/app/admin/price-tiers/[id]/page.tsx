'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress, Chip, Paper, Stack, Divider } from '@mui/material';
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
  const [customerCount, setCustomerCount] = React.useState<number>(0);
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    const fetchPriceTier = async () => {
      try {
        const tierData = await apiService.getPriceTier(parseInt(resolvedParams.id));
        setPriceTier(tierData);
        
        // Load customer count for this price tier
        await loadCustomerCount(parseInt(resolvedParams.id));
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

  const loadCustomerCount = async (priceTierId: number) => {
    try {
      // Fetch all customers and count those with this price_tier_id
      const response = await apiService.getCustomers({ 
        per_page: 1000,
        page: 1,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      
      console.log(`Loading customer count for price tier ${priceTierId}`);
      console.log('API Response:', response);
      
      // Handle the correct response structure
      let customersData: any[] = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        customersData = response.data.data;
        console.log('Using response.data.data structure');
      } else if (response?.data && Array.isArray(response.data)) {
        customersData = response.data;
        console.log('Using response.data structure');
      } else if (Array.isArray(response)) {
        customersData = response;
        console.log('Using direct response array');
      } else {
        console.log('No valid data structure found in response');
        return;
      }
      
      const tierCustomers = customersData.filter((customer: any) => 
        customer.price_tier_id === priceTierId
      );
      
      console.log(`Found ${tierCustomers.length} customers for price tier ${priceTierId}:`, 
        tierCustomers.map(c => ({ id: c.id, name: c.name || `${c.first_name} ${c.last_name}` }))
      );
      
      setCustomerCount(tierCustomers.length);
    } catch (error: any) {
      console.error('Error loading customer count:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

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
            Back
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Price Tier Details">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/price-tiers')}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
       
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/admin/price-tiers/${priceTier.id}/edit`)}
          >
            Edit Price Tier
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
                    {priceTier.name}
                  </Typography>
                </Box>

                {priceTier.description && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {priceTier.description}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Pricing
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Discount Off Retail Price
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {priceTier.discount_off_retail_price}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Customers Count
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {customerCount}
                      </Typography>
                    </Box>
                  </Box>
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
                      {priceTier.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={priceTier.is_active !== false ? 'Active' : 'Inactive'}
                      color={priceTier.is_active !== false ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(priceTier.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(priceTier.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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

export default ViewPriceTierPage; 