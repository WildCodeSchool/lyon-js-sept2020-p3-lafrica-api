const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { LAM_API_LOGIN, LAM_API_PASSWORD } = require('../env');

require('dotenv').config();

module.exports.test = async (req, res) => {
  const vocalisationFileName = `${req.body.vocalisationFileName}`;
  const phoneNumber = [req.body.phoneNumber];

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
    .then((result) => {
      console.log('REQUETE UPLOAD API LAM : ', result.data);
      const { clientFileName, serverFileName } = JSON.parse(
        result.data.slice(0, -1)
      );
      console.log('ETAPE 2');
      console.log(clientFileName, serverFileName);

      axios
        .post('https://voice.lafricamobile.com/api/Message', {
          login: LAM_API_LOGIN,
          password: LAM_API_PASSWORD,
          filename: clientFileName,
          serverfilename: serverFileName,
          campagnename: 'test',
          contacts: phoneNumber,
        })
        .then((res2) => {
          console.log(res2.data);
          res.sendStatus(200);
        });
    });
};

// module.exports.campaignMessages = async (req, res) => {
//   //   console.log(req.body);
//   //   const user = await User.createUserInDatabase(req.body);
//   //   return res.status(201).send(user);
// };
