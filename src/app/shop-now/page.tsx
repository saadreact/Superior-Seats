'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function ShopNowPage() {
  return (
    <LazyComponent
      component={() => import('@/components/ShopNow')}
      loadingText="Loading Shop Now..."
    />
  );
}
