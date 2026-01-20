const { GalleryAlbum, GalleryEvent, GalleryImage, Media } = require("../models");

module.exports = async function seedGallery() {
  try {
    console.log("Seeding gallery data...");

    // Create Albums
    const album1 = await GalleryAlbum.findOrCreate({
      where: { slug: "2024-events" },
      defaults: {
        name: "2024 Events",
        slug: "2024-events",
        description: "A collection of events and celebrations from 2024",
        coverImageId: null,
        orderIndex: 0,
        isActive: true
      }
    });

    const album2 = await GalleryAlbum.findOrCreate({
      where: { slug: "2025-events" },
      defaults: {
        name: "2025 Events",
        slug: "2025-events",
        description: "A collection of events and celebrations from 2025",
        coverImageId: null,
        orderIndex: 1,
        isActive: true
      }
    });

    const album3 = await GalleryAlbum.findOrCreate({
      where: { slug: "company-celebrations" },
      defaults: {
        name: "Company Celebrations",
        slug: "company-celebrations",
        description: "Special moments and celebrations at Refex Group",
        coverImageId: null,
        orderIndex: 2,
        isActive: true
      }
    });

    // Create Events for Album 1
    const event1 = await GalleryEvent.findOrCreate({
      where: { slug: "annual-day-2024", albumId: album1[0].id },
      defaults: {
        albumId: album1[0].id,
        name: "Annual Day 2024",
        slug: "annual-day-2024",
        description: "Refex Group Annual Day celebration",
        eventDate: new Date("2024-12-15"),
        coverImageId: null,
        orderIndex: 0,
        isActive: true
      }
    });

    const event2 = await GalleryEvent.findOrCreate({
      where: { slug: "team-building-2024", albumId: album1[0].id },
      defaults: {
        albumId: album1[0].id,
        name: "Team Building 2024",
        slug: "team-building-2024",
        description: "Team building activities and workshops",
        eventDate: new Date("2024-11-20"),
        coverImageId: null,
        orderIndex: 1,
        isActive: true
      }
    });

    // Create Events for Album 2
    const event3 = await GalleryEvent.findOrCreate({
      where: { slug: "new-year-celebration-2025", albumId: album2[0].id },
      defaults: {
        albumId: album2[0].id,
        name: "New Year Celebration 2025",
        slug: "new-year-celebration-2025",
        description: "Welcoming the new year with celebrations",
        eventDate: new Date("2025-01-01"),
        coverImageId: null,
        orderIndex: 0,
        isActive: true
      }
    });

    // Create Events for Album 3
    const event4 = await GalleryEvent.findOrCreate({
      where: { slug: "anniversary-celebration", albumId: album3[0].id },
      defaults: {
        albumId: album3[0].id,
        name: "23rd Anniversary Celebration",
        slug: "anniversary-celebration",
        description: "Celebrating 23 years of excellence",
        eventDate: new Date("2024-06-15"),
        coverImageId: null,
        orderIndex: 0,
        isActive: true
      }
    });

    // Create Media records first, then Gallery Images for Event 1
    // Using actual downloaded images - these will be created by create_media_from_downloads.js
    // But we'll reference them by path here
    const media1 = await Media.findOrCreate({
      where: { filePath: "/uploads/about/Gallery-20-th.-Anniversary-3.jpg" },
      defaults: {
        fileName: "Gallery-20-th.-Anniversary-3.jpg",
        filePath: "/uploads/about/Gallery-20-th.-Anniversary-3.jpg",
        fileType: "image",
        altText: "Annual Day 2024 - Group Photo"
      }
    });

    const media2 = await Media.findOrCreate({
      where: { filePath: "/uploads/home/Office-Group-Photo-comp-1-1024x576.jpg" },
      defaults: {
        fileName: "Office-Group-Photo-comp-1-1024x576.jpg",
        filePath: "/uploads/home/Office-Group-Photo-comp-1-1024x576.jpg",
        fileType: "image",
        altText: "Annual Day 2024 - Celebration"
      }
    });

    const media3 = await Media.findOrCreate({
      where: { filePath: "/uploads/careers/life-refexian/Careers-Gallery-1-e1677566533601.png" },
      defaults: {
        fileName: "Careers-Gallery-1-e1677566533601.png",
        filePath: "/uploads/careers/life-refexian/Careers-Gallery-1-e1677566533601.png",
        fileType: "image",
        altText: "Team Building 2024 - Activities"
      }
    });

    // Create Gallery Images for Event 1
    await GalleryImage.findOrCreate({
      where: {
        eventId: event1[0].id,
        imageId: media1[0].id
      },
      defaults: {
        eventId: event1[0].id,
        imageId: media1[0].id,
        title: "Annual Day 2024 - Group Photo",
        orderIndex: 0,
        isActive: true
      }
    });

    await GalleryImage.findOrCreate({
      where: {
        eventId: event1[0].id,
        imageId: media2[0].id
      },
      defaults: {
        eventId: event1[0].id,
        imageId: media2[0].id,
        title: "Annual Day 2024 - Celebration",
        orderIndex: 1,
        isActive: true
      }
    });

    // Create Gallery Images for Event 2
    await GalleryImage.findOrCreate({
      where: {
        eventId: event2[0].id,
        imageId: media3[0].id
      },
      defaults: {
        eventId: event2[0].id,
        imageId: media3[0].id,
        title: "Team Building 2024 - Activities",
        orderIndex: 0,
        isActive: true
      }
    });

    console.log("✅ Gallery data seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding gallery:", error);
    throw error;
  }
};

