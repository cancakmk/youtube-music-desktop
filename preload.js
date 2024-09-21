const { ipcRenderer } = require('electron');

let initialLoad = true; // İlk yükleme için durum değişkeni

function observeMusicChanges() {
  const titleElement = document.querySelector('.content-info-wrapper');
  if (!titleElement) {
    console.error('Şarkı bilgileri izlenecek element bulunamadı.');
    return;
  }

  const titleObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        if (initialLoad) {
          console.log('İlk yükleme, bildirim gönderilmiyor.');
          initialLoad = false; // İlk yükleme durumunu güncelle
          return;
        }

        const songTitle = document.querySelector('.title.style-scope.ytmusic-player-bar')?.getAttribute('title') || 'Bilinmiyor';
        const artistName = document.querySelector('.byline.style-scope.ytmusic-player-bar')?.getAttribute('title') || 'Bilinmiyor';
        const albumArt = document.querySelector('#song-image img')?.src || 'Bilinmiyor';

        const songInfo = {
          title: songTitle,
          artist: artistName,
          albumArt: albumArt
        };

        console.log('Şarkı değişti, bildirim gönderiliyor:', songInfo);
        ipcRenderer.send('song-changed', songInfo);
      }
    });
  });

  const config = { childList: true, subtree: true };
  titleObserver.observe(titleElement, config);
}

window.addEventListener('DOMContentLoaded', observeMusicChanges);

// Bildirim fonksiyonunu kaldır, çünkü bu işlemci işleminden doğrudan Notification API'yi kullanamazsınız.
