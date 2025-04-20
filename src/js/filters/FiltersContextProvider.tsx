import { ReactElement, useContext, useState } from 'react';
import { useParams } from 'react-router';
import type {
  Episode,
  EpisodeType,
  EpisodeTypeFiltersState,
  SearchField,
  SearchFiltersState,
} from '../types';
import { FiltersContext } from './FiltersContext';
import { defaultEpisodeTypeFiltersState, defaultSearchFiltersState } from './filtersUtils';
import { DatabaseContext } from '../database/DatabaseContext';

type PresenterFiltersState = number[];
type VenueFiltersState = number[];
type CityFiltersState = string[];
type FilterToggleHandler<T> = (args: { name: T; checked: boolean }) => void;

// Four Undisclosed Locations
const WFH_VENUE_ID = 2;
const QI_OFFICE_VENUE_IDS = [
  1, // Covent Garden
  4, // Holborn
  9, // 2020 Audio
];

export const FiltersContextProvider = ({ children }: { children: ReactElement }) => {
  const { episodeId } = useParams();

  const {
    venues: { data: venues },
  } = useContext(DatabaseContext);
  const [presenterFilters, setPresenterFilters] = useState<PresenterFiltersState>([]);

  const [venueFilters, setVenueFilters] = useState<VenueFiltersState>([]);

  const [cityFilters, setCityFilters] = useState<CityFiltersState>([]);

  const [episodeTypeFilters, setEpisodeTypeFilters] = useState<EpisodeTypeFiltersState>(
    defaultEpisodeTypeFiltersState
  );

  const [searchFilters, setSearchFilters] = useState<SearchFiltersState>(defaultSearchFiltersState);

  const handleEpisodeTypeFilterToggle: FilterToggleHandler<EpisodeType> = ({ name, checked }) => {
    setEpisodeTypeFilters(current => ({
      ...current,
      [name]: checked,
    }));
  };

  const handleSearchFilterToggle: FilterToggleHandler<SearchField> = ({ name, checked }) => {
    setSearchFilters(current => ({
      ...current,
      [name]: checked,
    }));
  };

  const getFilteredEpisodes = (episodes: Episode[] = []) =>
    episodes
      .filter(({ episode }) => {
        if (!episodeId) {
          return true;
        }
        return episode === parseInt(episodeId, 10);
      })
      .filter(ep => {
        if (!presenterFilters.length) {
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
        if (!venueFilters.length) {
          return true;
        }
        return venueFilters.includes(ep.venue);
      })
      .filter(ep => {
        if (!cityFilters.length || !venues) {
          return true;
        }
        return cityFilters.includes(venues[ep.venue].city);
      })
      .filter(ep => {
        return (
          (episodeTypeFilters.live && ep.live) ||
          (episodeTypeFilters.compilation && ep.compilation) ||
          (episodeTypeFilters.wfh && ep.venue === WFH_VENUE_ID) ||
          (episodeTypeFilters.office && QI_OFFICE_VENUE_IDS.includes(ep.venue))
        );
      });

  const areEpisodeTypesAltered = Object.values(episodeTypeFilters).some(v => !v);
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
        cityFilters,
        handleEpisodeTypeFilterToggle,
        handleSearchFilterToggle,
        setPresenterFilters,
        setVenueFilters,
        setCityFilters,
        setEpisodeTypeFilters,
        numFiltersAltered,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
