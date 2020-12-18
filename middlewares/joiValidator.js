const Joi = require("joi");

const schema = Joi.object({
  firstnameValidator: Joi.string().max(50).required(),
  lastnameValidator: Joi.string().max(50).required(),
  phone_numberValidator: Joi.string().pattern(
    new RegExp(/^(\+|00)[0-9]?()[0-9](\s|\S)(\d[0-9]{0,})$/)
  ),
  emailValidator: Joi.string()
    .required()
    .pattern(
      new RegExp(
        /^(([^<>()[\]\\.,;:\s@“]+(\.[^<>()[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ),
  passwordValidator: Joi.string()
    .required()
    .pattern(
      new RegExp(/^(?=.{6,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/)
    ),
  password_confirmationValidator: Joi.ref("password"),
}).with("password", "password_confirmation");

module.exports = async (req, res, next) => {
  const {
    firstname,
    lastname,
    phone_number,
    password,
    password_confirmation,
  } = req.body;

  try {
    await schema.validateAsync({
      firstnameValidator: firstname,
      lastnameValidator: lastname,
      phone_numberValidator: phone_number,
      passwordValidator: password,
      password_confirmationValidator: password_confirmation,
    });
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ errorMessage: err });
  }
};
