/**
 * Gallery Configuration Template
 * 
 * Copy this template to create a new gallery year configuration.
 * 
 * Steps:
 * 1. Copy this entire file content
 * 2. Replace [YEAR] with the actual year (e.g., "2026")
 * 3. Update the heroImage URL
 * 4. Add your categories/events
 * 5. Add image filenames for each event
 * 6. Export the config in config.ts
 */

import { GalleryYearConfig } from '../../components/gallery/GalleryYearPage';
import { createGalleryConfig } from './config';

// Template for Gallery [YEAR]
// Replace [YEAR] with actual year (e.g., 2026)
// Example: export const gallery2026Config: GalleryYearConfig = createGalleryConfig(
export const galleryYEARConfig: GalleryYearConfig = createGalleryConfig(
  'YEAR', // e.g., '2026'
  '[HERO_IMAGE_URL]', // Background image for hero section
  [
    // Add your event categories here
    // Format: { id: 'event-id', label: 'Event Display Name' }
    { id: 'event1', label: 'Event 1 Name' },
    { id: 'event2', label: 'Event 2 Name' },
    // Add more events as needed
  ],
  {
    // Add image filenames for each event
    // Images should be placed in: public/assets/gallery/[YEAR]/[event-id]/
    event1: [
      // 'image1.jpg',
      // 'image2.jpg',
      // Add more image filenames here
    ],
    event2: [
      // 'image1.jpg',
      // 'image2.jpg',
    ],
    // Add more events as needed
  }
);

/**
 * Example Usage:
 * 
 * export const gallery2026Config: GalleryYearConfig = createGalleryConfig(
 *   '2026',
 *   'https://example.com/hero-2026.jpg',
 *   [
 *     { id: 'anniversary', label: '21st Company Anniversary' },
 *     { id: 'awards', label: 'Awards 2026' },
 *   ],
 *   {
 *     anniversary: ['anniversary-1.jpg', 'anniversary-2.jpg'],
 *     awards: ['award-1.jpg', 'award-2.jpg'],
 *   }
 * );
 */

