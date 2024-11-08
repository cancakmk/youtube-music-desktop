const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, path) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  });
  const buffer = Buffer.from(response.data, 'binary');
  fs.writeFileSync(path, buffer);
}

function getPlatformIcon() {
  return process.platform === 'darwin' ? 'icon.icns' : 'icon.ico';
}

module.exports = {
  getPlatformIcon,
  downloadImage
};