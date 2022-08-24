window.addEventListener('message', ({ data, origin }) => {
  switch (data) {
    case 'getCurrentSong': {
      const titleElement = document.querySelector('.player-controls .track__title');
      const artistElement = document.querySelector('.player-controls .track__artists');

      if (titleElement && artistElement) {
        window.opener.postMessage(
          JSON.stringify({
            type: 'getCurrentSong',
            value: `${artistElement.textContent} - ${titleElement.textContent}`,
          }),
          origin,
        );
      }

      return;
    }

    case 'startMusic': {
      return document.querySelector('.player-controls .player-controls__btn_play')?.click();
    }

    case 'stopMusic': {
      return document.querySelector('.player-controls .player-controls__btn_pause')?.click();
    }
  }
});
