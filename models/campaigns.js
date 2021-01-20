const db = require('../db');

module.exports.findAllCampaigns = (id) => {
  return db.query('SELECT * FROM mailing_campaign WHERE id = ?', [id]);
};

module.exports.findOneCampaign = async (id) => {
  const [
    campaignData,
  ] = await db.query('SELECT * FROM mailing_campaign WHERE id = ?', [id]);
  if (campaignData) {
    const contactsListCampaign = await db.query(
      'SELECT contact.id, contact.lastname, contact.firstname, contact.phone_number contact_id FROM `contact_in_mailing_campaign` JOIN contact WHERE mailing_campaign_id = ?',
      [campaignData.id]
    );
    return { campaignData, contactsListCampaign };
  }
  return null;
};

module.exports.createCampaignId = async (user_id) => {
  try {
    const data = await db.query(
      'INSERT INTO mailing_campaign (id_client_user,name,text_message,vocal_message_file_url,date, sending_status) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, null, null, null, null, false]
    );
    const insertedCampaign = await db.query(
      'SELECT * FROM mailing_campaign WHERE id = ?',
      [data.insertId]
    );
    return insertedCampaign[0];
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports.updateCampaign = async (campaign_id, campaignDatas) => {
  const {
    campaign_name,
    campaign_text,
    campaign_vocal,
    campaign_date,
  } = campaignDatas;
  const campaign_date_formated = new Date(campaign_date);
  try {
    await db.query(
      'UPDATE mailing_campaign SET name = ?, text_message = ?, vocal_message_file_url = ?, date = ?  where id = ?',
      [
        campaign_name,
        campaign_text,
        campaign_vocal,
        campaign_date_formated,
        campaign_id,
      ]
    );
    const data = await this.findOneCampaign(campaign_id);
    return data;
  } catch (err) {
    return err;
  }
};

module.exports.assignContactsToCampaign = async (contactsList, campaignId) => {
  try {
    // for (let i = 0; i < contactsList.length; i += 1)
    contactsList.forEach(async (contact) => {
      const existingContactCheck = await db.query(
        'SELECT * FROM contact_in_mailing_campaign WHERE contact_id = ? AND mailing_campaign_id = ?',
        [contact.id, campaignId]
      );
      if (existingContactCheck.length === 0) {
        // eslint-disable-next-line no-lone-blocks
        await db.query(
          'INSERT INTO contact_in_mailing_campaign (contact_id,mailing_campaign_id,sending_status) VALUES (?, ?, false)',
          [contact.id, campaignId]
        );
      }
    });
    return contactsList.length;
  } catch (err) {
    return err;
  }
};
