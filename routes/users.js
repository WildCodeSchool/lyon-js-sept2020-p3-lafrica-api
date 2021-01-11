const userRouter = require('express').Router();

const asyncHandler = require('express-async-handler');
const userController = require('../controllers/users');
const handleNewUserCredentials = require('../middlewares/handleNewUserCredentials');

userRouter.post(
  '/signUp',
  handleNewUserCredentials,
  asyncHandler(userController.handlePost)
);
// userRouter.get('/:user_id', requireCurrentUser, asyncHandler());
// pourra servir à afficher une page de l'utilisateur pour récupérer ses infos et les modifier (ROUTE + PUT MODEL)

module.exports = userRouter;
