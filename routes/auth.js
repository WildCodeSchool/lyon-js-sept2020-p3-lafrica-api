const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const authController = require("../controllers/auth");
const requireRequestBody = require("../middlewares/requireRequestBody");
const joiValidator = require("../middlewares/joiValidator");

router.post(
  "/login",
  requireRequestBody,
  joiValidator,
  asyncHandler(authController.login)
);
router.get("/logout", asyncHandler(authController.logout));

module.exports = router;
