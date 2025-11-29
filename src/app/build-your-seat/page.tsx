'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LazyComponent from '@/components/common/LazyComponent';

function BuildYourSeatContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || undefined;

  return (
    <LazyComponent
      component={() => import('@/components/CustomizedSeat')}
      loadingText="Loading 3D Seat Customizer..."
      props={{ productId }} // Pass productId from URL to CustomizedSeat
    />
  );
}

export default function BuildYourSeatPage() {
  // Wrap in Suspense because useSearchParams requires it in Next.js 13+
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuildYourSeatContent />
    </Suspense>
  );
}

