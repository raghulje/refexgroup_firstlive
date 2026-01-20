# Gallery 2024 - Event Structure

This folder contains all images for Gallery 2024, organized by event/category.

## Events (in order as displayed)

1. **All** - Shows all images from all events
2. **Airport Taxi Launch - BIAL** - Folder: `airport-taxi-launch-bial/`
3. **HCL Cyclothon 2024** - Folder: `hcl-cyclothon-2024/`
4. **Anamaya Launch - Pune** - Folder: `anamaya-launch-pune/`
5. **22nd Company Anniversary Celebration** - Folder: `anniversary/`
6. **Pongal Function 2024** - Folder: `pongal-function-2024/`
7. **Tamilnadu Largest EV HUB opening** - Folder: `tamilnadu-largest-ev-hub-opening/`
8. **Blood donation camp 2024** - Folder: `blood-donation-camp-2024/`
9. **Park Inauguration** - Folder: `park-inauguration/`
10. **Pond Restoration 2024** - Folder: `pond-restoration-2024/`
11. **Rahane at Refex** - Folder: `rahane-at-refex/`
12. **Rooftop Solar Plant Inauguration** - Folder: `rooftop-solar-plant-inauguration/`
13. **Refex eVeelz at BIAL** - Folder: `refex-eveelz-at-bial/`
14. **International Women's Day 2024** - Folder: `international-womens-day-2024/`
15. **Freshworks Marathon 2024** - Folder: `freshworks-marathon-2024/`
16. **Mumbai Ultimate League** - Folder: `mumbai-ultimate-league/`
17. **National Road Safety Month 2024** - Folder: `national-road-safety-month-2024/`

## Folder Structure

```
public/assets/gallery/2024/
├── airport-taxi-launch-bial/          # Airport Taxi Launch - BIAL images
├── hcl-cyclothon-2024/                 # HCL Cyclothon 2024 images
├── anamaya-launch-pune/                # Anamaya Launch - Pune images
├── anniversary/                        # 22nd Company Anniversary Celebration images
├── pongal-function-2024/               # Pongal Function 2024 images
├── tamilnadu-largest-ev-hub-opening/   # Tamilnadu Largest EV HUB opening images
├── blood-donation-camp-2024/           # Blood donation camp 2024 images
├── park-inauguration/                  # Park Inauguration images
├── pond-restoration-2024/             # Pond Restoration 2024 images
├── rahane-at-refex/                    # Rahane at Refex images
├── rooftop-solar-plant-inauguration/  # Rooftop Solar Plant Inauguration images
├── refex-eveelz-at-bial/               # Refex eVeelz at BIAL images
├── international-womens-day-2024/     # International Women's Day 2024 images
├── freshworks-marathon-2024/           # Freshworks Marathon 2024 images
├── mumbai-ultimate-league/             # Mumbai Ultimate League images
└── national-road-safety-month-2024/    # National Road Safety Month 2024 images
```

## How to Add Images

1. **Upload images** to the appropriate event folder
   - Example: For Airport Taxi Launch photos, upload to `airport-taxi-launch-bial/` folder
   
2. **Update configuration** in `src/data/gallery/config.ts`:
   ```typescript
   'airport-taxi-launch-bial': ['image1.jpg', 'image2.jpg', 'image3.jpg']
   ```

3. **Images will appear** automatically in the gallery when you:
   - Select "All" to see all images
   - Select the specific event category to filter

## Image Naming

- Use lowercase filenames with hyphens
- Examples: `airport-taxi-launch-1.jpg`, `anniversary-photo-2024.jpg`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## Current Status

All event folders are created and ready for image uploads. Once you add images to the folders and update the configuration file, they will appear in the gallery.

