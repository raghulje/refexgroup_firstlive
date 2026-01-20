# Gallery Image Folder Structure

This folder contains all gallery images organized by year and event/category.

## Folder Structure

```
public/assets/gallery/
├── 2022/
│   ├── anniversary/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   ├── awards/
│   │   ├── image1.jpg
│   │   └── ...
│   ├── esop/
│   │   ├── image1.jpg
│   │   └── ...
│   ├── blood-donation/
│   ├── we-love-to-give/
│   ├── festival/
│   ├── birthday/
│   └── medtech/
├── 2023/
│   ├── anniversary/
│   ├── awards/
│   ├── esop/
│   └── ...
├── 2024/
│   └── ...
└── 2025/
    ├── business-integrity/
    ├── ungcni/
    └── ...
```

## How to Add Images

1. **Navigate to the year folder** (e.g., `public/assets/gallery/2022/`)
2. **Navigate to the event folder** (e.g., `anniversary/`, `esop/`, etc.)
3. **Upload your images** directly into that folder
4. **Update the configuration file** at `src/data/gallery/config.ts`:
   - Find the year's configuration (e.g., `gallery2022Config`)
   - In the `eventImages` object, add the image filenames to the corresponding event array
   - Example:
     ```typescript
     anniversary: ['image1.jpg', 'image2.jpg', 'image3.jpg']
     ```

## Event/Category Folder Names

Use these folder names (lowercase, with hyphens) for consistency:

- `anniversary` - 20th Company Anniversary
- `awards` - Awards
- `esop` - ESOP events
- `blood-donation` - Blood Donation
- `we-love-to-give` - We Love to Give
- `festival` - Festival Celebrations
- `birthday` - Birthday Bashes
- `medtech` - 3i MedTech IRIA events
- `business-integrity` - Business Integrity Conclave (2025)
- `ungcni` - UNGCNI Convention (2025)

## Creating a New Gallery Year

1. **Create the folder structure**:
   ```
   public/assets/gallery/[YEAR]/
   ├── [event1]/
   ├── [event2]/
   └── ...
   ```

2. **Add configuration** in `src/data/gallery/config.ts`:
   ```typescript
   export const gallery[YEAR]Config: GalleryYearConfig = createGalleryConfig(
     '[YEAR]',
     '[HERO_IMAGE_URL]',
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

3. **Create the page** in `src/pages/gallery-[YEAR]/page.tsx`:
   ```typescript
   import GalleryYearPage from '../../components/gallery/GalleryYearPage';
   import { gallery[YEAR]Config } from '../../data/gallery/config';

   const Gallery[YEAR] = () => {
     return <GalleryYearPage config={gallery[YEAR]Config} />;
   };

   export default Gallery[YEAR];
   ```

4. **Add the route** in `src/router/config.tsx`:
   ```typescript
   {
     path: "/gallery-[YEAR]",
     element: (
       <MainLayout>
         <Suspense fallback={<div>Loading...</div>}>
           <Gallery[YEAR] />
         </Suspense>
       </MainLayout>
     ),
   },
   ```

## Image Naming Conventions

- Use lowercase filenames with hyphens: `my-image.jpg`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- Keep filenames descriptive but concise
- Avoid spaces in filenames (use hyphens instead)

## Future CMS Integration

When the CMS is built, it will:
- Automatically read images from this folder structure
- Generate the configuration files dynamically
- Allow uploading images directly through the CMS interface
- Maintain the same folder structure for consistency

## Performance Notes

- Images are lazy-loaded for better performance
- Consider optimizing images before uploading (compression, appropriate sizes)
- For very large galleries (100,000+ images), pagination or virtual scrolling may be needed

