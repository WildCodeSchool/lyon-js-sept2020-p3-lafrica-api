const campaignsRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const campaignsController = require('../controllers/campaigns');
const handleTextUpload = require('../middlewares/handleTextUpload');
const handleContactsUpload = require('../middlewares/handleContactsUpload');

campaignsRouter.get('/', asyncHandler(campaignsController.getCollection));
campaignsRouter.post(
  '/uploadtext',
  handleTextUpload,
  asyncHandler(campaignsController.readText)
);
campaignsRouter.post(
  '/uploadcontacts',
  handleContactsUpload,
  asyncHandler(campaignsController.readContacts)
);
campaignsRouter.post('/TTS', asyncHandler(campaignsController.vocalization));
campaignsRouter.get('/audio', asyncHandler(campaignsController.playAudio));
campaignsRouter.get(
  '/downloadaudio',
  asyncHandler(campaignsController.downloadAudio)
);

module.exports = campaignsRouter;
