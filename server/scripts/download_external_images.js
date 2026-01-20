const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = path.join(__dirname, '../../new_client/public/assets');
const IMAGES = {
  // Awards
  awards: [
    { url: 'https://www.refex.group/wp-content/uploads/2025/06/mid-size-award-300x226.png', filename: 'mid-size-award-300x226.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/06/fleet-managemnet-award-300x226.png', filename: 'fleet-managemnet-award-300x226.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/04/BEST-ORGANISATIONS-FOR-WOMEN-2024-With-Work-force-1-300x281.png', filename: 'BEST-ORGANISATIONS-FOR-WOMEN-2024-With-Work-force-1-300x281.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/06/green-apple-award01.png', filename: 'green-apple-award01.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/06/esg-excellence-award01.png', filename: 'esg-excellence-award01.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/04/Solar-award-300x226.png', filename: 'Solar-award-300x226.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/03/ESG_CSR_Award_01-Medium-300x295.png', filename: 'ESG_CSR_Award_01-Medium-300x295.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/03/Sustainability-report-award-Medium-300x225.png', filename: 'Sustainability-report-award-Medium-300x225.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Gold-Stieve-Refex.png', filename: 'Gold-Stieve-Refex.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Bronze-Stieve-Refex.png', filename: 'Bronze-Stieve-Refex.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Best-Company-Refex.png', filename: 'Best-Company-Refex.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/06/Refex_Group_IN_English_2025_Certification_Badge.png', filename: 'Refex_Group_IN_English_2025_Certification_Badge.png' },
    { url: 'https://refex.group/wp-content/uploads/2023/03/Times-of-India-Trailblazers-of-Tamil-Nadu-awarded-by-Times-Group.png', filename: 'Times-of-India-Trailblazers-of-Tamil-Nadu-awarded-by-Times-Group.png' },
    { url: 'https://refex.group/wp-content/uploads/2023/03/The-Standard-chartered-DUN-_-BRADSTREET-Top-100-SMEs-Award.png', filename: 'The-Standard-chartered-DUN-_-BRADSTREET-Top-100-SMEs-Award.png' },
    { url: 'https://refex.group/wp-content/uploads/2023/03/2009-Award.png', filename: '2009-Award.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/03/Rajasthan-Yuva-Ratna-Award-by-Rajasthan-Association-TN..png', filename: 'Rajasthan-Yuva-Ratna-Award-by-Rajasthan-Association-TN.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/07/workplace-awards-768x844.png', filename: 'workplace-awards-768x844.png' },
  ],
  // Leadership
  leadership: [
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Anil-Jain.png', filename: 'Anil-Jain.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Dinesh-Agarwal.png', filename: 'Dinesh-Agarwal.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Purvesh-Kapadia.png', filename: 'Purvesh-Kapadia.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Lalitha-Uthayakumar.png', filename: 'Lalitha-Uthayakumar.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/08/Srivaths.png', filename: 'Srivaths.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Kalpesh-Kumar.png', filename: 'Kalpesh-Kumar.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Bala-M.png', filename: 'Bala-M.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/02/Yash.png', filename: 'Yash.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/12/Sharath.png', filename: 'Sharath.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/06/Meet-Goradia.png', filename: 'Meet-Goradia.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/11/Tarun.png', filename: 'Tarun.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/11/Vishesh-group.png', filename: 'Vishesh-group.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/11/Gautam_Jain.png', filename: 'Gautam_Jain.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/08/Kruta_COE.png', filename: 'Kruta_COE.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Srividya.N.png', filename: 'Srividya.N.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Jagdish-Jain.png', filename: 'Jagdish-Jain.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Gagan-Bihari-Pattnaik.png', filename: 'Gagan-Bihari-Pattnaik.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Harini.S.png', filename: 'Harini.S.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Sahil-Singla.png', filename: 'Sahil-Singla.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Sonal-Jain.png', filename: 'Sonal-Jain.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Ankit-Poddar.png', filename: 'Ankit-Poddar.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/10/Suhail_VP.png', filename: 'Suhail_VP.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/05/Sandeep_VP_COS.png?t=1764401442', filename: 'Sandeep_VP_COS.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Susmitha-Siripurapu.png', filename: 'Susmitha-Siripurapu.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Sachin-Navtosh-Jha.png', filename: 'Sachin-Navtosh-Jha.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/03/Maharshi-Maitra.png', filename: 'Maharshi-Maitra.png' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/08/Saravanan_COS.png', filename: 'Saravanan_COS.png' },
  ],
  // Business
  business: [
    { url: 'https://www.refex.group/wp-content/uploads/2023/03/Quality-Refilling.jpeg', filename: 'Quality-Refilling.jpeg' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Renewables-Projects-Bhilai-1.jpg', filename: 'Renewables-Projects-Bhilai-1.jpg' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/03/coal-heap-at-yard-7-2-Large.jpeg', filename: 'coal-heap-at-yard-7-2-Large.jpeg' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Medtech-Hero-Banner.jpg', filename: 'Medtech-Hero-Banner.jpg' },
    { url: 'https://www.refex.group/wp-content/uploads/2023/03/Refex-Capital-slider.jpg', filename: 'Refex-Capital-slider.jpg' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/01/Srinagar-Airport-1.jpg', filename: 'Srinagar-Airport-1.jpg' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/08/Integrated-Electric-Fleet-Solutions-03.jpg', filename: 'Integrated-Electric-Fleet-Solutions-03.jpg' },
    { url: 'https://www.refex.group/wp-content/uploads/2024/01/Hero-section-BG.jpg', filename: 'Hero-section-BG.jpg' },
    { url: 'https://www.refex.group/wp-content/uploads/2025/03/venwind-homepage.jpg', filename: 'venwind-homepage.jpg' },
  ],
  // Newsroom
  newsroom: [
    { url: 'https://refex.co.in/wp-content/uploads/2025/11/newsroom-thumbnail-video.jpg', filename: 'newsroom-thumbnail-video.jpg' },
    { url: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/f083fd9c51a4b154ca0967ca2ad3b996.jpeg', filename: 'readdy-1.jpeg' },
    { url: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/2675d7edc8e086e4c4be378eba93a660.jpeg', filename: 'readdy-2.jpeg' },
    { url: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/d674bfc0dcb4ffb4355d91b67e0eb3b3.jpeg', filename: 'readdy-3.jpeg' },
    { url: 'https://refex.co.in/wp-content/uploads/2025/07/press-release02.jpg', filename: 'press-release02.jpg' },
    { url: 'https://refex.co.in/wp-content/uploads/2025/07/press-release04.jpg', filename: 'press-release04.jpg' },
    { url: 'https://refex.co.in/wp-content/uploads/2025/11/Refex-Mobility-expands.jpg', filename: 'Refex-Mobility-expands.jpg' },
    { url: 'https://refex.co.in/wp-content/uploads/2023/02/Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg', filename: 'Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg' },
    { url: 'https://refex.co.in/wp-content/uploads/2023/01/Refex-Group-Road-Safety-Awareness-event.jpg', filename: 'Refex-Group-Road-Safety-Awareness-event.jpg' },
  ],
  // Careers
  careers: [
    { url: 'https://refex.group/wp-content/uploads/2023/02/REFEX_home_career-BG.jpg', filename: 'REFEX_home_career-BG.jpg' },
  ],
  // Gallery
  gallery: [
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/Gallery-REFEX-Awards-7.jpg', filename: 'Gallery-REFEX-Awards-7.jpg' },
    { url: 'https://refex.group/wp-content/uploads/2024/12/IMG_0001-scaled.jpg', filename: 'IMG_0001-scaled.jpg' },
    { url: 'https://refex.group/wp-content/uploads/2023/02/Gallery-20-th.-Anniversary-10.jpg', filename: 'Gallery-20-th.-Anniversary-10.jpg' },
  ],
  // Logos
  logos: [
    { url: 'https://www.refex.group/wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png', filename: 'REFEX-Logo@2x-8-1.png' },
  ],
};

// Helper function to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    // Remove query parameters from URL for download
    const cleanUrl = url.split('?')[0];
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(cleanUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Main function
async function downloadAllImages() {
  console.log('Starting image download...\n');
  
  // Create directories
  const directories = Object.keys(IMAGES);
  directories.forEach(dir => {
    const dirPath = path.join(BASE_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  });
  
  let total = 0;
  let success = 0;
  let failed = 0;
  
  // Download all images
  for (const [category, images] of Object.entries(IMAGES)) {
    console.log(`\nDownloading ${category} images...`);
    
    for (const image of images) {
      total++;
      const filepath = path.join(BASE_DIR, category, image.filename);
      
      // Skip if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`  ✓ Already exists: ${image.filename}`);
        success++;
        continue;
      }
      
      try {
        await downloadFile(image.url, filepath);
        console.log(`  ✓ Downloaded: ${image.filename}`);
        success++;
      } catch (error) {
        console.error(`  ✗ Failed: ${image.filename} - ${error.message}`);
        failed++;
      }
    }
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Download Summary:`);
  console.log(`Total: ${total}`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

// Run the script
downloadAllImages().catch(console.error);

