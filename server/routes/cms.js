const express = require('express');
const router = express.Router();
const models = require('../models');
const crudFactory = require('../controllers/crudFactory');

// List Models
const listModels = [
    { path: '/esg-pillars', model: models.ESGPillar },
    { path: '/esg-policies', model: models.ESGPolicy },
    { path: '/renewables-projects', model: models.RenewablesProject },
    { path: '/refrigerants-products', model: models.RefrigerantsProduct },
    { path: '/refrigerants-features', model: models.RefrigerantsFeature },
    { path: '/diversity-initiatives', model: models.DiversityInitiative },
    { path: '/career-testimonials', model: models.CareerTestimonial },
];

listModels.forEach(({ path, model }) => {
    const controller = crudFactory(model, 'list', ['image', 'mainImage']); // Generic include
    router.get(path, controller.getAll);
    router.post(path, controller.create);
    router.put(`${path}/:id`, controller.update);
    router.delete(`${path}/:id`, controller.delete);
});

// Singleton Models
const singletonModels = [
    { path: '/home-about', model: models.HomeAboutSection },
    { path: '/home-cta', model: models.HomeCTASection },
    { path: '/about-page', model: models.AboutPageContent },
    { path: '/esg-page', model: models.ESGPageContent },
    { path: '/careers-page', model: models.CareersPageContent },
    { path: '/contact-page', model: models.ContactPageContent },
    { path: '/newsroom-page', model: models.NewsroomPageContent },
    { path: '/refrigerants-page', model: models.RefrigerantsContent },
    { path: '/renewables-page', model: models.RenewablesContent },
    { path: '/investments-page', model: models.InvestmentsPageContent },
    { path: '/diversity-page', model: models.DiversityPageContent },
    { path: '/gallery-page', model: models.GalleryPageContent },
];

singletonModels.forEach(({ path, model }) => {
    const controller = crudFactory(model, 'singleton', []);
    // Singleton routes: GET / and PUT / (no IDs)
    router.get(path, controller.get);
    router.put(path, controller.update);
});

module.exports = router;
