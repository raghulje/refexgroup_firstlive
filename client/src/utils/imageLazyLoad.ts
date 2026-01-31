/**
 * Global Image Lazy Loading Setup
 * Automatically adds lazy loading to images that don't have it
 */

export function setupGlobalImageLazyLoading() {
  if (typeof window === 'undefined') return;

  // Use Intersection Observer for better performance
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Only load if src is not set or is a placeholder
          if (img.dataset.src && !img.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Remove loading attribute once loaded
          img.addEventListener('load', () => {
            observer.unobserve(img);
          }, { once: true });
          
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before entering viewport
      threshold: 0.01,
    }
  );

  // Observe all images without explicit loading attribute
  const observeImages = () => {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      // Skip if already has src loaded
      if (img.src && !img.dataset.src) {
        return;
      }
      
      // Add lazy loading if not already present
      if (!img.hasAttribute('loading')) {
        // Check if image is above the fold
        const rect = img.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight * 1.5;
        
        if (isAboveFold) {
          img.loading = 'eager';
          img.setAttribute('fetchpriority', 'high');
        } else {
          img.loading = 'lazy';
        }
      }
      
      // If using data-src, observe it
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  };

  // Initial observation
  observeImages();

  // Observe new images added dynamically
  const mutationObserver = new MutationObserver(() => {
    observeImages();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    imageObserver.disconnect();
    mutationObserver.disconnect();
  };
}

/**
 * Add loading="lazy" to all images in a container
 */
export function addLazyLoadingToImages(container: HTMLElement | Document = document) {
  const images = container.querySelectorAll('img:not([loading])');
  images.forEach((img) => {
    const rect = img.getBoundingClientRect();
    const isAboveFold = rect.top < window.innerHeight * 1.5;
    
    if (!isAboveFold) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    } else {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
  });
}

