const router = require("express").Router();
const controller = require("../controllers/mediaController");
const { requireAuth } = require("../middlewares/auth");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", requireAuth, controller.create);
router.post("/download-url", requireAuth, controller.downloadFromUrl);
router.put("/:id", requireAuth, controller.update);
router.delete("/:id", requireAuth, controller.delete);

module.exports = router;

