/* eslint-disable */
class RecordNotFoundError extends Error {
  constructor(collection, id) {
    super("A record required to perform an operation wasn't found");
    this.collection = collection;
    this.id = id;
  }
}
class ValidationError extends Error {
  constructor(errorsByField) {
    super('Invalid data was provided');
    this.errorsByField = errorsByField;
  }
}
class FileTypeError extends Error {
  constructor(errorsByFileType) {
    super(errorsByFileType);
    this.errorsByFileType = errorsByFileType;
  }
}

module.exports = {
  RecordNotFoundError,
  ValidationError,
  FileTypeError,
};
