# Gallery 2022 - Event Structure

This folder contains all images for Gallery 2022, organized by event/category.

## Events (in order as displayed)

1. **All** - Shows all images from all events
2. **20th Company Anniversary** - Folder: `anniversary/`
3. **Awards** - Folder: `awards/`
4. **ESOP** - Folder: `esop/`
5. **Blood Donation** - Folder: `blood-donation/`
6. **We Love to Give** - Folder: `we-love-to-give/`
7. **Festival Celebrations** - Folder: `festival/`
8. **Birthday Bashes** - Folder: `birthday/`
9. **3i MedTech IRIA 2022** - Folder: `medtech/`

## Folder Structure

```
public/assets/gallery/2022/
├── anniversary/          # 20th Company Anniversary images
├── awards/              # Awards ceremony images
├── esop/                # ESOP event images
├── blood-donation/       # Blood Donation camp images
├── we-love-to-give/     # We Love to Give initiative images
├── festival/            # Festival Celebrations images
├── birthday/            # Birthday Bashes images
└── medtech/             # 3i MedTech IRIA 2022 images
```

## How to Add Images

1. **Upload images** to the appropriate event folder
   - Example: For anniversary photos, upload to `anniversary/` folder
   
2. **Update configuration** in `src/data/gallery/config.ts`:
   ```typescript
   anniversary: ['image1.jpg', 'image2.jpg', 'image3.jpg']
   ```

3. **Images will appear** automatically in the gallery when you:
   - Select "All" to see all images
   - Select the specific event category to filter

## Image Naming

- Use lowercase filenames with hyphens
- Examples: `anniversary-photo-1.jpg`, `award-ceremony-2022.jpg`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## Current Status

All event folders are created and ready for image uploads. Once you add images to the folders and update the configuration file, they will appear in the gallery.

