const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendSongInfo: (songInfo) => ipcRenderer.send('song-changed', songInfo)
});

function observeMusicChanges() {
  const titleElement = document.querySelector('.content-info-wrapper');
  if (!titleElement) {
    console.error('Şarkı bilgileri izlenecek element bulunamadı.');
    return;
  }

  const titleObserver = new MutationObserver(() => {
    const songTitle = document.querySelector('.title.style-scope.ytmusic-player-bar')?.getAttribute('title') || 'Bilinmiyor';
    const artistName = document.querySelector('.byline.style-scope.ytmusic-player-bar')?.getAttribute('title') || 'Bilinmiyor';
    const albumArt = document.querySelector('#song-image img')?.src || 'Bilinmiyor';

    const songInfo = {
      title: songTitle,
      artist: artistName,
      albumArt: albumArt
    };

    console.log('Şarkı değişti, bildirim gönderiliyor:', songInfo);
    window.electronAPI.sendSongInfo(songInfo);
  });

  const config = { childList: true, subtree: true };
  titleObserver.observe(titleElement, config);
}

window.addEventListener('DOMContentLoaded', observeMusicChanges);

console.log('Preload script loaded');
