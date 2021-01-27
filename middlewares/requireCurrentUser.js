const userModel = require("../models/users.js");

module.exports = async (req, res, next) => {
  const user = await userModel.findOne(req.session.userId, false);
  if (user && parseInt(req.params.user_id, 10) === user.id) {
    delete user.encrypted_password;
    req.currentUser = user;

    if (req.params.campaign_id) {
      req.campaign_id = req.params.campaign_id;
    }

    return next();
  }

  return res.sendStatus(401);
};
