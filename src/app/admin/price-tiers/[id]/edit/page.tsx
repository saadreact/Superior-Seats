'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import PriceTierForm from '@/components/admin/PriceTierForm';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';
import { PriceTier } from '@/data/types';

interface EditPriceTierPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPriceTierPage = ({ params }: EditPriceTierPageProps) => {
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

  const handleSubmit = async (updatedPriceTier: any) => {
    try {
      console.log('Updating price tier:', updatedPriceTier);
      await apiService.updatePriceTier(parseInt(resolvedParams.id), updatedPriceTier);
      router.push('/admin/price-tiers');
    } catch (error) {
      console.error('Error updating price tier:', error);
      // Handle error (could show toast notification)
    }
  };

  const handleCancel = () => {
    router.push('/admin/price-tiers');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Price Tier">
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
    <AdminLayout title="Edit Price Tier">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/price-tiers')}
          sx={{ mb: 2 }}
        >
          Back to Price Tiers
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Price Tier: {priceTier.name}
        </Typography>
      </Box>
      
      <PriceTierForm
        priceTier={priceTier}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default EditPriceTierPage; 