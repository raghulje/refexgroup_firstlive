const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Create directories structure
const baseDir = path.join(__dirname, '../uploads');
const directories = [
  'gallery/2024-events',
  'gallery/2025-events',
  'gallery/company-celebrations',
  'home/hero-slides',
  'home/business-cards',
  'home/awards',
  'about/hero',
  'about/overview',
  'about/mission-vision',
  'about/our-story',
  'careers/hero',
  'careers/life-refexian',
  'careers/why-choose',
  'careers/testimonials',
  'contact/hero',
  'investments/hero',
  'investments/message',
  'diversity-inclusion/hero',
  'diversity-inclusion/be-you',
  'diversity-inclusion/initiatives',
  'business/refex-refrigerants/hero',
  'business/refex-refrigerants/products',
  'business/refex-refrigerants/quality',
  'business/refex-renewables/hero',
  'business/refex-renewables/categories',
  'business/refex-renewables/projects',
  'business/refex-ash-coal/hero',
  'business/refex-ash-coal/why-us',
  'business/refex-ash-coal/what-we-do',
  'business/refex-medtech/hero',
  'business/refex-medtech/associates',
  'business/refex-medtech/stats',
  'business/refex-medtech/specialities',
  'business/refex-medtech/products',
  'business/refex-medtech/certifications',
  'business/refex-medtech/clientele',
  'business/refex-capital/hero',
  'business/refex-capital/about',
  'business/refex-capital/portfolio',
  'business/refex-airports/hero',
  'business/refex-airports/about',
  'business/refex-airports/retail',
  'business/refex-airports/advantage',
  'business/refex-airports/transport',
  'business/refex-airports/tech',
  'business/refex-mobility/hero',
  'business/refex-mobility/about',
  'business/refex-mobility/solutions',
  'business/refex-mobility/advantages',
  'business/pharma-rl-fine-chem/hero',
  'business/pharma-rl-fine-chem/about',
  'business/pharma-rl-fine-chem/leader',
  'business/pharma-rl-fine-chem/rd',
  'business/pharma-rl-fine-chem/plants',
  'business/pharma-rl-fine-chem/certifications',
  'business/venwind-refex/hero',
  'business/venwind-refex/stats',
  'business/venwind-refex/unique',
  'business/venwind-refex/specs',
  'logos',
  'icons',
  'leaders',
  'awards',
  'newsroom'
];

  // Create all directories
  directories.forEach(dir => {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
  
  // Ensure general directory exists
  const generalPath = path.join(baseDir, 'general');
  if (!fs.existsSync(generalPath)) {
    fs.mkdirSync(generalPath, { recursive: true });
  }

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const file = fs.createWriteStream(filePath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        return downloadFile(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
}

function getFileNameFromUrl(url, defaultName = 'image') {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const fileName = path.basename(pathname);
    
    if (fileName && fileName.includes('.')) {
      return fileName;
    }
    
    // Generate a safe filename
    const ext = path.extname(pathname) || '.jpg';
    return `${defaultName}${ext}`;
  } catch (e) {
    return `${defaultName}.jpg`;
  }
}

async function extractAndDownloadImages() {
  const seedFiles = [
    'seed_home_page.js',
    'seed_about_page.js',
    'seed_careers_page.js',
    'seed_contact_page.js',
    'seed_investments_page.js',
    'seed_diversity_inclusion_page.js',
    'seed_gallery.js',
    'seed_business_pages.js',
    'seed_business_pages_2.js',
    'seed_business_pages_3.js',
    'seed_business_pages_4.js',
    'seed_awards.js',
    'seed_leaders.js',
    'seed_newsroom.js'
  ];

  const imageMap = new Map(); // url -> local path mapping
  let downloadCount = 0;
  let skipCount = 0;

  console.log('🔍 Scanning seed files for image URLs...\n');

  for (const seedFile of seedFiles) {
    const filePath = path.join(__dirname, seedFile);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${seedFile}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract all image URLs
    const urlPattern = /https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|svg|webp|avif)/gi;
    const urls = content.match(urlPattern) || [];
    
    for (const url of urls) {
      if (imageMap.has(url)) continue;
      
      // Determine category and folder based on seed file and URL
      let category = 'general';
      let folder = 'general';
      
      if (seedFile.includes('home')) {
        if (url.includes('hero') || url.includes('Hero')) folder = 'home/hero-slides';
        else if (url.includes('business') || url.includes('Business')) folder = 'home/business-cards';
        else if (url.includes('award') || url.includes('Award')) folder = 'home/awards';
        else folder = 'home';
      } else if (seedFile.includes('about')) {
        folder = 'about';
        if (url.includes('hero') || url.includes('Hero')) folder = 'about/hero';
        else if (url.includes('overview') || url.includes('Office')) folder = 'about/overview';
        else if (url.includes('mission') || url.includes('Vision')) folder = 'about/mission-vision';
        else if (url.includes('story') || url.includes('Milestone')) folder = 'about/our-story';
      } else if (seedFile.includes('careers')) {
        folder = 'careers';
        if (url.includes('hero') || url.includes('Hero')) folder = 'careers/hero';
        else if (url.includes('Gallery') || url.includes('refexian')) folder = 'careers/life-refexian';
        else if (url.includes('Nurturing') || url.includes('Culture') || url.includes('Excellence')) folder = 'careers/why-choose';
        else if (url.includes('Lalitha') || url.includes('Rajeev') || url.includes('Saranya')) folder = 'careers/testimonials';
      } else if (seedFile.includes('contact')) {
        folder = 'contact/hero';
      } else if (seedFile.includes('investments')) {
        folder = 'investments';
        if (url.includes('hero') || url.includes('Hero')) folder = 'investments/hero';
        else if (url.includes('Anil')) folder = 'investments/message';
      } else if (seedFile.includes('diversity')) {
        folder = 'diversity-inclusion';
        if (url.includes('hero') || url.includes('Hero')) folder = 'diversity-inclusion/hero';
        else if (url.includes('Office-Group') || url.includes('be-you')) folder = 'diversity-inclusion/be-you';
        else if (url.includes('Vamika') || url.includes('Krav')) folder = 'diversity-inclusion/initiatives';
      } else if (seedFile.includes('gallery')) {
        folder = 'gallery/2024-events';
      } else if (seedFile.includes('business_pages')) {
        // Determine business page from URL patterns
        if (url.includes('Refrigerants') || url.includes('refrigerant')) {
          folder = 'business/refex-refrigerants';
          if (url.includes('R32') || url.includes('R134') || url.includes('R404') || url.includes('R407') || url.includes('R410') || url.includes('R22') || url.includes('R152') || url.includes('600a')) {
            folder = 'business/refex-refrigerants/products';
          } else if (url.includes('Quality') || url.includes('Safety')) {
            folder = 'business/refex-refrigerants/quality';
          }
        } else if (url.includes('Renewables') || url.includes('renewable') || url.includes('solar')) {
          folder = 'business/refex-renewables';
          if (url.includes('Hero')) folder = 'business/refex-renewables/hero';
          else if (url.includes('Commercial') || url.includes('Utility') || url.includes('Battery')) folder = 'business/refex-renewables/categories';
          else if (url.includes('Bhilai') || url.includes('Leh') || url.includes('Diwana') || url.includes('Project')) folder = 'business/refex-renewables/projects';
        } else if (url.includes('Ash') || url.includes('Coal') || url.includes('ash') || url.includes('coal')) {
          folder = 'business/refex-ash-coal';
          if (url.includes('Hero')) folder = 'business/refex-ash-coal/hero';
          else if (url.includes('pushing') || url.includes('Why')) folder = 'business/refex-ash-coal/why-us';
          else if (url.includes('Heap') || url.includes('Yard') || url.includes('Water')) folder = 'business/refex-ash-coal/what-we-do';
        } else if (url.includes('MedTech') || url.includes('medtech') || url.includes('med-tech')) {
          folder = 'business/refex-medtech';
          if (url.includes('medtech-images')) folder = 'business/refex-medtech/hero';
          else if (url.includes('3i') || url.includes('Adonis')) folder = 'business/refex-medtech/associates';
          else if (url.includes('specialities')) folder = 'business/refex-medtech/specialities';
          else if (url.includes('MINI') || url.includes('Anamaya') || url.includes('FPD') || url.includes('DR') || url.includes('C-arm') || url.includes('Myrian')) folder = 'business/refex-medtech/products';
          else if (url.includes('AERB') || url.includes('CDSCO') || url.includes('BIS') || url.includes('ISO') || url.includes('images.jpg') || url.includes('certification')) folder = 'business/refex-medtech/certifications';
          else if (url.includes('logo0')) folder = 'business/refex-medtech/clientele';
        } else if (url.includes('Capital') || url.includes('capital')) {
          folder = 'business/refex-capital';
          if (url.includes('About')) folder = 'business/refex-capital/about';
          else if (url.includes('Artwally') || url.includes('BLU') || url.includes('chalo') || url.includes('Easy-policy') || url.includes('Fab-heads')) folder = 'business/refex-capital/portfolio';
        } else if (url.includes('Airports') || url.includes('airport')) {
          folder = 'business/refex-airports';
          if (url.includes('Hero') || url.includes('Logo-W')) folder = 'business/refex-airports/hero';
          else if (url.includes('terminal') || url.includes('About')) folder = 'business/refex-airports/about';
          else if (url.includes('Retail')) folder = 'business/refex-airports/retail';
          else if (url.includes('Advantage')) folder = 'business/refex-airports/advantage';
          else if (url.includes('Landing-Page')) folder = 'business/refex-airports/transport';
        } else if (url.includes('Mobility') || url.includes('mobility')) {
          folder = 'business/refex-mobility';
          if (url.includes('top-banner')) folder = 'business/refex-mobility/hero';
          else if (url.includes('reliable')) folder = 'business/refex-mobility/about';
          else if (url.includes('Electric-Fleet') || url.includes('Solutions')) folder = 'business/refex-mobility/solutions';
          else if (url.includes('Strategic-Advantages') || url.includes('eWheelz')) folder = 'business/refex-mobility/advantages';
        } else if (url.includes('Pharma') || url.includes('RL') || url.includes('Fine-Chem') || url.includes('rlfinechem')) {
          folder = 'business/pharma-rl-fine-chem';
          if (url.includes('Hero-section')) folder = 'business/pharma-rl-fine-chem/hero';
          else if (url.includes('Logo.png')) folder = 'business/pharma-rl-fine-chem/about';
          else if (url.includes('Products')) folder = 'business/pharma-rl-fine-chem/leader';
          else if (url.includes('R-D-Capability') || url.includes('RD')) folder = 'business/pharma-rl-fine-chem/rd';
          else if (url.includes('Hindupur') || url.includes('Gauribidanur') || url.includes('Plant')) folder = 'business/pharma-rl-fine-chem/plants';
          else if (url.includes('Certification')) folder = 'business/pharma-rl-fine-chem/certifications';
        } else if (url.includes('Venwind') || url.includes('venwind')) {
          folder = 'business/venwind-refex';
          if (url.includes('banner')) folder = 'business/venwind-refex/hero';
          else if (url.includes('about-usbg')) folder = 'business/venwind-refex/stats';
          else if (url.includes('home-image') || url.includes('Hybrid') || url.includes('Proven') || url.includes('Rapid') || url.includes('Reduced') || url.includes('Lower') || url.includes('Decreased')) folder = 'business/venwind-refex/unique';
          else if (url.includes('Technical-Specifications')) folder = 'business/venwind-refex/specs';
        }
      } else if (seedFile.includes('awards')) {
        folder = 'awards';
      } else if (seedFile.includes('leaders')) {
        folder = 'leaders';
      } else if (seedFile.includes('newsroom')) {
        folder = 'newsroom';
      }
      
      // Check if it's a logo
      if (url.includes('Logo') || url.includes('logo') || url.includes('REFEX-Logo')) {
        folder = 'logos';
      }
      
      // Check if it's an icon
      if (url.includes('icon') || url.includes('Icon') || url.includes('.svg')) {
        if (!url.includes('logo')) {
          folder = 'icons';
        }
      }
      
      // Ensure folder directory exists
      const folderPath = path.join(baseDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      
      const fileName = getFileNameFromUrl(url, `image-${downloadCount}`);
      const localPath = path.join(baseDir, folder, fileName);
      const relativePath = `/uploads/${folder}/${fileName}`;
      
      imageMap.set(url, {
        localPath: localPath,
        relativePath: relativePath,
        folder: folder,
        fileName: fileName
      });
    }
  }

  console.log(`📦 Found ${imageMap.size} unique images to download\n`);

  // Download images with rate limiting
  const downloadQueue = Array.from(imageMap.entries());
  const maxConcurrent = 5;
  let currentDownloads = 0;
  let completed = 0;

  async function processNext() {
    if (completed >= downloadQueue.length) {
      console.log(`\n✅ Download complete!`);
      console.log(`   Downloaded: ${downloadCount}`);
      console.log(`   Skipped: ${skipCount}`);
      return;
    }

    if (currentDownloads >= maxConcurrent) {
      return;
    }

    const [url, info] = downloadQueue[completed++];
    currentDownloads++;

    try {
      // Check if file already exists
      if (fs.existsSync(info.localPath)) {
        console.log(`⏭️  Skipped (exists): ${info.fileName}`);
        skipCount++;
        currentDownloads--;
        setTimeout(processNext, 100);
        return;
      }

      await downloadFile(url, info.localPath);
      console.log(`✅ Downloaded: ${info.fileName} -> ${info.folder}`);
      downloadCount++;
    } catch (error) {
      console.error(`❌ Failed: ${info.fileName} - ${error.message}`);
      skipCount++;
    } finally {
      currentDownloads--;
      setTimeout(processNext, 100);
    }
  }

  // Start downloads
  for (let i = 0; i < Math.min(maxConcurrent, downloadQueue.length); i++) {
    processNext();
  }

  // Generate mapping file
  const mapping = {};
  imageMap.forEach((info, url) => {
    mapping[url] = info.relativePath;
  });

  fs.writeFileSync(
    path.join(__dirname, '../uploads/image_mapping.json'),
    JSON.stringify(mapping, null, 2)
  );

  console.log('\n📝 Image mapping saved to uploads/image_mapping.json');
}

// Run if called directly
if (require.main === module) {
  extractAndDownloadImages().catch(console.error);
}

module.exports = { extractAndDownloadImages, getFileNameFromUrl };

