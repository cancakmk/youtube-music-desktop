const { Menu, shell, app, BrowserWindow } = require('electron');
const musicControls = require('./musicControls');

function createMenu() {
  const template = [
    {
      label: 'Dosya',
      submenu: [
        { label: 'Yeni Pencere', accelerator: 'CmdOrCtrl+N', click: () => createWindow() },
        { label: 'Çıkış', accelerator: 'CmdOrCtrl+Q', role: 'quit' }
      ]
    },
    {
      label: 'Düzenle',
      submenu: [
        { label: 'Ara', accelerator: 'CmdOrCtrl+F', click: () => mainWindow.webContents.send('focus-search') },
        { label: 'Yeniden Yükle', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { label: 'Tam Ekran', accelerator: 'F11', role: 'togglefullscreen' },
        { label: 'Geliştirici Araçları', accelerator: 'CmdOrCtrl+I', role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Çalma Listeleri',
      submenu: [
        { label: 'Favorilerime Ekle', accelerator: 'CmdOrCtrl+D', click: () => mainWindow.webContents.executeJavaScript("document.querySelector('.like-button').click();") },
        { label: 'Son Çalınanlar', click: () => mainWindow.webContents.executeJavaScript("document.querySelector('a[href*=\"recently-played\"]').click();") }
      ]
    },
    {
      label: 'Müzik Kontrolleri',
      submenu: musicControls
    },
    {
      label: 'Yardım',
      submenu: [
        { label: 'YouTube Music Yardım', click: () => shell.openExternal('https://support.google.com/youtubemusic') },
        { label: 'GitHub Repo', click: () => shell.openExternal('https://github.com/your-repo/your-project') },
        { label: 'Hakkında', click: () => {
          const { dialog } = require('electron');
          dialog.showMessageBox({
            type: 'info',
            title: 'Hakkında',
            message: 'YouTube Music Desktop App\nVersion 1.0.0\nElectron ile geliştirilmiştir.',
            buttons: ['Tamam']
          });
        }}
      ]
    },
    {
      label: 'Görünüm',
      submenu: [
        {
          label: 'Geliştirici Araçlarını Aç',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => {
            BrowserWindow.getFocusedWindow().webContents.openDevTools();
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

module.exports = createMenu;