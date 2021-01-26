const Joi = require('joi');

const schema = Joi.object({
  passwordValidator: Joi.string()
    .required()
    .pattern(
      new RegExp(/^(?=.{6,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/)
    ),
  password_confirmationValidator: Joi.ref('passwordValidator'),
}).with('password', 'password_confirmation');

module.exports = async (req, res, next) => {
  const { password, password_confirmation } = req.body;

  try {
    await schema.validateAsync({
      passwordValidator: password,
      password_confirmationValidator: password_confirmation,
    });
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      errorMessage:
        'Password must be at least 6 characters and contain one uppercase, one lowercase and one special character',
    });
  }
};
