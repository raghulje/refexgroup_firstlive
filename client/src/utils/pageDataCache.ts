/**
 * Page Data Cache Utility
 * Persists page data in sessionStorage for faster navigation
 * Data persists during browser session
 */

const CACHE_PREFIX = 'page_data_';
const CACHE_VERSION = '1.0';
const MAX_CACHE_AGE = 10 * 60 * 1000; // 10 minutes

interface CachedPageData {
  data: any;
  timestamp: number;
  version: string;
}

/**
 * Get cached page data
 */
export function getCachedPageData<T>(pageKey: string): T | null {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return null;
  }

  try {
    const cached = sessionStorage.getItem(`${CACHE_PREFIX}${pageKey}`);
    if (!cached) return null;

    const parsed: CachedPageData = JSON.parse(cached);
    
    // Check version
    if (parsed.version !== CACHE_VERSION) {
      sessionStorage.removeItem(`${CACHE_PREFIX}${pageKey}`);
      return null;
    }

    // Check age
    const age = Date.now() - parsed.timestamp;
    if (age > MAX_CACHE_AGE) {
      sessionStorage.removeItem(`${CACHE_PREFIX}${pageKey}`);
      return null;
    }

    return parsed.data as T;
  } catch (error) {
    console.error('Error reading page cache:', error);
    return null;
  }
}

/**
 * Set cached page data
 */
export function setCachedPageData<T>(pageKey: string, data: T): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  try {
    const cacheEntry: CachedPageData = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };

    sessionStorage.setItem(
      `${CACHE_PREFIX}${pageKey}`,
      JSON.stringify(cacheEntry)
    );
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('SessionStorage quota exceeded, clearing old cache');
      clearOldCache();
      // Retry once
      try {
        sessionStorage.setItem(
          `${CACHE_PREFIX}${pageKey}`,
          JSON.stringify({
            data,
            timestamp: Date.now(),
            version: CACHE_VERSION,
          })
        );
      } catch (retryError) {
        console.error('Failed to cache page data after retry:', retryError);
      }
    } else {
      console.error('Error caching page data:', error);
    }
  }
}

/**
 * Clear cached page data
 */
export function clearCachedPageData(pageKey: string): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  sessionStorage.removeItem(`${CACHE_PREFIX}${pageKey}`);
}

/**
 * Clear all cached page data
 */
export function clearAllCachedPageData(): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  const keys = Object.keys(sessionStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  });
}

/**
 * Clear old cache entries
 */
function clearOldCache(): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  const keys = Object.keys(sessionStorage);
  const now = Date.now();

  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      try {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          const parsed: CachedPageData = JSON.parse(cached);
          const age = now - parsed.timestamp;
          if (age > MAX_CACHE_AGE) {
            sessionStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Remove invalid entries
        sessionStorage.removeItem(key);
      }
    }
  });
}

/**
 * Get cache size (approximate)
 */
export function getCacheSize(): number {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return 0;
  }

  let size = 0;
  const keys = Object.keys(sessionStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      const item = sessionStorage.getItem(key);
      if (item) {
        size += item.length;
      }
    }
  });

  return size;
}

