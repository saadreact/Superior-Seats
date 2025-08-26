'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

const ShopPage = () => {
  return (
    <LazyComponent
      component={() => import('@/components/CustomizedSeat')}
      loadingText="Loading Shop..."
    />
  );
};

export default ShopPage; 