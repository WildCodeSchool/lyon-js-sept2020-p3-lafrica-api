const xlsx = require('xlsx');
const Excel = require('exceljs');
const path = require('path');
const fs = require('fs');
const {
  findAllContacts,
  createContacts,
  modifyContact,
  deleteContact,
  findContactsForCampaign,
} = require('../models/contacts');

module.exports.getCollection = async (req, res) => {
  const data = await findAllContacts(req.currentUser.id);
  if (data) {
    return res.status(200).json(data);
  }
  return res.status(400).send(`Impossible d'afficher les contacts`);
};

module.exports.getCollectionForCampaign = async (req, res) => {
  let { limit = 10, offset = 0 } = req.query;
  const campaign_id = parseInt(req.campaign_id, 10);
  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  const [total, contacts] = await findContactsForCampaign(
    campaign_id,
    limit,
    offset
  );
  if (contacts) {
    return res.status(200).json({ total, contacts });
  }
  return res.status(400).send(`Impossible d'afficher les contacts`);
};

module.exports.createContacts = async (req, res) => {
  const data = await createContacts(
    req.body,
    req.currentUser.id,
    req.campaign_id
  );
  if (data) {
    return res.status(201).json(data);
  }
  return res.status(400).send(`Impossible to add new contact(s)`);
};

module.exports.modifyContact = async (req, res) => {
  const data = await modifyContact(req.body, req.params.id_contact);
  if (data) {
    return res.status(200).json(data);
  }
  return res.status(400).send(`Impossible to update contact(s)`);
};

module.exports.readContacts = async (req, res) => {
  let contactsArray;
  try {
    const workbook = xlsx.readFile(req.file.path);
    const rawData = workbook.SheetNames;
    contactsArray = xlsx.utils.sheet_to_json(workbook.Sheets[rawData[0]]);
  } catch (err) {
    throw new Error(err);
  }
  fs.unlink(req.file.path, (err) => {
    if (err) throw err;
  });

  const data = await createContacts(
    contactsArray,
    req.currentUser.id,
    req.campaign_id
  );
  if (data) {
    return res.status(201).json(data);
  }
  return res.status(400).send(`Impossible to create new contacts`);
};

module.exports.deleteContact = async (req, res) => {
  const data = await deleteContact(req.params.id_contact, req.campaign_id);
  if (data) {
    return res.status(200).send('Contact successfully deleted');
  }
  return res.status(400).send(`Impossible to delete this contact`);
};

module.exports.exportContacts = async (req, res) => {
  const campaignId = parseInt(req.campaign_id, 10);
  // eslint-disable-next-line no-unused-vars
  const [total, data] = await findContactsForCampaign(campaignId);
  if (data) {
    const workbook = new Excel.Workbook();

    const contactsFileName = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 5);
    const worksheet = workbook.addWorksheet('Contacts');
    worksheet.columns = [
      { header: 'lastname', key: 'lastname' },
      { header: 'firstname', key: 'firstname' },
      { header: 'phone_number', key: 'phone_number' },
    ];
    worksheet.columns.forEach((column) => {
      // eslint-disable-next-line no-param-reassign
      column.width = column.header.length < 12 ? 12 : column.header.length;
    });
    worksheet.getRow(1).font = { bold: true };
    data.forEach((e) => {
      worksheet.addRow({
        ...e,
      });
    });
    const pathFile = path.join(
      `${__dirname}/../file-storage/private/${contactsFileName}.xlsx`
    );
    await workbook.xlsx.writeFile(pathFile);
    return res.status(200).download(pathFile);
  }
  return res.status(400).send(`Impossible d'afficher les contacts`);
};

module.exports.exportStatistics = async (req, res) => {
  const campaignId = parseInt(req.campaign_id, 10);
  // eslint-disable-next-line no-unused-vars
  const [total, data] = await findContactsForCampaign(campaignId);
  // need to create a workbook object. Almost everything in ExcelJS is based off of the workbook object.
  const workbook = new Excel.Workbook();

  const statisticsFileName = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
  const worksheet = workbook.addWorksheet('Statistiques');
  worksheet.columns = [
    { header: 'lastname', key: 'lastname' },
    { header: 'firstname', key: 'firstname' },
    { header: 'phone_number', key: 'phone_number' },
    { header: 'sending_status', key: 'sending_status' },
  ];
  worksheet.columns.forEach((column) => {
    // eslint-disable-next-line no-param-reassign
    column.width = column.header.length < 12 ? 12 : column.header.length;
  });

  worksheet.getRow(1).font = { bold: true };

  data.forEach((e) => {
    worksheet.addRow({
      ...e,
    });
  });

  const pathFile = path.join(
    `${__dirname}/../file-storage/private/${statisticsFileName}.xlsx`
  );
  await workbook.xlsx.writeFile(pathFile);

  res.download(pathFile);
};
