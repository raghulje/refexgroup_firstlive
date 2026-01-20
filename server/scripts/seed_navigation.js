const { NavigationMenu, Media } = require("../models");

module.exports = async function seedNavigation() {
  try {
    console.log("Seeding navigation menus...");

    // Clear existing navigation
    await NavigationMenu.destroy({ where: {} });

    // Header Navigation
    const homeMenu = await NavigationMenu.create({
      menuLocation: "header",
      label: "Home",
      linkType: "internal",
      linkUrl: "/",
      parentId: null,
      orderIndex: 0,
      isActive: true
    });

    const aboutMenu = await NavigationMenu.create({
      menuLocation: "header",
      label: "About Refex",
      linkType: "dropdown",
      linkUrl: "/about-refex",
      parentId: null,
      orderIndex: 1,
      isActive: true
    });

    // About Submenu
    await NavigationMenu.create({
      menuLocation: "header",
      label: "Overview",
      linkType: "internal",
      linkUrl: "/about-refex",
      parentId: aboutMenu.id,
      orderIndex: 0,
      isActive: true
    });

    await NavigationMenu.create({
      menuLocation: "header",
      label: "Leadership",
      linkType: "internal",
      linkUrl: "/about-refex#leadership",
      parentId: aboutMenu.id,
      orderIndex: 1,
      isActive: true
    });

    await NavigationMenu.create({
      menuLocation: "header",
      label: "Our Story",
      linkType: "internal",
      linkUrl: "/about-refex#ourstory",
      parentId: aboutMenu.id,
      orderIndex: 2,
      isActive: true
    });

    const businessMenu = await NavigationMenu.create({
      menuLocation: "header",
      label: "Business",
      linkType: "dropdown",
      linkUrl: "/business",
      parentId: null,
      orderIndex: 2,
      isActive: true
    });

    // Business Submenu
    const businessSubmenus = [
      { label: "Refex Refrigerants", url: "/refex-refrigerants" },
      { label: "Refex Renewables", url: "/refex-renewables" },
      { label: "Ash & Coal Handling", url: "/refex-ash-coal-handling" },
      { label: "Refex Medtech", url: "/refex-medtech" },
      { label: "Refex Capital", url: "/refex-capital" },
      { label: "Refex Airports", url: "/refex-airports" },
      { label: "Refex Mobility", url: "/refex-mobility" },
      { label: "RL Fine Chem", url: "/pharma-rl-fine-chem" },
      { label: "Venwind Refex", url: "/venwind-refex" }
    ];

    for (let i = 0; i < businessSubmenus.length; i++) {
      await NavigationMenu.create({
        menuLocation: "header",
        label: businessSubmenus[i].label,
        linkType: "internal",
        linkUrl: businessSubmenus[i].url,
        parentId: businessMenu.id,
        orderIndex: i,
        isActive: true
      });
    }

    await NavigationMenu.create({
      menuLocation: "header",
      label: "Investments",
      linkType: "internal",
      linkUrl: "/investments",
      parentId: null,
      orderIndex: 3,
      isActive: true
    });

    await NavigationMenu.create({
      menuLocation: "header",
      label: "ESG",
      linkType: "internal",
      linkUrl: "/esg",
      parentId: null,
      orderIndex: 4,
      isActive: true
    });

    // Footer Navigation (simplified - can be expanded)
    await NavigationMenu.create({
      menuLocation: "footer",
      label: "About Refex",
      linkType: "internal",
      linkUrl: "/about-refex",
      parentId: null,
      orderIndex: 0,
      isActive: true
    });

    await NavigationMenu.create({
      menuLocation: "footer",
      label: "Investments",
      linkType: "internal",
      linkUrl: "/investments",
      parentId: null,
      orderIndex: 1,
      isActive: true
    });

    await NavigationMenu.create({
      menuLocation: "footer",
      label: "Newsroom",
      linkType: "internal",
      linkUrl: "/newsroom",
      parentId: null,
      orderIndex: 2,
      isActive: true
    });

    await NavigationMenu.create({
      menuLocation: "footer",
      label: "Careers",
      linkType: "internal",
      linkUrl: "/careers",
      parentId: null,
      orderIndex: 3,
      isActive: true
    });

    await NavigationMenu.create({
      menuLocation: "footer",
      label: "Contact",
      linkType: "internal",
      linkUrl: "/contact",
      parentId: null,
      orderIndex: 4,
      isActive: true
    });

    await NavigationMenu.create({
      menuLocation: "footer",
      label: "ESG",
      linkType: "internal",
      linkUrl: "/esg",
      parentId: null,
      orderIndex: 5,
      isActive: true
    });

    console.log("✅ Navigation menus seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding navigation:", error);
    throw error;
  }
};

