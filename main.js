const { app, ipcMain, nativeImage ,BrowserWindow, Notification} = require('electron');
const path = require('path');
const { downloadImage, getPlatformIcon } = require('./src/utils');
const { createMainWindow } = require('./src/window');
const displayNotification = require('./src/notification');
const { handleSongChange } = require('./src/song');

app.whenReady().then(createMainWindow);

app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length) {
    createMainWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('song-changed', (event, songInfo) => {
  console.log('Şarkı değişti:', songInfo);

  const notification = new Notification({
    title: `Şu An Çalıyor: ${songInfo.title}`,
    body: `Sanatçı: ${songInfo.artist}`,
    icon: songInfo.albumArt
  });

  notification.show();
});
