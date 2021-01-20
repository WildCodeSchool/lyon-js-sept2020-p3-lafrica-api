const db = require('../db');

module.exports.findAllCampaigns = async (id) => {
  const data = await db.query(
    'SELECT * FROM mailing_campaign WHERE id_client_user = ?',
    [id]
  );
  console.log(data);
  return data;
};

module.exports.findOneCampaign = async (id) => {
  const [
    campaignData,
  ] = await db.query('SELECT * FROM mailing_campaign WHERE id = ?', [id]);
  if (campaignData) {
    const contactsListCampaign = await db.query(
      'SELECT contact.id, contact.lastname, contact.firstname, contact.phone_number contact_id FROM contact_in_mailing_campaign JOIN contact WHERE mailing_campaign_id = ?',
      [campaignData.id]
    );

    return { campaignData, contactsListCampaign };
  }
  return null;
};
