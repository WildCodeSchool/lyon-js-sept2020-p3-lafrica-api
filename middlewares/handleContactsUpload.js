const multer = require('multer');
const path = require('path');
const { FileTypeError } = require('../error-types');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'file-storage/private');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = ['.xls', '.xlsx', '.csv'];
  const mimetypes = /text\/csv||application\/vnd.ms-excel||application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/;

  const mimetype = mimetypes.test(file.mimetype);
  const fileExtension = path.extname(file.originalname).toLocaleLowerCase();
  let extname = false;

  filetypes.forEach((filetype) => {
    if (fileExtension === filetype) {
      extname = true;
    }
  });

  if (mimetype && extname) {
    return cb(null, true);
  }
  const err = `File upload only support the following filetypes - ${filetypes}`;
  return cb(new FileTypeError(err));
};

const uploadText = multer({ storage, fileFilter }).single('uploaded_contacts');

module.exports = uploadText;
