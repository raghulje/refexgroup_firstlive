const { BusinessCard, Media } = require("../models");

module.exports = async function seedBusinessCards() {
  try {
    console.log("Seeding business cards...");

    const businessCards = [
      {
        title: "Refex Refrigerants",
        description: "Over 20 years, Refex has been a renowned brand in refrigerant gas, expanding to offer eco-friendly products that reduce risks from sourcing and environmental policy changes.",
        imageId: null,
        linkUrl: "/refex-refrigerants",
        hoverColor: "#50b848",
        orderIndex: 0,
        isActive: true
      },
      {
        title: "Refex Renewables",
        description: "Refex excels in providing top-notch design, installation, and maintenance services for efficient solar power systems. With 10+ years of experience, Refex is your trusted partner in renewable energy.",
        imageId: null,
        linkUrl: "/refex-renewables",
        hoverColor: "#50b848",
        orderIndex: 1,
        isActive: true
      },
      {
        title: "Refex Ash & Coal Handling",
        description: "Refex trades coal and provides ash disposal to ensure a steady supply to power plants. Offers efficient solutions for sustainable operations in the energy sector.",
        imageId: null,
        linkUrl: "/refex-ash-coal-handling",
        hoverColor: "#50b848",
        orderIndex: 2,
        isActive: true
      },
      {
        title: "Refex MedTech",
        description: "Refex aims to bring \"Affordable Luxury\" to radiology products & solutions to serve customers with advanced cutting-edge technology with lower life cycle costs without compromising on quality, reliability, and patient safety.",
        imageId: null,
        linkUrl: "/refex-medtech",
        hoverColor: "#50b848",
        orderIndex: 3,
        isActive: true
      },
      {
        title: "Refex Capital",
        description: "A SEBI-approved Category I AIF, Refex Capital invests in startups, managing a portfolio of 26 firms. It also offers incubation services to budding entrepreneurs in Chennai.",
        imageId: null,
        linkUrl: "/refex-capital",
        hoverColor: "#50b848",
        orderIndex: 4,
        isActive: true
      },
      {
        title: "Refex Airports and Transportation",
        description: "Refex is on a mission to enhance the consumer journey and foster enduring relationships across various transportation platforms, including airports, railways, metro systems, bus stations, and heliports.",
        imageId: null,
        linkUrl: "/refex-airports",
        hoverColor: "#50b848",
        orderIndex: 5,
        isActive: true
      },
      {
        title: "Refex Mobility",
        description: "Refex Mobility operates 100% cleaner-fuelled 4-wheeler vehicles across India with trained chauffeurs, 24/7 support teams, and a full-fledged technology platform serving corporates.",
        imageId: null,
        linkUrl: "/refex-mobility",
        hoverColor: "#50b848",
        orderIndex: 6,
        isActive: true
      },
      {
        title: "Pharma | RL Fine Chem",
        description: "Over 40 years, RL Fine Chem specialize in CNS and Psychotropic drugs manufacturing and exports to 30+ developed countries around the world.",
        imageId: null,
        linkUrl: "/pharma-rl-fine-chem",
        hoverColor: "#50b848",
        orderIndex: 7,
        isActive: true
      },
      {
        title: "Venwind Refex",
        description: "Venwind Refex, a joint venture between Refex and Venwind, is dedicated to transforming wind energy in India through cutting-edge turbine technology and sustainable practices.",
        imageId: null,
        linkUrl: "/venwind-refex",
        hoverColor: "#50b848",
        orderIndex: 8,
        isActive: true
      }
    ];

    for (const cardData of businessCards) {
      await BusinessCard.findOrCreate({
        where: {
          title: cardData.title
        },
        defaults: cardData
      });
    }

    console.log("✅ Business cards seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding business cards:", error);
    throw error;
  }
};

