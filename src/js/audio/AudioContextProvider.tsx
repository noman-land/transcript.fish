import { ReactElement, useEffect, useRef, useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { AudioContext } from './AudioContext';

export const AudioContextProvider = ({ children }: { children: ReactElement }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
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
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playingEpisode) {
      return;
    }

    audio.playbackRate = 1;
    audio.preservesPitch = true;

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
    const audio = audioRef.current;
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
      {playingEpisode && <AudioPlayer episodeNum={playingEpisode} audioRef={audioRef} />}
      {children}
    </AudioContext.Provider>
  );
};
