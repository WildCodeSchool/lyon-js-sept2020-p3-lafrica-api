const fs = require('fs');
const path = require('path');
const util = require('util');
const { findAllCampaigns, createCampaign } = require('../models/campaigns');
const WordFileReader = require('../helpers/handleReadWordFile');
const textVocalization = require('../services/textToSpeech');

module.exports.getCollection = async (req, res) => {
  const [data] = await findAllCampaigns(req.currentUser.id);
  res.json(data);
};

module.exports.vocalization = async (req, res) => {
  const fileName = await textVocalization(req.body);
  res.status(200).send(fileName);
};

module.exports.playAudio = async (req, res) => {
  const audioFile = `${req.query.audio}`;
  const pathFile = path.join(`${__dirname}/../file-storage/private`);
  const stream = fs.createReadStream(`${pathFile}/${audioFile}`);
  stream.pipe(res);
};

module.exports.downloadAudio = async (req, res) => {
  const audioFile = `${req.query.audio}`;
  const pathFile = path.join(
    `${__dirname}/../file-storage/private/${audioFile}`
  );
  res.download(pathFile);
};

module.exports.readText = async (req, res) => {
  const readfile = util.promisify(fs.readFile);
  const fileExtension = path.extname(req.file.path);
  let uploadedTextToVocalize;
  switch (fileExtension) {
    case '.txt':
      try {
        uploadedTextToVocalize = await readfile(req.file.path, 'utf-8');
        break;
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .send('Something went wrong in reading .txt file');
      }
    case '.docx':
      try {
        uploadedTextToVocalize = await WordFileReader.extract(req.file.path);
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .send('Something went wrong in reading .docx file');
      }
      break;
    default:
      return null;
  }
  fs.unlink(req.file.path, (err) => {
    if (err) throw err;
    console.log(`${req.file.originalname} has successfully been deleted`);
  });
  return res.send(uploadedTextToVocalize);
};

module.exports.createCampaign = async (req, res) => {
  const campaignDatas = req.body;
  const data = await createCampaign(campaignDatas);
  if (data) {
    return res.status(200).send(data);
  }
  return res
    .status(500)
    .send('Something went wrong uploading campaigns database');
};
