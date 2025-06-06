import { ReactElement, useState } from 'react';
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

type PresenterFiltersState = number[];
type VenueFiltersState = number[];
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
  const [presenterFilters, setPresenterFilters] = useState<PresenterFiltersState>([]);

  const [venueFilters, setVenueFilters] = useState<VenueFiltersState>([]);

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
