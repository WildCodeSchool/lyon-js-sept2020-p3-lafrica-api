const xlsx = require('xlsx');
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
  const data = await findContactsForCampaign(campaign_id, limit, offset);
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
    return res.status(200).send('Le contact a été suprrimé');
  }
  return res.status(400).send(`Impossible de suprrimer le contact`);
};
