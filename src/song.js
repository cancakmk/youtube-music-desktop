const { Notification } = require('electron');

function handleSongChange(event, songInfo) {
  console.log('Şarkı bilgisi alındı:', songInfo);
  if (!songInfo.title || !songInfo.artist) {
    console.error('Eksik şarkı bilgisi:', songInfo);
    return;
  }

  displayNotification(songInfo.title, songInfo.artist);
}

function displayNotification(title, artist) {
  const notification = new Notification({
    title: `Şu An Çalıyor: ${title}`,
    body: `Sanatçı: ${artist}`,
  });

  notification.show();
}

module.exports = { handleSongChange };