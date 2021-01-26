const xlsx = require("xlsx");
const Excel = require("exceljs");
const path = require("path");
const fs = require("fs");
const {
  findAllContacts,
  createContacts,
  modifyContact,
  deleteContact,
  findContactsForCampaign,
} = require("../models/contacts");

module.exports.getCollection = async (req, res) => {
  const data = await findAllContacts(req.currentUser.id);
  if (data) {
    return res.status(200).json(data);
  }
  return res.status(400).send(`Impossible d'afficher les contacts`);
};

module.exports.getCollectionForCampaign = async (req, res) => {
  const data = await findContactsForCampaign(req.campaign_id);
  if (data) {
    return res.status(200).json(data);
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
  return res.status(400).send(`Impossible d'ajouter de nouveaux contacts`);
};

module.exports.modifyContact = async (req, res) => {
  const data = await modifyContact(req.body, req.params.id_contact);
  if (data) {
    return res.status(200).json(data);
  }
  return res.status(400).send(`Impossible de modifier le contact`);
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
  return res.status(400).send(`Impossible d'ajouter de nouveaux contacts`);
};

module.exports.deleteContact = async (req, res) => {
  const data = await deleteContact(req.params.id_contact, req.campaign_id);
  if (data) {
    return res.status(200).send("Le contact a été suprrimé");
  }
  return res.status(400).send(`Impossible de suprrimer le contact`);
};

module.exports.exportContacts = async (req, res) => {
  const data = await findContactsForCampaign(req.campaign_id);
  if (data) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Debtors");
    worksheet.columns = [
      { header: "Id", key: "id" },
      { header: "Nom de Famille", key: "lastname" },
      { header: "Prénom", key: "firstname" },
      { header: "Télephone", key: "phone_number" },
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
      `${__dirname}/../file-storage/private/contacts/contacts.xlsx`
    );
    await workbook.xlsx.writeFile(pathFile);
    return res.status(200).download(pathFile);
  }
  return res.status(400).send(`Impossible d'afficher les contacts`);
};
