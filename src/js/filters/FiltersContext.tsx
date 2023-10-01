import { ReactElement, createContext, useCallback, useState } from 'react';
import { Episode, EpisodeTypeFiltersState, SearchFiltersState } from '../types';

type PresenterFiltersState = number[];
type FilterToggleHandler = (args: { name: string; checked: boolean }) => void;
type PresenterFilterChangeHandlers = (selected: number[]) => void;

const WFH_VANUE_ID = 2;
const QI_OFFICE_VENUE_IDS = [
  1, // Covent Garden
  4, // Hoburn
  9, // 2020 Audio
];

const defaultEpisodeTypeFiltersState = {
  live: true,
  compilation: true,
  wfh: true,
  office: true,
};

const defaultSearchFiltersState = {
  episode: true,
  title: true,
  description: true,
  words: true,
};

const defaultPresenterFiltersState: PresenterFiltersState = [];

const noop = () => {
  return undefined;
};

export const FiltersContext = createContext<{
  getFilteredEpisodes: (episodes?: Episode[]) => Episode[] | undefined;
  episodeTypeFilters: EpisodeTypeFiltersState;
  searchFilters: SearchFiltersState;
  presenterFilters: PresenterFiltersState;
  handleEpisodeTypeFilterToggle: FilterToggleHandler;
  handleSearchFilterToggle: FilterToggleHandler;
  handlePresenterFilterChange: PresenterFilterChangeHandlers;
}>({
  getFilteredEpisodes: () => undefined,
  episodeTypeFilters: defaultEpisodeTypeFiltersState,
  searchFilters: defaultSearchFiltersState,
  presenterFilters: defaultPresenterFiltersState,
  handleEpisodeTypeFilterToggle: noop,
  handleSearchFilterToggle: noop,
  handlePresenterFilterChange: noop,
});

export const FiltersContextProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [presenterFilters, setPresenterFilters] =
    useState<PresenterFiltersState>([]);

  const [episodeTypeFilters, setEpisodeTypeFilters] =
    useState<EpisodeTypeFiltersState>(defaultEpisodeTypeFiltersState);

  const [searchFilters, setSearchFilters] = useState<SearchFiltersState>(
    defaultSearchFiltersState
  );

  const handleEpisodeTypeFilterToggle: FilterToggleHandler = useCallback(
    ({ name, checked }) => {
      setEpisodeTypeFilters(current => ({
        ...current,
        [name]: checked,
      }));
    },
    []
  );

  const handleSearchFilterToggle: FilterToggleHandler = useCallback(
    ({ name, checked }) => {
      setSearchFilters(current => ({
        ...current,
        [name]: checked,
      }));
    },
    []
  );

  const getFilteredEpisodes = (episodes: Episode[] = []) =>
    episodes
      .filter(epi => {
        if (presenterFilters.length === 0) {
          return true;
        }

        return (
          presenterFilters.includes(epi.presenter1) ||
          presenterFilters.includes(epi.presenter2) ||
          presenterFilters.includes(epi.presenter3) ||
          presenterFilters.includes(epi.presenter4) ||
          presenterFilters.includes(epi.presenter5)
        );
      })
      .filter(epi => {
        return (
          (epi.live && episodeTypeFilters.live) ||
          (epi.compilation && episodeTypeFilters.compilation) ||
          (epi.venue === WFH_VANUE_ID && episodeTypeFilters.wfh) ||
          (QI_OFFICE_VENUE_IDS.includes(epi.venue) && episodeTypeFilters.office)
        );
      });

  return (
    <FiltersContext.Provider
      value={{
        getFilteredEpisodes,
        episodeTypeFilters,
        searchFilters,
        presenterFilters,
        handleEpisodeTypeFilterToggle,
        handleSearchFilterToggle,
        handlePresenterFilterChange: setPresenterFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
