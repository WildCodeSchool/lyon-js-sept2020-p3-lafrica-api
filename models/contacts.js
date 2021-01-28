const db = require("../db");
const { contact_in_mailing_campaign } = require("../db").prisma;

const findOneContactFromItsId = async (contactId) => {
  const contacts = db
    .query("SELECT * FROM contact WHERE id = ?", [contactId])
    .catch((err) => {
      console.log(err);
      throw err;
    });
  if (contacts) {
    return contacts;
  }
  return null;
};

const findOneContactFromPhoneNumberAndIdUser = async (
  phone_number,
  currentUserId
) => {
  const contacts = db
    .query(
      "SELECT * FROM contact WHERE phone_number = ? AND id_client_user = ?",
      [phone_number, currentUserId]
    )
    .catch((err) => {
      console.log(err);
      throw err;
    });
  if (contacts) {
    return contacts;
  }
  return null;
};

module.exports.findAllContacts = (id) => {
  return db.query("SELECT * FROM contact WHERE id_client_user  = ?", [id]);
};

module.exports.findContactsForCampaign = async (campaign_id, limit, offset) => {
  // return db.query(
  //   'SELECT * FROM contact JOIN contact_in_mailing_campaign as cm ON contact.id = cm.contact_id WHERE cm.mailing_campaign_id = ?',
  //   [campaign_id]
  // );
  const dataset = await contact_in_mailing_campaign.findMany({
    where: {
      mailing_campaign_id: campaign_id,
    },
    take: limit,
    skip: offset,
    include: {
      contact: true,
    },
  });

  const total = (
    await contact_in_mailing_campaign.aggregate({
      where: {
        mailing_campaign_id: campaign_id,
      },
      count: true,
    })
  ).count;

  const result = dataset.map((data) => {
    return {
      id: data.contact.id,
      lastname: data.contact.lastname,
      firstname: data.contact.firstname,
      phone_number: data.contact.phone_number,
      mailing_campaign_id: campaign_id,
    };
  });

  return [total, result];
};

const phoneNumberAlreadyExistsForThisUser = async (
  phone_number,
  currentUserId
) => {
  const rows = await db.query(
    "SELECT * FROM contact WHERE phone_number = ? AND id_client_user = ?",
    [phone_number, currentUserId]
  );
  if (rows.length) {
    return true;
  }
  return false;
};

module.exports.createContacts = async (
  newContacts,
  currentUserId,
  campaign_id
) => {
  const createdContacts = await Promise.all(
    newContacts.map(async (contact) => {
      const { lastname, firstname } = contact;
      let { phone_number } = contact;
      if (typeof phone_number !== "string") {
        phone_number = phone_number.toString();
      }
      const phoneNumberExists = await phoneNumberAlreadyExistsForThisUser(
        phone_number,
        currentUserId
      );
      if (phoneNumberExists) {
        await db
          .query(
            `UPDATE contact SET lastname = ?, firstname = ? WHERE phone_number = ? AND id_client_user = ?`,
            [lastname, firstname, phone_number, currentUserId]
          )
          .catch((err) => {
            console.log(err);
            throw err;
          });
        const [modifiedContact] = await findOneContactFromPhoneNumberAndIdUser(
          phone_number,
          currentUserId
        );

        if (modifiedContact) {
          const contactAssigned = await this.assignContactsToCampaign(
            modifiedContact.id,
            campaign_id
          );

          if (contactAssigned) {
            return {
              id: modifiedContact.id,
              campaign_id,
              lastname,
              firstname,
              phone_number,
              id_client_user: currentUserId,
            };
          }
        }
      }
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
        const contactAssigned = await this.assignContactsToCampaign(
          result.insertId,
          campaign_id
        );

        if (contactAssigned) {
          return {
            id: result.insertId,
            campaign_id,
            lastname,
            firstname,
            phone_number,
            id_client_user: currentUserId,
          };
        }
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
  await db
    .query(
      "UPDATE contact SET lastname = ?, firstname = ?, phone_number = ? WHERE id = ?",
      [lastname, firstname, phone_number, contactId]
    )
    .catch((err) => {
      console.log(err);
      throw err;
    });
  return findOneContactFromItsId(contactId);
};

module.exports.deleteContact = async (contactId, campaignId) => {
  await db
    .query(
      "DELETE FROM contact_in_mailing_campaign WHERE contact_id = ? AND mailing_campaign_id = ?",
      [contactId, campaignId]
    )
    .catch((err) => {
      console.log(err);
      throw err;
    });
  return findOneContactFromItsId(contactId);
};

module.exports.assignContactsToCampaign = async (contactId, campaignId) => {
  try {
    const existingContactCheck = await db.query(
      "SELECT * FROM contact_in_mailing_campaign WHERE contact_id = ? AND mailing_campaign_id = ?",
      [contactId, campaignId]
    );
    if (existingContactCheck.length === 0) {
      // eslint-disable-next-line no-lone-blocks
      await db.query(
        "INSERT INTO contact_in_mailing_campaign (contact_id,mailing_campaign_id,sending_status) VALUES (?, ?, false)",
        [contactId, campaignId]
      );
    }
    return true;
  } catch (err) {
    return err;
  }
};
