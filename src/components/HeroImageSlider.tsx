'use client';

import React from 'react';
import Image from 'next/image';
import { Box, IconButton } from '@mui/material';
import { motion } from 'framer-motion';

type SlideDirection = 'left' | 'right';

export type HeroImageSliderProps = {
  images: string[];
  autoPlay?: boolean;
  intervalMs?: number;
  onChange?: (index: number) => void;
  /** Optional sx to override the outer container (position should generally be relative/absolute with full-bleed). */
  containerSx?: any;
  /** Image fit, defaults to 'cover' */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

/**
 * Reusable background image slider with autoplay and swipe/drag gestures.
 *
 * Example usage:
 *
 *  <HeroImageSlider
 *    images={[ '/Gallery/HeroHd/01.jpg', '/Gallery/HeroHd/02.jpg' ]}
 *    autoPlay
 *    intervalMs={4000}
 *  />
 */
const HeroImageSlider: React.FC<HeroImageSliderProps> = ({
  images,
  autoPlay = true,
  intervalMs = 4000,
  onChange,
  containerSx,
  objectFit = 'cover',
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [animationKey, setAnimationKey] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(autoPlay);
  const [slideDirection, setSlideDirection] = React.useState<SlideDirection>('left');

  // Touch state
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Mouse drag state
  const [mouseStart, setMouseStart] = React.useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const minSwipeDistance = 50;

  React.useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
      setAnimationKey(prev => prev + 1);
      setSlideDirection('left');
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, intervalMs]);

  const goToIndex = (index: number, direction: SlideDirection = 'left') => {
    if (index === currentIndex) return;
    setSlideDirection(direction);
    setCurrentIndex(index);
    setAnimationKey(prev => prev + 1);
    if (onChange) onChange(index);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToIndex((currentIndex + 1) % images.length, 'left');
    } else if (isRightSwipe) {
      goToIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1, 'right');
    }
    setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
  };

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsAutoPlaying(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMouseEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!mouseStart || !mouseEnd) {
      setIsDragging(false);
      return;
    }
    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToIndex((currentIndex + 1) % images.length, 'left');
    } else if (isRightSwipe) {
      goToIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1, 'right');
    }
    setIsDragging(false);
    setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
        touchAction: 'none',
        '@keyframes slideFromRight': {
          '0%': { transform: 'translateX(100%)', opacity: 0.8 },
          '100%': { transform: 'translateX(0%)', opacity: 1 },
        },
        '@keyframes slideFromLeft': {
          '0%': { transform: 'translateX(-100%)', opacity: 0.8 },
          '100%': { transform: 'translateX(0%)', opacity: 1 },
        },
        ...containerSx,
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => {
        if (isDragging) {
          setIsDragging(false);
          setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
        }
      }}
    >
      {/* Active slide image */}
      <Box key={animationKey} sx={{ position: 'absolute', inset: 0 }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            animation: `${slideDirection === 'left' ? 'slideFromRight' : 'slideFromLeft'} 0.6s ease-out`,
          }}
        >
          <Image src={images[currentIndex]} alt="Hero background" fill style={{ objectFit }} priority />
        </Box>
      </Box>

      {/* Subtle gradient overlay */}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)' }} />

      {/* Dots (simple indicators) */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 10, sm: 12, md: 16 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 3,
          }}
        >
          {images.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => goToIndex(idx, idx > currentIndex ? 'left' : 'right')}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: idx === currentIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HeroImageSlider;


