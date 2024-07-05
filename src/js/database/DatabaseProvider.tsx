import { ReactElement, createContext, useEffect } from 'react';
import {
  UseEpisodes,
  UsePresenters,
  UseVenues,
  useEpisodes,
  usePresenters,
  useVenues,
} from './dbHooks';

export const DatabaseContext = createContext<{
  episodes: Omit<ReturnType<UseEpisodes>, 'get'>;
  presenters: Omit<ReturnType<UsePresenters>, 'get'>;
  venues: Omit<ReturnType<UseVenues>, 'get'>;
}>({
  episodes: { loading: false, search: () => undefined },
  presenters: { loading: false },
  venues: { loading: false },
});

export const DatabaseProvider = ({ children }: { children: ReactElement }) => {
  const { get: getEpisodes, ...episodes } = useEpisodes();
  const { get: getPresenters, ...presenters } = usePresenters();
  const { get: getVenues, ...venues } = useVenues();

  useEffect(() => {
    getPresenters();
    getEpisodes();
    getVenues();
  }, [getPresenters, getEpisodes, getVenues]);

  const value = {
    presenters,
    episodes,
    venues,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
