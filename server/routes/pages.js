const router = require("express").Router();
const controller = require("../controllers/pagesController");

router.get("/", controller.getAll);
router.get("/:slug", controller.getBySlug);
router.get("/id/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;

