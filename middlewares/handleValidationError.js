const { ValidationError } = require('../error-types');

// eslint-disable-next-line
module.exports = (error, req, res, next) => {
  if (error instanceof ValidationError)
    return res.status(422).send({
      errorMessage: error.message,
      ...error,
    });
  return next(error);
};
