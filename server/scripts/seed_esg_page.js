const { Page, Section, SectionContent } = require("../models");

module.exports = async function seedESGPage() {
  try {
    console.log("Seeding ESG page sections...");

    // Find or create ESG page
    const [esgPage] = await Page.findOrCreate({
      where: { slug: "esg" },
      defaults: {
        title: "ESG",
        slug: "esg",
        status: "published",
        templateType: "esg"
      }
    });

    // Hero Section
    const heroSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "hero" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });

    const heroContent = [
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "ESG", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "subtitle", contentValue: "At Refex, we're constantly changing from the inside to change the world outside. Learn how our business strives to make a difference.", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "backgroundImage", contentValue: "/uploads/esg/ESG-Banner.jpg", contentType: "text" }
    ];

    for (const content of heroContent) {
      await SectionContent.findOrCreate({
        where: { sectionId: content.sectionId, contentKey: content.contentKey },
        defaults: content
      });
    }

    // Intro Section
    const introSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "intro" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "content",
        sectionKey: "intro",
        orderIndex: 1,
        isActive: true
      }
    });

    const introContent = [
      { sectionId: introSection[0].id, contentKey: "image", contentValue: "/uploads/esg/ESG-Images-REFEX-9.jpg", contentType: "text" },
      { sectionId: introSection[0].id, contentKey: "logo", contentValue: "/uploads/logos/REFEX-Logo@2x-8-1.png", contentType: "text" },
      { sectionId: introSection[0].id, contentKey: "heading", contentValue: "At Refex Group, we believe in creating a better world through sustainable business practices. We prioritize People, Planet, and Profit equally and are committed to becoming an ESG champion and carbon-neutral company.", contentType: "text" },
      { sectionId: introSection[0].id, contentKey: "description", contentValue: "By aligning with the United Nations Sustainable Development Goals, we are taking action towards a brighter future. We invite you to join hands with Refex Group in our efforts towards sustainability and make a positive impact on the world!", contentType: "text" }
    ];

    for (const content of introContent) {
      await SectionContent.findOrCreate({
        where: { sectionId: content.sectionId, contentKey: content.contentKey },
        defaults: content
      });
    }

    // Championing for Change Section
    const championingSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "championing-change" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "cta",
        sectionKey: "championing-change",
        orderIndex: 2,
        isActive: true
      }
    });

    const championingContent = [
      { sectionId: championingSection[0].id, contentKey: "title", contentValue: "Championing for Change", contentType: "text" },
      { sectionId: championingSection[0].id, contentKey: "description", contentValue: "We take our responsibility to the planet and society seriously, and we strive to be a force for good in everything we do. Our commitment to making a positive impact is reflected in our approach to corporate social responsibility, and we work tirelessly to create a better future for generations to come. Join us in our mission to make a meaningful difference in the world.", contentType: "text" },
      { sectionId: championingSection[0].id, contentKey: "backgroundColor", contentValue: "#7DC144", contentType: "text" },
      { sectionId: championingSection[0].id, contentKey: "backgroundPattern", contentValue: "/uploads/esg/ESG-dot-pattern-Small.png", contentType: "text" },
      { sectionId: championingSection[0].id, contentKey: "textColor", contentValue: "white", contentType: "text" }
    ];

    for (const content of championingContent) {
      await SectionContent.findOrCreate({
        where: { sectionId: content.sectionId, contentKey: content.contentKey },
        defaults: content
      });
    }

    // Three Pillars Section
    const pillarsSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "three-pillars" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "cards",
        sectionKey: "three-pillars",
        orderIndex: 3,
        isActive: true
      }
    });

    const pillars = [
      {
        title: "Environment",
        description: "At Refex, we're deeply committed to protecting the planet. We use eco-friendly technology, conserve precious resources, and restore ecosystems to make a positive impact. Join us in creating a better world for all!",
        image: "/uploads/esg/ESG-Images-REFEX8.jpg"
      },
      {
        title: "Health & Safety",
        description: "At Refex, safety is our #1 priority with mission zero harm. We're committed to providing a safe workplace for all, including employees, visitors, and workers, and we're proud of our perfect record with zero fatalities and disabilities!",
        image: "/uploads/esg/ESG-Images-REFEX3.jpg"
      },
      {
        title: "Corporate Social Responsibility",
        description: "We're committed to creating social value and making a positive impact in the lives of marginalized groups through our CSR activities. Our guiding principles of transparency and accountability ensure that we're making a real difference.",
        image: "/uploads/esg/CSR.jpg"
      }
    ];

    await SectionContent.findOrCreate({
      where: { sectionId: pillarsSection[0].id, contentKey: "pillars" },
      defaults: {
        sectionId: pillarsSection[0].id,
        contentKey: "pillars",
        contentValue: JSON.stringify(pillars),
        contentType: "json"
      }
    });

    // ESG Policies Section
    const policiesSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "policies" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "content",
        sectionKey: "policies",
        orderIndex: 4,
        isActive: true
      }
    });

    const policiesData = {
      heading: "ESG Policies",
      description: "Sustainable development is a core value that we take very seriously. Our management team is fully committed to this goal, and we strive to reflect this in our policies and procedures that address environmental, social, and governance aspects. We invite you to learn more about our policies by clicking on the link provided.",
      policies: [
        { title: "Quality Policy", url: "https://www.refex.group/wp-content/uploads/2023/03/Quality-Policy.pdf" },
        { title: "EHS Policy", url: "https://www.refex.group/wp-content/uploads/2023/03/EHS-Policy.pdf" },
        { title: "Sustainability Policy", url: "https://www.refex.group/wp-content/uploads/2023/03/Sustainability-ESG-Policy.pdf" },
        { title: "Grievance Policy", url: "https://www.refex.group/wp-content/uploads/2023/02/Grievance-Policy.pdf" },
        { title: "Signed ABAC Policy", url: "https://www.refex.group/wp-content/uploads/2025/06/Anti-Bribery-Anti-Corruption-ABAC-Policy.pdf" },
        { title: "Signed Supplier Vendor Code of Conduct", url: "https://www.refex.group/wp-content/uploads/2025/06/Vendor-Code-of-Conduct.pdf" }
      ]
    };

    await SectionContent.findOrCreate({
      where: { sectionId: policiesSection[0].id, contentKey: "policies" },
      defaults: {
        sectionId: policiesSection[0].id,
        contentKey: "policies",
        contentValue: JSON.stringify(policiesData),
        contentType: "json"
      }
    });

    // ESG Tabs Section
    const tabsSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "tabs" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "tabs",
        sectionKey: "tabs",
        orderIndex: 5,
        isActive: true
      }
    });

    const tabsData = [
      {
        tabId: "environment",
        title: "Environment Policies",
        description: "At Refex, we're committed to safeguarding our planet's natural resources through strategic policies and a robust environmental management system. We prioritize eco-friendly technologies in all of our operations, and constantly strive to make our businesses more sustainable. We're passionate about conserving resources, reducing carbon emissions, conserving water, and restoring ecosystems to their natural states.",
        image: "/uploads/esg/ESG-Images-REFEX2.jpg",
        items: [
          { title: "Renewable Energy", description: "Our renewable energy business aims to provide affordable solar energy to private and government agencies, and we have established our solar foothold in the Himalayas with our prestigious client BSF." },
          { title: "Waste Management & Material Circularity", description: "Refex provides eco-friendly disposal and management of coal ash for thermal power plants, establishing a robust business network of manufacturers, contractors, and abandoned mine owners to maximize recycling in an environmentally-friendly way." },
          { title: "Ecosystem Restoration and Plantation Drive", description: "We prioritize biodiversity conservation and ecosystem restoration through plantation drives, barren land rehabilitation, and agro-farming practices, initiating a visionary program \"Plant for the Future\" to plant and nurture 100,000 saplings over the next 10 years." },
          { title: "Water Stewardship", description: "We aim to be water positive by 2030 by reducing freshwater demand through recycling, rainwater harvesting, and ground recharge at our sites and facility offices, prioritizing wise and judicious use of water resources." }
        ]
      },
      {
        tabId: "health",
        title: "Health & Safety",
        description: "We're dedicated to achieving mission zero harm, prioritizing a safe workplace and the physical and mental well-being of our entire workforce. Our Occupational Health and Safety Management System (OHSMS) adheres to ISO 45001:2018, and we're proud to report zero fatalities or permanent disabilities to date.",
        image: "/uploads/esg/ESG-Images-REFEX6-e1677564183954.jpg",
        items: [
          { title: "Vamika", description: "Refex has established an internal networking forum called 'Vamika' to provide physical, mental and career wellness support to women, including safety needs addressed through self-defense workshops and a \"Wellness Work-from-Home policy\"." },
          { title: "Mental Health Awareness", description: "Refex recognizes the importance of mental health and has initiated a program of mental health awareness for its employees through regular sessions with mental wellness experts." },
          { title: "Basic Health Surveillance", description: "Refex has implemented regular basic health screening for its staff and workers engaged in high-risk activities to identify and manage workplace-related incidents caused by poor health conditions. Tests include blood pressure, blood sugar levels, eyesight, hemoglobin count, breathing difficulties, and skin diseases." },
          { title: "Safety Training", description: "Regular safety training programs and drills are conducted to ensure all employees are well-prepared to handle emergency situations and maintain a safe working environment." }
        ]
      },
      {
        tabId: "csr",
        title: "Corporate Social Responsibility",
        description: "At Refex, we believe in creating social value by giving back to the community. Our CSR activities are managed with the highest transparency, oversight, and impact assessment, focusing on four thematic areas. We strive for a sustainable business model connected with society to contribute to the underprivileged and marginalized sections.",
        image: "/uploads/esg/ESG-Images-REFEX7.jpg",
        items: [
          { title: "Water and Sanitation", description: "Providing potable water through \"Nirmal Jal\" program and maintaining water supply network." },
          { title: "Ecosystem Restoration", description: "Planting 100,000 trees, rehabilitating abandoned mines, and offering land and water for crop cultivation." },
          { title: "Child Education and Skill Training", description: "Donating refurbished laptops and providing computer literacy to local school children." },
          { title: "Primary Healthcare", description: "3i MedTech offers affordable medical diagnosis and imaging services using frugal innovation and portable technology." }
        ]
      }
    ];

    await SectionContent.findOrCreate({
      where: { sectionId: tabsSection[0].id, contentKey: "tabs" },
      defaults: {
        sectionId: tabsSection[0].id,
        contentKey: "tabs",
        contentValue: JSON.stringify(tabsData),
        contentType: "json"
      }
    });

    // Sustainability Report Section
    const reportsSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "sustainability-report" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "content",
        sectionKey: "sustainability-report",
        orderIndex: 6,
        isActive: true
      }
    });

    const reportsContent = [
      { sectionId: reportsSection[0].id, contentKey: "backgroundImage", contentValue: "/uploads/esg/ESG-Report-Bg.jpg", contentType: "text" },
      { sectionId: reportsSection[0].id, contentKey: "sustainabilityReportTitle", contentValue: "Sustainability Report", contentType: "text" },
      { sectionId: reportsSection[0].id, contentKey: "sustainabilityReportLabel", contentValue: "Refex Sustainability Report FY2023-24", contentType: "text" },
      { sectionId: reportsSection[0].id, contentKey: "sustainabilityReportUrl", contentValue: "https://www.refex.group/wp-content/uploads/2025/01/Sustainability-Report-2023-24.pdf", contentType: "text" },
      { sectionId: reportsSection[0].id, contentKey: "dashboardTitle", contentValue: "ESG Performance Dashboard", contentType: "text" },
      { sectionId: reportsSection[0].id, contentKey: "dashboardLabel", contentValue: "ESG Performance Dashboard", contentType: "text" },
      { sectionId: reportsSection[0].id, contentKey: "dashboardUrl", contentValue: "https://www.refex.group/wp-content/uploads/2025/01/ESG-Performance-Dashboard.pdf", contentType: "text" }
    ];

    for (const content of reportsContent) {
      await SectionContent.findOrCreate({
        where: { sectionId: content.sectionId, contentKey: content.contentKey },
        defaults: content
      });
    }

    // SDG Section
    const sdgSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "sdg" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "content",
        sectionKey: "sdg",
        orderIndex: 7,
        isActive: true
      }
    });

    const sdgContent = [
      { sectionId: sdgSection[0].id, contentKey: "heading", contentValue: "Sustainable Development Goals", contentType: "text" },
      { sectionId: sdgSection[0].id, contentKey: "description1", contentValue: "We're all about making the world a better place! We're committed to working with India and the UN to achieve United Nations Sustainable Development Goals, because we know that together we can make a big difference. We're not just focused on making our shareholders happy – we're all about creating value for everyone involved, including the planet!", contentType: "text" },
      { sectionId: sdgSection[0].id, contentKey: "description2", contentValue: "We're so proud to be a member of UNGC and to be working with partners around the world to make the world a better place. We're all about ethical business practices and doing our part to solve some of the biggest challenges of our time. Let's make the world a better place, together!", contentType: "text" },
      { sectionId: sdgSection[0].id, contentKey: "image", contentValue: "/uploads/esg/SDG-Image-Hero-Large1.jpeg", contentType: "text" }
    ];

    for (const content of sdgContent) {
      await SectionContent.findOrCreate({
        where: { sectionId: content.sectionId, contentKey: content.contentKey },
        defaults: content
      });
    }

    // Governance Section
    const governanceSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "governance" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "content",
        sectionKey: "governance",
        orderIndex: 8,
        isActive: true
      }
    });

    const governanceData = {
      heading: "Governance",
      description: "Our corporate governance culture is rock solid, with strong risk resilience and a value creation model that can't be beat. We're all about inclusivity, with policies and procedures that are comprehensive and robust, and we've got a monitoring and grievance mechanism that really works. Join us in our mission to make the world a better place!",
      quote: {
        text: "\"The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share.\"",
        author: "– Lady Bird Johnson."
      },
      mission: {
        title: "Our Mission",
        description: "We will strive to attain our goals by exceeding the needs & expectations of our customers with continuous improvements in quality, productivity, value creation, new product & service offerings and customer satisfaction. Refex Group is dedicated to offering highest quality products & services to our customers while achieving acceptable returns on investments."
      },
      vision: {
        title: "Our Vision",
        description: "To be the most preferred company; committed to seeking growth and prosperity by achieving a sustainable competitive share – globally; using innovative solutions, technology and a team of good people. It is our intent to develop quality partnerships with our shareholders, employees, suppliers, partners, customers and the community in which we operate."
      },
      coreValues: {
        title: "Our Core Values",
        description: "Refex's core values have always been the foundation of our guiding principles.",
        values: [
          {
            title: "Customer-centric approach",
            description: "Prioritizing the needs of customers and consistently working towards exceeding their expectations.",
            icon: "/uploads/icons/customer-centric-icon.png"
          },
          {
            title: "Exemplary leadership",
            description: "Leading by example, exhibiting the desired behaviors and setting a positive standard for others to emulate.",
            icon: "/uploads/icons/exemplary-leadership-icon.png"
          },
          {
            title: "Ethical Conduct",
            description: "Upholding the highest standards of honesty and transparency in all business dealings, and adhering to a strict code of ethics.",
            icon: "/uploads/icons/ethical-conduct-icon.png"
          },
          {
            title: "Fairness",
            description: "Practicing equality and treating all individuals and stakeholders with fairness and justice in all business dealings and decision-making processes.",
            icon: "/uploads/icons/fairness-icon.png"
          },
          {
            title: "Excellence",
            description: "A continuous effort to attain the highest level of quality and proficiency in every sphere of business activities.",
            icon: "/uploads/icons/excellence-icon.png"
          }
        ]
      }
    };

    await SectionContent.findOrCreate({
      where: { sectionId: governanceSection[0].id, contentKey: "governance" },
      defaults: {
        sectionId: governanceSection[0].id,
        contentKey: "governance",
        contentValue: JSON.stringify(governanceData),
        contentType: "json"
      }
    });

    // CTA Section
    const ctaSection = await Section.findOrCreate({
      where: { pageId: esgPage.id, sectionKey: "cta" },
      defaults: {
        pageId: esgPage.id,
        sectionType: "cta",
        sectionKey: "cta",
        orderIndex: 9,
        isActive: true
      }
    });

    const ctaData = [
      { title: "Got a question?", buttonText: "Get in touch", link: "/contact" },
      { title: "See our latest news", buttonText: "Refex Newsroom", link: "/newsroom" },
      { title: "Work at Refex", buttonText: "Careers", link: "/careers" }
    ];

    await SectionContent.findOrCreate({
      where: { sectionId: ctaSection[0].id, contentKey: "cta" },
      defaults: {
        sectionId: ctaSection[0].id,
        contentKey: "cta",
        contentValue: JSON.stringify(ctaData),
        contentType: "json"
      }
    });

    console.log("✅ ESG page seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding ESG page:", error);
    throw error;
  }
};
