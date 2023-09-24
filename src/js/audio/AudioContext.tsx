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
  seek: (time: number) => void;
  ended: boolean;
}>({
  isPlaying: () => false,
  playPause: () => undefined,
  audioRef: null,
  playingEpisode: undefined,
  currentTime: 0,
  seek: () => undefined,
  ended: false,
});

export const AudioContextWrapper = ({
  children,
}: {
  children: ReactElement;
}) => {
  const ref = useRef<HTMLAudioElement>(null);
  const [playingEpisode, setPlayingEpisode] = useState<number>();
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const playPause = (episodeNum: number) => {
    setPlaying(p => {
      if (episodeNum === playingEpisode) {
        return !p;
      }

      setPlayingEpisode(episodeNum);
      return true;
    });
  };

  const isPlaying = (episodeNum: number) => {
    return playing && episodeNum === playingEpisode;
  };

  const seek = (time: number) => {
    ref.current?.fastSeek(time);
  };

  useEffect(() => {
    const audio = ref.current;
    if (!audio || !playingEpisode) {
      return;
    }

    const handleTimeupdate = (event: Event) => {
      const { currentTime } = event.target as HTMLAudioElement;
      setCurrentTime(currentTime);
      setEnded(false);
    };
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => setEnded(true);

    audio?.addEventListener('timeupdate', handleTimeupdate);
    audio?.addEventListener('play', handlePlay);
    audio?.addEventListener('pause', handlePause);
    audio?.addEventListener('ended', handleEnded);
    audio?.addEventListener('seeked', handleTimeupdate);

    return () => {
      audio?.removeEventListener('timeupdate', handleTimeupdate);
      audio?.removeEventListener('play', handlePlay);
      audio?.removeEventListener('pause', handlePause);
      audio?.removeEventListener('ended', handleEnded);
      audio?.removeEventListener('seeked', handleTimeupdate);
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
        seek,
        ended,
      }}
    >
      {playingEpisode && (
        <AudioPlayer episodeNum={playingEpisode} audioRef={ref} />
      )}
      {children}
    </AudioContext.Provider>
  );
};
