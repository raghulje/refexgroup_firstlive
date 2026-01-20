const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeSectionsController');

// Home Video Section
router.get('/home-video-section', controller.getVideoSection);
router.put('/home-video-section', controller.updateVideoSection);

// Home About Section
router.get('/home-about-section', controller.getAboutSection);
router.put('/home-about-section', controller.updateAboutSection);

// Home Careers Section
router.get('/home-careers-section', controller.getCareersSection);
router.put('/home-careers-section', controller.updateCareersSection);

// Home CTA Section (List)
router.get('/home-cta-section', controller.getCTASections);
router.post('/home-cta-section', controller.createCTASection);
router.put('/home-cta-section/:id', controller.updateCTASection);
router.delete('/home-cta-section/:id', controller.deleteCTASection);

module.exports = router;
