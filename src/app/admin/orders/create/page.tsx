'use client';

import React from 'react';
import { Box } from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import OrderWizard from '@/components/admin/OrderWizard';

const CreateOrderPage = () => {
  return (
    <AdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <OrderWizard />
      </Box>
    </AdminLayout>
  );
};

export default CreateOrderPage; 
