const { NewsroomItem, Media } = require("../models");

module.exports = async function seedNewsroom() {
  try {
    console.log("Seeding newsroom items...");

    const newsItems = [
      {
        type: "press",
        title: "Dinesh Agarwal, CEO of Refex Group, on ET Now",
        excerpt: "",
        content: "",
        logo: "/uploads/logos/ET_Now_logo.svg-1024x819.png",
        link: "https://www.youtube.com/watch?v=vyiEp-hzhqU&t=3s",
        badge: "Press Release",
        featuredImageId: null,
        publishedAt: new Date("2024-11-01"),
        category: "Press Release",
        isFeatured: true,
        isActive: true
      },
      {
        type: "press",
        title: "Refex Mobility expands operations to Delhi NCR",
        excerpt: "",
        content: "",
        logo: "/uploads/icons/et-autor.svg",
        link: "https://auto.economictimes.indiatimes.com/news/aftermarket/refex-mobility-expands-operations-to-delhi-ncr/124252061",
        badge: "Press Release",
        featuredImageId: null,
        publishedAt: new Date("2024-10-15"),
        category: "Press Release",
        isFeatured: false,
        isActive: true
      },
      {
        type: "press",
        title: "Refex eVeelz rebrands as Refex Mobility; to consolidate focus on existing Tier-1 market",
        excerpt: "",
        content: "",
        logo: "/uploads/icons/et-autor.svg",
        link: "https://auto.economictimes.indiatimes.com/news/aftermarket/refex-eveelz-rebrands-as-refex-mobility-to-consolidate-focus-on-existing-tier-1-market/123237339",
        badge: "Press Release",
        featuredImageId: null,
        publishedAt: new Date("2024-09-20"),
        category: "Press Release",
        isFeatured: false,
        isActive: true
      },
      {
        type: "event",
        title: "Refex Group Road Safety Awareness event",
        excerpt: "",
        content: "",
        logo: "",
        link: "https://navjeevanexpress.com/csr-initiative-refex-group-kick-starts-road-safety-campaign-on-anna-salai-in-chennai/",
        badge: "Event",
        featuredImageId: null,
        publishedAt: new Date("2024-08-10"),
        category: "Event",
        isFeatured: false,
        isActive: true
      },
      {
        type: "event",
        title: "Refex Gheun Tak - A Women's Ultimate Frisbee Tournament",
        excerpt: "",
        content: "",
        logo: "",
        link: "http://businessnewsthisweek.com/business/team-meraki-wins-refex-gheun-tak-a-womens-ultimate-frisbee-tournament/",
        badge: "Event",
        featuredImageId: null,
        publishedAt: new Date("2024-07-15"),
        category: "Event",
        isFeatured: false,
        isActive: true
      }
    ];

    for (const itemData of newsItems) {
      // Extract fields for where clause
      const { title, type } = itemData;
      // Use the full itemData for defaults
      await NewsroomItem.findOrCreate({
        where: {
          title: title,
          type: type
        },
        defaults: itemData
      });
    }

    console.log("✅ Newsroom items seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding newsroom:", error);
    throw error;
  }
};

