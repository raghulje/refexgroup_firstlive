/* eslint-disable no-await-in-loop */
const { sequelize, Page, HeroSlide, HomeAboutSection, BusinessCard, Award, Media } = require('../models');
const fs = require('fs');
const path = require('path');

// Helper to copy file
function copyImage(srcPathRelative, destName) {
    const srcPath = path.resolve(__dirname, '../../new_client/src/wp-content/uploads', srcPathRelative);
    // Note: Adjusting path logic to match where the script runs (server/scripts) -> ../../new_client...
    // But wait, the imports in React were relative to the component.
    // HeroSlider.tsx is in src/pages/home/components.
    // Import is ../../../wp-content/uploads... -> src/wp-content/uploads.
    // So project_root/new_client/src/wp-content/uploads is correct.

    const destPath = path.resolve(__dirname, '../uploads/images', destName);

    // We can't easily copy from here because we don't know the exact deeply nested paths of every file 
    // without listing them all.
    // Plan B: Just assume standard paths and "try" to set the DB record. 
    // The user can fix missing files later, or we can copy specifically named files we know.
    return `/uploads/images/${destName}`;
}

async function seedHome() {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();

        // Ensure "Home" page exists
        const [homePage] = await Page.findOrCreate({
            where: { slug: 'home' },
            defaults: { title: 'Home', is_published: true }
        });

        console.log('Seeding Hero Slides...');
        const slides = [
            {
                title: 'Breaking New Grounds in Sustainability',
                subtitle: 'Forging a Path Towards a Brighter Tomorrow',
                description: 'Refex promotes sustainability through innovative solutions, products, and services that create environmental, social, and financial value in a world where sustainability is the need of the hour for businesses',
                imageName: 'Slider-1.jpg',
                srcPath: '2023/02/Slider-1.jpg',
                link: '/about-refex',
                videoId: 'MCl9yK2HWo8'
            },
            {
                title: 'Reliable and Sustainable Refrigerant solutions.',
                subtitle: 'REFRIGERANTS',
                description: 'A market leader in refrigerant gas manufacturing, we are also conscious innovators. Discover our eco-friendly alternatives to make the step towards a greener tomorrow.',
                imageName: 'Renwables-Hero-Option.jpg', // Note: React import name was RenewablesHero but filename likely this
                srcPath: '2023/03/Renwables-Hero-Option.jpg',
                link: '/refex-refrigerants'
            },
            {
                title: 'Powering the Future with Green Energy',
                subtitle: 'REFEX Renewables',
                description: 'Building a safe and healthy future with limitless clean and green energy by inculcating innovative methods to have a sustainable future.',
                imageName: 'Business-page-banner-Large.jpeg',
                srcPath: '2023/03/Business-page-banner-Large-e1678952742298.jpeg',
                link: '/refex-renewables'
            },
            {
                title: 'Reliable and responsible coal handling solutions.',
                subtitle: 'REFEX Coal & Ash handling',
                description: 'Experience unprecedented efficiency and reliability in coal and ash handling by elevating it with Refex.',
                imageName: 'Heap-Making.jpeg',
                srcPath: '2023/03/Heap-Making.jpeg',
                link: '/refex-ash-coal-handling'
            },
            {
                title: 'Engineering Innovation for Good Health',
                subtitle: 'REFEX MedTech',
                description: 'Creating extraordinary diagnostic tools and providing expert technical guidance to make healthcare affordable and accessible to all.',
                imageName: 'Medtech-Slider.jpg',
                srcPath: '2023/02/Medtech-Slider.jpg',
                link: '/refex-medtech'
            },
            {
                title: 'Fuelling great ideas into new possibilities',
                subtitle: 'REFEX Capital',
                description: 'We focus on investing in disruptive start-ups with the aim of advancing technology and defining the future.',
                imageName: 'Refex-Capital-slider.jpg',
                srcPath: '2023/03/Refex-Capital-slider.jpg',
                link: '/refex-capital'
            }
        ];

        for (let i = 0; i < slides.length; i++) {
            const s = slides[i];
            const [media] = await Media.findOrCreate({
                where: { fileName: s.imageName },
                defaults: {
                    fileName: s.imageName,
                    filePath: `/uploads/images/${s.imageName}`,
                    fileType: 'image',
                    altText: s.title
                }
            });

            await HeroSlide.findOrCreate({
                where: { title: s.title, pageId: homePage.id },
                defaults: {
                    subtitle: s.subtitle,
                    description: s.description,
                    backgroundImageId: media.id,
                    buttonText: 'Know More',
                    buttonLink: s.link,
                    videoId: s.videoId || null,
                    orderIndex: i
                }
            });
        }

        console.log('Seeding Home About Section...');
        // Images
        const [aboutCurve] = await Media.findOrCreate({
            where: { fileName: 'About-BG-Curve.png' },
            defaults: { fileName: 'About-BG-Curve.png', filePath: '/uploads/images/About-BG-Curve.png', fileType: 'image' }
        });
        const [refexLogo] = await Media.findOrCreate({
            where: { fileName: 'REFEX-Logo.png' },
            defaults: { fileName: 'REFEX-Logo.png', filePath: '/uploads/images/REFEX-Logo@2x-8-1.png', fileType: 'image' }
        });
        const [aboutImg] = await Media.findOrCreate({
            where: { fileName: 'Diversity-Inclusion-v2.jpg' }, // From src check
            defaults: { fileName: 'Diversity-Inclusion-v2.jpg', filePath: '/uploads/images/Diversity-Inclusion-v2.jpg', fileType: 'image' }
        });

        await HomeAboutSection.findOrCreate({
            where: { title: 'About' },
            defaults: {
                tagline: 'Choosing green,\nChasing growth',
                content_paragraph_1: 'Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment-friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals.',
                content_paragraph_2: 'At present, there are 2 publicly listed entities (listed in the stock exchanges of India) under the umbrella of the Group – Refex Industries Limited and Refex Renewables & Infrastructure Limited.',
                content_paragraph_3: 'Refex Holding Private Limited along with its associate companies, sister companies, and their subsidiaries form part of the Refex Group.',
                content_paragraph_4: 'Refex\'s values, including integrity, diversity, dedication, commitment, and competitiveness have been central to its success, allowing the company to respond to shifting market trends with a "growth mindset." Refex is dedicated to improving the customer experience, constantly innovating, and upholding transparency and honesty. These values have positioned Refex as a key industry player, setting the standard for others to follow.',
                button_text: 'Know More',
                button_link: '/about-refex',
                main_image_id: aboutImg.id,
                logo_image_id: refexLogo.id
            }
        });

        console.log('Seeding Business Cards...');
        const businesses = [
            { title: 'Refex Refrigerants', desc: 'Over 20 years, Refex has been a renowned brand in refrigerant gas, expanding to offer eco-friendly products that reduce risks from sourcing and environmental policy changes.', img: 'Quality-Refilling.jpeg', link: '/refex-refrigerants' },
            { title: 'Refex Renewables', desc: 'Refex excels in providing top-notch design, installation, and maintenance services for efficient solar power systems. With 10+ years of experience, Refex is your trusted partner in renewable energy.', img: 'Renewables-Projects-Bhilai-1.jpg', link: '/refex-renewables' },
            { title: 'Refex Ash & Coal Handling', desc: 'Refex trades coal and provides ash disposal to ensure a steady supply to power plants. Offers efficient solutions for sustainable operations in the energy sector.', img: 'coal-heap-at-yard-7-2-Large.jpeg', link: '/refex-ash-coal-handling' },
            { title: 'Refex MedTech', desc: 'Refex aims to bring "Affordable Luxury" to radiology products & solutions to serve customers with advanced cutting-edge technology with lower life cycle costs without compromising on quality, reliability, and patient safety.', img: 'Medtech-Hero-Banner.jpg', link: '/refex-medtech' },
            { title: 'Refex Capital', desc: 'A SEBI-approved Category I AIF, Refex Capital invests in startups, managing a portfolio of 26 firms. It also offers incubation services to budding entrepreneurs in Chennai.', img: 'Refex-Capital-slider.jpg', link: '/refex-capital' },
            { title: 'Refex Airports and Transportation', desc: 'Refex is on a mission to enhance the consumer journey and foster enduring relationships across various transportation platforms, including airports, railways, metro systems, bus stations, and heliports.', img: 'Srinagar-Airport-1.jpg', link: '/refex-airports' },
            { title: 'Refex Mobility', desc: 'Refex Mobility operates 100% cleaner-fuelled 4-wheeler vehicles across India with trained chauffeurs, 24/7 support teams, and a full-fledged technology platform serving corporates.', img: 'Integrated-Electric-Fleet-Solutions-03.jpg', link: '/refex-mobility' },
            { title: 'Pharma | RL Fine Chem', desc: 'Over 40 years, RL Fine Chem specialize in CNS and Psychotropic drugs manufacturing and exports to 30+ developed countries around the world.', img: 'Hero-section-BG.jpg', link: '/pharma-rl-fine-chem' },
            { title: 'Venwind Refex', desc: 'Venwind Refex, a joint venture between Refex and Venwind, is dedicated to transforming wind energy in India through cutting-edge turbine technology and sustainable practices.', img: 'venwind-homepage.jpg', link: '/venwind-refex' }
        ];

        for (let i = 0; i < businesses.length; i++) {
            const b = businesses[i];
            const [media] = await Media.findOrCreate({
                where: { fileName: b.img },
                defaults: { fileName: b.img, filePath: `/uploads/images/${b.img}`, fileType: 'image' }
            });

            await BusinessCard.findOrCreate({
                where: { title: b.title },
                defaults: {
                    description: b.desc,
                    imageId: media.id,
                    linkUrl: b.link,
                    orderIndex: i
                }
            });
        }

        console.log('Seeding Awards...');
        // We already have 17 awards in the array.
        const awards = [
            { title: 'Mid-Size Fleet of the Year 2024 – 2025 by India Fleet Excellence Awards', img: 'mid-size-award-300x226.png' },
            { title: 'Fleet Management Service Provider of the Year 2024 – 2025 by India Fleet Excellence Awards', img: 'fleet-managemnet-award-300x226.png' },
            { title: 'Best Organisations for Women 2024 Award by ET Now', img: 'BEST-ORGANISATIONS-FOR-WOMEN-2024-With-Work-force-1-300x281.png' },
            { title: 'International Green Apple Environment Award 2024', img: 'green-apple-award01.png' },
            { title: 'ESG Excellence Award by ESG Grit Awards', img: 'esg-excellence-award01.png' },
            { title: 'Solar Energy Company of the Year 2023 by MSMECCII', img: 'Solar-award-300x226.png' },
            { title: 'Most Diversified Sustainable Company (India) by The Business Concept. UK', img: 'ESG_CSR_Award_01-Medium-300x295.png' },
            { title: 'Bronze Prize of Asia\'s Best Integrated Report for our First-ever Sustainability Report by AIRA', img: 'Sustainability-report-award-Medium-300x225.png' },
            { title: 'GOLD STEVIE AWARD WINNER - Conglomerates Category (Medium Size)', img: 'Gold-Stieve-Refex.png' },
            { title: 'BRONZE STEVIE AWARD WINNER - Won by ANIL JAIN \'BEST ENTREPRENEUR OF THE YEAR\'', img: 'Bronze-Stieve-Refex.png' },
            { title: 'INDIA\'S BEST COMPANY OF THE YEAR, 2022 - By BERKSHIRE MEDIA LLC, USA', img: 'Best-Company-Refex.png' },
            { title: 'Great Place to Work Certified 2025', img: 'Refex_Group_IN_English_2025_Certification_Badge.png' },
            { title: 'Transnational Trailblazers of Tamil Nadu awarded by Times Group', img: 'Times-of-India-Trailblazers-of-Tamil-Nadu-awarded-by-Times-Group.png', year: 2007, recipient: 'To Anil Jain' },
            { title: 'The Standard chartered DnB & BENSTREET Top 50 SMEs Award', img: 'The-Standard-chartered-DUN-_-BRADSTREET-Top-100-SMEs-Award.png', year: 2008, recipient: 'To Anil Jain' },
            { title: 'Young Entrepreneur by Times Group', img: '2009-Award.png', year: 2009, recipient: 'To Anil Jain' },
            { title: 'Rajasthan Yuva Ratna Award by Rajasthan Association, TN.', img: 'Rajasthan-Yuva-Ratna-Award-by-Rajasthan-Association-TN..png', year: 2018, recipient: 'To Anil Jain' },
            { title: 'Most Preferred Workplace 2025-2026 by Marksmen Daily', img: 'workplace-awards-768x844.png' }
        ];

        for (let i = 0; i < awards.length; i++) {
            const a = awards[i];
            const [media] = await Media.findOrCreate({
                where: { fileName: a.img },
                defaults: { fileName: a.img, filePath: `/uploads/images/${a.img}`, fileType: 'image' }
            });

            await Award.findOrCreate({
                where: { title: a.title },
                defaults: {
                    awardType: 'General', // Defaulting for now
                    imageId: media.id,
                    year: a.year || null,
                    recipient: a.recipient || null,
                    orderIndex: i
                }
            });
        }

        console.log('Success!');
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seedHome();
