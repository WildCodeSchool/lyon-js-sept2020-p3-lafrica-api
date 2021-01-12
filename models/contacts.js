const db = require('../db');

/* const findOneContact = async (contactId) => {
  const contact = db.query
    .query("SELECT * FROM contact WHERE id = ?", [contactId])
    .catch((err) => {
      console.log(err);
      throw err;
    });
  if (contact) {
    return contact;
  }
  return null;
}; */

module.exports.findAllContacts = (id) => {
  return db.query('SELECT * FROM contact WHERE id_client_user  = ?', [id]);
};

module.exports.createContacts = async (newContacts, currentUserId) => {
  const createdContacts = await Promise.all(
    newContacts.map(async (contact) => {
      const { lastname, firstname } = contact;
      let { phone_number } = contact;
      phone_number = phone_number.toString();
      const result = await db
        .query(
          `INSERT INTO contact (lastname, firstname, phone_number, id_client_user) VALUES (?, ?, ?, ?)`,
          [lastname, firstname, phone_number, currentUserId]
        )
        .catch((err) => {
          console.log(err);
          throw err;
        });
      if (result) {
        return {
          id: result.insertId,
          lastname,
          firstname,
          phone_number,
          id_client_user: currentUserId,
        };
      }
      return null;
    })
  );
  if (createdContacts) {
    return createdContacts;
  }
  return null;
};

module.exports.modifyContact = async (newAtttributes, contactId) => {
  const { lastname, firstname, phone_number } = newAtttributes;
  console.log(newAtttributes);
  console.log(contactId);
  await db
    .query(
      "UPDATE * FROM contact SET lastname = ?, firstname = ?, phone_number = ? WHERE id = ?",
      [lastname, firstname, phone_number, contactId]
    )
    .catch((err) => {
      console.log(err);
      throw err;
    });
  /* findOneContact(contactId) */
};
