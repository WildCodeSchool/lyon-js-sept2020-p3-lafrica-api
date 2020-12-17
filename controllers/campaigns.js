const fs = require('fs');
const path = require('path');
const { findAllCampaigns } = require('../models/campaigns');
const quickStart = require('../services/textToSpeech');

module.exports.getCollection = async (req, res) => {
  const [data] = await findAllCampaigns(req.currentUser.id);
  res.json(data);
};

module.exports.vocalization = async (req, res) => {
  const fileName = await quickStart(req.body.message);
  res.status(200).send(fileName);
};

module.exports.playAudio = async (req, res) => {
  const audioFile = `${req.query.audio}.mp3`;
  // res.type = path.extname(audio);
  const pathFile = path.join(`${__dirname}/../file-storage/public`);
  const stream = fs.createReadStream(`${pathFile}/${audioFile}`);
  stream.pipe(res);
};
