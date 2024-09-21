const { app, Notification } = require('electron');
const path = require('path');
const getPlatformIcon = require('./utils').getPlatformIcon;

function displayNotification(title, content, icon) {
  let notification = new Notification({
    title: title,
    body: content,
    icon: icon
  });
  notification.show();
}

module.exports = displayNotification;