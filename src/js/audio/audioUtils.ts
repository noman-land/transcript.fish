import { Episode } from '../types';
import { formatDate } from '../utils';

export const setMetadata = (episode: Episode) => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${episode?.episode}: ${episode?.title}`,
      artist: 'No Such Thing As A Fish',
      album: episode?.pubDate ? formatDate(episode.pubDate) : undefined,
      artwork: [{ src: episode?.image || '', sizes: '512x512', type: 'image/png' }],
    });
  }
};
