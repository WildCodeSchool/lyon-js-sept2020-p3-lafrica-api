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

async function quickStart(textToVocalize) {
  // The text to synthesize
  const text = textToVocalize;

  // Construct the request
  const request = {
    input: { text },
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: 'fr-FR',
      ssmlGender: 'FEMALE',
      name: 'fr-FR-Wavenet-E',
    },
    // select the type of audio encoding

    audioConfig: { audioEncoding: 'MP3' },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  const pathFile = path.join(`${__dirname  }/../file-storage/public`);

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  const audioFileName = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
  await writeFile(
    `${pathFile}/${audioFileName}.mp3`,
    response.audioContent,
    'binary'
  );
  console.log(`Audio content written to file: ${audioFileName}.mp3`);
  return audioFileName;
}
module.exports = quickStart;
