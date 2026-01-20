const db = require('../models');

async function updateEsgPattern() {
    console.log('Connecting to database...');
    try {
        await db.sequelize.authenticate();
        console.log('Database connection established.');

        const page = await db.Page.findOne({ where: { slug: 'esg' } });
        if (!page) {
            console.error('ESG Page not found');
            return;
        }
        console.log('Found page:', page.id);

        // Use db.Section instead of db.PageSection
        const section = await db.Section.findOne({
            where: {
                pageId: page.id, // Use pageId matching model definition
                sectionKey: 'governance'
            }
        });

        if (!section) {
            console.error('Governance section not found');
            return;
        }
        console.log('Found section:', section.id);

        // Update or create patternPositionX
        const [xContent, xCreated] = await db.SectionContent.findOrCreate({
            where: {
                sectionId: section.id, // Use sectionId
                contentKey: 'patternPositionX'
            },
            defaults: {
                contentValue: '0',
                contentType: 'text'
            }
        });

        if (!xCreated) {
            xContent.contentValue = '0';
            await xContent.save();
            console.log('Updated patternPositionX to 0');
        } else {
            console.log('Created patternPositionX = 0');
        }

        // Update or create patternPositionY
        const [yContent, yCreated] = await db.SectionContent.findOrCreate({
            where: {
                sectionId: section.id, // Use sectionId
                contentKey: 'patternPositionY'
            },
            defaults: {
                contentValue: '50',
                contentType: 'text'
            }
        });

        if (!yCreated) {
            yContent.contentValue = '50';
            await yContent.save();
            console.log('Updated patternPositionY to 50');
        } else {
            console.log('Created patternPositionY = 50');
        }

        console.log('SUCCESS: Pattern positions updated.');

    } catch (error) {
        console.error('Error updating ESG pattern:', error.message);
        if (error.original) console.error('Original error:', error.original);
    } finally {
        await db.sequelize.close();
    }
}

updateEsgPattern();
