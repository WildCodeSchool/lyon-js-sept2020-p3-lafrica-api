const nodemailer = require('nodemailer');
const User = require('../models/users');
const { MAIL_SERVICE, MAIL_ADRESS, MAIL_PASSWORD } = require('../env');
const parseSortParams = require('../helpers/parseSortParams');

module.exports.handlePost = async (req, res) => {
  const user = await User.createUserInDatabase(req.body);
  return res.status(201).send(user);
};

module.exports.validateUser = async (req, res) => {
  const userConfirmed = await User.validateUser(req.params.user_id);

  const { email } = req.body;

  if (userConfirmed) {
    const transporter = nodemailer.createTransport({
      service: MAIL_SERVICE,
      auth: {
        user: MAIL_ADRESS,
        pass: MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: MAIL_SERVICE,
      to: email,
      subject: 'Votre inscription est confirmée',
      text: `Bonjour, \n\n Votre inscription à l'espace voix L'Africa Mobile est confirmée.\n\n Vous avez désormais accès à l'ensemble des fonctionnalités. \n\n Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer ce mail. `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) console.log(error);
    });
    return res.json(userConfirmed);
  }
  return res
    .status(400)
    .send('An error occured during the confirmation of this user account');
};

module.exports.getAllUsers = async (req, res) => {
  let { limit = 10, offset = 0 } = req.query;
  const {
    sortby = 'user_confirmed.asc',
    lastname,
    firstname,
    email,
  } = req.query;
  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  const orderBy = parseSortParams(sortby);

  const [total, users] = await User.getCollection(
    limit,
    offset,
    orderBy,
    firstname,
    lastname,
    email
  );
  return res.json({ total, users });
};
