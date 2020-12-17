const userModel = require('../models/users.js');

module.exports = async (req, res, next) => {
  const user = await userModel.findOne(req.session.userId, false);
  if (user && parseInt(req.params.user_id, 10) === user.id) {
    console.log(user.id);
    console.log(req.params.user_id);

    delete user.encrypted_password;
    req.currentUser = user;
    return next();
  }

  return res.sendStatus(401);
};
