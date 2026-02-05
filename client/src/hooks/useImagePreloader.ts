import { useEffect, useState } from 'react';
import { preloadImages, isImageCached } from '../utils/imageOptimization';

interface UseImagePreloaderOptions {
  priority?: 'high' | 'low';
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to preload images with priority handling
 */
export function useImagePreloader(
  imageSrcs: string[],
  options: UseImagePreloaderOptions = {}
) {
  const { priority = 'low', onComplete, onError } = options;
  const [loadedCount, setLoadedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    if (imageSrcs.length === 0) {
      setIsComplete(true);
      return;
    }

    // Filter out already cached images
    const uncachedImages = imageSrcs.filter(src => !isImageCached(src));

    if (uncachedImages.length === 0) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Preload images with priority handling
    const loadImages = async () => {
      try {
        if (priority === 'high') {
          // Load all high-priority images immediately
          await preloadImages(uncachedImages);
          setLoadedCount(uncachedImages.length);
        } else {
          // Load low-priority images one at a time to avoid blocking
          for (let i = 0; i < uncachedImages.length; i++) {
            try {
              await preloadImages([uncachedImages[i]]);
              setLoadedCount(prev => prev + 1);
            } catch (error) {
              const err = error instanceof Error ? error : new Error(String(error));
              setErrors(prev => [...prev, err]);
              onError?.(err);
            }
            // Small delay between images to prevent overwhelming the browser
            if (i < uncachedImages.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }
        }
        setIsComplete(true);
        onComplete?.();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setErrors(prev => [...prev, err]);
        onError?.(err);
      }
    };

    loadImages();
  }, [imageSrcs.join(','), priority]);

  return {
    loadedCount,
    totalCount: imageSrcs.length,
    isComplete,
    errors,
    progress: imageSrcs.length > 0 ? loadedCount / imageSrcs.length : 1
  };
}

