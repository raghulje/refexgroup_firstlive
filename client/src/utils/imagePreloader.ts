import { getOptimizedImageUrl } from './imageOptimization';

/**
 * Preloads critical images for faster initial page load
 * Call this in page components to preload above-the-fold images
 */
export function preloadCriticalImages(imageSrcs: string[], options?: { width?: number; quality?: number }) {
  const { width, quality = 85 } = options || {};
  
  imageSrcs.forEach(src => {
    if (!src) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getOptimizedImageUrl(src, { width, quality });
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  });
}

/**
 * Preloads images using Image objects (for better control)
 */
export function preloadImagesWithPriority(
  imageSrcs: string[],
  priority: 'high' | 'low' = 'high'
) {
  imageSrcs.forEach(src => {
    if (!src) return;
    
    const img = new Image();
    img.fetchPriority = priority;
    img.src = src;
  });
}

