const { sequelize, HeroSlide, HomeAboutSection, BusinessCard, Award, NewsroomItem, HomeCTASection } = require('../models');

async function verify() {
    try {
        await sequelize.authenticate();
        const slides = await HeroSlide.count();
        const about = await HomeAboutSection.count();
        const businesses = await BusinessCard.count();
        const awards = await Award.count();
        const news = await NewsroomItem.count();
        const ctas = await HomeCTASection.count();

        console.log(`Slides: ${slides} (Expected: 6)`);
        console.log(`About: ${about} (Expected: 1)`);
        console.log(`Businesses: ${businesses} (Expected: 9)`);
        console.log(`Awards: ${awards} (Expected: 17)`);
        console.log(`News/Events: ${news} (Expected: 14)`); // 12 press + 2 events
        console.log(`CTAs: ${ctas} (Expected: 3)`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
verify();
