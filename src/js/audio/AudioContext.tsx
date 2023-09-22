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
  isPlaying: boolean;
  getCurrentTime: () => number;
  playPause: (episodeNum: number) => void;
  audioRef?: Ref<HTMLAudioElement>;
  playingEpisode?: number;
}>({
  isPlaying: false,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const getCurrentTime = () => 0;
  const playPause = (episodeNum: number) => {
    setIsPlaying(p => {
      const newPlaying = !p;
      if (newPlaying) {
        setPlayingEpisode(episodeNum);
      }
      return newPlaying;
    });
  };

  useEffect(() => {
    const audio = ref.current;
    if (playingEpisode && audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [playingEpisode, isPlaying]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        getCurrentTime,
        playPause,
        playingEpisode,
      }}
    >
      <AudioPlayer episodeNum={playingEpisode} audioRef={ref} />
      {children}
    </AudioContext.Provider>
  );
};
