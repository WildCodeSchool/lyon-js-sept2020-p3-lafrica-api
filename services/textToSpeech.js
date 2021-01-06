// Imports the Google Cloud client library

const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
const path = require('path');

// const projectId = 'test-lam'; S
// const keyFileName = '../Test-LAM-0d28b0da2eea.json';

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

async function textVocalization(textToVocalize) {
  // The text to synthesize
  const { message, audioConfig } = textToVocalize;

  const {
    audioEncoding = 'MP3',
    speakingRate = 1,
    pitch = 0,
    volumeGainDb = -6.0,
    voiceType = 'Standard',
    voiceGender = 'A',
  } = audioConfig;

  const text = message;

  // Construct the request
  const request = {
    input: { text },
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: 'fr-FR',
      ssmlGender: 'FEMALE',
      name: `fr-FR-${voiceType}-${voiceGender}`,
    },
    // select the type of audio encoding

    audioConfig: {
      audioEncoding,
      speakingRate,
      pitch,
      volumeGainDb,
      effectsProfileId: ['telephony-class-application'],
    },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  const pathFile = path.join(`${__dirname}/../file-storage/public`);

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  const audioFileName = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
  await writeFile(
    `${pathFile}/${audioFileName}.${audioEncoding.toLowerCase()}`,
    response.audioContent,
    'binary'
  );
  return audioFileName;
}
module.exports = textVocalization;
