const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/auth');
const requireRequestBody = require('../middlewares/requireRequestBody');

router.post('/login', requireRequestBody, asyncHandler(authController.login));
router.get('/logout', asyncHandler(authController.logout));

module.exports = router;
