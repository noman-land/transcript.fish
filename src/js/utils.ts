import { FormEventHandler, MouseEventHandler } from 'react';
import { Presenter } from './types';

export const mediaUrl = () => {
  const url = new URL(import.meta.url);
  return url.hostname === 'localhost'
    ? url.origin
    : 'https://media.transcript.fish';
};

export const formatDate = (date: string) => {
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDuration = (duration: number) => {
  return `${Math.floor(duration / 60)} minutes`;
};

export const makeImageUrl = (episode: number, imageUrl: string) => {
  const extension = imageUrl.split('.').pop();
  return extension
    ? `${mediaUrl()}/images/episodes/${episode}.${extension}`
    : '';
};

export const preventDefault: FormEventHandler = e => e.preventDefault();

export const stopPropagation: MouseEventHandler = e => {
  if ((e.target as HTMLElement).nodeName === 'A') {
    e.stopPropagation();
  }
};

export const formatName = ({ firstName, middleName, lastName }: Presenter) =>
  [firstName, middleName, lastName].filter(n => n).join(' ');
