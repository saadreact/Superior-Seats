'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  showSpinner?: boolean;
  spinnerSize?: number;
  loadingText?: string;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  fallback,
  showSpinner = true,
  spinnerSize = 40,
  loadingText = 'Loading...',
}) => {
  const LazyLoadedComponent = lazy(component);

  const defaultFallback = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
      }}
    >
      {showSpinner && (
        <CircularProgress
          size={spinnerSize}
          sx={{
            color: 'primary.main',
          }}
        />
      )}
      {loadingText && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 500,
          }}
        >
          {loadingText}
        </Typography>
      )}
    </Box>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyLoadedComponent />
    </Suspense>
  );
};

export default LazyComponent;
