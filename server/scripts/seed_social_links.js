const { SocialLink } = require("../models");

module.exports = async function seedSocialLinks() {
  try {
    console.log("Seeding social links...");

    const socialLinks = [
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/company/refex-group/",
        iconClass: "ri-linkedin-fill",
        orderIndex: 0,
        isActive: true
      },
      {
        platform: "Facebook",
        url: "https://www.facebook.com/refexindustrieslimited/",
        iconClass: "ri-facebook-fill",
        orderIndex: 1,
        isActive: true
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/GroupRefex",
        iconClass: "ri-twitter-fill",
        orderIndex: 2,
        isActive: true
      },
      {
        platform: "YouTube",
        url: "https://www.youtube.com/@refexgroup",
        iconClass: "ri-youtube-fill",
        orderIndex: 3,
        isActive: true
      },
      {
        platform: "Instagram",
        url: "https://www.instagram.com/refexgroup/",
        iconClass: "ri-instagram-fill",
        orderIndex: 4,
        isActive: true
      }
    ];

    for (const linkData of socialLinks) {
      await SocialLink.findOrCreate({
        where: {
          platform: linkData.platform
        },
        defaults: linkData
      });
    }

    console.log("✅ Social links seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding social links:", error);
    throw error;
  }
};

