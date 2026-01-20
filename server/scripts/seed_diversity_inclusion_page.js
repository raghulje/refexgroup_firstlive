require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent, Media } = require("../models");

async function seedDiversityInclusionPage() {
  try {
    console.log("Seeding Diversity & Inclusion page sections...");

    // Get or create diversity-inclusion page
    const diversityPage = await Page.findOrCreate({
      where: { slug: "diversity-inclusion" },
      defaults: {
        slug: "diversity-inclusion",
        title: "Diversity & Inclusion",
        status: "published",
        templateType: "diversity"
      }
    });
    const page = diversityPage[0];

    // Hero Section
    const heroSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "hero"
      },
      defaults: {
        pageId: page.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });

    // Create or find media entries
    const mediaFiles = [
      { fileName: "Diversity-inclusion-Page-Title_.jpg", filePath: "/wp-content/uploads/2023/02/Diversity-inclusion-Page-Title_.jpg", altText: "Diversity & Inclusion Hero" },
      { fileName: "Diversity-Inclusion-v2.jpg", filePath: "/assets/diversity/Diversity-Inclusion-v2.jpg", altText: "Be YOU at work" },
      { fileName: "Diversity-Bg-Women-Face.png", filePath: "/wp-content/uploads/2023/02/Diversity-Bg-Women-Face.png", altText: "Diversity Background" }
    ];

    const mediaMap = {};
    for (const mediaFile of mediaFiles) {
      const [media] = await Media.findOrCreate({
        where: { fileName: mediaFile.fileName },
        defaults: {
          fileName: mediaFile.fileName,
          filePath: mediaFile.filePath,
          fileType: "image",
          altText: mediaFile.altText
        }
      });
      mediaMap[mediaFile.fileName] = media;
    }

    const heroBackgroundMedia = mediaMap["Diversity-inclusion-Page-Title_.jpg"];
    const heroContent = [
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "Diversity & Inclusion", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "description", contentValue: "Where differences are celebrated and all voices are heard, that's our commitment to diversity and inclusion.", contentType: "text" }
    ];

    // Add background image with media relationship
    if (heroBackgroundMedia) {
      heroContent.push({
        sectionId: heroSection[0].id,
        contentKey: "backgroundImage",
        contentValue: heroBackgroundMedia.filePath,
        contentType: "text",
        mediaId: heroBackgroundMedia.id
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

    // Be You Section
    const beYouSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "be-you"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "be-you",
        orderIndex: 1,
        isActive: true
      }
    });

    const beYouImageMedia = mediaMap["Diversity-Inclusion-v2.jpg"];
    const beYouContent = [
      { sectionId: beYouSection[0].id, contentKey: "title", contentValue: "Be YOU at work", contentType: "text" },
      {
        sectionId: beYouSection[0].id, contentKey: "content", contentValue: JSON.stringify([
          "Refex provides equal and fair employment opportunities to all eligible applicants for employment across the Group companies, in compliance with all applicable laws, thereby prohibiting any form of discrimination or harassment against any applicant or employee. This includes, and is not limited to discrimination based on age, race, color, gender, national origin, religion, creed, disability, sexual orientation, ancestry, gender identity, marital status, pregnancy, citizenship status, political view or activity and/or any other ground or reason whatsoever. This is applicable to all employee actions, including but not limited to recruitment, hiring, placement, promotion, transfer, separation, compensation, benefits, training, education. Refex makes hiring decisions based solely on qualifications, merit and business requirements/needs only.",
          "At Refex, we create a work environment where all employees learn and grow in their career journey and put their maximum efforts to achieve their fullest potential. We are an equal opportunity employer and are committed to diversity and inclusion at workplace and also maintaining respect and dignity for all."
        ]), contentType: "json"
      }
    ];

    // Add image with media relationship
    if (beYouImageMedia) {
      beYouContent.push({
        sectionId: beYouSection[0].id,
        contentKey: "image",
        contentValue: beYouImageMedia.filePath,
        contentType: "text",
        mediaId: beYouImageMedia.id
      });
    }

    for (const content of beYouContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Believe Section
    const believeSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "believe"
      },
      defaults: {
        pageId: page.id,
        sectionType: "features",
        sectionKey: "believe",
        orderIndex: 2,
        isActive: true
      }
    });

    const believeContent = [
      { sectionId: believeSection[0].id, contentKey: "title", contentValue: "What we believe in!", contentType: "text" },
      {
        sectionId: believeSection[0].id, contentKey: "beliefs", contentValue: JSON.stringify([
          {
            title: "Equal Opportunities",
            description: "Providing equal employment opportunities without discrimination or bias.",
            iconPath: "/uploads/icons/diversity/equalopportunities.svg"
          },
          {
            title: "Diversity and Inclusion",
            description: "Maintaining a workplace culture that values diversity and inclusiveness.",
            iconPath: "/uploads/icons/diversity/diversityinclusion.svg"
          },
          {
            title: "Respect",
            description: "Treating all employees fairly and with respect, regardless of personal characteristics.",
            iconPath: "/uploads/icons/diversity/respect.svg"
          }
        ]), contentType: "json"
      }
    ];


    for (const content of believeContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Initiatives Section
    const initiativesSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "initiatives"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "initiatives",
        orderIndex: 3,
        isActive: true
      }
    });

    const initiativesContent = [
      { sectionId: initiativesSection[0].id, contentKey: "title", contentValue: "Initiatives at Refex Group", contentType: "text" },
      { sectionId: initiativesSection[0].id, contentKey: "description", contentValue: "We are dedicated to creating a positive impact on the lives of our employees, customers, and the communities we serve, and will continue to strive towards this goal.", contentType: "text" },
      {
        sectionId: initiativesSection[0].id, contentKey: "sliderImages", contentValue: JSON.stringify([
          "/uploads/diversity-inclusion/initiatives/Vamika-Wellness-REFEX-3.jpg",
          "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-2.jpg",
          "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-12.jpg",
          "/uploads/diversity-inclusion/initiatives/Vamika-Wellness-REFEX-4.jpg",
          "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-11.jpg"
        ]), contentType: "json"
      },
      {
        sectionId: initiativesSection[0].id, contentKey: "vamika", contentValue: JSON.stringify({
          logo: "/uploads/logos/Vamika-Logo.png",
          description: "Refex has created an internal networking forum called 'Vamika' that prioritizes the career, physical, and mental wellness support of women. The initiative emphasizes the well-being of women and aims to promote their health.",
          images: [
            "/uploads/diversity-inclusion/initiatives/Vamika-Wellness-REFEX-1.jpg",
            "/uploads/diversity-inclusion/initiatives/Vamika-Wellness-REFEX-2.jpg",
            "/uploads/diversity-inclusion/initiatives/Vamika-Wellness-REFEX-3.jpg",
            "/uploads/diversity-inclusion/initiatives/Vamika-Wellness-REFEX-4.jpg"
          ]
        }), contentType: "json"
      },
      {
        sectionId: initiativesSection[0].id, contentKey: "kravMaga", contentValue: JSON.stringify({
          logo: "/uploads/diversity-inclusion/initiatives/Kravamaga.png",
          description: "Refex has taken a proactive step towards addressing women's safety by organizing a self-defense workshop called 'Krav Maga.' The workshop, which was available to all women, aimed to equip them with the necessary skills to protect themselves.",
          images: [
            "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-1.jpg",
            "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-2.jpg",
            "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-4.jpg",
            "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-6.jpg",
            "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-7.jpg",
            "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-10.jpg",
            "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-11.jpg",
            "/uploads/diversity-inclusion/initiatives/Krav-Maga-REFEX-12.jpg"
          ]
        }), contentType: "json"
      }
    ];

    for (const content of initiativesContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // CTA Section
    const ctaSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "cta"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "cta",
        orderIndex: 4,
        isActive: true
      }
    });

    const ctaContent = [
      { sectionId: ctaSection[0].id, contentKey: "backgroundColor", contentValue: "linear-gradient(to right, #3b9dd6, #4db3e8)", contentType: "text" },
      {
        sectionId: ctaSection[0].id, contentKey: "cards", contentValue: JSON.stringify([
          {
            title: "Got a question?",
            buttonText: "Get in touch",
            buttonLink: "/contact"
          },
          {
            title: "See our latest news",
            buttonText: "Refex Newsroom",
            buttonLink: "/newsroom"
          },
          {
            title: "Work at Refex",
            buttonText: "Careers",
            buttonLink: "/careers"
          }
        ]), contentType: "json"
      }
    ];

    for (const content of ctaContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    console.log("✅ Diversity & Inclusion page seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Diversity & Inclusion page:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDiversityInclusionPage();
}

module.exports = seedDiversityInclusionPage;

