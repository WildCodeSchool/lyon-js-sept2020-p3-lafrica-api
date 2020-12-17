const campaignsRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const campaignsController = require('../controllers/campaigns');

campaignsRouter.get('/', asyncHandler(campaignsController.getCollection));
campaignsRouter.post('/TTS', asyncHandler(campaignsController.vocalization));
campaignsRouter.get('/audio', asyncHandler(campaignsController.playAudio));

module.exports = campaignsRouter;
