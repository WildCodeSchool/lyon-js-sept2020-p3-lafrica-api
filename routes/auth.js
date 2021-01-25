const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/auth');
const handleResetPassword = require('../middlewares/handleResetPassword');
const requireRequestBody = require('../middlewares/requireRequestBody');

router.post('/login', requireRequestBody, asyncHandler(authController.login));
router.get('/logout', asyncHandler(authController.logout));
router.post('/forgot', asyncHandler(authController.forgot));
router.post(
  '/reset/:token',
  handleResetPassword,
  asyncHandler(authController.reset)
);

module.exports = router;
