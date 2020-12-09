const campaignsRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const campaignsController = require('../controllers/campaigns');

campaignsRouter.get('/', asyncHandler(campaignsController.getCollection));
campaignsRouter.get('/TTS', asyncHandler(campaignsController.vocalization));

module.exports = campaignsRouter;
