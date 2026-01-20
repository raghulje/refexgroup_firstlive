# Gallery 2023 - Event Structure

This folder contains all images for Gallery 2023, organized by event/category.

## Events (in order as displayed)

1. **All** - Shows all images from all events
2. **Tree Plantation** - Folder: `tree-plantation/`
3. **21st Company Anniversary** - Folder: `anniversary/`
4. **ACREX** - Folder: `acrex/`
5. **Blood Donation Camp 2023** - Folder: `blood-donation-camp-2023/`
6. **IOSH Managing Safely Training** - Folder: `iosh-managing-safely-training/`
7. **Refex eVeelz** - Folder: `refex-eveelz/`
8. **World Environment Day 2023** - Folder: `world-environment-day-2023/`
9. **Women's Day** - Folder: `womens-day/`
10. **National Road Safety Week** - Folder: `national-road-safety-week/`
11. **Solar Trade Show** - Folder: `solar-trade-show/`
12. **Eye Camp** - Folder: `eye-camp/`
13. **Freshworks Marathon** - Folder: `freshworks-marathon/`
14. **Sports Events** - Folder: `sports-events/`

## Folder Structure

```
public/assets/gallery/2023/
├── tree-plantation/              # Tree Plantation images
├── anniversary/                  # 21st Company Anniversary images
├── acrex/                        # ACREX event images
├── blood-donation-camp-2023/     # Blood Donation Camp 2023 images
├── iosh-managing-safely-training/ # IOSH Managing Safely Training images
├── refex-eveelz/                 # Refex eVeelz images
├── world-environment-day-2023/    # World Environment Day 2023 images
├── womens-day/                   # Women's Day images
├── national-road-safety-week/   # National Road Safety Week images
├── solar-trade-show/             # Solar Trade Show images
├── eye-camp/                     # Eye Camp images
├── freshworks-marathon/          # Freshworks Marathon images
└── sports-events/                # Sports Events images
```

## How to Add Images

1. **Upload images** to the appropriate event folder
   - Example: For Tree Plantation photos, upload to `tree-plantation/` folder
   
2. **Update configuration** in `src/data/gallery/config.ts`:
   ```typescript
   'tree-plantation': ['image1.jpg', 'image2.jpg', 'image3.jpg']
   ```

3. **Images will appear** automatically in the gallery when you:
   - Select "All" to see all images
   - Select the specific event category to filter

## Image Naming

- Use lowercase filenames with hyphens
- Examples: `tree-plantation-1.jpg`, `anniversary-photo-2023.jpg`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## Current Status

All event folders are created and ready for image uploads. Once you add images to the folders and update the configuration file, they will appear in the gallery.

