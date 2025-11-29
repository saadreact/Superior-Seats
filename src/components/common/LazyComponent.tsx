'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import BrandedLoader from './BrandedLoader';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  showSpinner?: boolean;
  spinnerSize?: number;
  loadingText?: string;
  props?: Record<string, any>; // Props to pass to the lazy-loaded component
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  fallback,
  showSpinner = true,
  spinnerSize = 40,
  loadingText = 'Loading...',
  props = {},
}) => {
  const LazyLoadedComponent = lazy(component);

  const defaultFallback = (
    <BrandedLoader text={loadingText} />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  );
};

export default LazyComponent;
