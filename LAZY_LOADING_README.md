# Lazy Loading Implementation

This document describes the comprehensive lazy loading implementation for the Superior Seats application.

## Overview

The lazy loading system consists of several components and utilities designed to optimize performance by:

1. **Component Lazy Loading**: Loading page components only when needed
2. **Image Lazy Loading**: Loading images only when they come into view
3. **Performance Optimization**: Adaptive loading strategies based on connection type
4. **Error Handling**: Graceful fallbacks for failed loads

## Components

### 1. LazyComponent (`src/components/common/LazyComponent.tsx`)

A wrapper component that uses React.lazy and Suspense to lazy load page components.

**Usage:**
```tsx
import LazyComponent from '@/components/common/LazyComponent';

export default function MyPage() {
  return (
    <LazyComponent
      component={() => import('@/components/MyComponent')}
      loadingText="Loading My Component..."
      showSpinner={true}
      spinnerSize={40}
    />
  );
}
```

**Props:**
- `component`: Dynamic import function for the component
- `fallback`: Custom loading fallback (optional)
- `showSpinner`: Whether to show loading spinner (default: true)
- `spinnerSize`: Size of the loading spinner (default: 40)
- `loadingText`: Text to display while loading (default: "Loading...")

### 2. LazyImage (`src/components/common/LazyImage.tsx`)

A basic lazy loading image component with skeleton loading and error handling.

**Usage:**
```tsx
import LazyImage from '@/components/common/LazyImage';

<LazyImage
  src="/path/to/image.jpg"
  alt="Description"
  fill
  showSkeleton={true}
  skeletonHeight="100%"
  skeletonWidth="100%"
/>
```

### 3. EnhancedLazyImage (`src/components/common/EnhancedLazyImage.tsx`)

An advanced lazy loading image component with adaptive loading strategies.

**Usage:**
```tsx
import EnhancedLazyImage from '@/components/common/EnhancedLazyImage';

<EnhancedLazyImage
  src="/path/to/image.jpg"
  alt="Description"
  fill
  preloadPriority="high"
  loadingStrategy="auto"
  showSkeleton={true}
/>
```

**Additional Props:**
- `preloadPriority`: 'high' | 'medium' | 'low' (default: 'medium')
- `loadingStrategy`: 'auto' | 'aggressive' | 'conservative' (default: 'auto')

## Hooks

### useLazyLoading (`src/hooks/useLazyLoading.ts`)

A custom hook for implementing lazy loading with intersection observer.

**Usage:**
```tsx
import { useLazyLoading } from '@/hooks/useLazyLoading';

const MyComponent = () => {
  const { isLoaded, isInView, ref, handleLoad, handleError } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '100px',
    fallback: '/fallback-image.jpg'
  });

  return (
    <div ref={ref}>
      {isInView && <img src="/image.jpg" onLoad={handleLoad} onError={handleError} />}
    </div>
  );
};
```

## Utilities

### Lazy Loading Utilities (`src/utils/lazyLoading.ts`)

Utility functions for performance optimization and monitoring.

**Available Functions:**

1. **preloadComponent**: Preload components with different priorities
2. **preloadImage**: Preload images with different priorities
3. **getLoadingStrategy**: Get optimal loading strategy based on connection type
4. **createLazyLoadingMonitor**: Monitor lazy loading performance
5. **debounce**: Debounce function for performance optimization
6. **throttle**: Throttle function for performance optimization

**Usage:**
```tsx
import { 
  preloadComponent, 
  preloadImage, 
  getLoadingStrategy,
  createLazyLoadingMonitor 
} from '@/utils/lazyLoading';

// Preload a component
preloadComponent(() => import('@/components/HeavyComponent'), 'high');

// Preload an image
preloadImage('/path/to/image.jpg', 'medium');

// Get loading strategy
const strategy = getLoadingStrategy();

// Monitor performance
const monitor = createLazyLoadingMonitor();
monitor.recordComponentLoad(150); // 150ms load time
```

## Implementation Status

### ✅ Completed

1. **All Page Components**: Updated to use lazy loading
   - Home page (`src/app/page.tsx`)
   - Gallery page (`src/app/gallery/page.tsx`)
   - About page (`src/app/about/page.tsx`)
   - Contact page (`src/app/contact/page.tsx`)
   - Shop page (`src/app/shop/page.tsx`)
   - Custom seats page (`src/app/custom-seats/page.tsx`)
   - Customize your seat page (`src/app/customize-your-seat/page.tsx`)
   - Checkout page (`src/app/checkout/page.tsx`)
   - Specials page (`src/app/specials/page.tsx`)
   - Shop gallery page (`src/app/ShopGallery/page.tsx`)

2. **Gallery Component**: Updated to use LazyImage for all images
   - Slider images
   - Gallery grid images
   - Modal images

3. **Core Infrastructure**:
   - LazyComponent wrapper
   - LazyImage component
   - EnhancedLazyImage component
   - useLazyLoading hook
   - Performance utilities

### 🔄 Next Steps

1. **Update Other Components**: Apply LazyImage to other components with images
2. **Performance Monitoring**: Implement monitoring in production
3. **Testing**: Test on different connection types and devices
4. **Optimization**: Fine-tune loading strategies based on real-world usage

## Performance Benefits

1. **Faster Initial Load**: Only essential components load immediately
2. **Reduced Bandwidth**: Images load only when needed
3. **Better User Experience**: Smooth loading with skeleton placeholders
4. **Adaptive Loading**: Optimizes based on user's connection type
5. **Error Resilience**: Graceful handling of failed loads

## Best Practices

1. **Use LazyComponent for Page Components**: All page components should use LazyComponent
2. **Use LazyImage for Images**: Replace all Image components with LazyImage
3. **Set Appropriate Priorities**: Use 'high' priority for above-the-fold content
4. **Monitor Performance**: Use the monitoring utilities to track performance
5. **Test on Different Connections**: Ensure good performance on slow connections

## Configuration

The lazy loading system automatically adapts to the user's connection type:

- **Fast connections (4G+)**: Aggressive loading with small thresholds
- **Medium connections (3G)**: Balanced loading with medium thresholds
- **Slow connections (2G)**: Conservative loading with large thresholds

You can override this behavior by setting the `loadingStrategy` prop on EnhancedLazyImage components.
