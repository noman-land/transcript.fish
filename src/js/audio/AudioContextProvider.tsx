import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { AudioContext } from './AudioContext';
import { DatabaseContext } from '../database/DatabaseContext';
import { setMetadata } from './audioUtils';
import { FiltersContext } from '../filters/FiltersContext';

export const AudioContextProvider = ({ children }: { children: ReactElement }) => {
  const { episodes } = useContext(DatabaseContext);
  const { getFilteredEpisodes } = useContext(FiltersContext);
  const [playingEpisode, setPlayingEpisode] = useState<number>();
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback((episodeNum: number) => {
    setPlaying(true);
    setPlayingEpisode(episodeNum);
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    setPlaying(false);
    audioRef.current?.pause();
  }, []);

  const isPlaying = useCallback(
    (episodeNum: number) => {
      return playing && episodeNum === playingEpisode;
    },
    [playing, playingEpisode]
  );

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.fastSeek(time);
    }
  }, []);

  const filteredEpisodes = getFilteredEpisodes(episodes.data);

  // Add event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playingEpisode) {
      return;
    }

    if (!filteredEpisodes) {
      return;
    }

    audio.playbackRate = 1;
    audio.preservesPitch = true;

    const episodeIdx = filteredEpisodes?.findIndex(({ episode }) => episode === playingEpisode);

    navigator.mediaSession.setActionHandler('play', () => play(playingEpisode));
    navigator.mediaSession.setActionHandler('pause', pause);

    // Show back button on everything but the first episode
    if (episodeIdx > 0) {
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (typeof episodeIdx === 'number') {
          setPlayingEpisode(filteredEpisodes[episodeIdx - 1].episode);
          setCurrentTime(0);
          setPlaying(true);
          audio.currentTime = 0;
        }
      });
    } else {
      navigator.mediaSession.setActionHandler('previoustrack', null);
    }

    // Show foward button on everything but the last episode
    if (episodeIdx < filteredEpisodes.length - 1) {
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (typeof episodeIdx === 'number') {
          setPlayingEpisode(filteredEpisodes[episodeIdx + 1].episode);
          setCurrentTime(0);
          setPlaying(true);
          audio.currentTime = 0;
        }
      });
    } else {
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }

    navigator.mediaSession.setActionHandler('seekbackward', () => {
      setCurrentTime(t => {
        const seekTime = t - 10_000;
        audio.fastSeek(seekTime);
        return seekTime;
      });
    });

    navigator.mediaSession.setActionHandler('seekforward', () => {
      setCurrentTime(t => {
        const seekTime = t + 10_000;
        audio.fastSeek(seekTime);
        return seekTime;
      });
    });

    navigator.mediaSession.setActionHandler('seekto', ({ seekTime }) => {
      if (seekTime) {
        setCurrentTime(seekTime);
        audio.fastSeek(seekTime);
      }
    });

    const handleTimeupdate = (event: Event) => {
      const { currentTime } = event.target as HTMLAudioElement;
      setCurrentTime(currentTime);
      setEnded(false);
    };

    const handleEnded = () => {
      setEnded(true);
      setPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeupdate);
    audio.addEventListener('seeked', handleTimeupdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeupdate);
      audio.removeEventListener('seeked', handleTimeupdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playingEpisode, play, pause, filteredEpisodes, getFilteredEpisodes]);

  // Update MediaSession metadata when episode is changed
  useEffect(() => {
    const episode = filteredEpisodes?.find(({ episode }) => episode === playingEpisode);
    if (episode) {
      setMetadata(episode);
    }
  }, [playingEpisode, filteredEpisodes]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        play,
        pause,
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
