// Imports the Google Cloud client library

const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
const path = require('path');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

async function textVocalization(textToVocalize) {
  // The text to synthesize
  const { message, audioConfig } = textToVocalize;

  const {
    audioEncoding = 'MP3',
    speakingRate = 1,
    pitch = 0,
    volumeGainDb = 0,
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

  let audioFileExt;

  if (audioEncoding === 'MP3') {
    audioFileExt = 'mp3';
  } else {
    audioFileExt = 'wav';
  }

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  const pathFile = path.join(`${__dirname}/../file-storage/private`);

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  const audioFileName = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
  await writeFile(
    `${pathFile}/${audioFileName}.${audioFileExt}`,
    response.audioContent,
    'binary'
  );

  const audioFile = `${audioFileName}.${audioFileExt}`;

  return audioFile;
}
module.exports = textVocalization;
