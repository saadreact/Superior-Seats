'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function CustomizeYourSeatPage() {
  return (
    <LazyComponent
      component={() => import('@/components/CustomizedSeat')}
      loadingText="Loading Customize Your Seat..."
    />
  );
} 