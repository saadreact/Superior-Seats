'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

const CheckoutPage = () => {
  return (
    <LazyComponent
      component={() => import('@/components/Checkout')}
      loadingText="Loading Checkout..."
    />
  );
};

export default CheckoutPage; 