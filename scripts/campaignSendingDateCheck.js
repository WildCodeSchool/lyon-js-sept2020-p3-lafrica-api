const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const db = require('../db');

require('dotenv').config();

function getEnv(varibale) {
  const value = process.env[varibale];
  if (typeof value === 'undefined') {
    console.warn(`Seems like the variable "${varibale}" is not set in the environment.
    Did you forget to execute "cp .env.sample .env" and adjust variables in the .env file to match your own environment ?`);
  }
  return value;
}

module.exports.campaignSendingDateCheck = async () => {
  let serviceIsRunning = false;
  if (!serviceIsRunning) {
    serviceIsRunning = true;
    /*  Récupérer le tableau des campagnes
    Parcourir le tableau des campagnes
    Pour chaque campagne dont le status est "à envoyer" :
        Si la date d'envoi est < à now :
            Récupérer les contacts de la campagne avec le tableau de jointure
            Récupérer le message vocal avec l'url de la BDD
            Envoyer le tout à l'API LAM
            Modifier le status de cette campagne à "envoyé"
    */

    const allCampaignsList = await db.query(
      'SELECT * from mailing_campaign WHERE sending_status = 0'
    );

    for (let i = 0; i < allCampaignsList.length; i += 1) {
      // Date and hour initialization
      const dateNow = new Date();

      // Get list of campaigns that are not sent yet and for which date is lower that this routine date
      if (allCampaignsList[i].date <= dateNow) {
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
          'public',
          vocalisationFileName
        );

        form.append('login', getEnv('LAM_API_login'));
        form.append('password', getEnv('LAM_API_password'));
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
                  login: getEnv('LAM_API_login'),
                  password: getEnv('LAM_API_password'),
                  filename: clientFileName,
                  serverfilename: serverFileName,
                  campagnename: allCampaignsList[i].name,
                  contacts: phoneNumbersArray,
                })
                .then((res2) => {
                  if (res2) {
                    db.query(
                      'UPDATE mailing_campaign SET sending_status = 1 WHERE id = ?',
                      [allCampaignsList[i].id]
                    );
                  }
                  console.log('retour API LAM', res2.data);
                });
            }, i * 1000);
          });
      }
    }

    serviceIsRunning = false;
  }
};
