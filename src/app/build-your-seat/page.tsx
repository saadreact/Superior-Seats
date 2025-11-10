'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function BuildYourSeatPage() {
  return (
    <LazyComponent
      component={() => import('@/components/CustomizedSeat')}
      loadingText="Loading 3D Seat Customizer..."
    />
  );
}

