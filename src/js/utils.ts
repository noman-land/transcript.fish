import { FormEventHandler, MouseEventHandler } from 'react';
import type { Option, Venue, Presenter, Word, Matches } from './types';

const MEDIA_URL = 'https://media.transcript.fish' as const;

const isLocal = () => {
  const { hostname, search } = window.location;
  const deployed = new URLSearchParams(search).get('deployed');
  return (hostname === 'localhost' || hostname === '127.0.0.1') && !deployed;
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

const zeroPad = (num: number) => {
  return Math.floor(num).toString().padStart(2, '0');
};

export const formatTimestamp = (duration: number) => {
  const minutes = zeroPad(duration / 60);
  const seconds = zeroPad(duration % 60);
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

export const formatVenueName = (venue: Venue) => {
  const location = [venue.region, venue.city, venue.state]
    .filter(n => n)
    .join(', ');
  return `${venue.name} (${location})`;
};

export const sortByLabel = (a: Option, b: Option) => {
  return a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase());
};

export const makeRowKey = (w: Word) => {
  return `${w.startTime}-${w.endTime}-${w.word}-${w.probability}`;
};

const WORD_REGEX = /[\s.,!?\-"]/g;

const clean = (word: string) => {
  return word.replace(WORD_REGEX, '').toLowerCase();
};

export const findMatches = (words: Word[], searchTerm: string) => {
  const searchWords = searchTerm
    .replace(WORD_REGEX, ' ')
    .split(' ')
    .filter(n => n);

  const allMatches = words.reduce((acc, _, i, _words) => {
    const matches: Matches = {};
    let j = 0;
    while (
      j < searchWords.length &&
      clean(_words[i + j].word) === clean(searchWords[j])
    ) {
      matches[i + j] = true;
      j++;
    }
    if (Object.keys(matches).length === searchWords.length) {
      return Object.assign(acc, matches);
    }
    return acc;
  }, {} as Matches);

  return {
    matches: allMatches,
    occurences: Object.keys(allMatches).length / searchWords.length,
  };
};
