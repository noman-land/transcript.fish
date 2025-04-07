import { Ref, createContext } from 'react';

export const AudioContext = createContext<{
  isPlaying: (episodeNum: number) => boolean;
  play: (episodeNum: number) => void;
  pause: () => void;
  audioRef?: Ref<HTMLAudioElement>;
  playingEpisode?: number;
  currentTime: number;
  seek: (time: number) => void;
  ended: boolean;
}>({
  isPlaying: () => false,
  play: () => undefined,
  pause: () => undefined,
  audioRef: null,
  playingEpisode: undefined,
  currentTime: 0,
  seek: () => undefined,
  ended: false,
});
