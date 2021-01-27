const nodemailer = require('nodemailer');
const User = require('../models/users');
const {
  MAIL_SERVICE,
  MAIL_ADRESS,
  MAIL_PASSWORD,
  MAIL_CLIENT_URL,
} = require('../env');

module.exports.login = async (req, res) => {
  const user = await User.findByEmail(req.body.email, false);
  if (
    user &&
    (await User.verifyPassword(user.encrypted_password, req.body.password))
  ) {
    if (req.body.stayConnected) {
      req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
    }
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) return res.sendStatus(500);
      const userDetails = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
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

module.exports.forgot = async (req, res) => {
  const user = await User.findByEmail(req.body.email, false);
  if (user) {
    const token = await User.forgotPassword(user.id);
    if (token) {
      const transporter = nodemailer.createTransport({
        service: MAIL_SERVICE,
        auth: {
          user: MAIL_ADRESS,
          pass: MAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: MAIL_SERVICE,
        to: user.email,
        subject: 'Mot de passe oublié',
        text: `Bonjour, \n\n Une demande pour réinitialiser le mot de passe de votre espace voix L'Africa Mobile a été effectuée. \n\n Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer ce mail. \n\n Pour définir un nouveau mot de passe, cliquez sur le lien ci-dessous : \n\n ${MAIL_CLIENT_URL}/reset/${token} \n\n Si le lien ne fonctionne pas, vous pouvez le copier et le coller dans la barre d’adresse de votre navigateur. Pour des raisons de sécurité, ce lien ne sera valable que 1 heure. Passé ce délai, nous vous invitons à cliquer sur le lien "Mot de passe oublié" sur la page de connexion de l'application.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        console.log('message sent at', user.email);
        console.log('response', info.response);
      });
      return res.sendStatus(200);
    }
  }
  return res
    .status(404)
    .json({ message: 'No account with that email address exists.' });
};

module.exports.reset = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.checkUserToken(token);
  if (user) {
    const updatedPassword = await User.resetPassword(password, user.id);
    if (updatedPassword) {
      return res.status(200).send('Password successfully modified');
    }
    return res.status(404).send('An error occured during modifying password');
  }
  return res.status(404).send('The token is invalid or has expired');
};
