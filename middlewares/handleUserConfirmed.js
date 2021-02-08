const userModel = require('../models/users.js');

module.exports = async (req, res, next) => {
  const user = await userModel.findOne(req.session.userId, false);
  if (user.user_confirmed) {
    return next();
  }
  return res
    .status(403)
    .send('This account has not been confirmed by the administrator yet.');
};
