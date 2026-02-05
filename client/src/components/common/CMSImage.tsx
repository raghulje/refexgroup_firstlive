import OptimizedImage, { OptimizedImageProps } from './OptimizedImage';
import { getApiBaseUrl } from '../../config/env';

interface CMSImageProps extends Omit<OptimizedImageProps, 'src'> {
  imageData: any; // CMS image data (can be string, object, number, or null)
  imageId?: number | string | null; // Optional imageId if imageData is null but imageId exists
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
  imageId,
  getImagePath: customGetImagePath,
  fallback,
  ...optimizedImageProps
}: CMSImageProps) {
  // Helper to resolve image path from CMS data
  const resolveImagePath = (data: any, id?: number | string | null): string => {
    // If data is null/undefined but imageId exists, construct URL from imageId
    if ((!data || data === null || data === undefined) && id) {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (!isNaN(numericId) && numericId > 0) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}/uploads/media/${numericId}`;
      }
    }
    
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

  const imageSrc = resolveImagePath(imageData, imageId);

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
    // Return transparent placeholder if no image source - no visual placeholder
    return (
      <div
        className={`relative overflow-hidden bg-transparent ${optimizedImageProps.className || ''}`}
        style={{
          width: optimizedImageProps.width,
          height: optimizedImageProps.height,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <OptimizedImage
      src={imageSrc}
      {...optimizedImageProps}
    />
  );
}

