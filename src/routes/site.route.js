const express = require('express');

const router = express.Router();
const siteController = require('../controllers/site.controller');

router.get('/', siteController.getHomePage);
module.exports = router;
