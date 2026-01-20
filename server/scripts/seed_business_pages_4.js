const { Page, Section, SectionContent } = require("../models");

module.exports = async function seedBusinessPages4() {
  try {
    console.log("Seeding business pages (Part 4)...");

    // ============================================
    // 8. PHARMA RL FINE CHEM PAGE
    // ============================================
    const pharmaPage = await Page.findOrCreate({
      where: { slug: "pharma-rl-fine-chem" },
      defaults: {
        slug: "pharma-rl-fine-chem",
        title: "Pharma | RL Fine Chem",
        status: "published",
        templateType: "business"
      }
    });
    const pharma = pharmaPage[0];

    // Hero Section
    const pharmaHero = await Section.findOrCreate({
      where: { pageId: pharma.id, sectionKey: "hero" },
      defaults: {
        pageId: pharma.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: pharmaHero[0].id, contentKey: "title", contentValue: "A Global API Partner from Refex", contentType: "text" },
      { sectionId: pharmaHero[0].id, contentKey: "description", contentValue: "We are among the fastest growing API companies, with a leadership position in several APIs.", contentType: "text" },
      { sectionId: pharmaHero[0].id, contentKey: "backgroundImage", contentValue: "/uploads/general/Hero-section-BG.jpg", contentType: "text" },
      { sectionId: pharmaHero[0].id, contentKey: "stats", contentValue: JSON.stringify([
        { value: "40", label: "Years of Experience" },
        { value: "80", label: "APIs in our products list" },
        { value: "80", label: "Countries our APIs are exported" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // About Section
    const pharmaAbout = await Section.findOrCreate({
      where: { pageId: pharma.id, sectionKey: "about" },
      defaults: {
        pageId: pharma.id,
        sectionType: "content",
        sectionKey: "about",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: pharmaAbout[0].id, contentKey: "label", contentValue: "ABOUT RLFC", contentType: "text" },
      { sectionId: pharmaAbout[0].id, contentKey: "title", contentValue: "Over four Decades of Quality & Excellence", contentType: "text" },
      { sectionId: pharmaAbout[0].id, contentKey: "description", contentValue: "Established in 1984 in Bengaluru, RL Fine Chem pioneered psychotropic substance manufacturing. In 2016, private equity acquired us, targeting a 20% CAGR. Operating from two facilities in Karnataka and Andhra Pradesh, we lead in psychotropic substances, Antipsychotics, Antihistamines, and Muscle relaxants. Exporting APIs to 80+ countries showcases our commitment to global excellence.", contentType: "text" },
      { sectionId: pharmaAbout[0].id, contentKey: "logo", contentValue: "/uploads/logos/Logo.png", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Leader Section
    const pharmaLeader = await Section.findOrCreate({
      where: { pageId: pharma.id, sectionKey: "leader" },
      defaults: {
        pageId: pharma.id,
        sectionType: "content",
        sectionKey: "leader",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: pharmaLeader[0].id, contentKey: "title", contentValue: "Leader in Psychotropic Substances & CNS APIs", contentType: "text" },
      { sectionId: pharmaLeader[0].id, contentKey: "description", contentValue: "With over 40 years of global service, RL Fine Chem excels as a leader in Psychotropic Substances and CNS APIs. Renowned for our expertise, we have built a stellar reputation in developing and commercializing niche APIs worldwide.", contentType: "text" },
      { sectionId: pharmaLeader[0].id, contentKey: "image", contentValue: "/uploads/general/Products.jpg", contentType: "text" },
      { sectionId: pharmaLeader[0].id, contentKey: "buttonText", contentValue: "View products", contentType: "text" },
      { sectionId: pharmaLeader[0].id, contentKey: "buttonLink", contentValue: "https://www.rlfinechem.com/", contentType: "text" }
    ], { ignoreDuplicates: true });

    // RD Capability Section
    const pharmaRD = await Section.findOrCreate({
      where: { pageId: pharma.id, sectionKey: "rd-capability" },
      defaults: {
        pageId: pharma.id,
        sectionType: "content",
        sectionKey: "rd-capability",
        orderIndex: 3,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: pharmaRD[0].id, contentKey: "title", contentValue: "R & D Capability", contentType: "text" },
      { sectionId: pharmaRD[0].id, contentKey: "description", contentValue: "RL Fine Chem excels through innovation, driven by DSIR-approved R&D. Our dedicated team navigates pharmaceutical breakthroughs, progressing seamlessly from grams to multi-tons. This commitment places us at the forefront of pharmaceutical innovation, ensuring quality at every stage of manufacturing.", contentType: "text" },
      { sectionId: pharmaRD[0].id, contentKey: "image", contentValue: "/uploads/general/R-D-Capability.jpg", contentType: "text" },
      { sectionId: pharmaRD[0].id, contentKey: "capabilities", contentValue: JSON.stringify([
        { icon: "ri-flask-line", title: "Synthesis" },
        { icon: "ri-shield-check-line", title: "Improved Quality\n& Consistency" },
        { icon: "ri-test-tube-line", title: "Chiral Chemistry" },
        { icon: "ri-settings-3-line", title: "Improved Technology" },
        { icon: "ri-flask-fill", title: "Grignard reaction" },
        { icon: "ri-medicine-bottle-line", title: "N & O Alkylation" },
        { icon: "ri-microscope-line", title: "Impurities" },
        { icon: "ri-alert-line", title: "Genotoxic Impurities" },
        { icon: "ri-leaf-line", title: "Green Chemistry" },
        { icon: "ri-file-list-3-line", title: "Regulatory Support" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Plant Capability Section
    const pharmaPlant = await Section.findOrCreate({
      where: { pageId: pharma.id, sectionKey: "plant-capability" },
      defaults: {
        pageId: pharma.id,
        sectionType: "content",
        sectionKey: "plant-capability",
        orderIndex: 4,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: pharmaPlant[0].id, contentKey: "title", contentValue: "Plant Capability", contentType: "text" },
      { sectionId: pharmaPlant[0].id, contentKey: "subtitle", contentValue: "RLFC is among the fastest growing API Companies", contentType: "text" },
      { sectionId: pharmaPlant[0].id, contentKey: "description", contentValue: "RLFC's two CNS and psychotropic API manufacturing plants have played a pivotal role in meeting customer demands and expanding our global presence. Evolving from one plant and two blocks to multiple units, our continuous growth is evident, highlighted by the recent foundation stone laying for a new block.", contentType: "text" },
      { sectionId: pharmaPlant[0].id, contentKey: "plants", contentValue: JSON.stringify([
        {
          name: "Hindupur Plant",
          image: "/uploads/general/Hindupur-Plant.jpg",
          details: [
            "Our Hindupur plant was started in the year 2004, and is on the border of Andhra Pradesh and Karnataka, 80 km from Bangalore city.",
            "",
            "Total KL capacity – 135 KL",
            "Hydrogenation Facility",
            "High vacuum distillation",
            "High-temperature reaction",
            "Approvals – WHO GMP, WC, ISO 9001, ISO 18001, ISO 45001"
          ]
        },
        {
          name: "Gauribidnaur Plant",
          image: "/uploads/general/Gauribidanur-Plant.jpg",
          details: [
            "Our second plant was started in the year 2016 at Gauribidnaur, It is in the state of Karnataka, around 70 km from Bangalore city.",
            "",
            "Total capacity – 225 KL",
            "Pilot Facility",
            "In house testing",
            "Approvals – USFDA, WHO GMP, ISO 9001, ISO 45001, ISO14001, ISO 22301"
          ]
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Certifications Section
    const pharmaCert = await Section.findOrCreate({
      where: { pageId: pharma.id, sectionKey: "certifications" },
      defaults: {
        pageId: pharma.id,
        sectionType: "content",
        sectionKey: "certifications",
        orderIndex: 5,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: pharmaCert[0].id, contentKey: "title", contentValue: "Certifications", contentType: "text" },
      { sectionId: pharmaCert[0].id, contentKey: "description", contentValue: "We support customers in several ways, including intermediate/API supply, custom synthesis, intellectual property generation, regulatory compliance, etc.", contentType: "text" },
      { sectionId: pharmaCert[0].id, contentKey: "certifications", contentValue: JSON.stringify([
        "/uploads/general/Certification-2.png",
        "/uploads/general/Certification-3.png",
        "/uploads/general/Certification-4.png",
        "/uploads/general/Certification-5.png",
        "/uploads/general/Certification-6.png",
        "/uploads/general/Certification-7.png",
        "/uploads/general/Certification-8.png",
        "/uploads/general/Certification-9.png",
        "/uploads/general/Certification-10.png",
        "/uploads/general/Certification-11.png",
        "/uploads/general/Certification-12.png",
        "/uploads/general/Certification-13.png",
        "/uploads/general/Certification-14.png",
        "/uploads/general/Certification-15.png",
        "/uploads/general/Certification-16.png",
        "/uploads/general/Certification-1.png"
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // ============================================
    // 9. VENWIND REFEX PAGE
    // ============================================
    const venwindPage = await Page.findOrCreate({
      where: { slug: "venwind-refex" },
      defaults: {
        slug: "venwind-refex",
        title: "Venwind Refex",
        status: "published",
        templateType: "business"
      }
    });
    const venwind = venwindPage[0];

    // Hero Section
    const venwindHero = await Section.findOrCreate({
      where: { pageId: venwind.id, sectionKey: "hero" },
      defaults: {
        pageId: venwind.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: venwindHero[0].id, contentKey: "label", contentValue: "Venwind Refex", contentType: "text" },
      { sectionId: venwindHero[0].id, contentKey: "title", contentValue: "Harnessing and Powering the Future with Sustainable Wind Technology", contentType: "text" },
      { sectionId: venwindHero[0].id, contentKey: "description", contentValue: "Venwind Refex has an exclusive license from Vensys Energy AG, Germany, to manufacture 5.3 MW wind turbines featuring a permanent magnet generator and hybrid drivetrain technology. More than 120 GW of wind turbine generators using Vensys technology are in operation across five continents and multiple countries. Currently, we have been licensed to manufacture the state-of-the-art wind turbine technology in India.", contentType: "text" },
      { sectionId: venwindHero[0].id, contentKey: "backgroundImage", contentValue: "/uploads/business/venwind-refex/hero/venwind-banner.jpg", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Stats Section
    const venwindStats = await Section.findOrCreate({
      where: { pageId: venwind.id, sectionKey: "stats" },
      defaults: {
        pageId: venwind.id,
        sectionType: "stats",
        sectionKey: "stats",
        orderIndex: 1,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: venwindStats[0].id, contentKey: "stats", contentValue: JSON.stringify([
        { value: "128", suffix: "+ GW", description: "Operational Worldwide based on Vensys technology" },
        { value: "38", suffix: "+", description: "Countries Operating globally utilizing wind turbine technology by Vensys" },
        { value: "5.3", suffix: " MW", description: "Permanent Magnet Generator with Medium-Speed Gearbox Hybrid Technology – Best in Class" },
        { value: "183.4", suffix: "m", description: "Rotor Diameter and 130m Tower Height – Capturing Optimal Wind Energy" }
      ]), contentType: "json" },
      { sectionId: venwindStats[0].id, contentKey: "image", contentValue: "/uploads/general/about-usbg-630x630-1.jpg", contentType: "text" }
    ], { ignoreDuplicates: true });

    // Unique Section
    const venwindUnique = await Section.findOrCreate({
      where: { pageId: venwind.id, sectionKey: "unique" },
      defaults: {
        pageId: venwind.id,
        sectionType: "features",
        sectionKey: "unique",
        orderIndex: 2,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: venwindUnique[0].id, contentKey: "title", contentValue: "What makes us unique?", contentType: "text" },
      { sectionId: venwindUnique[0].id, contentKey: "description", contentValue: "We offer wind turbines with advanced German technology from Vensys Energy AG at competitive prices.", contentType: "text" },
      { sectionId: venwindUnique[0].id, contentKey: "image", contentValue: "/uploads/general/home-image-840x968-1.jpg", contentType: "text" },
      { sectionId: venwindUnique[0].id, contentKey: "features", contentValue: JSON.stringify([
        {
          icon: "/uploads/general/Hybrid-drive-train.png",
          text: "Hybrid drive-train (gearbox + medium speed PMG) for superior performance"
        },
        {
          icon: "/uploads/general/Proven-technology.png",
          text: "Proven technology with global installations in Australia, South Africa, Brazil and the Middle East"
        },
        {
          icon: "/uploads/general/Rapid-delivery.png",
          text: "Rapid delivery"
        },
        {
          icon: "/uploads/general/Reduced-Opex-costs.png",
          text: "Reduced Opex costs due to PMG and hybrid drive-train"
        },
        {
          icon: "/uploads/general/Lower-BOP-costs.png",
          text: "Lower BOP costs with larger WTG sizes, achieving 20-25% savings"
        },
        {
          icon: "/uploads/general/Decreased-LCOE.png",
          text: "Decreased LCOE through technological efficiency and BOP savings"
        }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    // Technical Specs Section
    const venwindSpecs = await Section.findOrCreate({
      where: { pageId: venwind.id, sectionKey: "technical-specs" },
      defaults: {
        pageId: venwind.id,
        sectionType: "content",
        sectionKey: "technical-specs",
        orderIndex: 3,
        isActive: true
      }
    });
    await SectionContent.bulkCreate([
      { sectionId: venwindSpecs[0].id, contentKey: "title", contentValue: "Our Technical Specifications", contentType: "text" },
      { sectionId: venwindSpecs[0].id, contentKey: "image", contentValue: "/uploads/general/Technical-Specifications-Image.png", contentType: "text" },
      { sectionId: venwindSpecs[0].id, contentKey: "specs", contentValue: JSON.stringify([
        { value: "26417 m²", label: "Swept Area" },
        { value: "130m", label: "Hub Height" },
        { value: "2.5 m/s", label: "Cut-in Wind Speed" },
        { value: "IEC S", label: "Class" }
      ]), contentType: "json" }
    ], { ignoreDuplicates: true });

    console.log("✅ Business pages (Pharma, Venwind) seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding business pages (Part 4):", error);
    throw error;
  }
};

