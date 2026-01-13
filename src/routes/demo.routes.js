const express = require('express');
const demoController = require('../controllers/demo.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/headers', demoController.readHeaders);

router.post('/json', demoController.parseJson);

router.post('/form', demoController.parseForm);

router.post('/upload', authenticate, demoController.handleUpload);

router.get('/status/:code', demoController.returnStatus);

router.get('/error', demoController.triggerError);

router.get('/content-type', demoController.testContentType);

module.exports = router;
