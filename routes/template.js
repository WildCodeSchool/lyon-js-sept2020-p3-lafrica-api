const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const templateController = require('../controllers/template');

router.get('/', asyncHandler(templateController.getTemplate));

module.exports = router;
