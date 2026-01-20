/**
 * Gallery Image Loader Utility
 * 
 * This utility helps load images from the structured folder system:
 * public/assets/gallery/[year]/[event]/
 * 
 * For local development, images should be placed in:
 * public/assets/gallery/[year]/[event]/
 * 
 * Example structure:
 * public/assets/gallery/
 *   ├── 2022/
 *   │   ├── anniversary/
 *   │   │   ├── image1.jpg
 *   │   │   ├── image2.jpg
 *   │   ├── esop/
 *   │   │   ├── image1.jpg
 *   │   │   ├── image2.jpg
 *   │   └── awards/
 *   │       ├── image1.jpg
 *   ├── 2023/
 *   │   ├── anniversary/
 *   │   └── esop/
 *   └── 2024/
 *       └── ...
 */

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export interface GalleryCategory {
  id: string;
  label: string;
}

/**
 * Load images from a specific year and event folder
 * 
 * @param year - The gallery year (e.g., "2022", "2023")
 * @param eventId - The event/category ID (e.g., "anniversary", "esop")
 * @returns Array of image objects
 */
export const loadImagesFromEvent = (year: string, eventId: string): GalleryImage[] => {
  // For Vite, we use import.meta.glob to dynamically import images
  // This will be replaced with actual image loading logic
  // For now, return empty array - images will be loaded via config files
  
  // In production/CMS, this will fetch from:
  // /assets/gallery/${year}/${eventId}/
  
  return [];
};

/**
 * Load all images for a specific year
 * 
 * @param year - The gallery year
 * @param events - Array of event IDs to load images from
 * @returns Array of all images with their categories
 */
export const loadAllImagesForYear = (
  year: string,
  events: string[]
): GalleryImage[] => {
  const images: GalleryImage[] = [];
  let imageId = 1;

  events.forEach((eventId) => {
    const eventImages = loadImagesFromEvent(year, eventId);
    images.push(...eventImages.map(img => ({ ...img, id: imageId++ })));
  });

  return images;
};

/**
 * Generate image paths for a given year and event
 * This is a helper function for static imports
 * 
 * @param year - The gallery year
 * @param eventId - The event/category ID
 * @param imageNames - Array of image filenames
 * @returns Array of image paths
 */
export const generateImagePaths = (
  year: string,
  eventId: string,
  imageNames: string[]
): string[] => {
  return imageNames.map(
    (name) => `/assets/gallery/${year}/${eventId}/${name}`
  );
};

/**
 * Create gallery image objects from paths
 * 
 * @param paths - Array of image paths
 * @param category - The category/event ID
 * @param startId - Starting ID for images (default: 1)
 * @returns Array of GalleryImage objects
 */
export const createGalleryImages = (
  paths: string[],
  category: string,
  startId: number = 1
): GalleryImage[] => {
  return paths.map((path, index) => ({
    id: startId + index,
    src: path,
    alt: `${category} image ${startId + index}`,
    category,
  }));
};

