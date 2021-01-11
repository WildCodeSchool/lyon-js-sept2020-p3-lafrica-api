const StreamZip = require('node-stream-zip');

function open(filePath) {
  return new Promise((resolve, reject) => {
    const zip = new StreamZip({
      file: filePath,
      storeEntries: true,
    });
    zip.on('ready', () => {
      const chunks = [];
      let content = '';
      zip.stream('word/document.xml', (err, stream) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        stream.on('data', (chunk) => {
          chunks.push(chunk);
        });
        stream.on('end', () => {
          content = Buffer.concat(chunks);
          zip.close();
          resolve(content.toString());
        });
      });
    });
  });
}

module.exports.extract = (filePath) => {
  return new Promise((resolve, reject) => {
    open(filePath).then((res, err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      let body = '';
      const components = res.toString().split('<w:t');
      for (let i = 0; i < components.length; i += 1) {
        const tags = components[i].split('>');
        const content = tags[1].replace(/<.*$/, '');
        body += `${content} `;
      }
      resolve(body);
    });
  });
};
