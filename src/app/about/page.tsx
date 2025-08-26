'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function About() {
  return (
    <LazyComponent
      component={() => import('@/components/AboutPage')}
      loadingText="Loading About Page..."
    />
  );
} 