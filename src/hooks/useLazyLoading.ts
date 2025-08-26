import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  fallback?: string;
}

interface UseLazyLoadingReturn {
  isLoaded: boolean;
  isInView: boolean;
  ref: React.RefObject<HTMLElement | null>;
  handleLoad: () => void;
  handleError: () => void;
}

export const useLazyLoading = (options: UseLazyLoadingOptions = {}): UseLazyLoadingReturn => {
  const { threshold = 0.1, rootMargin = '50px', fallback } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    if (fallback) {
      setIsLoaded(true);
    }
  }, [fallback]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin]);

  return {
    isLoaded,
    isInView,
    ref,
    handleLoad,
    handleError,
  };
};
