const campaignsRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const campaignsController = require('../controllers/campaigns');

campaignsRouter.get('/', asyncHandler(campaignsController.getCollection));

module.exports = campaignsRouter;
