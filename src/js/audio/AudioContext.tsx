import {
  ReactElement,
  Ref,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AudioPlayer } from './AudioPlayer';

export const AudioContext = createContext<{
  isPlaying: (episodeNum: number) => boolean;
  getCurrentTime: () => number;
  playPause: (episodeNum: number) => void;
  audioRef?: Ref<HTMLAudioElement>;
  playingEpisode?: number;
}>({
  isPlaying: () => false,
  getCurrentTime: () => 0,
  playPause: () => {
    return;
  },
  audioRef: null,
  playingEpisode: undefined,
});

export const AudioContextWrapper = ({
  children,
}: {
  children: ReactElement;
}) => {
  const ref = useRef<HTMLAudioElement>(null);
  const [playingEpisode, setPlayingEpisode] = useState<number>();
  const [playing, setPlaying] = useState(false);
  const getCurrentTime = () => 0;
  const playPause = (episodeNum: number) => {
    setPlaying(p => {
      const newPlaying = !p;
      if (newPlaying) {
        setPlayingEpisode(episodeNum);
      }
      return newPlaying;
    });
  };

  const isPlaying = (episodeNum: number) => {
    return playing && episodeNum === playingEpisode;
  };

  useEffect(() => {
    const audio = ref.current;
    if (!audio || !playingEpisode) {
      return;
    }

    if (playing) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playingEpisode, playing]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        getCurrentTime,
        playPause,
        playingEpisode,
      }}
    >
      {playingEpisode && (
        <AudioPlayer episodeNum={playingEpisode} audioRef={ref} />
      )}
      {children}
    </AudioContext.Provider>
  );
};
