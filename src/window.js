const { BrowserWindow } = require('electron');
const path = require('path');
const { getPlatformIcon } = require('./utils');
const APP_CONSTANTS = require('./constants'); 

let mainWindow;

function createMainWindow() {
  if (isMainWindowActive()) {
    return mainWindow.focus();
  }

  mainWindow = new BrowserWindow(getBrowserWindowOptions());
  loadMainWindowURL(mainWindow, APP_CONSTANTS.YOUTUBE_MUSIC_URL);
  mainWindow.on('closed', () => (mainWindow = null));
}

function isMainWindowActive() {
  return mainWindow && !mainWindow.isDestroyed();
}

function getBrowserWindowOptions() {
  return {
    width: APP_CONSTANTS.DEFAULT_WINDOW_WIDTH,
    height: APP_CONSTANTS.DEFAULT_WINDOW_HEIGHT,
    icon: getWindowIconPath(),
    webPreferences: getWebPreferences(),
    show: false,
  };
}

function getWindowIconPath() {
  return path.join(__dirname, '../assets', getPlatformIcon());
}

function getWebPreferences() {
  return {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
    devTools: true,
  };
}

function loadMainWindowURL(window, url) {
  window.loadURL(url).then(() => window.show());
}

module.exports = { createMainWindow };