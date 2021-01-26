const axios = require('axios');
const db = require('../db');
const { LAM_API_LOGIN, LAM_API_PASSWORD } = require('../env');

module.exports.campaignHistoryCheck = async () => {
  let serviceIsRunning = false;
  if (!serviceIsRunning) {
    serviceIsRunning = true;
    const allContactToUpdate = await db.query(
      'SELECT * from contact_in_mailing_campaign WHERE call_state_id = 1'
      // Voir ce qu'il se passe quand callStateId = 2 --> à quoi ça correspond ?
      // Voir ce qu'il se passe quand callStateId = 3 --> à quoi ça correspond ?
    );
    if (allContactToUpdate.length === 0) {
      return null;
    }
    await axios
      .get(
        `https://voice.lafricamobile.com/api/Histories?login=${LAM_API_LOGIN}&password=${LAM_API_PASSWORD}`
      )
      .then((res) => {
        res.data.forEach((campaign) => {
          campaign.calls.forEach((call) => {
            db.query(
              'UPDATE contact_in_mailing_campaign SET call_state_id = ?, call_result_id = ? WHERE lam_contact_id = ?',
              [call.callStateId, call.callResultId, call.contactId]
            );
          });
        });
      });
    serviceIsRunning = false;
  }
  console.log('contact called status updated');
  return 'contact called status updated';
};
