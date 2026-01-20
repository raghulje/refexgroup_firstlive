# Gallery 2025 - Event Structure

This folder contains all images for Gallery 2025, organized by event/category.

## Events (in order as displayed)

1. **All** - Shows all images from all events
2. **1st Business Integrity Conclave and 19th National Convention by UNGCNI** - Folder: `business-integrity-ungcni/`
3. **Ganesh Chaturti** - Folder: `ganesh-chaturti/`
4. **Meet & Greet with CSK** - Folder: `meet-greet-with-csk/`
5. **Blood Donation Camp** - Folder: `blood-donation-camp/`
6. **Krav Maga Session** - Folder: `krav-maga-session/`
7. **Mangrove Plantation Drive** - Folder: `mangrove-plantation-drive/`
8. **Tamil Nadu Round Table** - Folder: `tamil-nadu-round-table/`
9. **Ayutha Puja Celebration** - Folder: `ayutha-puja-celebration/`
10. **Company Anniversary** - Folder: `company-anniversary/`
11. **GPTW Celebration** - Folder: `gptw-celebration/`
12. **Independence Day** - Folder: `independence-day/`
13. **International Women's Day** - Folder: `international-womens-day/`
14. **National Road Safety Week** - Folder: `national-road-safety-week/`
15. **Republic Day** - Folder: `republic-day/`
16. **Vamika Oncology Session** - Folder: `vamika-oncology-session/`
17. **World Environment Day** - Folder: `world-environment-day/`

## Folder Structure

```
public/assets/gallery/2025/
├── business-integrity-ungcni/        # 1st Business Integrity Conclave and 19th National Convention by UNGCNI images
├── ganesh-chaturti/                  # Ganesh Chaturti images
├── meet-greet-with-csk/              # Meet & Greet with CSK images
├── blood-donation-camp/              # Blood Donation Camp images
├── krav-maga-session/                # Krav Maga Session images
├── mangrove-plantation-drive/        # Mangrove Plantation Drive images
├── tamil-nadu-round-table/           # Tamil Nadu Round Table images
├── ayutha-puja-celebration/          # Ayutha Puja Celebration images
├── company-anniversary/              # Company Anniversary images
├── gptw-celebration/                 # GPTW Celebration images
├── independence-day/                 # Independence Day images
├── international-womens-day/         # International Women's Day images
├── national-road-safety-week/        # National Road Safety Week images
├── republic-day/                     # Republic Day images
├── vamika-oncology-session/          # Vamika Oncology Session images
└── world-environment-day/            # World Environment Day images
```

## How to Add Images

1. **Upload images** to the appropriate event folder
   - Example: For Business Integrity Conclave photos, upload to `business-integrity-ungcni/` folder
   
2. **Update configuration** in `src/data/gallery/config.ts`:
   ```typescript
   'business-integrity-ungcni': ['image1.jpg', 'image2.jpg', 'image3.jpg']
   ```

3. **Images will appear** automatically in the gallery when you:
   - Select "All" to see all images
   - Select the specific event category to filter

## Image Naming

- Use lowercase filenames with hyphens
- Examples: `business-integrity-1.jpg`, `ganesh-chaturti-2025.jpg`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## Current Status

All event folders are created and ready for image uploads. Once you add images to the folders and update the configuration file, they will appear in the gallery.

