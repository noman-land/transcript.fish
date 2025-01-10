import { ReactElement, useEffect } from 'react';
import { useEpisodes, usePresenters, useVenues } from './dbHooks';
import { DatabaseContext } from './DatabaseContext';

export const DatabaseContextProvider = ({ children }: { children: ReactElement }) => {
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

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};
