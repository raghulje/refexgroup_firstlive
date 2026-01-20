/* eslint-disable no-await-in-loop */
/* eslint-disable no-await-in-loop */
const { sequelize, NavigationMenu, Media, SocialLink, GlobalSettings } = require('../models');

async function seed() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Database connection established.');

        // --- 1. MEDIA ---
        console.log('Seeding Media...');
        const [aboutMedia] = await Media.findOrCreate({
            where: { fileName: 'about-anniversary.jpg' },
            defaults: {
                fileName: 'about-anniversary.jpg',
                filePath: '/uploads/images/about-anniversary.jpg',
                fileType: 'image',
                altText: 'Refex Group Team'
            }
        });

        const [businessMedia] = await Media.findOrCreate({
            where: { fileName: 'business-bg.jpg' },
            defaults: {
                fileName: 'business-bg.jpg',
                filePath: '/uploads/images/business-bg.jpg',
                fileType: 'image',
                altText: 'Our Businesses'
            }
        });

        // --- 2. HEADER NAVIGATION ---
        console.log('Seeding Header Navigation...');

        // Home
        await NavigationMenu.create({
            menuLocation: 'header',
            label: 'Home',
            linkType: 'internal',
            linkUrl: '/',
            orderIndex: 0,
        });

        // About Refex (Mega Menu)
        const aboutMenu = await NavigationMenu.create({
            menuLocation: 'header',
            label: 'About Refex',
            linkType: 'dropdown',
            linkUrl: '/about-refex',
            orderIndex: 1,
            megaMenuTitle: 'About Refex Group',
            description: 'Refex Group, a trusted name in the industry for two decades. Our commitment to core values and a growth mindset drives excellence and innovation.',
            megaMenuMediaId: aboutMedia.id
        });

        // About Submenus
        const aboutLinks = [
            { label: 'Overview', url: '/about-refex', order: 0 },
            { label: 'Leadership Team', url: '/about-refex#leadership', order: 1 },
            { label: 'Mission & Vision', url: '/about-refex#mission', order: 2 },
            { label: 'Careers', url: '/careers', order: 3 },
            { label: 'Newsroom', url: '/newsroom', order: 4 }, // Col 2
            { label: 'Diversity & Inclusion', url: '/diversity-inclusion', order: 5 },
            { label: 'Gallery', url: '/gallery', order: 6 }
        ];

        for (const link of aboutLinks) {
            await NavigationMenu.create({
                menuLocation: 'header',
                label: link.label,
                linkType: 'internal',
                linkUrl: link.url,
                parentId: aboutMenu.id,
                orderIndex: link.order
            });
        }

        // Business (Mega Menu)
        const businessMenu = await NavigationMenu.create({
            menuLocation: 'header',
            label: 'Business',
            linkType: 'dropdown',
            linkUrl: '/#business',
            orderIndex: 2,
            megaMenuTitle: 'Our Businesses',
            description: 'Refex – Your trusted partner in Renewable Energy, Ash & Coal Handling, Medical Imaging, Pharmaceuticals, Refrigerant gas, Venture Capital, Electric Vehicles, and Airports Retail.',
            megaMenuMediaId: businessMedia.id
        });

        const businessLinks = [
            { label: 'Refex Refrigerants', url: '/refex-refrigerants', order: 0 },
            { label: 'Refex Renewables', url: '/refex-renewables', order: 1 },
            { label: 'Refex Ash & Coal Handling', url: '/refex-ash-coal-handling', order: 2 },
            { label: 'Refex MedTech', url: '/refex-medtech', order: 3 },
            { label: 'Refex Capital', url: '/refex-capital', order: 4 }, // Col 2
            { label: 'Refex Airports and Transportation', url: '/refex-airports', order: 5 },
            { label: 'Refex Mobility', url: '/refex-mobility', order: 6 },
            { label: 'Refex Life Sciences', url: '/pharma-rl-fine-chem', order: 7 },
            { label: 'Venwind Refex', url: '/venwind-refex', order: 8 }
        ];

        for (const link of businessLinks) {
            await NavigationMenu.create({
                menuLocation: 'header',
                label: link.label,
                linkType: 'internal',
                linkUrl: link.url,
                parentId: businessMenu.id,
                orderIndex: link.order
            });
        }

        // Investments
        await NavigationMenu.create({
            menuLocation: 'header',
            label: 'Investments',
            linkType: 'internal',
            linkUrl: '/investments',
            orderIndex: 3
        });

        // ESG
        await NavigationMenu.create({
            menuLocation: 'header',
            label: 'ESG',
            linkType: 'internal',
            linkUrl: '/esg',
            orderIndex: 4
        });

        // --- 3. FOOTER NAVIGATION ---
        console.log('Seeding Footer Navigation...');

        // Column 2: BUSINESS
        const footerBusiness = await NavigationMenu.create({
            menuLocation: 'footer',
            label: 'BUSINESS',
            linkType: 'internal', // Just a header
            orderIndex: 0
        });

        for (const link of businessLinks) {
            await NavigationMenu.create({
                menuLocation: 'footer',
                label: link.label,
                linkType: 'internal',
                linkUrl: link.url,
                parentId: footerBusiness.id,
                orderIndex: link.order
            });
        }

        // Column 3: QUICK LINKS
        const footerQuick = await NavigationMenu.create({
            menuLocation: 'footer',
            label: 'QUICK LINKS',
            linkType: 'internal',
            orderIndex: 1
        });

        const quickLinks = [
            { label: 'About Refex', url: '/about-refex', order: 0 },
            { label: 'Leadership Team', url: '/about-refex#leadership', order: 1 },
            { label: 'Gallery', url: '/gallery', order: 2 },
            { label: 'ESG', url: '/esg', order: 3 },
            { label: 'Diversity & Inclusion', url: '/diversity-inclusion', order: 4 }
        ];

        for (const link of quickLinks) {
            await NavigationMenu.create({
                menuLocation: 'footer',
                label: link.label,
                linkType: 'internal',
                linkUrl: link.url,
                parentId: footerQuick.id,
                orderIndex: link.order
            });
        }

        // Column 4: Other Links (Investments, Newsroom, Careers, Contact)
        const footerOther = await NavigationMenu.create({
            menuLocation: 'footer',
            label: 'OTHER LINKS', // Hidden label effectively or used for query
            linkType: 'internal',
            orderIndex: 2
        });

        const otherLinks = [
            { label: 'INVESTMENTS', url: '/investments', order: 0 },
            { label: 'NEWSROOM', url: '/newsroom', order: 1 },
            { label: 'CAREERS', url: '/careers', order: 2 },
            { label: 'CONTACT US', url: '/contact', order: 3 }
        ];

        for (const link of otherLinks) {
            await NavigationMenu.create({
                menuLocation: 'footer',
                label: link.label,
                linkType: 'internal',
                linkUrl: link.url,
                parentId: footerOther.id,
                orderIndex: link.order
            });
        }

        // --- 4. SOCIAL LINKS ---
        if (SocialLink) {
            console.log('Seeding Social Links...');
            const socials = [
                { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/refex-group/', iconClass: 'ri-linkedin-fill' },
                { platform: 'Facebook', url: 'https://www.facebook.com/refexindustrieslimited/', iconClass: 'ri-facebook-fill' },
                { platform: 'X', url: 'https://twitter.com/GroupRefex', iconClass: 'ri-twitter-x-fill' },
                { platform: 'YouTube', url: 'https://www.youtube.com/@refexgroup', iconClass: 'ri-youtube-fill' },
                { platform: 'Instagram', url: 'https://www.instagram.com/refexgroup/', iconClass: 'ri-instagram-fill' }
            ];
            for (const s of socials) {
                await SocialLink.create(s);
            }
        }

        // --- 6. Global Settings (Copyright & Conact) ---
        if (GlobalSettings) {
            console.log('Seeding Global Settings...');
            await GlobalSettings.create({
                phone_main: '+91 96297 38734',
                email_main: 'refexcares@refex.co.in',
                copyright_text: '2024 REFEX. All right reserved.',
                social_links: {
                    linkedin: 'https://www.linkedin.com/company/refex-group/',
                    facebook: 'https://www.facebook.com/refexindustrieslimited/',
                    twitter: 'https://twitter.com/GroupRefex',
                    youtube: 'https://www.youtube.com/@refexgroup',
                    instagram: 'https://www.instagram.com/refexgroup/'
                }
            });
        }

        console.log('Seeding Complete.');
        process.exit(0);

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
}

seed();
