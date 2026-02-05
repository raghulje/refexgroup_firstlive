import { getApiBaseUrl } from '../config/env';

/**
 * Image Optimization Utility
 * Generates optimized image URLs with query parameters for resizing and compression
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  blur?: number; // 0-1000, for low-quality placeholder
}

/**
 * Generates an optimized image URL with query parameters
 * Supports both backend optimization and client-side URL manipulation
 */
export function getOptimizedImageUrl(
  imageSrc: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!imageSrc || imageSrc.trim() === '') {
    return '';
  }

  const {
    width,
    height,
    quality = 85,
    format = 'auto',
    fit = 'cover',
    blur
  } = options;

  // If it's already a data URL or external CDN, return as-is
  if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
    return imageSrc;
  }

  // Handle CMS uploads - add optimization parameters
  if (imageSrc.includes('/uploads/')) {
    const apiBase = getApiBaseUrl();
    let baseUrl = imageSrc;
    
    // Ensure full URL
    if (!imageSrc.startsWith('http')) {
      baseUrl = imageSrc.startsWith('/') 
        ? `${apiBase}${imageSrc}`
        : `${apiBase}/${imageSrc}`;
    }

    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== 85) params.append('q', quality.toString());
    if (format !== 'auto') params.append('f', format);
    if (fit !== 'cover') params.append('fit', fit);
    if (blur) params.append('blur', blur.toString());

    // If URL already has query params, append to existing
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${params.toString()}`;
  }

  // For external URLs, try to add optimization if supported
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
    // If it's a known image optimization service, add params
    // Otherwise, return as-is (external services handle their own optimization)
    return imageSrc;
  }

  return imageSrc;
}

/**
 * Generates a low-quality placeholder URL for progressive loading
 */
export function getLowQualityPlaceholder(imageSrc: string): string {
  return getOptimizedImageUrl(imageSrc, {
    width: 20,
    quality: 20,
    blur: 10
  });
}

/**
 * Generates responsive srcset for an image
 */
export function generateResponsiveSrcSet(
  baseSrc: string,
  baseWidth: number,
  options: Omit<ImageOptimizationOptions, 'width'> = {}
): string {
  const breakpoints = [640, 768, 1024, 1280, 1536, 1920];
  const srcSets: string[] = [];

  breakpoints.forEach(bp => {
    if (bp <= baseWidth) {
      const optimizedUrl = getOptimizedImageUrl(baseSrc, {
        ...options,
        width: bp
      });
      srcSets.push(`${optimizedUrl} ${bp}w`);
    }
  });

  // Always include the base width
  const baseOptimized = getOptimizedImageUrl(baseSrc, {
    ...options,
    width: baseWidth
  });
  srcSets.push(`${baseOptimized} ${baseWidth}w`);

  return srcSets.join(', ');
}

/**
 * Preloads an image in the browser
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

/**
 * Preloads multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(src => preloadImage(src)));
}

/**
 * Checks if an image is already loaded/cached
 */
export function isImageCached(src: string): boolean {
  const img = new Image();
  img.src = src;
  return img.complete || img.naturalWidth > 0;
}
