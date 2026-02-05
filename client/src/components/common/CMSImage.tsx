import OptimizedImage, { OptimizedImageProps } from './OptimizedImage';
import { getApiBaseUrl } from '../../config/env';

interface CMSImageProps extends Omit<OptimizedImageProps, 'src'> {
  imageData: any; // CMS image data (can be string, object, or number)
  getImagePath?: (imageData: any) => string; // Optional custom getImagePath function
  fallback?: string; // Fallback image URL
}

/**
 * CMS Image Component
 * Wrapper around OptimizedImage that handles CMS image data resolution
 * Automatically extracts image paths from various CMS data structures
 */
export default function CMSImage({
  imageData,
  getImagePath: customGetImagePath,
  fallback,
  ...optimizedImageProps
}: CMSImageProps) {
  // Helper to resolve image path from CMS data
  const resolveImagePath = (data: any): string => {
    if (!data || data === null || data === undefined) return fallback || '';

    // Use custom getImagePath if provided
    if (customGetImagePath) {
      const path = customGetImagePath(data);
      if (path) return path;
    }

    // Handle number (media ID)
    if (typeof data === 'number' && data > 0) {
      const apiBase = getApiBaseUrl();
      return `${apiBase}/uploads/media/${data}`;
    }

    // Handle string paths
    if (typeof data === 'string' && data.trim()) {
      // Filter out old /assets/ paths
      if (data.startsWith('/assets/')) {
        return fallback || '';
      }
      // Handle /uploads/ paths
      if (data.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${data}`;
      }
      // If it's already a full URL, return as-is
      if (data.startsWith('http://') || data.startsWith('https://')) {
        return data;
      }
      return data;
    }

    // Handle objects with path/image properties (Media objects from Sequelize)
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Handle Sequelize dataValues wrapper - recursive unwrap
      const unwrapSequelize = (obj: any, depth: number = 0): any => {
        if (depth > 3) return obj; // Prevent infinite recursion
        if (obj && typeof obj === 'object' && obj.dataValues) {
          return unwrapSequelize(obj.dataValues, depth + 1);
        }
        return obj;
      };
      
      let unwrapped = unwrapSequelize(data);
      
      // Also try direct access to dataValues
      if (data.dataValues) {
        unwrapped = unwrapSequelize(data.dataValues);
      }
      
      // Try common CMS image object properties in order of likelihood
      const tryPath = (path: string): string | null => {
        if (!path || typeof path !== 'string') return null;
        
        // Filter out old /assets/ paths
        if (path.startsWith('/assets/')) {
          return null;
        }
        
        // Handle /uploads/ paths
        if (path.startsWith('/uploads/')) {
          const apiBase = getApiBaseUrl();
          return `${apiBase}${path}`;
        }
        
        // If it's already a full URL, return as-is
        if (path.startsWith('http://') || path.startsWith('https://')) {
          return path;
        }
        
        return path;
      };
      
      // Try filePath first (most common)
      if (unwrapped.filePath) {
        const resolved = tryPath(unwrapped.filePath);
        if (resolved) return resolved;
      }
      
      // Try dataValues.filePath
      if (data.dataValues?.filePath) {
        const resolved = tryPath(data.dataValues.filePath);
        if (resolved) return resolved;
      }
      
      // Try url
      if (unwrapped.url) {
        const resolved = tryPath(unwrapped.url);
        if (resolved) return resolved;
      }
      
      // Try path
      if (unwrapped.path) {
        const resolved = tryPath(unwrapped.path);
        if (resolved) return resolved;
      }
      
      // Try image property
      if (unwrapped.image && typeof unwrapped.image === 'string') {
        const resolved = tryPath(unwrapped.image);
        if (resolved) return resolved;
      }
      
      // Try dataValues properties directly
      if (data.dataValues) {
        if (data.dataValues.url) {
          const resolved = tryPath(data.dataValues.url);
          if (resolved) return resolved;
        }
        if (data.dataValues.path) {
          const resolved = tryPath(data.dataValues.path);
          if (resolved) return resolved;
        }
      }
    }

    return fallback || '';
  };

  const imageSrc = resolveImagePath(imageData);

  // Debug logging in development
  if (process.env.NODE_ENV === 'development' && !imageSrc && imageData) {
    console.warn('CMSImage: Could not resolve image path', {
      imageData,
      imageDataType: typeof imageData,
      hasFilePath: !!(imageData as any)?.filePath,
      hasUrl: !!(imageData as any)?.url,
      hasDataValues: !!(imageData as any)?.dataValues
    });
  }

  if (!imageSrc) {
    // Return placeholder if no image source
    return (
      <div
        className={`relative overflow-hidden bg-gray-200 animate-pulse ${optimizedImageProps.className || ''}`}
        style={{
          width: optimizedImageProps.width,
          height: optimizedImageProps.height,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={imageSrc}
      {...optimizedImageProps}
    />
  );
}

