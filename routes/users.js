const userRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const userController = require('../controllers/users');

userRouter.post('/signUp', asyncHandler(userController.handlePost));

module.exports = userRouter;
