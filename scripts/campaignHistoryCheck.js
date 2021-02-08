const axios = require('axios');
const db = require('../db');
const { LAM_API_LOGIN, LAM_API_PASSWORD } = require('../env');

module.exports.campaignHistoryCheck = async () => {
  let serviceIsRunning = false;
  if (!serviceIsRunning) {
    serviceIsRunning = true;

    await axios
      .get(
        `https://voice.lafricamobile.com/api/Histories?login=${LAM_API_LOGIN}&password=${LAM_API_PASSWORD}`
      )
      .then((res) => {
        res.data.forEach((campaign) => {
          db.query(
            'UPDATE mailing_campaign SET count = ?, call_success_count = ?, call_failed_count = ?, call_ignored_count = ? WHERE lam_campaign_id = ?',
            [
              campaign.count,
              campaign.callSuccessCount,
              campaign.callFailedCount,
              campaign.callIgnoredCount,
              campaign.id,
            ]
          );

          campaign.calls.forEach((call) => {
            db.query(
              'UPDATE contact_in_mailing_campaign SET call_state_id = ?, call_result_id = ? WHERE lam_contact_id = ?',
              [call.callStateId, call.callResultId, call.contactId]
            );
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
    serviceIsRunning = false;
  }
  console.log('contact called status and campaign sent status updated');
  return 'contact called status and campaign sent status updated';
};
