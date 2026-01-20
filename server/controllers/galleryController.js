const { GalleryAlbum, GalleryEvent, GalleryImage, GalleryDocument, Media } = require("../models");
const { Op } = require("sequelize");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

// Albums
exports.getAlbums = asyncHandler(async (req, res) => {
  const { albumType, isActive } = req.query;
  const where = {};
  if (albumType) where.albumType = albumType;
  if (isActive !== undefined) where.isActive = isActive === 'true';
  
  const albums = await GalleryAlbum.findAll({
    where,
    include: [
      { model: Media, as: 'coverImage', required: false },
      {
        model: GalleryEvent,
        as: 'events',
        where: { isActive: true },
        required: false,
        include: [{ model: Media, as: 'coverImage', required: false }]
      }
    ],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", albums);
});

exports.getAlbumBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const album = await GalleryAlbum.findOne({
    where: { slug, isActive: true },
    include: [
      { model: Media, as: 'coverImage', required: false },
      {
        model: GalleryEvent,
        as: 'events',
        where: { isActive: true },
        required: false,
        include: [{ model: Media, as: 'coverImage', required: false }]
      }
    ]
  });
  
  if (!album) {
    return status.responseStatus(res, 404, "Album not found");
  }
  
  return status.responseStatus(res, 200, "OK", album);
});

// Events
exports.getEventsByAlbumId = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const events = await GalleryEvent.findAll({
    where: { albumId, isActive: true },
    include: [{ model: Media, as: 'coverImage', required: false }],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", events);
});

exports.getEventBySlug = asyncHandler(async (req, res) => {
  const { albumSlug, eventSlug } = req.params;
  const album = await GalleryAlbum.findOne({ where: { slug: albumSlug } });
  if (!album) {
    return status.responseStatus(res, 404, "Album not found");
  }
  
  const event = await GalleryEvent.findOne({
    where: { albumId: album.id, slug: eventSlug, isActive: true },
    include: [
      { model: Media, as: 'coverImage', required: false },
      {
        model: GalleryImage,
        as: 'images',
        where: { isActive: true },
        required: false,
        include: [{ model: Media, as: 'image', required: false }],
        order: [['orderIndex', 'ASC']]
      },
      {
        model: GalleryDocument,
        as: 'documents',
        where: { isActive: true },
        required: false,
        include: [{ model: Media, as: 'document', required: false }],
        order: [['orderIndex', 'ASC']]
      }
    ]
  });
  
  if (!event) {
    return status.responseStatus(res, 404, "Event not found");
  }
  
  return status.responseStatus(res, 200, "OK", event);
});

// Images (legacy support)
exports.getImages = asyncHandler(async (req, res) => {
  const { year, category, eventId, isActive } = req.query;
  const where = {};
  
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (year) where.galleryYear = year;
  if (category) where.category = category;
  if (eventId) where.eventId = eventId;
  
  const images = await GalleryImage.findAll({
    where,
    include: [
      { model: Media, as: 'image', required: false },
      { model: GalleryEvent, as: 'event', required: false }
    ],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", images);
});

// CMS CRUD Operations for Albums
exports.createAlbum = asyncHandler(async (req, res) => {
  const album = await GalleryAlbum.create(req.body);
  const createdAlbum = await GalleryAlbum.findByPk(album.id, {
    include: [
      { model: Media, as: 'coverImage', required: false },
      { model: GalleryEvent, as: 'events', required: false }
    ]
  });
  return status.responseStatus(res, 201, "Created", createdAlbum);
});

exports.updateAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const album = await GalleryAlbum.findByPk(id);
  if (!album) {
    return status.responseStatus(res, 404, "Album not found");
  }
  await album.update(req.body);
  const updatedAlbum = await GalleryAlbum.findByPk(id, {
    include: [
      { model: Media, as: 'coverImage', required: false },
      { model: GalleryEvent, as: 'events', required: false }
    ]
  });
  return status.responseStatus(res, 200, "Updated", updatedAlbum);
});

