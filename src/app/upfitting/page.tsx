'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function Upfitting() {
  return (
    <LazyComponent
      component={() => import('@/components/SuperiorDesignsPage')}
      loadingText="Loading Upfitting Page..."
    />
  );
}

