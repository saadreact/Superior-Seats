'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import PriceTierForm from '@/components/admin/PriceTierForm';
import { useRouter } from 'next/navigation';
import { apiService } from '@/utils/api';

const CreatePriceTierPage = () => {
  const router = useRouter();

  const handleSubmit = async (priceTierData: any) => {
    try {
      console.log('Creating price tier:', priceTierData);
      await apiService.createPriceTier(priceTierData);
      router.push('/admin/price-tiers');
    } catch (error) {
      console.error('Error creating price tier:', error);
      // Handle error (could show toast notification)
    }
  };

  const handleCancel = () => {
    router.push('/admin/price-tiers');
  };

  return (
    <AdminLayout title="Create New Price Tier">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/price-tiers')}
          sx={{ mb: 2 }}
        >
          Back to Price Tiers
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Price Tier
        </Typography>
      </Box>
      
      <PriceTierForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default CreatePriceTierPage; 