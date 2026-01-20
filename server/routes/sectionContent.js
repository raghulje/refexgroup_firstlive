const router = require("express").Router();
const controller = require("../controllers/sectionContentController");

router.put("/:id", controller.update);
router.post("/bulk", controller.bulkUpdate);
router.delete("/:id", controller.delete);

module.exports = router;

