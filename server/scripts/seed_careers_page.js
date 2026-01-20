require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent, Job, Testimonial, Media } = require("../models");

async function seedCareersPage() {
  try {
    console.log("Seeding Careers page sections...");

    // Get or create careers page
    const careersPage = await Page.findOrCreate({
      where: { slug: "careers" },
      defaults: {
        slug: "careers",
        title: "Careers",
        status: "published",
        templateType: "careers"
      }
    });
    const page = careersPage[0];

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
      { fileName: "People-Group-Careers.jpg", filePath: "/wp-content/uploads/2023/02/People-Group-Careers.jpg", altText: "Careers Hero" },
      { fileName: "Careers-Gallery-1-e1677566533601.png", filePath: "/wp-content/uploads/2023/02/Careers-Gallery-1-e1677566533601.png", altText: "Life as Refexian" },
      { fileName: "Nurturing-Talent.png", filePath: "/wp-content/uploads/2023/03/Nurturing-Talent.png", altText: "Nurturing Talent" },
      { fileName: "Culture-Inclusion.png", filePath: "/wp-content/uploads/2023/03/Culture-Inclusion.png", altText: "Culture & Inclusion" },
      { fileName: "Center-of-Excellence.png", filePath: "/wp-content/uploads/2023/03/Center-of-Excellence.png", altText: "Center of Excellence" },
      { fileName: "Careers-bg-2.jpg", filePath: "/wp-content/uploads/2023/03/Careers-bg-2.jpg", altText: "Application Form Background" }
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

    const heroBackgroundMedia = mediaMap["People-Group-Careers.jpg"];
    const heroContent = [
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "Careers", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "description", contentValue: "Join Our Team and Make an Impact: Discover Your Next Career Opportunity at Refex Group", contentType: "text" }
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

    // Main Content Section
    const mainContentSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "main-content"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "main-content",
        orderIndex: 1,
        isActive: true
      }
    });

    const mainContent = [
      { sectionId: mainContentSection[0].id, contentKey: "title", contentValue: "Refex fosters a supportive and welcoming community for all.", contentType: "text" },
      { sectionId: mainContentSection[0].id, contentKey: "paragraph1", contentValue: "Refex is dedicated to creating a workplace where employees can expand their skills and reach their full potential. We believe in equality and value diversity, fostering a respectful and inclusive environment for all employees.", contentType: "text" },
      { sectionId: mainContentSection[0].id, contentKey: "paragraph2", contentValue: "At Refex Group, we are proud of the diverse and talented team of professionals who make our company a leading business conglomerate. Our employees come from a wide range of backgrounds and bring unique perspectives to the table, allowing us to continue to innovate and excel in our various business sectors including refrigerant gas, renewables, venture capital, power trading, thermal – ash and coal handling, thermal – power generation and health care.", contentType: "text" }
    ];

    for (const content of mainContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Video Section
    const videoSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "video"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "video",
        orderIndex: 2,
        isActive: true
      }
    });

    const videoContent = [
      { sectionId: videoSection[0].id, contentKey: "videoUrl", contentValue: "https://www.youtube.com/embed/Exp79B_pL9I", contentType: "text" }
    ];

    for (const content of videoContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Life as Refexian Section
    const refexianSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "life-refexian"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "life-refexian",
        orderIndex: 3,
        isActive: true
      }
    });

    const refexianImageMedia = mediaMap["Careers-Gallery-1-e1677566533601.png"];
    const refexianContent = [
      { sectionId: refexianSection[0].id, contentKey: "title", contentValue: "Life as A #Refexian", contentType: "text" },
      { sectionId: refexianSection[0].id, contentKey: "description", contentValue: "We're Nurturing Diversity, Embracing Inclusion, Igniting Passion, and Fostering Growth.", contentType: "text" }
    ];

    // Add image with media relationship
    if (refexianImageMedia) {
      refexianContent.push({
        sectionId: refexianSection[0].id,
        contentKey: "image",
        contentValue: refexianImageMedia.filePath,
        contentType: "text",
        mediaId: refexianImageMedia.id
      });
    }

    for (const content of refexianContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Why Choose Refex Section
    const whyChooseSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "why-choose"
      },
      defaults: {
        pageId: page.id,
        sectionType: "features",
        sectionKey: "why-choose",
        orderIndex: 4,
        isActive: true
      }
    });

    const whyChooseContent = [
      { sectionId: whyChooseSection[0].id, contentKey: "title", contentValue: "Why choose Refex?", contentType: "text" },
      { sectionId: whyChooseSection[0].id, contentKey: "features", contentValue: JSON.stringify([
        {
          icon: mediaMap["Nurturing-Talent.png"]?.filePath || "/wp-content/uploads/2023/03/Nurturing-Talent.png",
          title: "Nurturing Talent",
          description: "Harnessing the power of potential, our extensive training program is dedicated to identifying and nurturing talent to reach new heights."
        },
        {
          icon: mediaMap["Culture-Inclusion.png"]?.filePath || "/wp-content/uploads/2023/03/Culture-Inclusion.png",
          title: "Culture & Inclusion",
          description: "Working towards creating a workplace where everyone feels valued and has equal opportunities for success."
        },
        {
          icon: mediaMap["Center-of-Excellence.png"]?.filePath || "/wp-content/uploads/2023/03/Center-of-Excellence.png",
          title: "Center of Excellence",
          description: "Investing in the growth and development of our employees to drive long-term success for both individuals and the company."
        }
      ]), contentType: "json" }
    ];

    for (const content of whyChooseContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Application Form Section
    const formSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "application-form"
      },
      defaults: {
        pageId: page.id,
        sectionType: "form",
        sectionKey: "application-form",
        orderIndex: 5,
        isActive: true
      }
    });

    const formBackgroundMedia = mediaMap["Careers-bg-2.jpg"];
    const formContent = [
      { sectionId: formSection[0].id, contentKey: "title", contentValue: "Make a Difference", contentType: "text" },
      { sectionId: formSection[0].id, contentKey: "subtitle", contentValue: "Shape Your Future with Refex", contentType: "text" },
      { sectionId: formSection[0].id, contentKey: "formTitle", contentValue: "Apply now", contentType: "text" }
    ];

    // Add background image with media relationship
    if (formBackgroundMedia) {
      formContent.push({
        sectionId: formSection[0].id,
        contentKey: "backgroundImage",
        contentValue: formBackgroundMedia.filePath,
        contentType: "text",
        mediaId: formBackgroundMedia.id
      });
    }

    for (const content of formContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Employee Testimonials Section
    const testimonialsSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "testimonials"
      },
      defaults: {
        pageId: page.id,
        sectionType: "testimonials",
        sectionKey: "testimonials",
        orderIndex: 6,
        isActive: true
      }
    });

    const testimonialsContent = [
      { sectionId: testimonialsSection[0].id, contentKey: "title", contentValue: "What our employees say about us", contentType: "text" },
      { sectionId: testimonialsSection[0].id, contentKey: "paragraph1", contentValue: "At Refex we value employee input and foster a supportive work environment where open communication is encouraged. We believe our employees' perspectives drive company success. It's a privilege to be part of a company that values its team.", contentType: "text" },
      { sectionId: testimonialsSection[0].id, contentKey: "paragraph2", contentValue: "At Refex, ESOP isn't just a financial benefit; it's a catalyst for life-changing milestones. For many Refexians, it has helped close long-term loans, support children's education, and even secure land for future homes. These stories reflect our belief in shared growth and the power of true ownership.", contentType: "text" },
      { sectionId: testimonialsSection[0].id, contentKey: "paragraph3", contentValue: "Hear from Refexians as they share their ESOP journeys…", contentType: "text" }
    ];

    for (const content of testimonialsContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Seed Employee Testimonials
    const testimonials = [
      {
        authorName: "Lalitha Uthay",
        authorPosition: "CEO Refrigerants",
        quote: "For 19 years, I've proudly worked for Refex, a wonderful company. They prioritize safety, security, and career progression, offer challenging opportunities and leadership support. Despite facing challenges growing up, I've grown professionally with Refex, managing an entire business, including a team of 30, with an ideal work-life balance as a woman.",
        authorImageId: null,
        orderIndex: 0,
        isActive: true
      },
      {
        authorName: "Rajeev Vaze",
        authorPosition: "Head – Supply Chain Management",
        quote: "Refex Group has been an exhilarating experience for me over the last three years. Despite the nationwide lockdown, the Group's Managing Director and CEO extended unwavering support and empathy. The company's values of respect for each individual are reflected in our diverse team united in vision, mission, and goals. As Head of Supply Chain, I am proud to represent Refex and build lasting relationships with our suppliers as we expand into new markets.",
        authorImageId: null,
        orderIndex: 1,
        isActive: true
      },
      {
        authorName: "Saranya Sakthivel",
        authorPosition: "Deputy Manager – HR",
        quote: "My 6-year journey with Refex Group has been incredible. I started as an HR recruiter on a contract and now hold the position of Deputy Manager. The team, leadership, and company culture are all outstanding, and I've been provided with many opportunities to shine. Working with Refex is like being part of a family.",
        authorImageId: null,
        orderIndex: 2,
        isActive: true
      }
    ];

    for (const testimonialData of testimonials) {
      await Testimonial.findOrCreate({
        where: {
          authorName: testimonialData.authorName,
          authorPosition: testimonialData.authorPosition
        },
        defaults: testimonialData
      });
    }

    // Know More Section
    const knowMoreSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "know-more"
      },
      defaults: {
        pageId: page.id,
        sectionType: "cta",
        sectionKey: "know-more",
        orderIndex: 7,
        isActive: true
      }
    });

    const knowMoreContent = [
      { sectionId: knowMoreSection[0].id, contentKey: "title", contentValue: "Want to know more about Refex?", contentType: "text" },
      { sectionId: knowMoreSection[0].id, contentKey: "buttonText", contentValue: "Go to About Refex", contentType: "text" },
      { sectionId: knowMoreSection[0].id, contentKey: "buttonLink", contentValue: "/about-refex", contentType: "text" }
    ];

    for (const content of knowMoreContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Testimonial Slider Images Section
    const testimonialSliderSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "testimonial-slider"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "testimonial-slider",
        orderIndex: 8,
        isActive: true
      }
    });

    const testimonialSliderContent = [
      { sectionId: testimonialSliderSection[0].id, contentKey: "images", contentValue: JSON.stringify([
        "/careers/esops/careers1.png",
        "/careers/esops/careers2.png",
        "/careers/esops/careers3.png",
        "/careers/esops/careers4.png"
      ]), contentType: "json" }
    ];

    for (const content of testimonialSliderContent) {
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
        orderIndex: 9,
        isActive: true
      }
    });

    const ctaContent = [
      { sectionId: ctaSection[0].id, contentKey: "backgroundColor", contentValue: "linear-gradient(to right, #3b9dd6, #4db3e8)", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "cards", contentValue: JSON.stringify([
        {
          title: "Got a question?",
          buttonText: "Get in touch",
          buttonLink: "/contact"
        },
        {
          title: "See our latest news",
          buttonText: "Refex Newsroom",
          buttonLink: "/newsroom"
        }
      ]), contentType: "json" }
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

    console.log("✅ Careers page seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Careers page:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedCareersPage();
}

module.exports = seedCareersPage;

