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
  const campaign_date_formated = new Date(campaign_date);
  try {
    const data = await db.query(
      'INSERT INTO mailing_campaign (id_client_user,name,text_message,vocal_message_file_url,date) VALUES (?, ?, ?, ?, ?)',
      [
        user_id,
        campaign_name,
        campaign_text,
        campaign_vocal,
        campaign_date_formated,
      ]
    );
    return data;
  } catch (err) {
    return err;
  }
};
