const { Page, Section, SectionContent } = require("../models");

module.exports = async function seedBusinessPages2() {
  try {
    console.log("Seeding business pages (Part 2)...");

    // ============================================
    // 4. REFEX MEDTECH PAGE
    // ============================================
    const medtechPage = await Page.findOrCreate({
      where: { slug: "refex-medtech" },
      defaults: {
        slug: "refex-medtech",
        title: "Refex MedTech",
        status: "published",
        templateType: "business"
      }
    });
    const medtech = medtechPage[0];

    // Hero Section
    const medtechHero = await Section.findOrCreate({
      where: { pageId: medtech.id, sectionKey: "hero" },
      defaults: {
        pageId: medtech.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: medtechHero[0].id, contentKey: "title", contentValue: "Refex MedTech", contentType: "text" },
      { sectionId: medtechHero[0].id, contentKey: "description", contentValue: "We are an esteemed player in the medical devices industry with a core competency in the manufacturing of sophisticated diagnostic imaging equipment solutions, such as the first 'Made in India' MRI: Anamaya & Flat Panel Detector (FPD), ultra portable X-ray system: MINI 90, Digital Radiography and C-arms. We pledge to bring \"Affordable Luxury\" to our products & solutions to serve our customers with advanced technology with lower life cycle costs without compromising on performance, quality, reliability & patient safety.", contentType: "text" },
      { sectionId: medtechHero[0].id, contentKey: "image", contentValue: "/uploads/business/refex-medtech/hero/medtech-images-new.png", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Associate Companies Section
    const medtechAssociates = await Section.findOrCreate({
      where: { pageId: medtech.id, sectionKey: "associate-companies" },
      defaults: {
        pageId: medtech.id,
        sectionType: "content",
        sectionKey: "associate-companies",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: medtechAssociates[0].id, contentKey: "title", contentValue: "Exploring Innovative Healthcare Solutions with Our Associate Companies.", contentType: "text" },
      { sectionId: medtechAssociates[0].id, contentKey: "companies", contentValue: JSON.stringify([
        { 
          name: "3i MedTech", 
          logo: "/uploads/logos/3i-MedTech-new-Logo-e1679395253850-858x1024.png",
          description: "3i MedTech offers affordable diagnostic imaging solutions including X-rays, C-Arms, Mammography, pre-owned MRI and more, with a focus on reliability and global standards."
        },
        { 
          name: "Adonis", 
          logo: "/uploads/logos/Adonis-logo-1024x666.png",
          description: "ADONIS provides quality medical imaging solutions with ergonomically designed machines utilizing the latest image processing techniques to the medical fraternity at affordable costs."
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Stats Section
    const medtechStats = await Section.findOrCreate({
      where: { pageId: medtech.id, sectionKey: "stats" },
      defaults: {
        pageId: medtech.id,
        sectionType: "stats",
        sectionKey: "stats",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: medtechStats[0].id, contentKey: "stats", contentValue: JSON.stringify([
        { value: "30", suffix: "+", label: "Years of experience" },
        { value: "3", label: "Manufacturing and R&D facilities" },
        { value: "8000", suffix: "+", label: "Installations" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Commitment Section
    const medtechCommitment = await Section.findOrCreate({
      where: { pageId: medtech.id, sectionKey: "commitment" },
      defaults: {
        pageId: medtech.id,
        sectionType: "content",
        sectionKey: "commitment",
        orderIndex: 3,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: medtechCommitment[0].id, contentKey: "label", contentValue: "our commitment", contentType: "text" },
      { sectionId: medtechCommitment[0].id, contentKey: "title", contentValue: "Redefining Healthcare Through Innovation", contentType: "text" },
      { sectionId: medtechCommitment[0].id, contentKey: "commitments", contentValue: JSON.stringify([
        {
          icon: "💎",
          title: "Affordable Diagnostic Excellence",
          description: "Delivering world-class medical technology at accessible prices"
        },
        {
          icon: "🔬",
          title: "Comprehensive Imaging Solutions",
          description: "Providing end-to-end solutions for optimal patient care"
        },
        {
          icon: "🤝",
          title: "Unwavering Service Support",
          description: "Committed to customer satisfaction through exceptional service"
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Specialities Section
    const medtechSpecialities = await Section.findOrCreate({
      where: { pageId: medtech.id, sectionKey: "specialities" },
      defaults: {
        pageId: medtech.id,
        sectionType: "features",
        sectionKey: "specialities",
        orderIndex: 4,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: medtechSpecialities[0].id, contentKey: "label", contentValue: "Our Specialities", contentType: "text" },
      { sectionId: medtechSpecialities[0].id, contentKey: "description", contentValue: "Our expertise spans across various healthcare consulting services, providing medical professionals with innovative solutions for precision, efficiency, and reliability.", contentType: "text" },
      { sectionId: medtechSpecialities[0].id, contentKey: "image", contentValue: "/uploads/general/our-specialities.avif", contentType: "text" },
      { sectionId: medtechSpecialities[0].id, contentKey: "specialities", contentValue: JSON.stringify([
        { icon: "ri-heart-pulse-line", name: "Radiology" },
        { icon: "ri-capsule-line", name: "Urology" },
        { icon: "ri-brain-line", name: "Neurology" },
        { icon: "ri-bone-line", name: "Orthopedic" },
        { icon: "ri-stethoscope-line", name: "Gastroenterology" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Products Section
    const medtechProducts = await Section.findOrCreate({
      where: { pageId: medtech.id, sectionKey: "products" },
      defaults: {
        pageId: medtech.id,
        sectionType: "products",
        sectionKey: "products",
        orderIndex: 5,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: medtechProducts[0].id, contentKey: "title", contentValue: "Extensive product portfolio", contentType: "text" },
      { sectionId: medtechProducts[0].id, contentKey: "description", contentValue: "Our product range encompasses X-ray systems, digital radiography solutions, C-Arms, dedicated to improving healthcare accessibility and quality. Our strategic focus on Tier 2 and Tier 3 markets ensures that healthcare facilities in every corner of the country benefit from our advanced technology.", contentType: "text" },
      { sectionId: medtechProducts[0].id, contentKey: "products", contentValue: JSON.stringify([
        {
          title: "MINI 90",
          subtitle: "Ultra-portable hand-held digital X-ray system",
          features: [
            "Lightweight and compact design: Weighing<4 kg",
            "Best in class: up to 90 kV ,10 mA for precise and high resolution",
            "SID tracker",
            "7 inch LED smart screen",
            "Dose display",
            "Leak proof adjustable collimator",
            "Skin guard leaves",
            "Temperature and shock sensor",
            "Versatile uses in clinical settings",
            "Cutting-edge AI powered diagnostics"
          ]
        },
        {
          title: "Flat Panel Detector",
          subtitle: "Applications for X-ray and Fluoroscopy",
          features: [
            "New generation Flat Panel Detector",
            "17 x 17 and 14 x 17 inches",
            "Wired and wireless CSI Technology",
            "High DQE for excellent image quality",
            "Durable and robust-handle up to 150 kg of distributed load",
            "Unprecedented weight of 3 kg",
            "Advanced software technology for easy Deployment"
          ]
        },
        {
          title: "Anamaya 1.5T MRI",
          subtitle: "The country's first completely Made-in-India MRI, 1.5T superconductive MRI",
          features: [
            "96% acoustic noise reduction",
            "50% power savings and energy efficiency",
            "Radar technology and Smart analytics",
            "High-Precision Signal Correction technology",
            "Superior magnet technology"
          ]
        },
        {
          title: "Floor mounted DR",
          subtitle: "Digital Display for switching ON/OFF and Selection of kV/ mA/ mAs",
          features: [
            "Advanced Display for Bucky selection, Focal point selection, Exposure.",
            "APR Based Control for all body parts",
            "Microprocessor control tube for overload protection",
            "Automatic voltage compensation",
            "Self-Diagnostic program with Error code."
          ]
        },
        {
          title: "Ceiling mounted DR",
          subtitle: "Digital Display for switching ON/OFF and Selection of kV/ mA/ mAs",
          features: [
            "Advanced Display for Bucky selection, Focal point selection, Exposure.",
            "APR Based Control for all body parts",
            "Microprocessor control tube for overload protection",
            "Automatic voltage compensation",
            "Self-Diagnostic program with Error code."
          ]
        },
        {
          title: "Image Display Monitors",
          subtitle: "",
          features: [
            "Accurate visualization with high resolution, brightness and contrast ratio from any angle.",
            "Ergonomic design for enhanced comfort, speed and immersion.",
            "Optimized image quality with uniform luminance and long term consistency.",
            "Multi monitor setup and multi-modal compatibility."
          ]
        },
        {
          title: "X-ray film digitizer",
          subtitle: "",
          features: [
            "Easy to scan all sizes of X-ray films",
            "High quality mammography scan",
            "Scan time- 8 secs for 14 x17 film",
            "Support data format- DCM, BMP, JPEG, DICOM",
            "Slim data size (max 3.3MB /200dpi)",
            "One-click scans with auto-sizing",
            "Brightness control for each X-ray film",
            "Various support for PACS viewer"
          ]
        },
        {
          title: "Myrian",
          subtitle: "An advanced, fully orchestrated visualization solution",
          features: [
            "Smart layout",
            "Quick patient throughput",
            "Multi modality",
            "Patient lifeline",
            "Dedicated tools by modality",
            "Seamless communication"
          ]
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Certifications Section
    const medtechCert = await Section.findOrCreate({
      where: { pageId: medtech.id, sectionKey: "certifications" },
      defaults: {
        pageId: medtech.id,
        sectionType: "content",
        sectionKey: "certifications",
        orderIndex: 6,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: medtechCert[0].id, contentKey: "title", contentValue: "Certifications", contentType: "text" },
      { sectionId: medtechCert[0].id, contentKey: "certifications", contentValue: JSON.stringify([
        { image: "/uploads/general/images.jpg", title: "AERB" },
        { image: "/uploads/general/1536257006-9131.jpg-removebg-preview.png", title: "CDSCO" },
        { image: "/uploads/general/bis-certification-services.jpg", title: "BIS" },
        { image: "/uploads/general/b136d1c0df779785_400x400ar.jpg", title: "ISO 13485" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Clientele Section
    const medtechClientele = await Section.findOrCreate({
      where: { pageId: medtech.id, sectionKey: "clientele" },
      defaults: {
        pageId: medtech.id,
        sectionType: "content",
        sectionKey: "clientele",
        orderIndex: 7,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: medtechClientele[0].id, contentKey: "title", contentValue: "Clientele", contentType: "text" },
      { sectionId: medtechClientele[0].id, contentKey: "clientLogos", contentValue: JSON.stringify([
        "/uploads/logos/logo01.jpg",
        "/uploads/logos/logo02.jpg",
        "/uploads/logos/logo03.jpg",
        "/uploads/logos/logo04.jpg",
        "/uploads/logos/logo05.jpg",
        "/uploads/logos/logo06.jpg",
        "/uploads/logos/logo07.jpg",
        "/uploads/logos/logo08.jpg",
        "/uploads/logos/logo09.jpg",
        "/uploads/logos/logo10.jpg",
        "/uploads/logos/logo11.jpg",
        "/uploads/logos/logo12.jpg",
        "/uploads/logos/logo13.jpg",
        "/uploads/logos/logo14.jpg",
        "/uploads/logos/logo15.jpg",
        "/uploads/logos/logo16.jpg",
        "/uploads/logos/logo17.jpg",
        "/uploads/logos/logo18.jpg",
        "/uploads/logos/logo19.jpg",
        "/uploads/logos/logo20.jpg",
        "/uploads/logos/logo21.jpg",
        "/uploads/logos/logo22.jpg",
        "/uploads/logos/logo23.jpg",
        "/uploads/logos/logo24.jpg"
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // ============================================
    // 5. REFEX CAPITAL PAGE
    // ============================================
    const capitalPage = await Page.findOrCreate({
      where: { slug: "refex-capital" },
      defaults: {
        slug: "refex-capital",
        title: "Refex Capital",
        status: "published",
        templateType: "business"
      }
    });
    const capital = capitalPage[0];

    // Hero Section
    const capitalHero = await Section.findOrCreate({
      where: { pageId: capital.id, sectionKey: "hero" },
      defaults: {
        pageId: capital.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: capitalHero[0].id, contentKey: "label", contentValue: "WE ADD", contentType: "text" },
      { sectionId: capitalHero[0].id, contentKey: "title", contentValue: "GRIT AND GUMPTION TO YOUR GREAT IDEAS", contentType: "text" },
      { sectionId: capitalHero[0].id, contentKey: "subtitle", contentValue: "Empowering Visionaries", contentType: "text" },
      { sectionId: capitalHero[0].id, contentKey: "description", contentValue: "When dreamers and doers get together, clever ideas turn into revolutionary businesses.", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Stats Section
    const capitalStats = await Section.findOrCreate({
      where: { pageId: capital.id, sectionKey: "stats" },
      defaults: {
        pageId: capital.id,
        sectionType: "stats",
        sectionKey: "stats",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: capitalStats[0].id, contentKey: "stats", contentValue: JSON.stringify([
        { value: "26", label: "Investee Companies" },
        { value: "3", label: "Exits" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Know About Us Section
    const capitalAbout = await Section.findOrCreate({
      where: { pageId: capital.id, sectionKey: "about" },
      defaults: {
        pageId: capital.id,
        sectionType: "content",
        sectionKey: "about",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: capitalAbout[0].id, contentKey: "title", contentValue: "Know About Us", contentType: "text" },
      { sectionId: capitalAbout[0].id, contentKey: "description", contentValue: "At Refex Capital Fund, we believe in the potential of India to become a leading technology powerhouse in the near future. This conviction drives us to search for visionary entrepreneurs who are harnessing technology to create innovative products and services, disrupt the status quo, and forge new markets. Join us in our mission to support the next tech giant in India.", contentType: "text" },
      { sectionId: capitalAbout[0].id, contentKey: "logo", contentValue: "/uploads/logos/REFEX-Logo@2x-8-1.png", contentType: "text" },
      { sectionId: capitalAbout[0].id, contentKey: "image", contentValue: "/uploads/business/refex-capital/about/REFEX-Capital-About--768x525.jpg", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Areas of Interest Section
    const capitalAreas = await Section.findOrCreate({
      where: { pageId: capital.id, sectionKey: "areas-of-interest" },
      defaults: {
        pageId: capital.id,
        sectionType: "features",
        sectionKey: "areas-of-interest",
        orderIndex: 3,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: capitalAreas[0].id, contentKey: "title", contentValue: "OUR AREAS OF INTEREST", contentType: "text" },
      { sectionId: capitalAreas[0].id, contentKey: "description", contentValue: "We focus on investing in disruptive start-ups in the fields of AI, HealthTech, CleanTech, and Consumer sectors with the aim of advancing technology and defining the future.", contentType: "text" },
      { sectionId: capitalAreas[0].id, contentKey: "backgroundImage", contentValue: "/uploads/business/refex-capital/Capital-Areas-BG-1.jpg", contentType: "text" },
      { sectionId: capitalAreas[0].id, contentKey: "areas", contentValue: JSON.stringify([
        { name: "HealthTech", icon: "ri-heart-pulse-line" },
        { name: "ConsumerTech", icon: "ri-shopping-cart-line" },
        { name: "CleanTech", icon: "ri-leaf-line" },
        { name: "EnterpriseTech", icon: "ri-building-line" },
        { name: "FinTech", icon: "ri-money-dollar-circle-line" },
        { name: "DeepTech", icon: "ri-cpu-line" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // What We Look For Section
    const capitalLookFor = await Section.findOrCreate({
      where: { pageId: capital.id, sectionKey: "what-we-look-for" },
      defaults: {
        pageId: capital.id,
        sectionType: "content",
        sectionKey: "what-we-look-for",
        orderIndex: 4,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: capitalLookFor[0].id, contentKey: "title", contentValue: "What we look for?", contentType: "text" },
      { sectionId: capitalLookFor[0].id, contentKey: "description", contentValue: "Our mission is to provide funding for Indian startups that are developing innovative products or services for the domestic market and have the potential to expand globally. We are particularly interested in companies that have a sustainable competitive advantage over the long term and a clear path to profitability.", contentType: "text" },
      { sectionId: capitalLookFor[0].id, contentKey: "subtitle", contentValue: "When evaluating a startup, we look for the following key factors:", contentType: "text" },
      { sectionId: capitalLookFor[0].id, contentKey: "factors", contentValue: JSON.stringify([
        {
          icon: "/uploads/icons/Attractive.svg",
          title: "Attractiveness of opportunity & addressable market"
        },
        {
          icon: "/uploads/icons/Team-Capital.svg",
          title: "Team with passion, perseverance, relevant experience"
        },
        {
          icon: "/uploads/icons/Use-of-Tech.svg",
          title: "Use of technology to create an economic moat"
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Portfolio Section
    const capitalPortfolio = await Section.findOrCreate({
      where: { pageId: capital.id, sectionKey: "portfolio" },
      defaults: {
        pageId: capital.id,
        sectionType: "content",
        sectionKey: "portfolio",
        orderIndex: 5,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: capitalPortfolio[0].id, contentKey: "title", contentValue: "Our Portfolio", contentType: "text" },
      { sectionId: capitalPortfolio[0].id, contentKey: "subtitle", contentValue: "We give start-ups an unfair advantage", contentType: "text" },
      { sectionId: capitalPortfolio[0].id, contentKey: "portfolioLogos", contentValue: JSON.stringify([
        "/uploads/general/Artwally.png",
        "/uploads/general/BLU.png",
        "/uploads/general/chalo.png",
        "/uploads/general/DR.png",
        "/uploads/general/Easy-policy.png",
        "/uploads/general/Fab-heads.png",
        "/uploads/general/FIB-SOL.png",
        "/uploads/general/Happy-EMI.png",
        "/uploads/general/i-love-Diamonds.png",
        "/uploads/general/Intugine.png",
        "/uploads/general/Kyvor.png",
        "/uploads/general/Mentis.png",
        "/uploads/general/Munoth-industries-LTD.png",
        "/uploads/general/N.png",
        "/uploads/general/NanOlife.png",
        "/uploads/general/ORBO.png",
        "/uploads/general/Ovenfresh.png",
        "/uploads/general/Race-coffee.png",
        "/uploads/general/S3V.png",
        "/uploads/general/Sun-telematics.png",
        "/uploads/general/Toch.png",
        "/uploads/general/Tomaganetics.png",
        "/uploads/general/Trillbit.png",
        "/uploads/general/Venrank.png",
        "/uploads/general/Wassup.png",
        "/uploads/general/Zenlth.png"
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // CTA Section
    const capitalCTA = await Section.findOrCreate({
      where: { pageId: capital.id, sectionKey: "cta" },
      defaults: {
        pageId: capital.id,
        sectionType: "cta",
        sectionKey: "cta",
        orderIndex: 6,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: capitalCTA[0].id, contentKey: "title", contentValue: "Want to know more about how Refex Capital can help your business succeed?", contentType: "text" },
      { sectionId: capitalCTA[0].id, contentKey: "buttonText", contentValue: "Visit Website", contentType: "text" },
      { sectionId: capitalCTA[0].id, contentKey: "buttonLink", contentValue: "https://refexcapital.com/", contentType: "text" }
    ], { ignoreDuplicates: true });

    console.log("✅ Business pages (MedTech, Capital) seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding business pages (Part 2):", error);
    throw error;
  }
};

