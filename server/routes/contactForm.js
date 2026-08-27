const router = require('express').Router();
const controller = require('../controllers/contactFormController');
const { contactFormValidation } = require('../controllers/contactFormController');
const { requireAuth } = require('../middlewares/auth');

function withFormMeta(meta) {
  return (req, _res, next) => {
    req.contactFormMeta = meta;
    next();
  };
}

router.post('/submit', contactFormValidation, controller.submit);

router.post(
  '/business-commute',
  withFormMeta({
    endpoint: 'business-commute',
    formName: 'Business Commute',
    defaultProduct: 'Business Travel',
    websiteName: 'Refex Mobility',
  }),
  contactFormValidation,
  controller.submit
);

router.post(
  '/ets',
  withFormMeta({
    endpoint: 'ets',
    formName: 'ETS',
    defaultProduct: 'Employee Transfers',
    websiteName: 'Refex Mobility',
  }),
  contactFormValidation,
  controller.submit
);

router.post(
  '/corporate-rentals',
  withFormMeta({
    endpoint: 'corporate-rentals',
    formName: 'Corporate Rentals',
    defaultProduct: 'Spot Rental',
    websiteName: 'Refex Mobility',
  }),
  contactFormValidation,
  controller.submit
);

router.get('/email-config', requireAuth, controller.getEmailConfig);
router.post('/test-email', requireAuth, controller.testEmail);

module.exports = router;
