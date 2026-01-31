import { getApiBaseUrl } from '../config/env';

/**
 * Image Optimization Utilities
 * Provides functions for generating optimized image URLs and responsive srcsets
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Generate optimized image URL with query parameters
 * This can be used with image optimization services or CDN
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  const {
    width,
    height,
    quality = 85,
    format = 'auto',
    fit = 'cover',
  } = options;

  // If it's already a full URL, check if it needs optimization
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // If it's from our API, add optimization params
    if (imageUrl.includes('/uploads/') || imageUrl.includes('/api/')) {
      const url = new URL(imageUrl);
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      url.searchParams.set('q', quality.toString());
      if (format !== 'auto') url.searchParams.set('f', format);
      url.searchParams.set('fit', fit);
      return url.toString();
    }
    // External URLs - return as-is (could integrate with image CDN here)
    return imageUrl;
  }

  // Relative paths - convert to full URL and add optimization
  const apiBase = getApiBaseUrl();
  const fullUrl = imageUrl.startsWith('/') 
    ? `${apiBase}${imageUrl}`
    : `${apiBase}/${imageUrl}`;

  const url = new URL(fullUrl);
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  url.searchParams.set('q', quality.toString());
  if (format !== 'auto') url.searchParams.set('f', format);
  url.searchParams.set('fit', fit);

  return url.toString();
}

/**
 * Generate responsive srcset for an image
 */
export function generateSrcSet(
  imageUrl: string,
  baseWidth: number,
  options: Omit<ImageOptimizationOptions, 'width'> = {}
): string {
  const breakpoints = [640, 768, 1024, 1280, 1536, 1920]; // Common breakpoints
  const srcSets: string[] = [];

  // Add original size
  srcSets.push(
    `${getOptimizedImageUrl(imageUrl, { ...options, width: baseWidth })} ${baseWidth}w`
  );

  // Generate smaller sizes
  breakpoints.forEach((bp) => {
    if (bp < baseWidth) {
      srcSets.push(
        `${getOptimizedImageUrl(imageUrl, { ...options, width: bp })} ${bp}w`
      );
    }
  });

  return srcSets.join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(
  defaultSize: string = '100vw',
  breakpoints?: { [key: string]: string }
): string {
  if (!breakpoints) {
    return defaultSize;
  }

  const sizes: string[] = [];
  const sortedBreakpoints = Object.keys(breakpoints)
    .map(Number)
    .sort((a, b) => a - b);

  sortedBreakpoints.forEach((bp) => {
    sizes.push(`(max-width: ${bp}px) ${breakpoints[bp.toString()]}`);
  });

  sizes.push(defaultSize); // Default size
  return sizes.join(', ');
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, options?: { as?: string; fetchPriority?: 'high' | 'low' | 'auto' }): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = options?.as || 'image';
  link.href = src;
  if (options?.fetchPriority) {
    link.setAttribute('fetchpriority', options.fetchPriority);
  }

  // Check if already preloaded
  const existing = document.querySelector(`link[rel="preload"][href="${src}"]`);
  if (!existing) {
    document.head.appendChild(link);
  }
}

/**
 * Preload multiple images
 */
export function preloadImages(
  images: Array<{ src: string; as?: string; fetchPriority?: 'high' | 'low' | 'auto' }>
): void {
  images.forEach((img) => {
    preloadImage(img.src, { as: img.as, fetchPriority: img.fetchPriority });
  });
}

/**
 * Generate blur placeholder data URL
 * This is a simple base64 encoded tiny image
 * In production, you might want to generate actual blur placeholders
 */
export function generateBlurPlaceholder(width: number = 20, height: number = 20): string {
  // This is a minimal SVG placeholder
  // In production, consider using a service like blurha.sh or generating actual blur data
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Check if image is above the fold (critical)
 * Simple heuristic - can be enhanced
 */
export function isAboveTheFold(element: HTMLElement | null): boolean {
  if (!element || typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // Consider above the fold if within first 1.5 viewport heights
  return rect.top < viewportHeight * 1.5;
}

