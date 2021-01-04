const fs = require("fs");
const util = require("util");

module.exports = async (req, res, next) => {
  const readfile = util.promisify(fs.readFile);
  try {
    const uploadedTextToVocalize = await readfile(req.file.path, "utf-8");
    req.uploadedTextToVocalize = uploadedTextToVocalize;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
};
