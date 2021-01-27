const db = require('../db');

module.exports.getAllCallsFromDb = async () => {
  const data = await db.query('SELECT * FROM contact_in_mailing_campaign');
  return data;
};

module.exports.getAllSendCampaignsFromDb = async () => {
  const [data] = await db.query(
    'SELECT COUNT (*) AS total FROM mailing_campaign WHERE sending_status = 2'
  );
  return data;
};

module.exports.getAllSendCampaignsFromUsers = async () => {
  const data = await db.query(
    'SELECT user.firstname, user.lastname, m.id_client_user, COUNT(id_client_user) AS total FROM mailing_campaign AS m JOIN user ON user.id = m.id_client_user WHERE m.sending_status = 2 GROUP BY m.id_client_user'
  );
  return data;
};
