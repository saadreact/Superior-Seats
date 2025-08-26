'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

const CustomSeatsPage = () => {
  return (
    <LazyComponent
      component={() => import('@/components/CustomizedSeat')}
      loadingText="Loading Custom Seats..."
    />
  );
};

export default CustomSeatsPage; 