const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { LAM_API_LOGIN, LAM_API_PASSWORD } = require('../env');

module.exports.campaignSendingDateCheck = async () => {
  let serviceIsRunning = false;
  if (!serviceIsRunning) {
    serviceIsRunning = true;
    const allCampaignsList = await db.query(
      'SELECT * from mailing_campaign WHERE sending_status = 0 OR sending_status = 1'
    );

    if (allCampaignsList.length === 0) {
      return null;
    }
    for (let i = 0; i < allCampaignsList.length; i += 1) {
      // Date and hour initialization
      const dateNow = new Date();

      // Get list of campaigns that are not sent yet and for which date is higher that this routine date - put status "en attente"
      if (
        allCampaignsList[i].name &&
        allCampaignsList[i].text_message &&
        allCampaignsList[i].vocal_message_file_url &&
        allCampaignsList[i].date
      ) {
        db.query(
          'UPDATE mailing_campaign SET sending_status = 1 WHERE id = ?',
          [allCampaignsList[i].id]
        );
      }

      // Get list of campaigns that are not sent yet and for which date is lower that this routine date
      if (
        allCampaignsList[i].name &&
        allCampaignsList[i].text_message &&
        allCampaignsList[i].vocal_message_file_url &&
        allCampaignsList[i].date &&
        allCampaignsList[i].date <= dateNow
      ) {
        const vocalisationFileName = `${allCampaignsList[i].vocal_message_file_url}`;

        // Get the list of phone numbers related to this campaign
        // eslint-disable-next-line no-await-in-loop
        const phoneNumbers = await db.query(
          'SELECT phone_number FROM contact_in_mailing_campaign JOIN contact ON contact_id = contact.id WHERE mailing_campaign_id = ?',
          [allCampaignsList[i].id]
        );
        const phoneNumbersArray = [];
        for (let k = 0; k < phoneNumbers.length; k += 1) {
          phoneNumbersArray.push(phoneNumbers[k].phone_number);
        }

        // Setting all informations needed to use LAM API (login, password, vocal file url)
        const form = new FormData();
        const jsonPath = path.join(
          __dirname,
          '..',
          'file-storage',
          'private',
          vocalisationFileName
        );

        form.append('login', LAM_API_LOGIN);
        form.append('password', LAM_API_PASSWORD);
        form.append('filename', fs.createReadStream(jsonPath));

        axios
          .post('https://voice.lafricamobile.com/api/Upload', form, {
            headers: form.getHeaders(),
          })
          .then((res) => {
            const { clientFileName, serverFileName } = JSON.parse(
              res.data.slice(0, -1)
            );

            setTimeout(() => {
              axios
                .post('https://voice.lafricamobile.com/api/Message', {
                  login: LAM_API_LOGIN,
                  password: LAM_API_PASSWORD,
                  filename: clientFileName,
                  serverfilename: serverFileName,
                  campagnename: allCampaignsList[i].name,
                  contacts: phoneNumbersArray,
                })
                .then((res2) => {
                  if (res2.data.calls) {
                    db.query(
                      'UPDATE mailing_campaign SET sending_status = 2 WHERE id = ?',
                      [allCampaignsList[i].id]
                    );
                    db.query(
                      'UPDATE mailing_campaign SET lam_campaign_id = ? WHERE id = ?',
                      [res2.data.id, allCampaignsList[i].id]
                    );
                    res2.data.calls.forEach((call) => {
                      const formatedPhoneNumber = call.called.slice(2);
                      db.query(
                        'UPDATE contact_in_mailing_campaign AS jointure JOIN contact ON jointure.contact_id = contact.id JOIN mailing_campaign ON mailing_campaign.id = jointure.mailing_campaign_id SET lam_contact_id = ?, call_state_id = ?, call_result_id = ? WHERE contact.phone_number = ? AND mailing_campaign.lam_campaign_id = ?',
                        [
                          call.contactId,
                          call.callStateId,
                          call.callResultId,
                          formatedPhoneNumber,
                          res2.data.id,
                        ]
                      );
                    });
                  }
                  console.log('retour API LAM', res2.data);
                  // res.data.id = numéro de la campagne côté LAM
                  // res.data.calls = tableau rassemblant tous les appels
                  // res.data.calls[i] =
                  //        id = numéro de l'appel côté LAM
                  //        contactId = numéro du contact côté LAM
                  //        called = numéro de téléphone appelé
                  //        callStateId: 1, ???
                  //        callResultId: 1, ???
                  //        processingCallCount: 0,
                  // callSuccessCount: 0,
                  // callFailedCount: 0,
                  // callIgnoredCount: 0,
                });
            }, i * 1000);
          });
      }
    }
    serviceIsRunning = false;
  }
  console.log('campaings list to send checked');
  return 'campaings list to send checked';
};
