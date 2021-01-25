const fs = require("fs");
const path = require("path");
const util = require("util");
const {
  findUsersCampaigns,
  findOneCampaign,
  createCampaignId,
  updateCampaign,
} = require("../models/campaigns");
const WordFileReader = require("../helpers/handleReadWordFile");
const textVocalization = require("../services/textToSpeech");

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
  console.log(pathFile);
  res.download(pathFile);
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
    .send("Something went wrong uploading campaigns database");
};

module.exports.exportStatistics = async (req, res) => {
  const data = [
    {
      firstName: "John",
      lastName: "Bailey",
      purchasePrice: 1000,
      paymentsMade: 100,
    },
    {
      firstName: "Leonard",
      lastName: "Clark",
      purchasePrice: 1000,
      paymentsMade: 150,
    },
    {
      firstName: "Phil",
      lastName: "Knox",
      purchasePrice: 1000,
      paymentsMade: 200,
    },
    {
      firstName: "Sonia",
      lastName: "Glover",
      purchasePrice: 1000,
      paymentsMade: 250,
    },
    {
      firstName: "Adam",
      lastName: "Mackay",
      purchasePrice: 1000,
      paymentsMade: 350,
    },
    {
      firstName: "Lisa",
      lastName: "Ogden",
      purchasePrice: 1000,
      paymentsMade: 400,
    },
    {
      firstName: "Elizabeth",
      lastName: "Murray",
      purchasePrice: 1000,
      paymentsMade: 500,
    },
    {
      firstName: "Caroline",
      lastName: "Jackson",
      purchasePrice: 1000,
      paymentsMade: 350,
    },
    {
      firstName: "Kylie",
      lastName: "James",
      purchasePrice: 1000,
      paymentsMade: 900,
    },
    {
      firstName: "Harry",
      lastName: "Peake",
      purchasePrice: 1000,
      paymentsMade: 1000,
    },
  ];
  // need to create a workbook object. Almost everything in ExcelJS is based off of the workbook object.
  const workbook = 1; /* new Excel.Workbook(); */
  const worksheet = workbook.addWorksheet("Debtors");
  worksheet.columns = [
    { header: "First Name", key: "firstName" },
    { header: "Last Name", key: "lastName" },
    { header: "Purchase Price", key: "purchasePrice" },
    { header: "Payments Made", key: "paymentsMade" },
    { header: "Amount Remaining", key: "amountRemaining" },
    { header: "% Remaining", key: "percentRemaining" },
  ];
  // force the columns to be at least as long as their header row.
  // Have to take this approach because ExcelJS doesn't have an autofit property.
  worksheet.columns.forEach((column) => {
    // eslint-disable-next-line no-param-reassign
    column.width = column.header.length < 12 ? 12 : column.header.length;
  });
  // Make the header bold.
  // Note: in Excel the rows are 1 based, meaning the first row is 1 instead of 0.
  worksheet.getRow(1).font = { bold: true };
  // Dump all the data into Excel
  data.forEach((e) => {
    // row 1 is the header.
    // By using destructuring we can easily dump all of the data into the row without doing much
    // We can add formulas pretty easily by providing the formula property.
    worksheet.addRow({
      ...e,
    });
  });
  // Keep in mind that reading and writing is promise based.
  await workbook.xlsx.writeFile("Debtors.xlsx");
  const myFile = "Debtors.xlsx";
  const pathFile = path.join(`${__dirname}/../${myFile}`);
  /* res.download(pathFile); */
  res.download(pathFile);
};
