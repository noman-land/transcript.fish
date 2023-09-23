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
  playPause: (episodeNum: number) => void;
  audioRef?: Ref<HTMLAudioElement>;
  playingEpisode?: number;
  currentTime: number;
}>({
  isPlaying: () => false,
  playPause: () => undefined,
  audioRef: null,
  playingEpisode: undefined,
  currentTime: 0,
});

export const AudioContextWrapper = ({
  children,
}: {
  children: ReactElement;
}) => {
  const ref = useRef<HTMLAudioElement>(null);
  const [playingEpisode, setPlayingEpisode] = useState<number>();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
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

    const handleTimeupdate = (event: Event) => {
      const { currentTime } = event.target as HTMLAudioElement;
      setCurrentTime(currentTime);
    };

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    const logEnd = ({ target }: Event) => console.log('ended', target);

    audio?.addEventListener('timeupdate', handleTimeupdate);
    audio?.addEventListener('play', handlePlay);
    audio?.addEventListener('pause', handlePause);
    audio?.addEventListener('ended', logEnd);

    return () => {
      audio?.removeEventListener('timeupdate', handleTimeupdate);
      audio?.removeEventListener('play', handlePlay);
      audio?.removeEventListener('pause', handlePause);
      audio?.removeEventListener('ended', logEnd);
    };
  }, [playingEpisode]);

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
        playPause,
        playingEpisode,
        currentTime,
      }}
    >
      {playingEpisode && (
        <AudioPlayer episodeNum={playingEpisode} audioRef={ref} />
      )}
      {children}
    </AudioContext.Provider>
  );
};
