# Gallery Setup Guide

## Quick Start

1. **Upload Images**: Place your images in the appropriate folders:
   ```
   public/assets/gallery/[YEAR]/[EVENT]/
   ```

2. **Update Config**: Edit `src/data/gallery/config.ts` and add the image filenames to the corresponding event array.

3. **Create Page** (for new years): Follow the pattern in existing gallery pages.

## Example: Adding Images to Gallery 2022

### Step 1: Upload Images
Place images in: `public/assets/gallery/2022/anniversary/`
- `anniversary-photo-1.jpg`
- `anniversary-photo-2.jpg`
- `anniversary-photo-3.jpg`

### Step 2: Update Configuration
Edit `src/data/gallery/config.ts`:

```typescript
export const gallery2022Config: GalleryYearConfig = createGalleryConfig(
  '2022',
  'https://www.refex.group/wp-content/uploads/2023/02/Gallery-REFEX-Awards-7.jpg',
  [
    { id: 'anniversary', label: '20th Company Anniversary' },
    // ... other categories
  ],
  {
    anniversary: [
      'anniversary-photo-1.jpg',
      'anniversary-photo-2.jpg',
      'anniversary-photo-3.jpg'
    ],
    // ... other events
  }
);
```

### Step 3: Done!
The images will automatically appear in the gallery when you visit `/gallery-2022` and select the "20th Company Anniversary" category.

## Creating a New Gallery Year (e.g., 2026)

### Step 1: Create Folder Structure
```powershell
New-Item -ItemType Directory -Force -Path "public/assets/gallery/2026/event1", "public/assets/gallery/2026/event2"
```

### Step 2: Add Configuration
In `src/data/gallery/config.ts`:

```typescript
export const gallery2026Config: GalleryYearConfig = createGalleryConfig(
  '2026',
  'https://example.com/hero-image.jpg', // Hero background image
  [
    { id: 'event1', label: 'Event 1 Name' },
    { id: 'event2', label: 'Event 2 Name' },
  ],
  {
    event1: ['image1.jpg', 'image2.jpg'],
    event2: ['image1.jpg', 'image2.jpg'],
  }
);
```

### Step 3: Create Page Component
Create `src/pages/gallery-2026/page.tsx`:

```typescript
import GalleryYearPage from '../../components/gallery/GalleryYearPage';
import { gallery2026Config } from '../../data/gallery/config';

const Gallery2026 = () => {
  return <GalleryYearPage config={gallery2026Config} />;
};

export default Gallery2026;
```

### Step 4: Add Route
In `src/router/config.tsx`:

```typescript
import Gallery2026 from '../pages/gallery-2026/page';

// In routes array:
{
  path: "/gallery-2026",
  element: (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Gallery2026 />
      </Suspense>
    </MainLayout>
  ),
},
```

## Event Folder Naming Convention

Use lowercase with hyphens:
- ✅ `blood-donation`
- ✅ `we-love-to-give`
- ✅ `business-integrity`
- ❌ `Blood Donation` (spaces)
- ❌ `blood_donation` (underscores)

## Image Paths

Images are automatically served from:
```
/assets/gallery/[YEAR]/[EVENT]/[FILENAME]
```

So if you have:
- Folder: `public/assets/gallery/2022/anniversary/`
- File: `photo1.jpg`

The image URL will be: `/assets/gallery/2022/anniversary/photo1.jpg`

## Future CMS Integration

When the CMS is built:
1. Images uploaded through CMS will automatically be placed in the correct folder structure
2. Configuration will be generated automatically
3. The same folder structure will be maintained
4. You'll be able to create new galleries and events through the CMS interface

## Performance Tips

- **Image Optimization**: Compress images before uploading (use tools like TinyPNG, ImageOptim)
- **Naming**: Use descriptive but concise filenames
- **Format**: Prefer `.jpg` or `.webp` for photos, `.png` for graphics
- **Size**: Keep individual images under 2MB for web performance

## Troubleshooting

**Images not showing?**
1. Check that images are in the correct folder: `public/assets/gallery/[YEAR]/[EVENT]/`
2. Verify filenames in config match actual filenames (case-sensitive)
3. Check browser console for 404 errors
4. Ensure image paths start with `/assets/gallery/` (not `public/`)

**Category not appearing?**
1. Check that the category is added to the `categories` array in config
2. Verify the category `id` matches the folder name
3. Ensure at least one image is added to that category

