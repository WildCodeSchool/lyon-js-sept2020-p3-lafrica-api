const campaignsRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const campaignsController = require('../controllers/campaigns');
const uploadText = require('../middlewares/uploadText');

campaignsRouter.get('/', asyncHandler(campaignsController.getCollection));
campaignsRouter.post('/', asyncHandler(campaignsController.createCampaign));

campaignsRouter.post(
  '/uploadtext',
  uploadText,
  asyncHandler(campaignsController.readText)
);
campaignsRouter.post('/TTS', asyncHandler(campaignsController.vocalization));
campaignsRouter.get('/audio', asyncHandler(campaignsController.playAudio));
campaignsRouter.get(
  '/downloadaudio',
  asyncHandler(campaignsController.downloadAudio)
);

module.exports = campaignsRouter;
