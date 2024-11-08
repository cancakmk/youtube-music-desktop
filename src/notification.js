const { Notification } = require('electron');

function displayNotification(title, content, icon) {
  let notification = new Notification({
    title: title,
    body: content,
    icon: icon
  });
  notification.show();
}

module.exports = displayNotification;