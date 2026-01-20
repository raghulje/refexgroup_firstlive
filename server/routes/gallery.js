const router = require("express").Router();
const controller = require("../controllers/galleryController");
const { requireAuth } = require("../middlewares/auth");

// Public routes
// Albums
router.get("/albums", controller.getAlbums);
router.get("/albums/:slug", controller.getAlbumBySlug);
router.get("/albums/id/:id", controller.getAlbumById);

// Events
router.get("/albums/:albumId/events", controller.getEventsByAlbumId);
router.get("/albums/:albumSlug/events/:eventSlug", controller.getEventBySlug);
router.get("/events/:id", controller.getEventById);

// Images
router.get("/", controller.getImages);
router.get("/images/:id", controller.getImageById);

// CMS routes (protected)
// Albums CRUD
router.post("/albums", requireAuth, controller.createAlbum);
router.put("/albums/:id", requireAuth, controller.updateAlbum);
router.delete("/albums/:id", requireAuth, controller.deleteAlbum);
router.put("/albums/reorder", requireAuth, controller.reorderAlbums);

// Events CRUD
router.post("/albums/:albumId/events", requireAuth, controller.createEvent);
router.put("/events/:id", requireAuth, controller.updateEvent);
router.delete("/events/:id", requireAuth, controller.deleteEvent);
router.put("/albums/:albumId/events/reorder", requireAuth, controller.reorderEvents);

// Images CRUD
router.post("/images", requireAuth, controller.createImage);
router.put("/images/:id", requireAuth, controller.updateImage);
router.delete("/images/:id", requireAuth, controller.deleteImage);
router.put("/events/:eventId/images/reorder", requireAuth, controller.reorderImages);

module.exports = router;

