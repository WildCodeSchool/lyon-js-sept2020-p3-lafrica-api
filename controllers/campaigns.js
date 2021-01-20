const fs = require('fs');
const path = require('path');
const util = require('util');
const WordFileReader = require('../helpers/handleReadWordFile');
const { findAllCampaigns, findOneCampaign } = require('../models/campaigns');
const textVocalization = require('../services/textToSpeech');

module.exports.getCollection = async (req, res) => {
  const data = await findAllCampaigns(req.currentUser.id);
  res.json(data);
};

module.exports.getOneCampaign = async (req, res) => {
  const campaign_id = req.params.campaignId;
  const data = await findOneCampaign(campaign_id);
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
  stream.on('error', () => {
    res
      .status(404)
      .json({ errorMessage: 'The requested audio file does not exist' });
  });
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
