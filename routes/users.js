const userRouter = require("express").Router();

const asyncHandler = require("express-async-handler");
const userController = require("../controllers/users");
const joiValidator = require("../middlewares/joiValidator");

userRouter.post(
  "/signUp",
  joiValidator,
  asyncHandler(userController.handlePost)
);
// userRouter.get('/:user_id', requireCurrentUser, asyncHandler());
// pourra servir à afficher une page de l'utilisateur pour récupérer ses infos et les modifier (ROUTE + PUT MODEL)

module.exports = userRouter;
