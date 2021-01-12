const {
  findAllContacts,
  createContacts,
  modifyContact,
} = require("../models/contacts");

module.exports.getCollection = async (req, res) => {
  const data = await findAllContacts(req.currentUser.id);
  if (data) {
    return res.status(200).json(data);
  }
  return res.status(400).send(`Impossible d'afficher les contacts`);
};

module.exports.createContacts = async (req, res) => {
  const data = await createContacts(req.body, req.currentUser.id);
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
