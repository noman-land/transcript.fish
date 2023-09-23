import { FormEventHandler, MouseEventHandler } from 'react';
import { Presenter } from './types';

const MEDIA_URL = 'https://media.transcript.fish' as const;

const isLocal = () => {
  const { hostname, search } = window.location;
  const deployed = new URLSearchParams(search).get('deployed');
  return hostname === 'localhost' && !deployed;
};

export const mediaUrl = (path = '') => {
  const host = isLocal() ? window.location.origin : MEDIA_URL;
  return `${host}/${path}`;
};

mediaUrl.audio = (episodeNum: number) => mediaUrl(`audio/${episodeNum}.mp3`);
mediaUrl.images = (path: string) => mediaUrl(`images/${path}`);
mediaUrl.db = (path: string) => mediaUrl(`db/${path}`);

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDuration = (duration: number) => {
  return `${Math.floor(duration / 60)} minutes`;
};

export const formatTimestamp = (duration: number) => {
  const minutes = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(duration % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const makeEpisodeCoverUrl = (episode: number, imageUrl: string) => {
  const extension = imageUrl.split('.').pop();
  return extension ? mediaUrl.images(`episodes/${episode}.${extension}`) : '';
};

export const preventDefault: FormEventHandler = e => e.preventDefault();

export const stopPropagation: MouseEventHandler = e => {
  if ((e.target as HTMLElement).nodeName === 'A') {
    e.stopPropagation();
  }
};

export const formatName = ({ firstName, middleName, lastName }: Presenter) =>
  [firstName, middleName, lastName].filter(n => n).join(' ');
