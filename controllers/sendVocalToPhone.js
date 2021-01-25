const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

function getEnv(varibale) {
  const value = process.env[varibale];
  if (typeof value === 'undefined') {
    console.warn(`Seems like the variable "${varibale}" is not set in the environment.
    Did you forget to execute "cp .env.sample .env" and adjust variables in the .env file to match your own environment ?`);
  }
  return value;
}

module.exports.test = async (req) => {
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

  form.append('login', getEnv('LAM_API_LOGIN'));
  form.append('password', getEnv('LAM_API_PASSWORD'));
  form.append('filename', fs.createReadStream(jsonPath));

  axios
    .post('https://voice.lafricamobile.com/api/Upload', form, {
      headers: form.getHeaders(),
    })
    .then((res) => {
      console.log('REQUETE UPLOAD API LAM : ', res.data);
      const { clientFileName, serverFileName } = JSON.parse(
        res.data.slice(0, -1)
      );
      console.log('ETAPE 2');
      console.log(clientFileName, serverFileName);

      axios
        .post('https://voice.lafricamobile.com/api/Message', {
          login: getEnv('LAM_API_LOGIN'),
          password: getEnv('LAM_API_PASSWORD'),
          filename: clientFileName,
          serverfilename: serverFileName,
          campagnename: 'test',
          contacts: phoneNumber,
        })
        .then((res2) => {
          console.log(res2.data);
        });
    });
};

// module.exports.campaignMessages = async (req, res) => {
//   //   console.log(req.body);
//   //   const user = await User.createUserInDatabase(req.body);
//   //   return res.status(201).send(user);
// };
