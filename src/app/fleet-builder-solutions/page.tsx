'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function FleetBuilderSolutions() {
  return (
    <LazyComponent
      component={() => import('@/components/FleetBuilderSolutionsPage')}
      loadingText="Loading Fleet & Builder Solutions Page..."
    />
  );
}

