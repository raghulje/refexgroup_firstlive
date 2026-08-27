const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactFormController');
const { contactFormValidation } = require('../controllers/contactFormController');

router.post('/create-enquiry', contactFormValidation, controller.submit);
router.post('/check-enquiry', controller.checkEnquiry);

module.exports = router;
