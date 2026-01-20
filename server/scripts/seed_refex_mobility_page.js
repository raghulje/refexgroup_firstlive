require('dotenv').config();
const db = require('../models');
const { Page, Section, SectionContent, Media } = require('../models');

async function seedRefexMobilityPage() {
  try {
    console.log('Seeding Refex Mobility page sections...');

    // Get or create refex-mobility page
    const [page] = await Page.findOrCreate({
      where: { slug: 'refex-mobility' },
      defaults: {
        slug: 'refex-mobility',
        title: 'Refex Mobility',
        status: 'published',
        templateType: 'business-vertical'
      }
    });

    // Media entries based on frontend assets
    const mediaFiles = [
      {
        fileName: 'mobility-banner.png',
        filePath: '/assets/heroes/mobility-banner.png',
        altText: 'Refex Mobility Hero Banner'
      },
      {
        fileName: 'reliable.png',
        filePath: '/assets/business/mobility/reliable.png',
        altText: 'Reliable Electric Vehicle'
      },
      {
        fileName: 'solutions-01.jpg',
        filePath: '/assets/business/mobility/solutions-01.jpg',
        altText: 'Employee Transportation'
      },
      {
        fileName: 'solutions-02.jpg',
        filePath: '/assets/business/mobility/solutions-02.jpg',
        altText: 'Corporate Airport Transfers'
      },
      {
        fileName: 'solutions-03.jpg',
        filePath: '/assets/business/mobility/solutions-03.jpg',
        altText: 'On-demand Rides'
      },
      {
        fileName: 'why-opt.png',
        filePath: '/assets/business/mobility/why-opt.png',
        altText: 'Why Opt for Refex Mobility'
      },
      {
        fileName: 'fleet-advantage-1.jpg',
        filePath: '/assets/business/mobility/fleet-advantage-1.jpg',
        altText: 'EV Charging Stations'
      },
      {
        fileName: 'fleet-advantage-2.jpg',
        filePath: '/assets/business/mobility/fleet-advantage-2.jpg',
        altText: 'Wall Charger'
      },
      {
        fileName: 'ewheelz-cta.jpg',
        filePath: '/assets/business/mobility/ewheelz-cta.jpg',
        altText: 'Electric Fleet with Plane'
      },
      {
        fileName: 'cta-bg.jpg',
        filePath: '/assets/business/mobility/cta-bg.jpg',
        altText: 'Mobility CTA Background'
      }
    ];

    const mediaMap = {};
    for (const mediaFile of mediaFiles) {
      const [media] = await Media.findOrCreate({
        where: { fileName: mediaFile.fileName },
        defaults: {
          fileName: mediaFile.fileName,
          filePath: mediaFile.filePath,
          fileType: 'image',
          altText: mediaFile.altText
        }
      });
      mediaMap[mediaFile.fileName] = media;
    }

    //
    // HERO SECTION
    //
    console.log('Seeding Hero section...');
    const [heroSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'hero'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'hero',
        orderIndex: 0,
        isActive: true
      }
    });

    const heroBg = mediaMap['mobility-banner.png'];

    const heroContent = [
      {
        sectionId: heroSection.id,
        contentKey: 'titleHighlight',
        contentValue: 'Refex Mobility:',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'titleMain',
        contentValue: 'Where reliability meets responsibility!',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'description',
        contentValue:
          'Our cleaner-fuelled 4-wheeler fleet is transforming the way you commute, making every journey clean, safe and on time.',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'buttonText',
        contentValue: 'Discover More',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'buttonLink',
        contentValue: '/contact',
        contentType: 'text'
      }
    ];

    if (heroBg) {
      heroContent.push({
        sectionId: heroSection.id,
        contentKey: 'image',
        contentValue: heroBg.filePath,
        contentType: 'text',
        mediaId: heroBg.id
      });
    }

    for (const content of heroContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Hero section seeded');

    //
    // ABOUT SECTION
    //
    console.log('Seeding About section...');
    const [aboutSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'about'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'about',
        orderIndex: 1,
        isActive: true
      }
    });

    const aboutImage = mediaMap['reliable.png'];

    const aboutContent = [
      {
        sectionId: aboutSection.id,
        contentKey: 'badge',
        contentValue: 'About Us',
        contentType: 'text'
      },
      {
        sectionId: aboutSection.id,
        contentKey: 'heading',
        contentValue: 'Most Trusted, Sustainable Mobility Partner in India',
        contentType: 'text'
      },
      {
        sectionId: aboutSection.id,
        contentKey: 'paragraphs',
        contentValue: JSON.stringify([
          'Experience Refex Mobility, a hub of innovation and sustainability in India\'s mobility landscape. As the flagship venture of Refex Green Mobility Limited, we\'re dedicated to revolutionizing urban commuting. Under the esteemed Refex Group, a recognized leader and Great Place To Work certified organization, Refex Mobility pioneers India\'s sustainable mobility revolution.',
          'We provide exceptional commuting solutions with a 100% cleaner-fuelled fleet. Our commitment extends to a comprehensive charging infrastructure and dedicated charging hub in the cities we operate.'
        ]),
        contentType: 'json'
      },
      {
        sectionId: aboutSection.id,
        contentKey: 'buttonText',
        contentValue: 'Explore our Solutions',
        contentType: 'text'
      },
      {
        sectionId: aboutSection.id,
        contentKey: 'buttonLink',
        contentValue: '#solutions',
        contentType: 'text'
      }
    ];

    if (aboutImage) {
      aboutContent.push({
        sectionId: aboutSection.id,
        contentKey: 'image',
        contentValue: aboutImage.filePath,
        contentType: 'text',
        mediaId: aboutImage.id
      });
    }

    for (const content of aboutContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ About section seeded');

    //
    // SOLUTIONS SECTION
    //
    console.log('Seeding Solutions section...');
    const [solutionsSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'solutions'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'solutions',
        orderIndex: 2,
        isActive: true
      }
    });

    const solutions1 = mediaMap['solutions-01.jpg'];
    const solutions2 = mediaMap['solutions-02.jpg'];
    const solutions3 = mediaMap['solutions-03.jpg'];

    const solutionsContent = [
      {
        sectionId: solutionsSection.id,
        contentKey: 'title',
        contentValue: 'Refex Mobility Solutions',
        contentType: 'text'
      },
      {
        sectionId: solutionsSection.id,
        contentKey: 'solutions',
        contentValue: JSON.stringify([
          {
            key: 'employee-transportation',
            title: 'Employee Transportation',
            description:
              'Offering efficient, reliable, and customizable employee transportation services tailored to your organization\'s unique needs. With professional, verified drivers and well-maintained, clean vehicles, we ensure a safe and seamless daily commute. Trusted by leading corporate enterprises, we help businesses transition to tech-enabled, sustainable mobility solutions aligned with their ESG and carbon reduction goals.',
            image: solutions1 ? solutions1.filePath : '/assets/business/mobility/solutions-01.jpg'
          },
          {
            key: 'corporate-airport-transfers',
            title: 'Corporate Airport Transfers',
            description:
              'We provide premium and punctual pre-booked airport pick-up and drop-off services for corporate clients, ensuring a seamless travel experience from and to the airport 24/7. Our commitment to safety and timeliness makes us the preferred choice for airport transfers.\n\nCorporates can conveniently book airport rides through the Refex Mobility app and Website for a hassle-free experience.',
            image: solutions2 ? solutions2.filePath : '/assets/business/mobility/solutions-02.jpg'
          },
          {
            key: 'on-demand-rides',
            title: 'On-call / On-demand Rides',
            description:
              'We offer flexible and customizable rental packages for corporates and events designed to meet varying distance and time requirements. Choose from options such as 4hr/40km, 8hr/80km, or 10hr/100km, with the ability to tailor services based on your specific needs.\n\nLOCAL RIDES | AIRPORT RIDES',
            image: solutions3 ? solutions3.filePath : '/assets/business/mobility/solutions-03.jpg'
          }
        ]),
        contentType: 'json'
      },
      {
        sectionId: solutionsSection.id,
        contentKey: 'citiesTitle',
        contentValue: 'Available In Major Cities',
        contentType: 'text'
      },
      {
        sectionId: solutionsSection.id,
        contentKey: 'cities',
        contentValue: 'Chennai | Bengaluru | Mumbai | Hyderabad | Delhi',
        contentType: 'text'
      }
    ];

    for (const content of solutionsContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Solutions section seeded');

    //
    // ADVANTAGES SECTION
    //
    console.log('Seeding Advantages section...');
    const [advantagesSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'advantages'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'advantages',
        orderIndex: 3,
        isActive: true
      }
    });

    const whyOptImage = mediaMap['why-opt.png'];

    const advantagesContent = [
      {
        sectionId: advantagesSection.id,
        contentKey: 'heading',
        contentValue: 'Why Opt for Refex Mobility?',
        contentType: 'text'
      },
      {
        sectionId: advantagesSection.id,
        contentKey: 'description',
        contentValue:
          'At Refex Mobility, we\'re not just offering transportation solutions; we\'re inviting you to be a part of a movement that\'s reshaping the way we move. Elevate your journey with us and experience a future where sustainability meets innovation at every turn.',
        contentType: 'text'
      },
      {
        sectionId: advantagesSection.id,
        contentKey: 'leftCards',
        contentValue: JSON.stringify([
          {
            title: 'Sustainability Redefined',
            description:
              'Immerse your business in a commitment to sustainability, significantly reducing your carbon footprint with our electric fleet.'
          },
          {
            title: 'Complete In-house Fleet',
            description:
              'Trust in the reliability of our services with a 100% company-owned fleet of 1400+ cars ensuring consistency and quality in every ride.'
          }
        ]),
        contentType: 'json'
      },
      {
        sectionId: advantagesSection.id,
        contentKey: 'rightCards',
        contentValue: JSON.stringify([
          {
            title: 'Exclusive Fleet Ownership',
            description:
              'Trust in the reliability of our services with a 100% company-owned electric vehicle fleet, ensuring consistency and quality in every ride.'
          },
          {
            title: 'Tech-Backed Fleet Management',
            description:
              'Experience transparency at every level with our technology-integrated fleet management, providing real-time insights and control to our valued clients.'
          },
          {
            title: 'Transparent Fleet Management',
            description:
              'Experience transparency at every level with our technology-integrated fleet management, providing real-time insights and control to our valued clients.'
          },
          {
            title: 'Dedicated Hubs & Charging Infrastructure',
            description:
              'Our strategically located hubs and 400+ charging points across major metro cities, ensure high fleet uptime, quick turnarounds, and seamless operations without disruption.'
          },
          {
            title: 'Centralized Command Center',
            description:
              'Efficiency is at the heart of our operations with a centralized vehicle command and control center, ensuring swift responses and streamlined operations 24x7.'
          }
        ]),
        contentType: 'json'
      }
    ];

    if (whyOptImage) {
      advantagesContent.push({
        sectionId: advantagesSection.id,
        contentKey: 'image',
        contentValue: whyOptImage.filePath,
        contentType: 'text',
        mediaId: whyOptImage.id
      });
    }

    for (const content of advantagesContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Advantages section seeded');

    //
    // ELECTRIC FLEET SECTION
    //
    console.log('Seeding Electric Fleet section...');
    const [fleetSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'electric-fleet'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'electric-fleet',
        orderIndex: 4,
        isActive: true
      }
    });

    const fleetImg1 = mediaMap['fleet-advantage-1.jpg'];
    const fleetImg2 = mediaMap['fleet-advantage-2.jpg'];
    const fleetBottom = mediaMap['ewheelz-cta.jpg'];

    const fleetContent = [
      {
        sectionId: fleetSection.id,
        contentKey: 'heading',
        contentValue: 'Strategic Advantages of Electric Fleets',
        contentType: 'text'
      },
      {
        sectionId: fleetSection.id,
        contentKey: 'description',
        contentValue:
          'Explore the multifaceted benefits of integrating electric fleets into your corporate strategy and witness the transformative impact on your bottom line, environmental stewardship, and brand reputation. Discover the strategic advantages that position your business at the forefront of sustainable innovation.',
        contentType: 'text'
      },
      {
        sectionId: fleetSection.id,
        contentKey: 'advantages',
        contentValue: JSON.stringify([
          {
            title: 'Cost-Effective EV Solutions',
            description:
              'EVs have lower operating costs than traditional gasoline-powered vehicles, which can result in significant savings for corporations.'
          },
          {
            title: 'Eco-Revolutionary Fleet Choices',
            description:
              'By adopting electric fleets, companies can demonstrate their commitment to environmental responsibility & social sustainability, improving their reputation & brand image.'
          },
          {
            title: 'Emission-Free EV Journeys',
            description:
              'EVs emit less greenhouse gas and other pollutants than traditional vehicles, helping companies to reduce their carbon footprint and meet sustainability goals.'
          }
        ]),
        contentType: 'json'
      }
    ];

    if (fleetImg1) {
      fleetContent.push({
        sectionId: fleetSection.id,
        contentKey: 'image1',
        contentValue: fleetImg1.filePath,
        contentType: 'text',
        mediaId: fleetImg1.id
      });
    }

    if (fleetImg2) {
      fleetContent.push({
        sectionId: fleetSection.id,
        contentKey: 'image2',
        contentValue: fleetImg2.filePath,
        contentType: 'text',
        mediaId: fleetImg2.id
      });
    }

    if (fleetBottom) {
      fleetContent.push({
        sectionId: fleetSection.id,
        contentKey: 'imageBottom',
        contentValue: fleetBottom.filePath,
        contentType: 'text',
        mediaId: fleetBottom.id
      });
    }

    for (const content of fleetContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Electric Fleet section seeded');

    //
    // CTA SECTION
    //
    console.log('Seeding CTA section...');
    const [ctaSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'cta'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'cta',
        orderIndex: 5,
        isActive: true
      }
    });

    const ctaBg = mediaMap['cta-bg.jpg'];

    const ctaContent = [
      {
        sectionId: ctaSection.id,
        contentKey: 'title',
        contentValue: 'Sustainable Mobility Redefined',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'paragraphs',
        contentValue: JSON.stringify([
          'With Refex Mobility, embrace a new standard in urban commuting. Our cleaner-fuelled vehicles, from comfortable sedans to premium SUVs, are tailored for corporate needs with efficiency and environmental responsibility.',
          'By choosing us, your business not only optimizes costs but also actively accelerates our collective journey toward a carbon-neutral India.'
        ]),
        contentType: 'json'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'buttonText',
        contentValue: 'Visit Website',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'buttonLink',
        contentValue: 'https://refexmobility.com/',
        contentType: 'text'
      }
    ];

    if (ctaBg) {
      ctaContent.push({
        sectionId: ctaSection.id,
        contentKey: 'backgroundImage',
        contentValue: ctaBg.filePath,
        contentType: 'text',
        mediaId: ctaBg.id
      });
    }

    for (const content of ctaContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ CTA section seeded');

    console.log('✅ Refex Mobility page seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Refex Mobility page:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  db.sequelize
    .sync()
    .then(() => {
      seedRefexMobilityPage();
    })
    .catch(err => {
      console.error('Error syncing database:', err);
      process.exit(1);
    });
}

module.exports = seedRefexMobilityPage;


