/* eslint-disable no-await-in-loop */
const { sequelize, NewsroomItem, HomeCTASection, Media } = require('../models');

async function seedAdditionalHome() {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();

        // --- NEWSROOM ITEMS ---
        console.log('Seeding Newsroom Items...');
        // Press Releases
        const press = [
            { title: 'Dinesh Agarwal, CEO of Refex Group, on ET Now', date: '2025-11-11', source: 'ET NOW', link: 'https://www.youtube.com/watch?v=vyiEp-hzhqU', img: 'newsroom-thumbnail-video.jpg' },
            { title: 'Refex reports PBT at 30 crore in Q1 FY24', date: '2023-08-04', source: 'The Times of India', link: 'https://timesofindia.indiatimes.com/city/chennai/refex-reports-pbt-at-30-crore-in-q1-fy24/articleshow/102408182.cms?from=mdr', img: 'f083fd9c51a4b154ca0967ca2ad3b996.jpeg' },
            { title: 'Refex Mobility expands operations to Delhi NCR', date: '2025-11-11', source: 'ET AUTO', link: 'https://auto.economictimes.indiatimes.com/news/aftermarket/refex-eveelz-rebrands-as-refex-mobility-to-consolidate-focus-on-existing-tier-1-market/123237339', img: '2675d7edc8e086e4c4be378eba93a660.jpeg' },
            { title: 'Refex eVeelz rebrands as Refex Mobility; to consolidate focus on existing Tier-1 market', date: '2025-03-27', source: 'ANI', link: 'https://www.aninews.in/news/business/refex-group-is-the-official-sponsor-of-chennai-super-kings20250327190124/', img: 'd674bfc0dcb4ffb4355d91b67e0eb3b3.jpeg' },
            { title: 'Refex Group is the Official Sponsor of Chennai Super Kings', date: '2025-03-11', source: 'The Hindu', link: 'https://www.thehindu.com/sci-tech/technology/uber-partners-with-chennai-based-refex-green-mobility-to-deploy-1000-evs-across-cities/article69316319.ece', img: 'press-release02.jpg' },
            { title: 'Refex Group Strengthens Leadership in Sustainability at UNGCNI Annual Convention 2025', date: '2025-02-15', source: 'ANI', link: 'https://www.aninews.in/news/business/refex-group-strengthens-leadership-in-sustainability-at-ungcni-annual-convention-202520250215101613/', img: 'press-release04.jpg' },
            { title: 'Refex Group wins Excellence in Sustainability Award 2024', date: '2024-12-15', source: 'Economic Times', link: '#', img: 'press-release02.jpg' },
            { title: 'Refex expands green mobility operations to 5 new cities', date: '2024-11-28', source: 'The Hindu', link: '#', img: 'Refex-Mobility-expands.jpg' },
            { title: 'Refex Industries reports 45% growth in Q3 revenue', date: '2024-11-10', source: 'Financial Express', link: '#', img: 'press-release04.jpg' },
            { title: 'Refex Group launches new renewable energy initiative', date: '2024-10-22', source: 'Business Today', link: '#', img: '2675d7edc8e086e4c4be378eba93a660.jpeg' },
            { title: 'Refex partners with government for clean energy project', date: '2024-09-18', source: 'Times of India', link: '#', img: 'd674bfc0dcb4ffb4355d91b67e0eb3b3.jpeg' },
            { title: 'Refex Industries achieves carbon neutrality milestone', date: '2024-08-30', source: 'Mint', link: '#', img: 'press-release02.jpg' }
        ];

        for (const p of press) {
            const [media] = await Media.findOrCreate({
                where: { fileName: p.img },
                defaults: { fileName: p.img, filePath: `/uploads/images/${p.img}`, fileType: 'image' }
            });

            await NewsroomItem.findOrCreate({
                where: { title: p.title },
                defaults: {
                    type: 'press',
                    publishedAt: p.date,
                    category: p.source, // Storing source in category for now or create a source field? The frontend displays it where category is for events. For press it maps source.
                    link: p.link,
                    featuredImageId: media.id,
                    isFeatured: true
                }
            });
        }

        // Events
        const events = [
            { title: "Refex Gheun Tak – A Women's Ultimate Frisbee Tournament", date: '2023-01-25', source: 'Times of India', cat: 'Frisbee Tournament', link: 'https://businessnewsthisweek.com/business/team-meraki-wins-refex-gheun-tak-a-womens-ultimate-frisbee-tournament/', img: 'Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg' },
            { title: 'Refex Group Road Safety Awareness event', date: '2023-01-11', source: 'Events', cat: 'Awareness event', link: 'https://navjeevanexpress.com/csr-initiative-refex-group-kick-starts-road-safety-campaign-on-anna-salai-in-chennai/', img: 'Refex-Group-Road-Safety-Awareness-event.jpg' }
        ];

        for (const e of events) {
            const [media] = await Media.findOrCreate({
                where: { fileName: e.img },
                defaults: { fileName: e.img, filePath: `/uploads/images/${e.img}`, fileType: 'image' }
            });

            await NewsroomItem.findOrCreate({
                where: { title: e.title },
                defaults: {
                    type: 'event',
                    publishedAt: e.date,
                    category: e.cat, // "Frisbee Tournament"
                    excerpt: e.source, // Using excerpt for source if needed or just part of title
                    link: e.link,
                    featuredImageId: media.id,
                    isFeatured: true
                }
            });
        }

        // --- CTA SECTION ---
        console.log('Seeding CTA Section...');
        const ctas = [
            { title: 'Got a question?', linkText: 'Get in touch', linkUrl: '/contact' },
            { title: 'See our latest news', linkText: 'Refex Newsroom', linkUrl: '/newsroom' },
            { title: 'Work at Refex', linkText: 'Careers', linkUrl: '/careers' }
        ];

        for (let i = 0; i < ctas.length; i++) {
            await HomeCTASection.findOrCreate({
                where: { title: ctas[i].title },
                defaults: {
                    linkText: ctas[i].linkText,
                    linkUrl: ctas[i].linkUrl,
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

seedAdditionalHome();
