'use client';

import React from 'react';
import LazyComponent from '@/components/common/LazyComponent';

export default function Contact() {
  return (
    <LazyComponent
      component={() => import('@/components/ContactPage')}
      loadingText="Loading Contact Page..."
    />
  );
} 