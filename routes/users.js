const userRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const userController = require('../controllers/campaigns');

userRouter.get('/signUp', asyncHandler(userController.handlePost));

module.exports = userRouter;
