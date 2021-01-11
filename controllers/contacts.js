const { findAllContacts, createContacts } = require("../models/contacts");

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
