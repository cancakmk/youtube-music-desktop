const { mainWindow } = require('./createWindow');
const { Notification } = require('electron');
const displayNotification = require('./notification');

const showNotification = (title, body) => {
  new Notification({ title, body }).show();
};

const musicControls = [
  {
    label: 'Oynat/Duraklat',
    accelerator: 'Space',
    click: () => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        console.error('Ana pencere mevcut değil veya yok edilmiş.');
        return;
      }
      mainWindow.webContents.executeJavaScript("document.querySelector('.play-pause-button').click();");
    }
  },
  {
    label: 'Sonraki Şarkı',
    accelerator: 'CmdOrCtrl+Right',
    click: () => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        console.error('Ana pencere mevcut değil veya yok edilmiş.');
        return;
      }
      mainWindow.webContents.executeJavaScript("document.querySelector('.next-button').click();")
        .then(() => displayNotification('Müzik Kontrolü', 'Sonraki şarkıya geçildi'))
        .catch(err => console.error('JavaScript çalıştırma hatası:', err));
    }
  },
  {
    label: 'Önceki Şarkı',
    accelerator: 'CmdOrCtrl+Left',
    click: () => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        console.error('Ana pencere mevcut değil veya yok edilmiş.');
        return;
      }
      mainWindow.webContents.executeJavaScript("document.querySelector('.previous-button').click();")
        .then(() => displayNotification('Müzik Kontrolü', 'Önceki şarkıya geçildi'))
        .catch(err => console.error('JavaScript çalıştırma hatası:', err));
    }
  },
  {
    label: 'Favorilere Ekle/Çıkar',
    accelerator: 'CmdOrCtrl+F',
    click: () => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        console.error('Ana pencere mevcut değil veya yok edilmiş.');
        showNotification('Hata', 'Favori işlemleri için pencere bulunamadı.');
        return;
      }
      mainWindow.webContents.executeJavaScript("document.querySelector('.like-button').click();")
        .then(() => showNotification('Favoriler', 'Favorilere eklendi/çıkarıldı'))
        .catch(err => console.error('JavaScript çalıştırma hatası:', err));
    }
  }
];

module.exports = musicControls;