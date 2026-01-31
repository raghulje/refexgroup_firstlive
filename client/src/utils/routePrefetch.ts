/**
 * Route Prefetching Utility
 * Prefetches data and images for likely next pages
 */

import { prefetchPageImages } from './imagePrefetch';
import { pagesService, sectionsService } from '../services/apiService';

/**
 * Prefetch data for a route
 */
export async function prefetchRoute(route: string): Promise<void> {
  try {
    // Map routes to page slugs
    const routeToSlug: { [key: string]: string } = {
      '/': 'home',
      '/about-refex': 'about',
      '/business': 'business',
      '/investments': 'investments',
      '/esg': 'esg',
      '/careers': 'careers',
      '/contact': 'contact',
      '/newsroom': 'newsroom',
      '/gallery': 'gallery',
    };

    const slug = routeToSlug[route];
    if (!slug) return;

    // Fetch page data in background
    const page = await pagesService.getBySlug(slug);
    if (page?.id) {
      const sections = await sectionsService.getByPageId(page.id);
      
      // Prefetch images from page data
      prefetchPageImages({ page, sections });
    }
  } catch (error) {
    // Silently fail - prefetching shouldn't break the app
    console.debug('Prefetch failed for route:', route, error);
  }
}

/**
 * Setup prefetching on link hover
 */
export function setupRoutePrefetch(): void {
  if (typeof window === 'undefined') return;

  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach(link => {
    let prefetchTimeout: NodeJS.Timeout | null = null;
    
    link.addEventListener('mouseenter', () => {
      // Prefetch after 100ms hover (to avoid prefetching on accidental hovers)
      prefetchTimeout = setTimeout(() => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
          prefetchRoute(href);
        }
      }, 100);
    }, { once: false });
    
    link.addEventListener('mouseleave', () => {
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
      }
    });
  });
}

