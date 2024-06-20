import { ReactElement, createContext, useEffect } from 'react';
import {
  UseEpisodes,
  UsePresenters,
  UseTranscript,
  UseVenues,
  useEpisodes,
  usePresenters,
  useTranscript,
  useVenues,
} from './dbHooks';

export const DatabaseContext = createContext<{
  episodes: Omit<ReturnType<UseEpisodes>, 'get'>;
  presenters: Omit<ReturnType<UsePresenters>, 'get'>;
  venues: Omit<ReturnType<UseVenues>, 'get'>;
  transcript: ReturnType<UseTranscript>;
}>({
  episodes: { loading: false, search: () => undefined },
  presenters: { loading: false },
  venues: { loading: false },
  transcript: { loading: false, get: () => undefined },
});

export const DatabaseProvider = ({ children }: { children: ReactElement }) => {
  const { get: getEpisodes, ...episodes } = useEpisodes();
  const { get: getPresenters, ...presenters } = usePresenters();
  const { get: getVenues, ...venues } = useVenues();
  const transcript = useTranscript();

  useEffect(() => {
    getPresenters();
    getEpisodes();
    getVenues();
  }, [getPresenters, getEpisodes, getVenues]);

  const value = {
    presenters,
    episodes,
    transcript,
    venues,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
