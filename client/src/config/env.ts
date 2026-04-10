/**
 * Environment Configuration
 * Centralized configuration for environment variables
 */

/**
 * Get the API base URL (without /api/v1 suffix)
 * Used for constructing full URLs to uploaded images and documents
 */
export const getApiBaseUrl = (): string => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const isDeployedHost = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);
    const isLocalApiUrl = typeof apiUrl === 'string' && (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1'));

    // If VITE_API_URL is explicitly set, validate and use it (but remove /api/v1 suffix if present)
    if (apiUrl && apiUrl.trim() !== '' && !(isDeployedHost && isLocalApiUrl)) {
        const trimmedUrl = apiUrl.trim();
        // Check if it's malformed (starts with :)
        if (trimmedUrl.startsWith(':')) {
            console.warn('Invalid VITE_API_URL format detected (starts with :). Using default.');
        } else {
        // Remove /api/v1 suffix if present
            let baseUrl = trimmedUrl.replace('/api/v1', '');
            // If it contains port 5000, replace it with 3002
            if (baseUrl.includes(':5000')) {
                console.warn('VITE_API_URL contains port 5000. Replacing with port 3002.');
                baseUrl = baseUrl.replace(':5000', ':3002');
            }
            // If it's a valid URL, return it
            if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
                return baseUrl;
            }
        }
    }

    // For production builds served from the same server, use current origin
    // This ensures /uploads/ paths point to the same server
    if (typeof window !== 'undefined') {
        // In production build (when served by same server), use current origin
        // This works for both development and production when server serves the client
        return window.location.origin;
    }

    // Fallback (shouldn't reach here in browser)
    return 'http://localhost:3002';
};

/**
 * Get the full API URL (with /api/v1 suffix)
 * Used for API requests
 */
export const getApiUrl = (): string => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const isDeployedHost = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);
    const isLocalApiUrl = typeof apiUrl === 'string' && (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1'));
    
    // If VITE_API_URL is explicitly set, validate and use it
    if (apiUrl && apiUrl.trim() !== '' && !(isDeployedHost && isLocalApiUrl)) {
        const trimmedUrl = apiUrl.trim();
        
        // Check if it starts with : (like :5000), it's malformed - ignore it
        if (trimmedUrl.startsWith(':')) {
            console.warn('Invalid VITE_API_URL format detected (starts with :). Using default.');
        } else if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
            // If it contains port 5000, replace it with 3002
            if (trimmedUrl.includes(':5000')) {
                console.warn('VITE_API_URL contains port 5000. Replacing with port 3002.');
                return trimmedUrl.replace(':5000', ':3002');
            }
            return trimmedUrl;
        } else {
            // If it doesn't start with http, assume it's a relative path or add http://localhost
            return trimmedUrl.startsWith('/') ? trimmedUrl : `http://localhost:3002${trimmedUrl.startsWith('/') ? '' : '/'}${trimmedUrl}`;
        }
    }
    
    // For production builds served from the same server, use current origin
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/api/v1`;
    }
    
    // Fallback for development
    return 'http://localhost:3002/api/v1';
};

/**
 * Resolve image path to full URL
 * Handles /uploads/ paths (from backend)
 * Filters out old /assets/ paths - they should not be displayed
 */
export const resolveImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath) return '';

    // Already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Uploaded images need backend URL
    if (imagePath.startsWith('/uploads/')) {
        return `${getApiBaseUrl()}${imagePath}`;
    }

    // Filter out old /assets/ paths - they should not be displayed
    if (imagePath.startsWith('/assets/')) {
        return '';
    }

    // Return as-is for other paths (though they should be /uploads/ paths)
    return imagePath;
};

/**
 * Environment mode
 */
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
