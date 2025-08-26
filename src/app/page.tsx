'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function Page() {
  return (
    <LazyComponent
      component={() => import('./HomePage')}
      loadingText="Loading Home Page..."
    />
  );
} 