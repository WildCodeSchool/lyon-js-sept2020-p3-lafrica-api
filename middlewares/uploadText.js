const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "file-storage/public");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /txt/;
  const mimetypes = /text\/plain/;
  const mimetype = mimetypes.test(file.mimetype);
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  const err = `Error : File upload only support the following filetypes - ${filetypes}`;
  console.error(err);
  return cb(err);
};

const uploadText = multer({ storage, fileFilter }).single("uploaded_text");

module.exports = uploadText;
