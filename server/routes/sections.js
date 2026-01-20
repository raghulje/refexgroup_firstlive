const router = require("express").Router();
const controller = require("../controllers/sectionsController");

router.get("/page/:pageId", controller.getByPageId);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;

