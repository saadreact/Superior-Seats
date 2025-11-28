'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function CustomizeYourSeatPage() {
  return (
    <LazyComponent
      component={() => import('@/components/CustomizeYourSeat')}
      loadingText="Loading 3D Customizable Products..."
    />
  );
}
