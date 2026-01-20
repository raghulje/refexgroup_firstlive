const { Page, Section, SectionContent } = require("../models");

module.exports = async function seedBusinessPages3() {
  try {
    console.log("Seeding business pages (Part 3)...");

    // ============================================
    // 6. REFEX AIRPORTS PAGE
    // ============================================
    const airportsPage = await Page.findOrCreate({
      where: { slug: "refex-airports" },
      defaults: {
        slug: "refex-airports",
        title: "Refex Airports and Transportation",
        status: "published",
        templateType: "business"
      }
    });
    const airports = airportsPage[0];

    // Hero Section
    const airportsHero = await Section.findOrCreate({
      where: { pageId: airports.id, sectionKey: "hero" },
      defaults: {
        pageId: airports.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: airportsHero[0].id, contentKey: "logo", contentValue: "/uploads/logos/Refex-Airports-Logo-W.png", contentType: "text" },
      { sectionId: airportsHero[0].id, contentKey: "title", contentValue: "Transforming Travel with Superior Retail Experiences.", contentType: "text" },
      { sectionId: airportsHero[0].id, contentKey: "description", contentValue: "Elevate your travel with our retail revolution. Refex Airports brings you the best in shopping, from global brands to unique finds, making every trip more than just a journey.", contentType: "text" },
      { sectionId: airportsHero[0].id, contentKey: "heroImage", contentValue: "/uploads/business/refex-airports/hero/Refex-Airports-Hero.png", contentType: "text" }
    ], { ignoreDuplicates: true });

    // About Us Section
    const airportsAbout = await Section.findOrCreate({
      where: { pageId: airports.id, sectionKey: "about" },
      defaults: {
        pageId: airports.id,
        sectionType: "content",
        sectionKey: "about",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: airportsAbout[0].id, contentKey: "label", contentValue: "About Us", contentType: "text" },
      { sectionId: airportsAbout[0].id, contentKey: "title", contentValue: "Revolutionizing retail experiences in air travel, Refex Airports brings a new dimension to your journey.", contentType: "text" },
      { sectionId: airportsAbout[0].id, contentKey: "description", contentValue: "Refex Airports, at the forefront of transport innovation, is dedicated to revolutionizing the consumer journey across airports, railways, and more. We champion delightful travel experiences, operational excellence, and robust partnerships, underpinned by our core values: initiative, progress, unity, and transparency. Join us in redefining global travel.", contentType: "text" },
      { sectionId: airportsAbout[0].id, contentKey: "image", contentValue: "/uploads/business/refex-airports/about/airport-terminal-Large-1024x683.jpeg", contentType: "text" },
      { sectionId: airportsAbout[0].id, contentKey: "imageCaption", contentValue: "Premier Retail Concessions at Pune and Srinagar Airports", contentType: "text" }
    ], { ignoreDuplicates: true });

    // For Retail Partners Section
    const airportsRetail = await Section.findOrCreate({
      where: { pageId: airports.id, sectionKey: "retail-partners" },
      defaults: {
        pageId: airports.id,
        sectionType: "features",
        sectionKey: "retail-partners",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: airportsRetail[0].id, contentKey: "title", contentValue: "For Retail Partners", contentType: "text" },
      { sectionId: airportsRetail[0].id, contentKey: "description", contentValue: "Experience a new era of airport retail with Refex Airports. Our unique approach combines the latest in retail innovation with a deep understanding of traveler needs, setting new standards in your journey's retail experience.", contentType: "text" },
      { sectionId: airportsRetail[0].id, contentKey: "image", contentValue: "/uploads/general/Refex-Airport-Retail-1.png", contentType: "text" },
      { sectionId: airportsRetail[0].id, contentKey: "features", contentValue: JSON.stringify([
        {
          icon: "ri-user-settings-line",
          title: "Dedicated Onsite Management",
          description: "Experience seamless operations with our dedicated Refex staff, prioritizing your success and bringing expertise to every detail of your retail venture."
        },
        {
          icon: "ri-vip-crown-line",
          title: "Exclusive Elegance in Retail",
          description: "Elevate your brand with an exclusive collection, making your offerings an integral part of passengers' premium journey."
        },
        {
          icon: "ri-line-chart-line",
          title: "Optimal Investment Returns",
          description: "Maximize returns with our strategically placed, high-traffic retail spaces designed for optimal profitability and investment efficiency."
        },
        {
          icon: "ri-lightbulb-flash-line",
          title: "Brand Brilliance on Display",
          description: "Illuminate your brand globally, enjoying unparalleled visibility that captivates diverse travelers. Join us, and let your brand shine."
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Refex Retail Advantage Section
    const airportsAdvantage = await Section.findOrCreate({
      where: { pageId: airports.id, sectionKey: "retail-advantage" },
      defaults: {
        pageId: airports.id,
        sectionType: "content",
        sectionKey: "retail-advantage",
        orderIndex: 3,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: airportsAdvantage[0].id, contentKey: "title", contentValue: "Discover the Refex Retail Advantage", contentType: "text" },
      { sectionId: airportsAdvantage[0].id, contentKey: "description", contentValue: "Redefine retail excellence with streamlined operations, a rich variety of stores, and a customer-centric approach for an unmatched shopping journey.", contentType: "text" },
      { sectionId: airportsAdvantage[0].id, contentKey: "image", contentValue: "/uploads/general/Refex-Advantage-1.jpg", contentType: "text" },
      { sectionId: airportsAdvantage[0].id, contentKey: "features", contentValue: JSON.stringify([
        "Diverse Store Options",
        "Seamless Business Operations",
        "Strategic Layout for Visibility",
        "Exciting Shopping Experience"
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Transportation Enhancement Section
    const airportsTransport = await Section.findOrCreate({
      where: { pageId: airports.id, sectionKey: "transportation-enhancement" },
      defaults: {
        pageId: airports.id,
        sectionType: "content",
        sectionKey: "transportation-enhancement",
        orderIndex: 4,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: airportsTransport[0].id, contentKey: "title", contentValue: "Comprehensive Transportation Enhancement Initiatives", contentType: "text" },
      { sectionId: airportsTransport[0].id, contentKey: "description", contentValue: "Enhance consumer journeys across transportation platforms (airports, railways, metro systems, bus stations, heliports). Currently managing end-to-end design, finance, operation, and maintenance of Pune Airport outlets (May 2023) and Srinagar Airport (Oct 2023).", contentType: "text" },
      { sectionId: airportsTransport[0].id, contentKey: "image", contentValue: "/uploads/business/refex-airports/hero/Refex-Airports-Landing-Page-Hero-1.png", contentType: "text" },
      { sectionId: airportsTransport[0].id, contentKey: "features", contentValue: JSON.stringify([
        { title: "Holistic Transportation Solutions", icon: "ri-plane-line" },
        { title: "Airport Retail Management Expertise", icon: "ri-store-3-line" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Tech Integration Section
    const airportsTech = await Section.findOrCreate({
      where: { pageId: airports.id, sectionKey: "tech-integration" },
      defaults: {
        pageId: airports.id,
        sectionType: "content",
        sectionKey: "tech-integration",
        orderIndex: 5,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: airportsTech[0].id, contentKey: "title", contentValue: "Elevating Airport Retail Experience with Seamless Tech Integration", contentType: "text" },
      { sectionId: airportsTech[0].id, contentKey: "description", contentValue: "Our commitment to enhancing customer experiences at airports extends to providing a future-forward, seamless retail and shopping journey for air travelers. Leveraging advanced technology, including the convenient pick-up of gifts and shopping items directly from our outlets, we ensure a modern and efficient shopping experience.", contentType: "text" },
      { sectionId: airportsTech[0].id, contentKey: "image", contentValue: "/uploads/business/refex-airports/hero/Refex-Airports-Landing-Page-Hero-2.png", contentType: "text" },
      { sectionId: airportsTech[0].id, contentKey: "features", contentValue: JSON.stringify([
        { title: "Customer-Centric Retail Enhancement", icon: "ri-customer-service-2-line" },
        { title: "Seamless Tech-Driven Shopping Experience", icon: "ri-smartphone-line" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // CTA Section
    const airportsCTA = await Section.findOrCreate({
      where: { pageId: airports.id, sectionKey: "cta" },
      defaults: {
        pageId: airports.id,
        sectionType: "cta",
        sectionKey: "cta",
        orderIndex: 6,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: airportsCTA[0].id, contentKey: "title", contentValue: "Revolutionizing Airport Retail", contentType: "text" },
      { sectionId: airportsCTA[0].id, contentKey: "description", contentValue: "Discover how Refex Airports is pioneering a new era of retail in the airport environment, blending convenience with luxury.", contentType: "text" },
      { sectionId: airportsCTA[0].id, contentKey: "buttonText", contentValue: "Visit Website", contentType: "text" },
      { sectionId: airportsCTA[0].id, contentKey: "buttonLink", contentValue: "https://refexairports.com/", contentType: "text" }
    ], { ignoreDuplicates: true });

    // ============================================
    // 7. REFEX MOBILITY PAGE
    // ============================================
    const mobilityPage = await Page.findOrCreate({
      where: { slug: "refex-mobility" },
      defaults: {
        slug: "refex-mobility",
        title: "Refex Mobility",
        status: "published",
        templateType: "business"
      }
    });
    const mobility = mobilityPage[0];

    // Hero Section
    const mobilityHero = await Section.findOrCreate({
      where: { pageId: mobility.id, sectionKey: "hero" },
      defaults: {
        pageId: mobility.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: mobilityHero[0].id, contentKey: "title", contentValue: "Refex Mobility: Where reliability meets responsibility!", contentType: "text" },
      { sectionId: mobilityHero[0].id, contentKey: "description", contentValue: "Our cleaner-fuelled 4-wheeler fleet is transforming the way you commute, making every journey clean, safe and on time.", contentType: "text" },
      { sectionId: mobilityHero[0].id, contentKey: "image", contentValue: "/uploads/general/top-banner-img.png", contentType: "text" }
    ], { ignoreDuplicates: true });

    // About Section
    const mobilityAbout = await Section.findOrCreate({
      where: { pageId: mobility.id, sectionKey: "about" },
      defaults: {
        pageId: mobility.id,
        sectionType: "content",
        sectionKey: "about",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: mobilityAbout[0].id, contentKey: "label", contentValue: "About Us", contentType: "text" },
      { sectionId: mobilityAbout[0].id, contentKey: "title", contentValue: "Most Trusted, Sustainable Mobility Partner in India", contentType: "text" },
      { sectionId: mobilityAbout[0].id, contentKey: "description", contentValue: JSON.stringify([
        "Experience Refex Mobility, a hub of innovation and sustainability in India's mobility landscape. As the flagship venture of Refex Green Mobility Limited, we're dedicated to revolutionizing urban commuting. Under the esteemed Refex Group, a recognized leader and Great Place To Work certified organization, Refex Mobility pioneers India's sustainable mobility revolution.",
        "We provide exceptional commuting solutions with a 100% cleaner-fuelled fleet. Our commitment extends to a comprehensive charging infrastructure and dedicated charging hub in the cities we operate."
      ]), contentType: "json" },
      { sectionId: mobilityAbout[0].id, contentKey: "image", contentValue: "/uploads/general/reliable.png", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Solutions Section
    const mobilitySolutions = await Section.findOrCreate({
      where: { pageId: mobility.id, sectionKey: "solutions" },
      defaults: {
        pageId: mobility.id,
        sectionType: "content",
        sectionKey: "solutions",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: mobilitySolutions[0].id, contentKey: "title", contentValue: "Refex Mobility Solutions", contentType: "text" },
      { sectionId: mobilitySolutions[0].id, contentKey: "solutions", contentValue: JSON.stringify([
        {
          title: "Employee Transportation",
          description: "Offering efficient, reliable, and customizable employee transportation services tailored to your organization's unique needs. With professional, verified drivers and well-maintained, clean vehicles, we ensure a safe and seamless daily commute. Trusted by leading corporate enterprises, we help businesses transition to tech-enabled, sustainable mobility solutions aligned with their ESG and carbon reduction goals.",
          images: [
            "/uploads/general/Integrated-Electric-Fleet-Solutions01.jpg",
            "/uploads/general/Integrated-Electric-Fleet-Solutions-02.jpg"
          ]
        },
        {
          title: "Corporate Airport Transfers",
          description: "We provide premium and punctual pre-booked airport pick-up and drop-off services for corporate clients, ensuring a seamless travel experience from and to the airport 24/7. Our commitment to safety and timeliness makes us the preferred choice for airport transfers. Corporates can conveniently book airport rides through the Refex Mobility app and Website for a hassle-free experience.",
          images: [
            "/uploads/general/Integrated-Electric-Fleet-Solutions-03.jpg"
          ]
        },
        {
          title: "On-call / On-demand Rides",
          description: "We offer flexible and customizable rental packages for corporates and events designed to meet varying distance and time requirements. Choose from options such as 4hr/40km, 8hr/80km, or 10hr/100km, with the ability to tailor services based on your specific needs.",
          images: [
            "/uploads/general/Integrated-Electric-Fleet-Solutions01.jpg"
          ]
        }
      ]), contentType: "json" },
      { sectionId: mobilitySolutions[0].id, contentKey: "availableCities", contentValue: "Chennai | Bengaluru | Mumbai | Hyderabad | Delhi", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Advantages Section
    const mobilityAdvantages = await Section.findOrCreate({
      where: { pageId: mobility.id, sectionKey: "advantages" },
      defaults: {
        pageId: mobility.id,
        sectionType: "features",
        sectionKey: "advantages",
        orderIndex: 3,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: mobilityAdvantages[0].id, contentKey: "title", contentValue: "Strategic Advantages of Electric Fleets", contentType: "text" },
      { sectionId: mobilityAdvantages[0].id, contentKey: "description", contentValue: "Explore the multifaceted benefits of integrating electric fleets into your corporate strategy and witness the transformative impact on your bottom line, environmental stewardship, and brand reputation. Discover the strategic advantages that position your business at the forefront of sustainable innovation.", contentType: "text" },
      { sectionId: mobilityAdvantages[0].id, contentKey: "images", contentValue: JSON.stringify([
        "/uploads/general/Strategic-Advantages-of-Electric-Fleets-1.jpg",
        "/uploads/general/Strategic-Advantages-of-Electric-Fleets-2.jpg",
        "/uploads/general/eWheelz-CTA-image-e1704363936888-1-scaled.jpg"
      ]), contentType: "json" },
      { sectionId: mobilityAdvantages[0].id, contentKey: "advantages", contentValue: JSON.stringify([
        {
          icon: "ri-money-dollar-circle-line",
          title: "Cost-Effective EV Solutions",
          description: "EVs have lower operating costs than traditional gasoline-powered vehicles, which can result in significant savings for corporations."
        },
        {
          icon: "ri-earth-line",
          title: "Eco-Revolutionary Fleet Choices",
          description: "By adopting electric fleets, companies can demonstrate their commitment to environmental responsibility & social sustainability, improving their reputation & brand image."
        },
        {
          icon: "ri-leaf-line",
          title: "Emission-Free EV Journeys",
          description: "EVs emit less greenhouse gas and other pollutants than traditional vehicles, helping companies to reduce their carbon footprint and meet sustainability goals."
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Electric Fleet Section
    const mobilityFleet = await Section.findOrCreate({
      where: { pageId: mobility.id, sectionKey: "electric-fleet" },
      defaults: {
        pageId: mobility.id,
        sectionType: "content",
        sectionKey: "electric-fleet",
        orderIndex: 4,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: mobilityFleet[0].id, contentKey: "title", contentValue: "Electric Fleet Solutions", contentType: "text" },
      { sectionId: mobilityFleet[0].id, contentKey: "description", contentValue: "Integrated electric fleet solutions with charging infrastructure", contentType: "text" }
    ], { ignoreDuplicates: true });

    console.log("✅ Business pages (Airports, Mobility) seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding business pages (Part 3):", error);
    throw error;
  }
};

