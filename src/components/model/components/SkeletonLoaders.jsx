import React from 'react';
import { Box, Skeleton } from '@mui/material';

/**
 * Skeleton loader for color/image tiles
 */
export const SkeletonColorTile = ({ size = { xs: 32, sm: 30, md: 28 } }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{
          bgcolor: 'grey.200',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }
        }}
      />
    </Box>
  );
};

/**
 * Skeleton loader for pattern tiles
 */
export const SkeletonPatternTile = ({ size = { xs: 30, md: 35 } }) => {
  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{
          bgcolor: 'grey.200',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }
        }}
      />
    </Box>
  );
};

/**
 * Skeleton loader for fabric type preview image
 */
export const SkeletonFabricPreview = ({ height = { xs: 120, md: 150 } }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: height,
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{
          bgcolor: 'grey.200',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }
        }}
      />
    </Box>
  );
};

/**
 * Skeleton loader for hover preview tooltip
 */
export const SkeletonHoverPreview = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={150}
        animation="wave"
        sx={{
          mb: 1.5,
          bgcolor: 'grey.200',
          borderRadius: 1
        }}
      />
      <Skeleton
        variant="text"
        width="60%"
        height={24}
        animation="wave"
        sx={{ mb: 0.5, bgcolor: 'grey.200' }}
      />
      <Skeleton
        variant="text"
        width="40%"
        height={20}
        animation="wave"
        sx={{ bgcolor: 'grey.200' }}
      />
    </Box>
  );
};

export default {
  SkeletonColorTile,
  SkeletonPatternTile,
  SkeletonFabricPreview,
  SkeletonHoverPreview
};

