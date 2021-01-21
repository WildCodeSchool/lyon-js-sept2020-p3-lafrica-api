const fs = require('fs');
const path = require('path');
const util = require('util');
const {
  findUsersCampaigns,
  findOneCampaign,
  createCampaignId,
  updateCampaign,
} = require('../models/campaigns');
const WordFileReader = require('../helpers/handleReadWordFile');
const textVocalization = require('../services/textToSpeech');

module.exports.getCollection = async (req, res) => {
  const data = await findUsersCampaigns(req.currentUser.id);
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
  console.log(pathFile);
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

module.exports.createCampaignId = async (req, res) => {
  const { id } = req.currentUser;

  const data = await createCampaignId(id);
  if (data) {
    return res.status(200).json({ campaign_id: data.id });
  }
  return res
    .status(500)
    .send('Something went wrong uploading campaigns database');
};

module.exports.updateCampaign = async (req, res) => {
  const campaign_id = req.params.campaignId;
  const campaignDatas = req.body[0];
  // const contactsList = req.body[1];

  const data = await updateCampaign(campaign_id, campaignDatas);
  if (data) {
    // const { campaignData } = data;
    // const data2 = await assignContactsToCampaign(contactsList, campaignData.id);
    return res.status(200).json(data);
  }
  return res
    .status(500)
    .send('Something went wrong uploading campaigns database');
};
