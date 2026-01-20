require("dotenv").config();
const db = require("../models");

async function seedAll() {
  try {
    console.log("Starting database seeding...");

    // Import all seed scripts
    await require("./seed_pages")();
    // Create media records from downloaded images first
    await require("./create_media_from_downloads")();
    await require("./seed_media")();
    await require("./seed_home_page")();
    await require("./seed_business_cards")();
    await require("./seed_awards")();
    await require("./seed_newsroom")();
    await require("./seed_leaders")();
    await require("./seed_core_values")();
    await require("./seed_sdg_cards")();
    await require("./seed_navigation")();
    await require("./seed_footer")();
    await require("./seed_social_links")();
    await require("./seed_contact_info")();
    await require("./seed_global_settings")();
    
    // Page-specific seeders
    await require("./seed_about_page")();
    await require("./seed_careers_page")();
    await require("./seed_jobs")();
    await require("./seed_contact_page")();
    await require("./seed_investments_page")();
    await require("./seed_diversity_inclusion_page")();
    await require("./seed_esg_page")();
    await require("./seed_gallery")();
    await require("./seed_business_pages")();
    await require("./seed_business_pages_2")();
    await require("./seed_business_pages_3")();
    await require("./seed_business_pages_4")();

    console.log("✅ All seeds completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedAll();

