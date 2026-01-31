/**
 * Image Prefetching Utility
 * Prefetches images for faster page loads
 */

interface PrefetchOptions {
  priority?: 'high' | 'low' | 'auto';
  as?: 'image';
}

/**
 * Prefetch a single image
 */
export function prefetchImage(src: string, options: PrefetchOptions = {}): void {
  if (typeof window === 'undefined') return;

  // Check if already prefetched
  const existing = document.querySelector(`link[rel="prefetch"][href="${src}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = options.as || 'image';
  link.href = src;
  
  if (options.priority) {
    link.setAttribute('fetchpriority', options.priority);
  }

  document.head.appendChild(link);
}

/**
 * Prefetch multiple images
 */
export function prefetchImages(
  images: string[],
  options: PrefetchOptions = {}
): void {
  images.forEach(src => {
    if (src) {
      prefetchImage(src, options);
    }
  });
}

/**
 * Prefetch images from a page (extracts image URLs from page data)
 */
export function prefetchPageImages(pageData: any): void {
  if (!pageData) return;

  const imageUrls: string[] = [];

  // Extract images from various data structures
  const extractImages = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach(item => extractImages(item));
      return;
    }

    // Check common image properties
    const imageProps = ['image', 'imageUrl', 'imagePath', 'filePath', 'url', 'src', 'backgroundImage', 'logo', 'icon'];
    
    imageProps.forEach(prop => {
      if (obj[prop]) {
        if (typeof obj[prop] === 'string' && obj[prop].startsWith('http')) {
          imageUrls.push(obj[prop]);
        } else if (typeof obj[prop] === 'object' && obj[prop].filePath) {
          if (obj[prop].filePath.startsWith('http')) {
            imageUrls.push(obj[prop].filePath);
          }
        }
      }
    });

    // Recursively check nested objects
    Object.values(obj).forEach(value => {
      if (value && typeof value === 'object') {
        extractImages(value);
      }
    });
  };

  extractImages(pageData);

  // Prefetch unique images
  const uniqueImages = [...new Set(imageUrls)];
  prefetchImages(uniqueImages.slice(0, 10), { priority: 'low' }); // Limit to 10 images
}

/**
 * Prefetch images on link hover (for faster navigation)
 */
export function setupLinkHoverPrefetch(): void {
  if (typeof window === 'undefined') return;

  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      // Extract likely image URLs from the link's data attributes or href
      // This is a simple implementation - can be enhanced
      const href = link.getAttribute('href');
      if (href) {
        // You can add logic here to prefetch images for specific routes
        // For now, we'll rely on the page data prefetch
      }
    }, { once: true });
  });
}

