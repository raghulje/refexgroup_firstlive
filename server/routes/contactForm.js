const router = require("express").Router();
const controller = require("../controllers/contactFormController");
const { contactFormValidation } = require("../controllers/contactFormController");
const { requireAuth } = require("../middlewares/auth");

// Public route - submit contact form
router.post("/submit", contactFormValidation, controller.submit);

// Protected routes - email configuration (admin only)
router.get("/email-config", requireAuth, controller.getEmailConfig);
router.post("/test-email", requireAuth, controller.testEmail);

module.exports = router;

