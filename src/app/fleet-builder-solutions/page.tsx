'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function FleetBuilderSolutions() {
  return (
    <LazyComponent
      component={() => import('@/components/FleetBuilderSolutionsPage')}
      loadingText="Loading fleet & builder solutions Page..."
    />
  );
}

