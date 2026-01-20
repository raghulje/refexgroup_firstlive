const { sequelize, HomeVideoSection, HomeCareersSection, Media } = require('../models');

async function seed() {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();

        // --- VIDEO SECTION ---
        console.log('Seeding Video Section...');
        await HomeVideoSection.findOrCreate({
            where: { id: 1 },
            defaults: {
                videoUrl: 'https://www.youtube.com/embed/MCl9yK2HWo8',
                title: 'Refex Group Corporate Video',
                description: 'Watch our corporate video to learn more about our journey and vision.'
            }
        });

        // --- CAREERS SECTION ---
        console.log('Seeding Careers Section...');
        const careerImg = 'REFEX_home_career-BG.jpg';

        const [media] = await Media.findOrCreate({
            where: { fileName: careerImg },
            defaults: {
                fileName: careerImg,
                filePath: `/uploads/images/${careerImg}`,
                fileType: 'image'
            }
        });

        await HomeCareersSection.findOrCreate({
            where: { id: 1 },
            defaults: {
                tagline: 'Join Refex',
                title: 'Resilient by <span class="text-[#ff6b35]">Nature.</span><br />Robust by <span class="text-[#ff6b35]">People.</span>',
                description: 'Refex prioritizes inclusivity, encouraging employee growth and learning opportunities in a diverse and welcoming work environment.',
                primaryButtonText: 'Explore careers at Refex',
                primaryButtonLink: '/careers',
                secondaryButtonText: 'Diversity at Refex',
                secondaryButtonLink: '/about-refex',
                imageId: media.id
            }
        });

        console.log('Success!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seed();
