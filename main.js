try {
  require('electron-reloader')(module);
} catch (_) {}

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  if (mainWindow) return;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL('https://music.youtube.com');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (e) => {
    if (app.quitting) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
  });
}

function stopPlayer() {
  if (mainWindow) {
    // Video öğesini seçip durdurur
    mainWindow.webContents.executeJavaScript(`
      var player = document.querySelector('video');
      if (player) {
        player.pause();
      }
    `);
  }
}

function createMenu() {
  const template = [
    {
      label: 'Uygulama',
      submenu: [
        {
          label: 'Çıkış',
          accelerator: 'Cmd+Q',
          click: () => {
            stopPlayer(); 
            app.quit(); 
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});

app.on('before-quit', () => {
  app.quitting = true;
});