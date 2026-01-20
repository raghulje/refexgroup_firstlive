/**
 * Gallery Configuration
 * 
 * NOTE: This file is kept for reference structure only.
 * All gallery images should now be managed through the CMS.
 * 
 * Gallery images are stored in the database via:
 * - GalleryAlbums (year albums)
 * - GalleryEvents (events within years)
 * - GalleryImages (individual images linked to events)
 * 
 * Images uploaded through CMS will be stored in:
 * /uploads/images/gallery/[year]/[event]/
 * 
 * The dynamic gallery year page (year-dynamic/page.tsx) fetches
 * all gallery data from the CMS API.
 */

import type { GalleryYearConfig } from '../../components/gallery/GalleryYearPage';
import { generateImagePaths, createGalleryImages } from '../../utils/galleryLoader';

/**
 * Helper function to create gallery config for a year
 * NOTE: This is kept for backward compatibility but should not be used
 * for new galleries. Use CMS instead.
 */
const createGalleryConfig = (
  year: string,
  heroImage: string,
  categories: Array<{ id: string; label: string }>,
  eventImages: Record<string, string[]> // eventId -> array of image filenames
): GalleryYearConfig => {
  const images: GalleryYearConfig['images'] = [];
  let imageId = 1;

  // Generate images for each event
  Object.entries(eventImages).forEach(([eventId, imageNames]) => {
    const paths = generateImagePaths(year, eventId, imageNames);
    const eventImages = createGalleryImages(paths, eventId, imageId);
    images.push(...eventImages);
    imageId += eventImages.length;
  });

  return {
    year,
    heroImage,
    categories: [
      { id: 'all', label: 'All' },
      ...categories,
    ],
    images,
  };
};

// Gallery configurations - kept empty as images come from CMS
// These are placeholders for reference only

export const gallery2022Config: GalleryYearConfig = createGalleryConfig(
  '2022',
  '', // Hero image should be set via CMS
  [
    { id: 'anniversary', label: '20th Company Anniversary' },
    { id: 'awards', label: 'Awards' },
    { id: 'esop', label: 'ESOP' },
    { id: 'blood-donation', label: 'Blood Donation' },
    { id: 'we-love-to-give', label: 'We Love to Give' },
    { id: 'festival', label: 'Festival Celebrations' },
    { id: 'birthday', label: 'Birthday Bashes' },
    { id: 'medtech', label: '3i MedTech IRIA 2022' },
  ],
  {} // Empty - images come from CMS
);

export const gallery2023Config: GalleryYearConfig = createGalleryConfig(
  '2023',
  '', // Hero image should be set via CMS
  [
    { id: 'tree-plantation', label: 'Tree Plantation' },
    { id: 'anniversary', label: '21st Company Anniversary' },
    { id: 'acrex', label: 'ACREX' },
    { id: 'blood-donation-camp-2023', label: 'Blood Donation Camp 2023' },
    { id: 'iosh-managing-safely-training', label: 'IOSH Managing Safely Training' },
    { id: 'refex-eveelz', label: 'Refex eVeelz' },
    { id: 'world-environment-day-2023', label: 'World Environment Day 2023' },
    { id: 'womens-day', label: "Women's Day" },
    { id: 'national-road-safety-week', label: 'National Road Safety Week' },
    { id: 'solar-trade-show', label: 'Solar Trade Show' },
    { id: 'eye-camp', label: 'Eye Camp' },
    { id: 'freshworks-marathon', label: 'Freshworks Marathon' },
    { id: 'sports-events', label: 'Sports Events' },
  ],
  {} // Empty - images come from CMS
);

export const gallery2024Config: GalleryYearConfig = createGalleryConfig(
  '2024',
  '', // Hero image should be set via CMS
  [
    { id: 'airport-taxi-launch-bial', label: 'Airport Taxi Launch - BIAL' },
    { id: 'hcl-cyclothon-2024', label: 'HCL Cyclothon 2024' },
    { id: 'anamaya-launch-pune', label: 'Anamaya Launch - Pune' },
    { id: 'anniversary', label: '22nd Company Anniversary Celebration' },
    { id: 'pongal-function-2024', label: 'Pongal Function 2024' },
    { id: 'tamilnadu-largest-ev-hub-opening', label: 'Tamilnadu Largest EV HUB opening' },
    { id: 'blood-donation-camp-2024', label: 'Blood donation camp 2024' },
    { id: 'park-inauguration', label: 'Park Inauguration' },
    { id: 'pond-restoration-2024', label: 'Pond Restoration 2024' },
    { id: 'rahane-at-refex', label: 'Rahane at Refex' },
    { id: 'rooftop-solar-plant-inauguration', label: 'Rooftop Solar Plant Inauguration' },
    { id: 'refex-eveelz-at-bial', label: 'Refex eVeelz at BIAL' },
    { id: 'international-womens-day-2024', label: "International Women's Day 2024" },
    { id: 'freshworks-marathon-2024', label: 'Freshworks Marathon 2024' },
    { id: 'mumbai-ultimate-league', label: 'Mumbai Ultimate League' },
    { id: 'national-road-safety-month-2024', label: 'National Road Safety Month 2024' },
  ],
  {} // Empty - images come from CMS
);

export const gallery2025Config: GalleryYearConfig = createGalleryConfig(
  '2025',
  '', // Hero image should be set via CMS
  [
    { id: 'business-integrity-ungcni', label: '1st Business Integrity Conclave and 19th National Convention by UNGCNI' },
    { id: 'ganesh-chaturti', label: 'Ganesh Chaturti' },
    { id: 'meet-greet-with-csk', label: 'Meet & Greet with CSK' },
    { id: 'blood-donation-camp', label: 'Blood Donation Camp' },
    { id: 'krav-maga-session', label: 'Krav Maga Session' },
    { id: 'mangrove-plantation-drive', label: 'Mangrove Plantation Drive' },
    { id: 'tamil-nadu-round-table', label: 'Tamil Nadu Round Table' },
    { id: 'ayutha-puja-celebration', label: 'Ayutha Puja Celebration' },
    { id: 'company-anniversary', label: 'Company Anniversary' },
    { id: 'gptw-celebration', label: 'GPTW Celebration' },
    { id: 'independence-day', label: 'Independence Day' },
    { id: 'international-womens-day', label: "International Women's Day" },
    { id: 'national-road-safety-week', label: 'National Road Safety Week' },
    { id: 'republic-day', label: 'Republic Day' },
    { id: 'vamika-oncology-session', label: 'Vamika Oncology Session' },
    { id: 'world-environment-day', label: 'World Environment Day' },
  ],
  {} // Empty - images come from CMS
);

// Gallery 2026 Configuration
export const gallery2026Config: GalleryYearConfig = createGalleryConfig(
  '2026',
  '', // Hero image should be set via CMS
  [],
  {} // Empty - images come from CMS
);

/**
 * Get gallery config by year
 * NOTE: This is kept for backward compatibility.
 * The dynamic gallery year page uses CMS API directly.
 */
export const getGalleryConfig = (year: string): GalleryYearConfig | null => {
  const configs: Record<string, GalleryYearConfig> = {
    '2022': gallery2022Config,
    '2023': gallery2023Config,
    '2024': gallery2024Config,
    '2025': gallery2025Config,
    '2026': gallery2026Config,
  };

  return configs[year] || null;
};

/**
 * Get all available gallery years
 */
export const getAvailableYears = (): string[] => {
  return ['2022', '2023', '2024', '2025', '2026'];
};
