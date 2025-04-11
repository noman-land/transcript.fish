import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AudioPlayer } from './AudioPlayer';
import { AudioContext } from './AudioContext';
import { setMetadata, setPositionState } from './audioUtils';
import { FiltersContext } from '../filters/FiltersContext';

type Handler = (details: MediaSessionActionDetails) => void;

type Handlers = [MediaSessionAction, Handler | null][];

export const AudioContextProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const { filteredEpisodes } = useContext(FiltersContext);
  const [playingEpisode, setPlayingEpisode] = useState<number | undefined>(
    filteredEpisodes?.[0]?.episode
  );
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback((episodeNum: number) => {
    if (audioRef.current) {
      setPlaying(true);
      setPlayingEpisode(episodeNum);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setPositionState(audioRef.current);
        }
      }, 0);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      setPlaying(false);
      audioRef.current.pause();
    }
  }, []);

  const isPlaying = useCallback(
    (episodeNum: number) => playing && episodeNum === playingEpisode,
    [playing, playingEpisode]
  );

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPositionState(audioRef.current);
    }
  }, []);

  // Add event listeners on audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

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
  }, []);

  // Update MediaSession metadata when episode is changed
  useEffect(() => {
    const episode = filteredEpisodes?.find(
      ({ episode }) => episode === playingEpisode
    );
    if (episode) {
      setMetadata(episode);
    }
  }, [playingEpisode, filteredEpisodes]);

  // Add MediaSession event handlers
  useEffect(() => {
    if (!audioRef.current || !playingEpisode || !filteredEpisodes) {
      return;
    }

    audioRef.current.playbackRate = 1;
    audioRef.current.preservesPitch = true;

    const episodeIdx = filteredEpisodes?.findIndex(
      ({ episode }) => episode === playingEpisode
    );

    const handlers: Handlers = [
      ['play', () => play(playingEpisode)],
      ['pause', pause],
      [
        'previoustrack',
        episodeIdx > 0
          ? () => {
              if (audioRef.current) {
                setPlayingEpisode(filteredEpisodes[episodeIdx - 1].episode);
                setCurrentTime(0);
                setPlaying(true);
                audioRef.current.currentTime = 0;
                setPositionState(audioRef.current);
              }
            }
          : null,
      ],
      [
        'nexttrack',
        episodeIdx < filteredEpisodes.length - 1
          ? () => {
              if (audioRef.current) {
                setPlayingEpisode(filteredEpisodes[episodeIdx + 1].episode);
                setCurrentTime(0);
                setPlaying(true);
                audioRef.current.currentTime = 0;
                setPositionState(audioRef.current);
              }
            }
          : null,
      ],
      [
        'seekbackward',
        ({ seekOffset = 10 }) => {
          if (audioRef.current) {
            audioRef.current.currentTime =
              audioRef.current.currentTime - seekOffset;
            setCurrentTime(time => time - seekOffset);
            setPositionState(audioRef.current);
          }
        },
      ],
      [
        'seekforward',
        ({ seekOffset = 10 }) => {
          if (audioRef.current) {
            audioRef.current.currentTime =
              audioRef.current.currentTime + seekOffset;
            setCurrentTime(time => time + seekOffset);
            setPositionState(audioRef.current);
          }
        },
      ],
      [
        'seekto',
        ({ seekTime, fastSeek }) => {
          if (!seekTime || !audioRef.current) {
            return;
          }

          if (fastSeek && 'fastSeek' in audioRef.current) {
            audioRef.current.fastSeek(seekTime);
          } else {
            audioRef.current.currentTime = seekTime;
          }

          setCurrentTime(seekTime);
          setPositionState(audioRef.current);
        },
      ],
    ];

    for (const [event, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(event, handler);
      } catch (e) {
        console.warn(`MediaSession event '${event}' not supported.`);
      }
    }
  }, [playingEpisode, play, pause, filteredEpisodes]);

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
      <AudioPlayer episodeNum={playingEpisode} audioRef={audioRef} />
      {children}
    </AudioContext.Provider>
  );
};
