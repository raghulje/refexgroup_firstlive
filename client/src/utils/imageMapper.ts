import { getApiBaseUrl } from '@/config/env';

/**
 * Image Mapper Utility
 * Maps assets to organized uploads structure
 * Use this to generate correct paths for CMS-uploaded images
 */

/**
 * Get full upload URL for an image
 * @param category - Main category (images, icons, documents)
 * @param subcategory - Subcategory (home/hero, about/leadership, etc.)
 * @param filename - Filename
 * @returns Full URL to the uploaded asset
 */
export const getUploadUrl = (
    category: string,
    subcategory: string,
    filename: string
): string => {
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}/uploads/${category}/${subcategory}/${filename}`;
};

/**
 * Organized image path helpers
 * Use these for consistent path generation across the app
 */
export const imageMapper = {
    // Home Page
    home: {
        hero: (filename: string) => getUploadUrl('images', 'home/hero', filename),
        about: (filename: string) => getUploadUrl('images', 'home/about', filename),
        business: (filename: string) => getUploadUrl('images', 'home/business', filename),
        awards: (filename: string) => getUploadUrl('images', 'home/awards', filename),
        newsroom: (filename: string) => getUploadUrl('images', 'home/newsroom', filename),
        careers: (filename: string) => getUploadUrl('images', 'home/careers', filename),
        cta: (filename: string) => getUploadUrl('images', 'home/cta', filename),
    },

    // About Page
    about: {
        hero: (filename: string) => getUploadUrl('images', 'about/hero', filename),
        leadership: (filename: string) => getUploadUrl('images', 'about/leadership', filename),
        coreValues: (filename: string) => getUploadUrl('images', 'about/core-values', filename),
        milestones: (filename: string) => getUploadUrl('images', 'about/milestones', filename),
    },

    // ESG Page
    esg: {
        hero: (filename: string) => getUploadUrl('images', 'esg/hero', filename),
        sdgCards: (filename: string) => getUploadUrl('images', 'esg/sdg-cards', filename),
        policies: (filename: string) => getUploadUrl('images', 'esg/policies', filename),
        initiatives: (filename: string) => getUploadUrl('images', 'esg/initiatives', filename),
    },

    // Business Pages
    refrigerants: {
        hero: (filename: string) => getUploadUrl('images', 'refrigerants/hero', filename),
        products: (filename: string) => getUploadUrl('images', 'refrigerants/products', filename),
    },

    renewables: {
        hero: (filename: string) => getUploadUrl('images', 'renewables/hero', filename),
        projects: (filename: string) => getUploadUrl('images', 'renewables/projects', filename),
    },

    ashCoal: {
        hero: (filename: string) => getUploadUrl('images', 'ash-coal/hero', filename),
    },

    medtech: {
        hero: (filename: string) => getUploadUrl('images', 'medtech/hero', filename),
        products: (filename: string) => getUploadUrl('images', 'medtech/products', filename),
    },

    mobility: {
        hero: (filename: string) => getUploadUrl('images', 'mobility/hero', filename),
    },

    capital: {
        hero: (filename: string) => getUploadUrl('images', 'capital/hero', filename),
    },

    airports: {
        hero: (filename: string) => getUploadUrl('images', 'airports/hero', filename),
    },

    pharma: {
        hero: (filename: string) => getUploadUrl('images', 'pharma/hero', filename),
    },

    venwind: {
        hero: (filename: string) => getUploadUrl('images', 'venwind/hero', filename),
    },

    // Other Pages
    careers: {
        hero: (filename: string) => getUploadUrl('images', 'careers/hero', filename),
        benefits: (filename: string) => getUploadUrl('images', 'careers/benefits', filename),
    },

    newsroom: {
        articles: (filename: string) => getUploadUrl('images', 'newsroom/articles', filename),
        thumbnails: (filename: string) => getUploadUrl('images', 'newsroom/thumbnails', filename),
    },

    contact: {
        hero: (filename: string) => getUploadUrl('images', 'contact/hero', filename),
    },

    diversity: {
        hero: (filename: string) => getUploadUrl('images', 'diversity/hero', filename),
        initiatives: (filename: string) => getUploadUrl('images', 'diversity/initiatives', filename),
    },

    investments: {
        hero: (filename: string) => getUploadUrl('images', 'investments/hero', filename),
        portfolio: (filename: string) => getUploadUrl('images', 'investments/portfolio', filename),
    },

    // Gallery
    gallery: {
        year: (year: string, filename: string) => getUploadUrl('images', `gallery/${year}`, filename),
        albums: (filename: string) => getUploadUrl('images', 'gallery/albums', filename),
    },

    // Header & Footer
    header: {
        logo: (filename: string) => getUploadUrl('images', 'header/logo', filename),
        megaMenu: (filename: string) => getUploadUrl('images', 'header/mega-menu', filename),
    },

    footer: {
        logo: (filename: string) => getUploadUrl('images', 'footer/logo', filename),
        socialIcons: (filename: string) => getUploadUrl('images', 'footer/social-icons', filename),
    },

    // Icons
    icons: {
        ui: (filename: string) => getUploadUrl('icons', 'ui', filename),
        social: (filename: string) => getUploadUrl('icons', 'social', filename),
        business: (filename: string) => getUploadUrl('icons', 'business', filename),
        sdg: (filename: string) => getUploadUrl('icons', 'sdg', filename),
    },

    // Documents
    documents: {
        policies: (filename: string) => getUploadUrl('documents', 'policies', filename),
        reports: (filename: string) => getUploadUrl('documents', 'reports', filename),
        brochures: (filename: string) => getUploadUrl('documents', 'brochures', filename),
        presentations: (filename: string) => getUploadUrl('documents', 'presentations', filename),
        esg: (filename: string) => getUploadUrl('documents', 'esg', filename),
        sustainability: (filename: string) => getUploadUrl('documents', 'sustainability', filename),
    },
};

/**
 * Helper to resolve image URL from CMS data
 * Handles both full paths and filenames
 */
export const resolveImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) {
        return ''; // Return empty string for null/undefined
    }

    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it starts with /uploads/, prepend base URL
    if (imagePath.startsWith('/uploads/')) {
        return `${getApiBaseUrl()}${imagePath}`;
    }

    // If it's just a filename, assume it's in uploads
    if (!imagePath.startsWith('/')) {
        return `${getApiBaseUrl()}/uploads/${imagePath}`;
    }

    // Default: prepend base URL
    return `${getApiBaseUrl()}${imagePath}`;
};

/**
 * Example usage:
 * 
 * // Using imageMapper
 * const heroImage = imageMapper.home.hero('slide-1.jpg');
 * // Returns: http://localhost:3002/uploads/images/home/hero/slide-1.jpg
 * 
 * // Using getUploadUrl
 * const customImage = getUploadUrl('images', 'custom/path', 'image.jpg');
 * // Returns: http://localhost:3002/uploads/images/custom/path/image.jpg
 * 
 * // Using resolveImageUrl (for CMS data)
 * const cmsImage = resolveImageUrl(slide.imagePath);
 * // Handles various formats automatically
 */
