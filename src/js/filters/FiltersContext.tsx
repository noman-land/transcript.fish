import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useState,
} from 'react';
import {
  Episode,
  EpisodeType,
  EpisodeTypeFiltersState,
  SearchField,
  SearchFiltersState,
} from '../types';

type PresenterFiltersState = number[];
type FilterToggleHandler<T> = (args: { name: T; checked: boolean }) => void;

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
  handleEpisodeTypeFilterToggle: FilterToggleHandler<EpisodeType>;
  handleSearchFilterToggle: FilterToggleHandler<SearchField>;
  setPresenterFilters: Dispatch<SetStateAction<PresenterFiltersState>>;
  setEpisodeTypeFilters: Dispatch<SetStateAction<EpisodeTypeFiltersState>>;
  numFiltersAltered: number;
}>({
  getFilteredEpisodes: () => undefined,
  episodeTypeFilters: defaultEpisodeTypeFiltersState,
  searchFilters: defaultSearchFiltersState,
  presenterFilters: defaultPresenterFiltersState,
  handleEpisodeTypeFilterToggle: noop,
  handleSearchFilterToggle: noop,
  setPresenterFilters: noop,
  setEpisodeTypeFilters: n => n,
  numFiltersAltered: 0,
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

  const handleEpisodeTypeFilterToggle: FilterToggleHandler<EpisodeType> = ({
    name,
    checked,
  }) => {
    setEpisodeTypeFilters(current => ({
      ...current,
      [name]: checked,
    }));
  };

  const handleSearchFilterToggle: FilterToggleHandler<SearchField> = ({
    name,
    checked,
  }) => {
    setSearchFilters(current => ({
      ...current,
      [name]: checked,
    }));
  };

  const getFilteredEpisodes = (episodes: Episode[] = []) =>
    episodes
      .filter(ep => {
        if (presenterFilters.length === 0) {
          return true;
        }

        return (
          presenterFilters.includes(ep.presenter1) ||
          presenterFilters.includes(ep.presenter2) ||
          presenterFilters.includes(ep.presenter3) ||
          presenterFilters.includes(ep.presenter4) ||
          presenterFilters.includes(ep.presenter5)
        );
      })
      .filter(ep => {
        return (
          (ep.live && episodeTypeFilters.live) ||
          (ep.compilation && episodeTypeFilters.compilation) ||
          (ep.venue === WFH_VANUE_ID && episodeTypeFilters.wfh) ||
          (QI_OFFICE_VENUE_IDS.includes(ep.venue) && episodeTypeFilters.office)
        );
      });

  const areEpisodeTypesAltered = Object.values(episodeTypeFilters).some(
    v => !v
  );
  const areSearchFiltersAltered = Object.values(searchFilters).some(v => !v);
  const arePresenterFiltersAltered = !!presenterFilters.length;

  const numFiltersAltered =
    Number(areEpisodeTypesAltered) +
    Number(areSearchFiltersAltered) +
    Number(arePresenterFiltersAltered);

  return (
    <FiltersContext.Provider
      value={{
        getFilteredEpisodes,
        episodeTypeFilters,
        searchFilters,
        presenterFilters,
        handleEpisodeTypeFilterToggle,
        handleSearchFilterToggle,
        setPresenterFilters,
        setEpisodeTypeFilters,
        numFiltersAltered,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
