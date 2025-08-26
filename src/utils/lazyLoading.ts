// Lazy Loading Utilities

/**
 * Preload a component for better performance
 * @param componentImport - The dynamic import function
 * @param priority - Loading priority ('high' | 'medium' | 'low')
 */
export const preloadComponent = (
  componentImport: () => Promise<any>,
  priority: 'high' | 'medium' | 'low' = 'medium'
) => {
  if (priority === 'high') {
    // Immediate preload for high priority components
    componentImport();
  } else if (priority === 'medium') {
    // Preload after a short delay for medium priority
    setTimeout(() => {
      componentImport();
    }, 100);
  } else {
    // Preload when browser is idle for low priority
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        componentImport();
      });
    } else {
      setTimeout(() => {
        componentImport();
      }, 1000);
    }
  }
};

/**
 * Preload an image for better performance
 * @param src - Image source URL
 * @param priority - Loading priority
 */
export const preloadImage = (src: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
  const img = new Image();
  
  if (priority === 'high') {
    img.src = src;
  } else if (priority === 'medium') {
    setTimeout(() => {
      img.src = src;
    }, 100);
  } else {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        img.src = src;
      });
    } else {
      setTimeout(() => {
        img.src = src;
      }, 1000);
    }
  }
};

/**
 * Get optimal loading strategy based on connection type
 */
export const getLoadingStrategy = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return {
        threshold: 0.5,
        rootMargin: '200px',
        preloadPriority: 'low' as const,
      };
    } else if (connection.effectiveType === '3g') {
      return {
        threshold: 0.3,
        rootMargin: '150px',
        preloadPriority: 'medium' as const,
      };
    } else {
      return {
        threshold: 0.1,
        rootMargin: '100px',
        preloadPriority: 'high' as const,
      };
    }
  }
  
  // Default strategy for browsers without connection API
  return {
    threshold: 0.1,
    rootMargin: '100px',
    preloadPriority: 'medium' as const,
  };
};

/**
 * Monitor lazy loading performance
 */
export const createLazyLoadingMonitor = () => {
  const metrics = {
    componentsLoaded: 0,
    imagesLoaded: 0,
    totalLoadTime: 0,
    errors: 0,
  };

  return {
    recordComponentLoad: (loadTime: number) => {
      metrics.componentsLoaded++;
      metrics.totalLoadTime += loadTime;
    },
    recordImageLoad: (loadTime: number) => {
      metrics.imagesLoaded++;
      metrics.totalLoadTime += loadTime;
    },
    recordError: () => {
      metrics.errors++;
    },
    getMetrics: () => ({ ...metrics }),
    getAverageLoadTime: () => {
      const total = metrics.componentsLoaded + metrics.imagesLoaded;
      return total > 0 ? metrics.totalLoadTime / total : 0;
    },
  };
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
