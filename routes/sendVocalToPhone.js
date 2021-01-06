const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const sendVocalToPhone = require('../controllers/sendVocalToPhone');

router.post('/test', asyncHandler(sendVocalToPhone.test));
router.post('/message', asyncHandler(sendVocalToPhone.campaignMessages));

module.exports = router;
