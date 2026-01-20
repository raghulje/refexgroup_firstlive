require("dotenv").config();
const db = require("../models");
const { GalleryAlbum } = require("../models");

async function createGallery2026() {
  try {
    console.log("🚀 Creating Gallery 2026 album...\n");

    // Get the maximum orderIndex for year albums to place 2026 at the end
    const maxOrderAlbum = await GalleryAlbum.findOne({
      where: { albumType: 'year' },
      order: [['orderIndex', 'DESC']],
      attributes: ['orderIndex']
    });
    
    const nextOrderIndex = maxOrderAlbum ? maxOrderAlbum.orderIndex + 1 : 0;

    // Create or find the 2026 album
    const [album2026, created] = await GalleryAlbum.findOrCreate({
      where: { 
        slug: '2026',
        albumType: 'year'
      },
      defaults: {
        name: '2026',
        slug: '2026',
        description: 'Gallery for year 2026',
        albumType: 'year',
        orderIndex: nextOrderIndex,
        isActive: false, // Start as unpublished (Draft)
        coverImageId: null
      }
    });

    if (created) {
      console.log("✅ Created Gallery 2026 album:");
      console.log(`   - ID: ${album2026.id}`);
      console.log(`   - Name: ${album2026.name}`);
      console.log(`   - Slug: ${album2026.slug}`);
      console.log(`   - Album Type: ${album2026.albumType}`);
      console.log(`   - Order Index: ${album2026.orderIndex}`);
      console.log(`   - Is Active (Published): ${album2026.isActive} (Draft/Unpublished)`);
      console.log("\n📝 Note: The album is set as unpublished (Draft).");
      console.log("   You can publish it later using the CMS by clicking the eye icon.");
    } else {
      console.log("ℹ️  Gallery 2026 album already exists:");
      console.log(`   - ID: ${album2026.id}`);
      console.log(`   - Name: ${album2026.name}`);
      console.log(`   - Slug: ${album2026.slug}`);
      console.log(`   - Is Active (Published): ${album2026.isActive}`);
      
      // Update it to be unpublished if it was published
      if (album2026.isActive) {
        await album2026.update({ isActive: false });
        console.log("\n✅ Updated album to unpublished (Draft) status.");
      }
    }

    console.log("\n✅ Script completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("   1. Go to Gallery CMS → Year Galleries tab");
    console.log("   2. You should see the 2026 gallery in the list");
    console.log("   3. Add events and upload images as needed");
    console.log("   4. Publish it when ready using the eye icon");

  } catch (error) {
    console.error("❌ Error creating Gallery 2026:", error);
    throw error;
  } finally {
    await db.sequelize.close();
  }
}

// Run the script
createGallery2026()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });

