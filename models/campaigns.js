const db = require('../db');

module.exports.findAllCampaigns = (id) => {
  return db.query('SELECT * FROM mailing_campaign WHERE id = ?', [id]);
};

module.exports.createCampaign = async (campaignDatas) => {
  const {
    user_id,
    campaign_name,
    campaign_text,
    campaign_vocal,
    campaign_date,
  } = campaignDatas;
  console.log(campaign_date);
  const campaign_date_formated = new Date(campaign_date);
  try {
    const data = await db.query(
      'INSERT INTO mailing_campaign (id_client_user,name,text_message,vocal_message_file_url,date, sending_status) VALUES (?, ?, ?, ?, ?, false)',
      [
        user_id,
        campaign_name,
        campaign_text,
        campaign_vocal,
        campaign_date_formated,
      ]
    );
    const insertedCampaign = await db.query(
      'SELECT * FROM mailing_campaign WHERE id = ?',
      [data.insertId]
    );
    return insertedCampaign[0];
  } catch (err) {
    return err;
  }
};

module.exports.assignContactsToCampaign = async (contactsList, campaignId) => {
  console.log(contactsList);
  const contactsAdded = [];
  try {
    // for (let i = 0; i < contactsList.length; i += 1)
    contactsList.forEach(async (contact) => {
      // eslint-disable-next-line no-lone-blocks
      {
        await db.query(
          'INSERT INTO contact_in_mailing_campaign (contact_id,mailing_campaign_id,sending_status) VALUES (?, ?, null)',
          [contact.id, campaignId]
        );
        const contactAssignment = await db.query(
          'SELECT * FROM contact_in_mailing_campaign WHERE contact_id = ?',
          [contact.id]
        );
        contactsAdded.push(contactAssignment[0]);
      }
    });

    return contactsAdded;
  } catch (err) {
    return err;
  }
};
