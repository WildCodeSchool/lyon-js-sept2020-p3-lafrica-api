const User = require('../models/users');

module.exports.login = async (req, res) => {
  const user = await User.findByEmail(req.body.email, false);
  if (
    user &&
    (await User.verifyPassword(user.encrypted_password, req.body.password))
  ) {
    if (req.body.stayConnected) {
      req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
    }
    req.session.cookie.maxAge = 60 * 60 * 1000;
    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) return res.sendStatus(500);
      const userDetails = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      };
      return res.status(200).json(userDetails);
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('session_id', { path: '/' });
    if (err) return res.sendStatus(500);
    return res.sendStatus(200);
  });
};