exports.deleteAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const album = await GalleryAlbum.findByPk(id);
  if (!album) {
    return status.responseStatus(res, 404, "Album not found");
  }
  await album.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

exports.getAlbumById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const album = await GalleryAlbum.findByPk(id, {
    include: [
      { model: Media, as: 'coverImage', required: false },
      {
        model: GalleryEvent,
        as: 'events',
        required: false,
        include: [{ model: Media, as: 'coverImage', required: false }]
      }
    ]
  });
  if (!album) {
    return status.responseStatus(res, 404, "Album not found");
  }
  return status.responseStatus(res, 200, "OK", album);
});

// CMS CRUD Operations for Events
exports.createEvent = asyncHandler(async (req, res) => {
  try {
    const { albumId } = req.params;
    
    // Validate required fields
    if (!req.body.name || !req.body.slug) {
      return status.responseStatus(res, 400, "Name and slug are required");
    }
    
    // Verify album exists
    const album = await GalleryAlbum.findByPk(albumId);
    if (!album) {
      return status.responseStatus(res, 404, "Album not found");
    }
    
    // Prepare event data with defaults
    const eventData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description || null,
      albumId: parseInt(albumId),
      orderIndex: req.body.orderIndex !== undefined ? parseInt(req.body.orderIndex) : 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      coverImageId: req.body.coverImageId ? parseInt(req.body.coverImageId) : null,
      eventDate: req.body.eventDate || null,
      location: req.body.location || null,
    };
    
    console.log('Creating event with data:', eventData);
    
    const event = await GalleryEvent.create(eventData);
    const createdEvent = await GalleryEvent.findByPk(event.id, {
      include: [
        { model: Media, as: 'coverImage', required: false },
        { model: GalleryAlbum, as: 'album', required: false }
      ]
    });
    return status.responseStatus(res, 201, "Created", createdEvent);
  } catch (error) {
    console.error('Error creating gallery event:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return status.responseStatus(res, 500, `Failed to create event: ${error.message}`, { error: error.message });
  }
});

exports.updateEvent = asyncHandler(async (req, res) => {
  try {
  const { id } = req.params;
  const event = await GalleryEvent.findByPk(id);
  if (!event) {
    return status.responseStatus(res, 404, "Event not found");
  }

    // Prepare update data
    const updateData = {};
    
    // Handle coverImageId - validate it exists if provided
    if (req.body.coverImageId !== undefined) {
      if (req.body.coverImageId === null || req.body.coverImageId === '') {
        updateData.coverImageId = null;
      } else {
        const coverImageId = typeof req.body.coverImageId === 'number' 
          ? req.body.coverImageId 
          : parseInt(req.body.coverImageId);
        
        if (isNaN(coverImageId) || coverImageId <= 0) {
          return status.responseStatus(res, 400, "Invalid coverImageId");
        }
        
        // Verify media exists
        const media = await Media.findByPk(coverImageId);
        if (!media) {
          return status.responseStatus(res, 404, `Media with id ${coverImageId} not found`);
        }
        
        updateData.coverImageId = coverImageId;
      }
    }

    // Handle other fields
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.slug !== undefined) updateData.slug = req.body.slug;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.eventDate !== undefined) updateData.eventDate = req.body.eventDate || null;
    if (req.body.location !== undefined) updateData.location = req.body.location || null;
    if (req.body.orderIndex !== undefined) updateData.orderIndex = parseInt(req.body.orderIndex) || 0;
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;

    console.log('Updating event with data:', updateData);

    await event.update(updateData);
  const updatedEvent = await GalleryEvent.findByPk(id, {
    include: [
      { model: Media, as: 'coverImage', required: false },
      { model: GalleryAlbum, as: 'album', required: false }
    ]
  });
  return status.responseStatus(res, 200, "Updated", updatedEvent);
  } catch (error) {
    console.error('Error updating gallery event:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      body: req.body
    });
    return status.responseStatus(res, 500, `Failed to update event: ${error.message}`, { error: error.message });
  }
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await GalleryEvent.findByPk(id);
  if (!event) {
    return status.responseStatus(res, 404, "Event not found");
  }
  await event.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

