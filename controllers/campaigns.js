const fs = require("fs")
const { findAllCampaigns } = require('../models/campaigns');
const quickStart = require('../services/textToSpeech');

module.exports.getCollection = async (req, res) => {
  const [data] = await findAllCampaigns();
  res.json(data);
};

module.exports.vocalization = async (req, res) => {
  const fileName = await quickStart(req.body.message);
res.status(200).send(fileName)
};

module.exports.playAudio = async (req, res) => {
const audioFile = `${req.query.audio}.mp3`
// res.type = path.extname(audio);
const stream = fs.createReadStream(`/usr/src/app/file-storage/public/${  audioFile}`);
stream.pipe(res);
};
