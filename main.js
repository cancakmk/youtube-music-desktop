try {
  require('electron-reloader')(module);
} catch (_) {}

const { app, BrowserWindow, Menu, Notification } = require('electron');
const path = require('path');

let mainWindow;
let previousSongTitle = '';

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

  monitorSongChanges();
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

function showNotification(title, body) {
  const notification = new Notification({
    title: title,
    body: body,
    silent: true, 
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.icns') 
  });

  notification.show();
}

function monitorSongChanges() {
  setInterval(() => {
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(`
        (function() {
          var titleElement = document.querySelector('.title.ytmusic-player-bar');
          var artistElement = document.querySelector('.byline.ytmusic-player-bar a');
          if (titleElement && artistElement) {
            return {
              title: titleElement.innerText,
              artist: artistElement.innerText
            };
          } else {
            return null;
          }
        })();
      `).then(result => {
        if (result && result.title !== previousSongTitle) {
          previousSongTitle = result.title;
          showNotification(result.title, result.artist);
        }
      }).catch(err => console.log(err));
    }
  }, 500); 
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