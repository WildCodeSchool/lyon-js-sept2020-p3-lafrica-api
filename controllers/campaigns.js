const fs = require('fs');
const path = require('path');
const util = require('util');
const { findAllCampaigns, createCampaign } = require('../models/campaigns');
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
  const pathFile = path.join(`${__dirname}/../file-storage/public`);
  const stream = fs.createReadStream(`${pathFile}/${audioFile}`);
  stream.pipe(res);
};

module.exports.downloadAudio = async (req, res) => {
  const audioFile = `${req.query.audio}`;
  const pathFile = path.join(
    `${__dirname}/../file-storage/public/${audioFile}`
  );
  res.download(pathFile);
};

module.exports.readText = async (req, res) => {
  const readfile = util.promisify(fs.readFile);
  try {
    const uploadedTextToVocalize = await readfile(req.file.path, 'utf-8');
    return res.send(uploadedTextToVocalize);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong');
  }
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
