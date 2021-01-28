const statisticsRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const statisticsController = require('../controllers/statistics');

statisticsRouter.get('/', asyncHandler(statisticsController.getAllCalls));

module.exports = statisticsRouter;
