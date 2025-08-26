'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import { getLoadingStrategy, preloadImage } from '@/utils/lazyLoading';

interface EnhancedLazyImageProps {
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
  preloadPriority?: 'high' | 'medium' | 'low';
  loadingStrategy?: 'auto' | 'aggressive' | 'conservative';
}

const EnhancedLazyImage: React.FC<EnhancedLazyImageProps> = ({
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
  preloadPriority = 'medium',
  loadingStrategy = 'auto',
}) => {
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get loading strategy based on connection type
  const strategy = loadingStrategy === 'auto' 
    ? getLoadingStrategy() 
    : loadingStrategy === 'aggressive'
    ? { threshold: 0.1, rootMargin: '50px', preloadPriority: 'high' as const }
    : { threshold: 0.5, rootMargin: '200px', preloadPriority: 'low' as const };

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [fallbackSrc, currentSrc, onError]);

  // Preload image when component mounts
  useEffect(() => {
    if (priority || preloadPriority === 'high') {
      preloadImage(src, preloadPriority);
    }
  }, [src, priority, preloadPriority]);

  // Setup intersection observer
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.unobserve(element);
          
          // Preload image when it comes into view
          if (!priority && preloadPriority !== 'high') {
            preloadImage(src, preloadPriority);
          }
        }
      },
      {
        threshold: strategy.threshold,
        rootMargin: strategy.rootMargin,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [strategy.threshold, strategy.rootMargin, src, priority, preloadPriority]);

  // Reset src when prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <Box
        ref={ref}
        sx={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.text.secondary,
          borderRadius: 1,
          border: `1px solid ${theme.palette.grey[300]}`,
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
      ref={ref}
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
            backgroundColor: theme.palette.grey[200],
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
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </Box>
  );
};

export default EnhancedLazyImage;
