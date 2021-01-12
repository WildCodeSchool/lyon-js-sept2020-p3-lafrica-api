const { FileTypeError } = require('../error-types');

// eslint-disable-next-line
module.exports = (error, req, res, next) => {
  if (error instanceof FileTypeError) {
    console.log(error);
    return res.status(404).send({
      errorMessage: error.message,
    });
  }
  return next(error);
};
