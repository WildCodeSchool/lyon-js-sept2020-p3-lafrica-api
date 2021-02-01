const path = require('path');

module.exports.getTemplate = async (req, res) => {
  const pathFile = path.join(`${__dirname}/../template.xlsx`);
  res.download(pathFile);
};
