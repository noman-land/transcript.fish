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
type VenueFiltersState = number[];
type FilterToggleHandler<T> = (args: { name: T; checked: boolean }) => void;

// Four Undisclosed Locations
const WFH_VENUE_ID = 2;
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
const defaultVenueFiltersState: VenueFiltersState = [];

const noop = () => {
  return undefined;
};

export const FiltersContext = createContext<{
  getFilteredEpisodes: (episodes?: Episode[]) => Episode[] | undefined;
  episodeTypeFilters: EpisodeTypeFiltersState;
  searchFilters: SearchFiltersState;
  presenterFilters: PresenterFiltersState;
  venueFilters: VenueFiltersState;
  handleEpisodeTypeFilterToggle: FilterToggleHandler<EpisodeType>;
  handleSearchFilterToggle: FilterToggleHandler<SearchField>;
  setPresenterFilters: Dispatch<SetStateAction<PresenterFiltersState>>;
  setVenueFilters: Dispatch<SetStateAction<VenueFiltersState>>;
  setEpisodeTypeFilters: Dispatch<SetStateAction<EpisodeTypeFiltersState>>;
  numFiltersAltered: number;
}>({
  getFilteredEpisodes: () => undefined,
  episodeTypeFilters: defaultEpisodeTypeFiltersState,
  searchFilters: defaultSearchFiltersState,
  presenterFilters: defaultPresenterFiltersState,
  venueFilters: defaultVenueFiltersState,
  handleEpisodeTypeFilterToggle: noop,
  handleSearchFilterToggle: noop,
  setPresenterFilters: noop,
  setVenueFilters: noop,
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

  const [venueFilters, setVenueFilters] = useState<VenueFiltersState>([]);

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
        if (venueFilters.length === 0) {
          return true;
        }

        return venueFilters.includes(ep.venue);
      })
      .filter(ep => {
        return (
          (episodeTypeFilters.live && ep.live) ||
          (episodeTypeFilters.compilation && ep.compilation) ||
          (episodeTypeFilters.wfh && ep.venue === WFH_VENUE_ID) ||
          (episodeTypeFilters.office && QI_OFFICE_VENUE_IDS.includes(ep.venue))
        );
      });

  const areEpisodeTypesAltered = Object.values(episodeTypeFilters).some(
    v => !v
  );
  const areSearchFiltersAltered = Object.values(searchFilters).some(v => !v);
  const arePresenterFiltersAltered = !!presenterFilters.length;
  const areVenueFiltersAltered = !!venueFilters.length;

  const numFiltersAltered =
    Number(areEpisodeTypesAltered) +
    Number(areSearchFiltersAltered) +
    Number(arePresenterFiltersAltered) +
    Number(areVenueFiltersAltered);

  return (
    <FiltersContext.Provider
      value={{
        getFilteredEpisodes,
        episodeTypeFilters,
        searchFilters,
        presenterFilters,
        venueFilters,
        handleEpisodeTypeFilterToggle,
        handleSearchFilterToggle,
        setPresenterFilters,
        setVenueFilters,
        setEpisodeTypeFilters,
        numFiltersAltered,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
