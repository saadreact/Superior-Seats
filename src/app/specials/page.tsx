'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function Specials() {
  return (
    <LazyComponent
      component={() => import('@/components/ShopGallery')}
      loadingText="Loading Specials..."
    />
  );
} 