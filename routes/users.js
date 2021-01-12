const userRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const userController = require('../controllers/users');
const handleNewUserCredentials = require('../middlewares/handleNewUserCredentials');

userRouter.post(
  '/signUp',
  handleNewUserCredentials,
  asyncHandler(userController.handlePost)
);

module.exports = userRouter;
