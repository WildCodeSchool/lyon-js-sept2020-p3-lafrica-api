const db = require("../db");

module.exports.findAllContacts = (id) => {
  return db.query("SELECT * FROM contact WHERE id_client_user  = ?", [id]);
};

module.exports.createContacts = async (newContacts, id) => {
  const createdContacts = await Promise.all(
    newContacts.map(async (contact) => {
      const { lastname, firstname, phone_number } = contact;
      const result = await db
        .query(
          `INSERT INTO contact (lastname, firstname, phone_number, id_client_user) VALUES (?, ?, ?, ?)`,
          [lastname, firstname, phone_number, id]
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
          id_client_user: id,
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
/* module.exports.modifyContact

module.exports.deleteContact
 */
