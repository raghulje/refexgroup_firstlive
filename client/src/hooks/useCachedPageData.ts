import { useState, useEffect, useCallback } from 'react';
import { getCachedPageData, setCachedPageData } from '../utils/pageDataCache';
import { prefetchPageImages } from '../utils/imagePrefetch';

interface UseCachedPageDataOptions {
  pageKey: string;
  fetchFunction: () => Promise<any>;
  ttl?: number; // Time to live in milliseconds (default: 10 minutes)
  prefetchImages?: boolean;
}

/**
 * Hook to fetch and cache page data
 * Returns cached data immediately if available, then updates with fresh data
 */
export function useCachedPageData<T = any>({
  pageKey,
  fetchFunction,
  ttl = 10 * 60 * 1000, // 10 minutes default
  prefetchImages: shouldPrefetchImages = true,
}: UseCachedPageDataOptions) {
  const [data, setData] = useState<T | null>(() => {
    // Try to get cached data immediately
    return getCachedPageData<T>(pageKey);
  });
  const [loading, setLoading] = useState(!data); // Not loading if we have cached data
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      
      // Cache the result
      setCachedPageData(pageKey, result);
      
      // Prefetch images if enabled
      if (shouldPrefetchImages) {
        prefetchPageImages(result);
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      console.error(`Error fetching ${pageKey}:`, err);
    } finally {
      setLoading(false);
    }
  }, [pageKey, fetchFunction, shouldPrefetchImages]);

  useEffect(() => {
    // If we have cached data, still fetch fresh data in background
    // but don't show loading state
    if (data) {
      // Fetch fresh data in background
      fetchData();
    } else {
      // No cached data, fetch immediately
      fetchData();
    }
  }, [pageKey]); // Only re-fetch if pageKey changes

  return { data, loading, error, refetch: fetchData };
}

