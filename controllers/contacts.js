const xlsx = require('xlsx');
const fs = require('fs');
const { findAllContacts, createContacts } = require('../models/contacts');

module.exports.getCollection = async (req, res) => {
  const data = await findAllContacts(req.currentUser.id);
  res.json(data);
};

module.exports.createContacts = async (req, res) => {
  const data = await createContacts(req.body, req.currentUser.id);
  if (data) {
    return res.status(201).json(data);
  }
  return res.status(400).send(`Impossible d'ajouter de nouveaux contacts`);
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
  const data = await createContacts(contactsArray, req.currentUser.id);
  if (data) {
    return res.status(201).json(data);
  }
  return res.status(400).send(`Impossible d'ajouter de nouveaux contacts`);
};
