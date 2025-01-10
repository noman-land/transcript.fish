import { createContext } from 'react';
import { UseEpisodes, UsePresenters, UseVenues } from './dbHooks';

export const DatabaseContext = createContext<{
  episodes: Omit<ReturnType<UseEpisodes>, 'get'>;
  presenters: Omit<ReturnType<UsePresenters>, 'get'>;
  venues: Omit<ReturnType<UseVenues>, 'get'>;
}>({
  episodes: { loading: false, search: () => undefined },
  presenters: { loading: false },
  venues: { loading: false },
});