exports.getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await GalleryEvent.findByPk(id, {
    include: [
      { model: Media, as: 'coverImage', required: false },
      { model: GalleryAlbum, as: 'album', required: false },
      {
        model: GalleryImage,
        as: 'images',
        required: false,
        include: [{ model: Media, as: 'image', required: false }],
        order: [['orderIndex', 'ASC']]
      }
    ]
  });
  if (!event) {
    return status.responseStatus(res, 404, "Event not found");
  }
  return status.responseStatus(res, 200, "OK", event);
});

// CMS CRUD Operations for Images
exports.createImage = asyncHandler(async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.imageId) {
      return status.responseStatus(res, 400, "imageId is required");
    }

    // Verify that the media record exists
    const media = await Media.findByPk(req.body.imageId);
    if (!media) {
      return status.responseStatus(res, 404, `Media with id ${req.body.imageId} not found`);
    }

    // Verify event exists if eventId is provided
    if (req.body.eventId) {
      const event = await GalleryEvent.findByPk(req.body.eventId);
      if (!event) {
        return status.responseStatus(res, 404, `Event with id ${req.body.eventId} not found`);
      }
    }

    // Prepare image data with defaults
    const imageData = {
      title: req.body.title || null,
      imageId: parseInt(req.body.imageId),
      eventId: req.body.eventId ? parseInt(req.body.eventId) : null,
      orderIndex: req.body.orderIndex !== undefined ? parseInt(req.body.orderIndex) : 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      galleryYear: req.body.galleryYear || null,
      category: req.body.category || null,
    };

    console.log('Creating gallery image with data:', imageData);

    const image = await GalleryImage.create(imageData);
  const createdImage = await GalleryImage.findByPk(image.id, {
    include: [
      { model: Media, as: 'image', required: false },
      { model: GalleryEvent, as: 'event', required: false }
    ]
  });
  return status.responseStatus(res, 201, "Created", createdImage);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      body: req.body
    });
    return status.responseStatus(res, 500, `Failed to create gallery image: ${error.message}`, { error: error.message });
  }
});

exports.updateImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = await GalleryImage.findByPk(id);
  if (!image) {
    return status.responseStatus(res, 404, "Image not found");
  }
  await image.update(req.body);
  const updatedImage = await GalleryImage.findByPk(id, {
    include: [
      { model: Media, as: 'image', required: false },
      { model: GalleryEvent, as: 'event', required: false }
    ]
  });
  return status.responseStatus(res, 200, "Updated", updatedImage);
});

exports.deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = await GalleryImage.findByPk(id);
  if (!image) {
    return status.responseStatus(res, 404, "Image not found");
  }
  await image.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

exports.getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = await GalleryImage.findByPk(id, {
    include: [
      { model: Media, as: 'image', required: false },
      { model: GalleryEvent, as: 'event', required: false }
    ]
  });
  if (!image) {
    return status.responseStatus(res, 404, "Image not found");
  }
  return status.responseStatus(res, 200, "OK", image);
});

// Bulk operations
exports.reorderAlbums = asyncHandler(async (req, res) => {
  const { albums } = req.body;
  for (const { id, orderIndex } of albums) {
    await GalleryAlbum.update({ orderIndex }, { where: { id } });
  }
  return status.responseStatus(res, 200, "Reordered");
});

exports.reorderEvents = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const { events } = req.body;
  for (const { id, orderIndex } of events) {
    await GalleryEvent.update({ orderIndex }, { where: { id, albumId } });
  }
  return status.responseStatus(res, 200, "Reordered");
});

exports.reorderImages = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { images } = req.body;
  for (const { id, orderIndex } of images) {
    await GalleryImage.update({ orderIndex }, { where: { id, eventId } });
  }
  return status.responseStatus(res, 200, "Reordered");
});

