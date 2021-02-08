const userRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const userController = require('../controllers/users');
const handleNewUserCredentials = require('../middlewares/handleNewUserCredentials');
const requireAdminUser = require('../middlewares/requireAdminUser');

userRouter.post(
  '/signup',
  handleNewUserCredentials,
  asyncHandler(userController.handlePost)
);

userRouter.put(
  '/:user_id',
  requireAdminUser,
  asyncHandler(userController.validateUser)
);

userRouter.get('/', requireAdminUser, asyncHandler(userController.getAllUsers));

module.exports = userRouter;
