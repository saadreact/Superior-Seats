'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function GalleryPage() {
  return (
    <LazyComponent
      component={() => import('@/components/Gallery')}
      loadingText="Loading Gallery..."
    />
  );
} 