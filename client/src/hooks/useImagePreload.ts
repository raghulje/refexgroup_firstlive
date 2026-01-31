import { useEffect } from 'react';
import { preloadImages } from '../utils/imageOptimization';

interface PreloadImage {
  src: string;
  as?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Hook to preload critical images
 * Use this for above-the-fold images that need to load immediately
 */
export function useImagePreload(images: PreloadImage[], deps: any[] = []) {
  useEffect(() => {
    if (images.length > 0) {
      preloadImages(images);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Hook to preload images when they become visible
 * Useful for lazy loading with preloading
 */
export function useLazyImagePreload(
  imageSrc: string | null | undefined,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || !imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.fetchPriority = 'low';
  }, [imageSrc, enabled]);
}

