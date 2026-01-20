// download-assets.js - Download critical external assets locally
const fs = require('fs');
const path = require('path');
const https = require('https');

// Critical assets to download
const CRITICAL_ASSETS = [
    // Main Logos
    {
        url: 'https://www.refex.group/wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png',
        dest: 'public/assets/logos/refex-logo.png',
        description: 'Main Refex Logo'
    },
    {
        url: 'https://refex.group/wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png',
        dest: 'public/assets/logos/refex-logo-alt.png',
        description: 'Main Refex Logo (Alt)'
    },

    // Business Logos
    {
        url: 'https://www.refex.group/wp-content/uploads/2024/01/Refex-Airports-Logo-W.png',
        dest: 'public/assets/logos/business/airports-logo-white.png',
        description: 'Airports Logo White'
    },
    {
        url: 'https://refex.group/wp-content/uploads/2023/03/Refex-Capital-logo.png',
        dest: 'public/assets/logos/business/capital-logo.png',
        description: 'Capital Logo'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2023/03/3i-MedTech-new-Logo-e1679395253850-858x1024.png',
        dest: 'public/assets/logos/business/3i-medtech-logo.png',
        description: '3i MedTech Logo'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2023/03/Adonis-logo-1024x666.png',
        dest: 'public/assets/logos/business/adonis-logo.png',
        description: 'Adonis Logo'
    },

    // Hero/Background Images
    {
        url: 'https://www.refex.group/wp-content/uploads/2023/02/Businesses-BG.jpg',
        dest: 'public/assets/heroes/business-bg.jpg',
        description: 'Business Background'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2023/02/Gallery-20-th.-Anniversary-10.jpg',
        dest: 'public/assets/heroes/about-anniversary.jpg',
        description: 'About Anniversary Image'
    },
    {
        url: 'https://refex.group/wp-content/uploads/2023/02/Capital-Hero-Banner-white.jpg',
        dest: 'public/assets/heroes/capital-hero.jpg',
        description: 'Capital Hero Banner'
    },
    {
        url: 'https://refex.group/wp-content/uploads/2023/02/Renewables-Projects-Leh-Ladak-2.jpg',
        dest: 'public/assets/heroes/renewables-hero.jpg',
        description: 'Renewables Hero'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/03/venwind-banner.jpg',
        dest: 'public/assets/heroes/venwind-banner.jpg',
        description: 'Venwind Banner'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/08/top-banner-img.png',
        dest: 'public/assets/heroes/mobility-banner.png',
        description: 'Mobility Banner'
    },
    {
        url: 'https://refex.group/wp-content/uploads/2024/01/Refex-Airports-Hero.png',
        dest: 'public/assets/heroes/airports-hero.png',
        description: 'Airports Hero'
    },

    // Key Business Images
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/08/reliable.png',
        dest: 'public/assets/business/mobility/reliable.png',
        description: 'Mobility Reliable Icon'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/08/Why-Opt-for-Refex-Green-Mobility.png',
        dest: 'public/assets/business/mobility/why-opt.png',
        description: 'Mobility Why Opt'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/05/medtech-images-new.png',
        dest: 'public/assets/business/medtech/hero-image.png',
        description: 'MedTech Hero Image'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/04/our-specialities.avif',
        dest: 'public/assets/business/medtech/specialities.avif',
        description: 'MedTech Specialities'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2023/02/REFEX-Capital-About--768x525.jpg',
        dest: 'public/assets/business/capital/about.jpg',
        description: 'Capital About Image'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2023/02/Capital-Areas-BG-1.jpg',
        dest: 'public/assets/business/capital/areas-bg.jpg',
        description: 'Capital Areas Background'
    },
    {
        url: 'https://refex.group/wp-content/uploads/2023/02/Sun-BG-Icon.png',
        dest: 'public/assets/icons/sun-bg.png',
        description: 'Sun Background Icon'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2024/01/airport-terminal-Large-1024x683.jpeg',
        dest: 'public/assets/business/airports/terminal.jpeg',
        description: 'Airport Terminal'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2024/01/Refex-Airport-Retail-1.png',
        dest: 'public/assets/business/airports/retail.png',
        description: 'Airport Retail'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2024/01/Refex-Advantage-1.jpg',
        dest: 'public/assets/business/airports/advantage.jpg',
        description: 'Airport Advantage'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/03/home-image-840x968-1.jpg',
        dest: 'public/assets/business/venwind/home-image.jpg',
        description: 'Venwind Home Image'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/03/gallery-img03.jpg',
        dest: 'public/assets/business/venwind/gallery.jpg',
        description: 'Venwind Gallery'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/03/about-usbg-630x630-1.jpg',
        dest: 'public/assets/business/venwind/about-bg.jpg',
        description: 'Venwind About Background'
    },
    {
        url: 'https://www.refex.group/wp-content/uploads/2025/03/sustainability-banner.jpg',
        dest: 'public/assets/business/venwind/sustainability.jpg',
        description: 'Venwind Sustainability'
    },
    {
        url: 'https://refex.group/wp-content/uploads/2023/03/pushing-at-th2.jpeg',
        dest: 'public/assets/business/ash-coal/pushing.jpeg',
        description: 'Ash & Coal Pushing'
    },
    {
        url: 'https://refex.group/wp-content/uploads/2023/03/Heap-Making-5293.jpeg',
        dest: 'public/assets/business/ash-coal/heap-making.jpeg',
        description: 'Ash & Coal Heap Making'
    },
];

// Download function
async function downloadFile(url, dest, description) {
    return new Promise((resolve, reject) => {
        // Create directory if it doesn't exist
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const file = fs.createWriteStream(dest);

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${description} -> ${dest}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { }); // Delete the file if error
            reject(err);
        });

        file.on('error', (err) => {
            fs.unlink(dest, () => { }); // Delete the file if error
            reject(err);
        });
    });
}

// Main download function
async function downloadAllAssets() {
    console.log(`🚀 Starting download of ${CRITICAL_ASSETS.length} critical assets...\n`);

    let successCount = 0;
    let failCount = 0;

    for (const asset of CRITICAL_ASSETS) {
        try {
            await downloadFile(asset.url, asset.dest, asset.description);
            successCount++;
        } catch (error) {
            console.error(`❌ Failed: ${asset.description} - ${error.message}`);
            failCount++;
        }
    }

    console.log(`\n📊 Download Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📁 Total: ${CRITICAL_ASSETS.length}`);
}

// Run the download
downloadAllAssets().catch(console.error);
