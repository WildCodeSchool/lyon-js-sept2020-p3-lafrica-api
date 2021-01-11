const userRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const userController = require('../controllers/users');
const joiValidator = require('../middlewares/joiValidator');

userRouter.post(
  '/signUp',
  joiValidator,
  asyncHandler(userController.handlePost)
);

module.exports = userRouter;
