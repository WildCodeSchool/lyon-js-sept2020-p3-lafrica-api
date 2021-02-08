const userModel = require('../models/users.js');

module.exports = async (req, res, next) => {
  const user = await userModel.findOne(req.session.userId, false);
  if (user.role === 'admin') {
    return next();
  }

  return res.sendStatus(401);
};
