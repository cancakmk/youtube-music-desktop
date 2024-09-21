const { BrowserWindow } = require('electron');
const path = require('path');
const { getPlatformIcon } = require('./utils');

let mainWindow;

function createWindow() {
  if (mainWindow) {
    if (mainWindow.isDestroyed()) {
      mainWindow = null; // Eğer pencere yok edildiyse, referansı sıfırla
    } else {
      mainWindow.focus(); // Eğer pencere zaten varsa, ona odaklan
      return;
    }
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../assets', getPlatformIcon()),
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true, // Electron 10+ için gerekebilir
      devTools: true // Geliştirici araçlarını etkinleştir
    },
    show: false // Pencereyi başlangıçta gizle
  });

  mainWindow.loadURL('https://music.youtube.com').then(() => {
    mainWindow.show(); // Site yüklendikten sonra pencereyi göster
  });

  mainWindow.on('closed', () => mainWindow = null);
}

module.exports = { createWindow };