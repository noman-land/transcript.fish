import { Dispatch, SetStateAction, createContext } from 'react';
import type {
  Episode,
  EpisodeType,
  EpisodeTypeFiltersState,
  SearchField,
  SearchFiltersState,
} from '../types';
import { defaultEpisodeTypeFiltersState, defaultSearchFiltersState } from './filtersUtils';

type PresenterFiltersState = number[];
type VenueFiltersState = number[];
type CityFiltersState = string[];
type FilterToggleHandler<T> = (args: { name: T; checked: boolean }) => void;

const defaultPresenterFiltersState: PresenterFiltersState = [];
const defaultVenueFiltersState: VenueFiltersState = [];
const defaultCityFiltersState: CityFiltersState = [];

const noop = () => {
  return undefined;
};

export const FiltersContext = createContext<{
  getFilteredEpisodes: (episodes?: Episode[]) => Episode[] | undefined;
  episodeTypeFilters: EpisodeTypeFiltersState;
  searchFilters: SearchFiltersState;
  presenterFilters: PresenterFiltersState;
  venueFilters: VenueFiltersState;
  cityFilters: CityFiltersState;
  handleEpisodeTypeFilterToggle: FilterToggleHandler<EpisodeType>;
  handleSearchFilterToggle: FilterToggleHandler<SearchField>;
  setPresenterFilters: Dispatch<SetStateAction<PresenterFiltersState>>;
  setVenueFilters: Dispatch<SetStateAction<VenueFiltersState>>;
  setCityFilters: Dispatch<SetStateAction<CityFiltersState>>;
  setEpisodeTypeFilters: Dispatch<SetStateAction<EpisodeTypeFiltersState>>;
  numFiltersAltered: number;
}>({
  getFilteredEpisodes: () => undefined,
  episodeTypeFilters: defaultEpisodeTypeFiltersState,
  searchFilters: defaultSearchFiltersState,
  presenterFilters: defaultPresenterFiltersState,
  venueFilters: defaultVenueFiltersState,
  cityFilters: defaultCityFiltersState,
  handleEpisodeTypeFilterToggle: noop,
  handleSearchFilterToggle: noop,
  setPresenterFilters: noop,
  setVenueFilters: noop,
  setCityFilters: noop,
  setEpisodeTypeFilters: n => n,
  numFiltersAltered: 0,
});
