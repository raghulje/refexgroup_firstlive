/* eslint-disable no-await-in-loop */
const { sequelize, HomeAboutSection, Media } = require('../models');

async function seedHomeAboutSection() {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();

        console.log('Seeding Home About Section...');

        // Create or find media entries
        const logoFileName = 'REFEX-Logo@2x-8-1.png';
        const mainImageFileName = 'Diversity-Inclusion-v2.jpg';
        const backgroundCurveFileName = 'About-BG-Curve.png';

        // Logo Image
        const [logoMedia] = await Media.findOrCreate({
            where: { fileName: logoFileName },
            defaults: {
                fileName: logoFileName,
                filePath: `/wp-content/uploads/2023/02/${logoFileName}`,
                fileType: 'image',
                url: `/wp-content/uploads/2023/02/${logoFileName}`
            }
        });

        // Main Image (Diversity Inclusion image)
        const [mainImageMedia] = await Media.findOrCreate({
            where: { fileName: mainImageFileName },
            defaults: {
                fileName: mainImageFileName,
                filePath: `/assets/diversity/${mainImageFileName}`,
                fileType: 'image',
                url: `/assets/diversity/${mainImageFileName}`
            }
        });

        // Background Curve Image (optional - if stored separately)
        // Note: This might be referenced in CSS, but we'll store it if needed
        const [bgCurveMedia] = await Media.findOrCreate({
            where: { fileName: backgroundCurveFileName },
            defaults: {
                fileName: backgroundCurveFileName,
                filePath: `/wp-content/uploads/2023/02/${backgroundCurveFileName}`,
                fileType: 'image',
                url: `/wp-content/uploads/2023/02/${backgroundCurveFileName}`
            }
        });

        // Create or update Home About Section
        const [aboutSection, created] = await HomeAboutSection.findOrCreate({
            where: { id: 1 },
            defaults: {
                title: 'About',
                tagline: 'Choosing green, Chasing growth',
                content_paragraph_1: 'Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment-friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals.',
                content_paragraph_2: 'At present, there are 2 publicly listed entities (listed in the stock exchanges of India) under the umbrella of the Group – Refex Industries Limited and Refex Renewables & Infrastructure Limited.',
                content_paragraph_3: 'Refex Holding Private Limited along with its associate companies, sister companies, and their subsidiaries form part of the Refex Group.',
                content_paragraph_4: 'Refex\'s values, including integrity, diversity, dedication, commitment, and competitiveness have been central to its success, allowing the company to respond to shifting market trends with a "growth mindset." Refex is dedicated to improving the customer experience, constantly innovating, and upholding transparency and honesty. These values have positioned Refex as a key industry player, setting the standard for others to follow.',
                button_text: 'Know More',
                button_link: '/about-refex',
                main_image_id: mainImageMedia.id,
                logo_image_id: logoMedia.id
            }
        });

        if (!created) {
            // Update existing record
            await aboutSection.update({
                title: 'About',
                tagline: 'Choosing green, Chasing growth',
                content_paragraph_1: 'Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment-friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals.',
                content_paragraph_2: 'At present, there are 2 publicly listed entities (listed in the stock exchanges of India) under the umbrella of the Group – Refex Industries Limited and Refex Renewables & Infrastructure Limited.',
                content_paragraph_3: 'Refex Holding Private Limited along with its associate companies, sister companies, and their subsidiaries form part of the Refex Group.',
                content_paragraph_4: 'Refex\'s values, including integrity, diversity, dedication, commitment, and competitiveness have been central to its success, allowing the company to respond to shifting market trends with a "growth mindset." Refex is dedicated to improving the customer experience, constantly innovating, and upholding transparency and honesty. These values have positioned Refex as a key industry player, setting the standard for others to follow.',
                button_text: 'Know More',
                button_link: '/about-refex',
                main_image_id: mainImageMedia.id,
                logo_image_id: logoMedia.id
            });
            console.log('Updated existing Home About Section');
        } else {
            console.log('Created new Home About Section');
        }

        console.log('Home About Section seeded successfully!');
        console.log('Section ID:', aboutSection.id);
        console.log('Logo Media ID:', logoMedia.id);
        console.log('Main Image Media ID:', mainImageMedia.id);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding Home About Section:', error);
        process.exit(1);
    }
}

seedHomeAboutSection();

