/**
 * Fallback Images Utility
 * Provides local fallback images instead of external placeholder services
 */

// 1x1 transparent pixel as data URL
export const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Simple colored placeholder as data URL (gray background with text)
export const createPlaceholder = (width: number, height: number, text: string = 'No Image'): string => {
    // Create SVG placeholder as data URI to avoid external requests
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Pre-generated placeholder URLs for common sizes
export const PLACEHOLDER_IMAGES = {
    '300x200': createPlaceholder(300, 200, 'No Image'),
    '400x300': createPlaceholder(400, 300, 'No Image'),
    '400x500': createPlaceholder(400, 500, 'No Image'),
    '800x300': createPlaceholder(800, 300, 'No Image'),
    '800x400': createPlaceholder(800, 400, 'No Image'),
    '800x450': createPlaceholder(800, 450, 'No Image'),
    '200x80': createPlaceholder(200, 80, 'No Logo'),
    '112x112': createPlaceholder(112, 112, 'SDG'),
    default: createPlaceholder(300, 200, 'No Image')
};

// Pre-generated placeholder URLs for common sizes
export const PLACEHOLDER_IMAGES = {
    '300x200': createPlaceholder(300, 200, 'No Image'),
    '400x300': createPlaceholder(400, 300, 'No Image'),
    '400x500': createPlaceholder(400, 500, 'No Image'),
    '800x300': createPlaceholder(800, 300, 'No Image'),
    '800x400': createPlaceholder(800, 400, 'No Image'),
    '800x450': createPlaceholder(800, 450, 'No Image'),
    '200x80': createPlaceholder(200, 80, 'No Logo'),
    '112x112': createPlaceholder(112, 112, 'SDG'),
    default: createPlaceholder(300, 200, 'No Image')
};

// Fallback images by type
export const FALLBACK_IMAGES = {
    default: TRANSPARENT_PIXEL,
    sdg: TRANSPARENT_PIXEL,
    esg: TRANSPARENT_PIXEL,
    news: TRANSPARENT_PIXEL,
    gallery: TRANSPARENT_PIXEL,
    logo: TRANSPARENT_PIXEL,
    icon: TRANSPARENT_PIXEL,
};

// Helper to get fallback image
export const getFallbackImage = (type: keyof typeof FALLBACK_IMAGES = 'default'): string => {
    return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
};
