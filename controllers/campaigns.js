const fs = require("fs");
const path = require("path");
const util = require("util");
const parseSortParams = require("../helpers/parseSortParams");
const {
  findUsersCampaigns,
  findOneCampaign,
  createCampaignId,
  updateCampaign,
  findAllClientCampaigns,
  stopCampaign,
  deleteCampaign,
} = require("../models/campaigns");
const WordFileReader = require("../helpers/handleReadWordFile");
const textVocalization = require("../services/textToSpeech");

module.exports.getCollection = async (req, res) => {
  let { limit = 10, offset = 0 } = req.query;
  const { name, sortby = "date.asc", lastname, firstname } = req.query;
  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  const orderBy = parseSortParams(sortby);

  if (req.currentUser.role === "admin") {
    const [total, campaigns] = await findAllClientCampaigns(
      limit,
      offset,
      name,
      orderBy,
      firstname,
      lastname
    );
    return res.json({ total, campaigns });
  }
  const [total, campaigns] = await findUsersCampaigns(
    req.currentUser.id,
    limit,
    offset,
    name,
    orderBy
  );
  return res.json({ total, campaigns });
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
  stream.on("error", () => {
    res
      .status(404)
      .json({ errorMessage: "The requested audio file does not exist" });
  });
  stream.pipe(res);
};

module.exports.downloadAudio = async (req, res) => {
  const audioFile = `${req.query.audio}`;
  const pathFile = path.join(
    `${__dirname}/../file-storage/private/${audioFile}`
  );

  const access = util.promisify(fs.access);

  try {
    await access(pathFile);
  } catch (err) {
    return res
      .status(404)
      .json({ errorMessage: "The requested audio file does not exist" });
  }

  return res.download(pathFile);
};

module.exports.video = async (req, res) => {
  const pathFile = path.join(
    `${__dirname}/../file-storage/public/tutorielText2voice.mp4`
  );

  const stream = fs.createReadStream(`${pathFile}`);
  stream.on("error", () => {
    res.status(404).json({ errorMessage: "Cannot access to the video" });
  });
  stream.pipe(res);
};

module.exports.readText = async (req, res) => {
  const readfile = util.promisify(fs.readFile);
  const fileExtension = path.extname(req.file.path);
  let uploadedTextToVocalize;
  switch (fileExtension) {
    case ".txt":
      try {
        uploadedTextToVocalize = await readfile(req.file.path, "utf-8");
        break;
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .send("Something went wrong in reading .txt file");
      }
    case ".docx":
      try {
        uploadedTextToVocalize = await WordFileReader.extract(req.file.path);
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .send("Something went wrong in reading .docx file");
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
    .send("Something went wrong uploading campaigns database");
};

module.exports.updateCampaign = async (req, res) => {
  const campaign_id = req.params.campaignId;
  const campaignDatas = req.body;
  // const contactsList = req.body[1];
  const pathFile = path.join(
    `${__dirname}/../file-storage/private/${campaignDatas.campaign_vocal}`
  );

  fs.access(pathFile, (err) => {
    if (err) {
      return res
        .status(404)
        .json({ errorMessage: "The requested audio file does not exist" });
    }
    return true;
  });

  const data = await updateCampaign(campaign_id, campaignDatas);
  if (data) {
    return res.status(200).json(data);
  }
  return res
    .status(500)
    .send("Something went wrong uploading campaigns database");
};

module.exports.stopCampaign = async (req, res) => {
  const campaign_id = req.params.campaignId;

  const result = await stopCampaign(campaign_id);
  if (result) {
    return res.status(200).json(result);
  }
  return res.status(400).json({
    error: "This campaign has already been send and cannot be stopped",
  });
};

module.exports.deleteCampaign = async (req, res) => {
  const campaignData = await findOneCampaign(req.params.campaignId);
  if (campaignData.sending_status === 2) {
    return res
      .status(400)
      .send("The campaign cannot be deleted as it has already been send");
  }
  if (campaignData.sending_status !== 2) {
    await deleteCampaign(req.params.campaignId);
    return res.status(200).send("Campaign successfully deleted");
  }
  return res.status(500).send(`An error occured in deleting campaign.`);
};
