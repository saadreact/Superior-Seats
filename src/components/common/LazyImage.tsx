'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Skeleton, Typography } from '@mui/material';
import { useLazyLoading } from '@/hooks/useLazyLoading';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  showSkeleton?: boolean;
  skeletonHeight?: string | number;
  skeletonWidth?: string | number;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  style,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc,
  onLoad,
  onError,
  showSkeleton = true,
  skeletonHeight = '100%',
  skeletonWidth = '100%',
}) => {
  const { isLoaded, isInView, ref, handleLoad, handleError } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '100px',
    fallback: fallbackSrc,
  });

  const [currentSrc, setCurrentSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  const handleImageLoad = () => {
    handleLoad();
    onLoad?.();
  };

  const handleImageError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      handleError();
      setHasError(true);
      onError?.();
    }
  };

  // Reset src when prop changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <Box
        ref={ref as React.RefObject<HTMLDivElement>}
        sx={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: 'text.secondary',
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" align="center">
          Failed to load image
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={ref as React.RefObject<HTMLDivElement>}
      sx={{
        position: 'relative',
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        overflow: 'hidden',
      }}
    >
      {/* Skeleton Loading */}
      {showSkeleton && !isLoaded && (
        <Skeleton
          variant="rectangular"
          width={skeletonWidth}
          height={skeletonHeight}
          animation="wave"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 1,
          }}
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <Image
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          style={{
            ...style,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          className={className}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </Box>
  );
};

export default LazyImage;
