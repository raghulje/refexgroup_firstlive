const router = require("express").Router();
const controller = require("../controllers/globalSettingsController");

router.get("/", controller.getAll);
router.get("/:key", controller.getByKey);
router.post("/", controller.create);
router.put("/:key", controller.update);
router.delete("/:key", controller.delete);

module.exports = router;

