
const { app, ipcMain, nativeImage ,BrowserWindow} = require('electron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadImage(url, path) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  });
  const buffer = Buffer.from(response.data, 'binary');
  fs.writeFileSync(path, buffer);
}

const { createWindow } = require('./src/createWindow');
const createMenu = require('./src/menu');
const displayNotification = require('./src/notification');

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('song-changed', async (event, songInfo) => {
  console.log('Bildirim gönderiliyor:', songInfo);
  if (!songInfo.title || !songInfo.artist || !songInfo.albumArt) {
    console.error('Eksik şarkı bilgisi:', songInfo);
  } else {
    const imagePath = path.join(app.getPath('temp'), 'album_art.png');
    await downloadImage(songInfo.albumArt, imagePath);
    const image = nativeImage.createFromPath(imagePath);
    displayNotification(songInfo.title, `${songInfo.artist}`, image);
  }
});