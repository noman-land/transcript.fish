import styled from 'styled-components';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { PAGE_SIZE } from './constants';
import { PaginationSpacer, Paginator } from './Paginator';
import { EpisodeTypeFiltersState, SearchFiltersState } from './types';
import { FilterBar } from './filters/FilterBar';
import { EmptyState } from './EmptyState';
import { SearchBar } from './SearchBar';
import { Total } from './Total';
import { preventDefault } from './utils';
import { fadeIn } from './styleUtils';
import { SearchFilters } from './filters/SearchFilters';
import { PresenterFilters } from './filters/PresenterFilters';
import { EpisodeTypeFilters } from './filters/EpisodeTypeFilters';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${fadeIn}
`;

const WFH_VANUE_ID = 2;
const QI_OFFICE_VENUE_IDS = [
  1, // Covent Garden
  4, // Hoburn
  9, // 2020 Audio
];

export const EpisodeSearch = () => {
  const {
    episodes: {
      data: episodes,
      search,
      error: episodesError,
      loading: episodesLoading,
      total,
    },
    presenters: { data: presenters },
  } = useDb();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [presenterFilters, setPresenterFilters] = useState<number[]>([]);
  const [episodeTypeFilters, setEpisodeTypeFilters] =
    useState<EpisodeTypeFiltersState>({
      live: true,
      compilation: true,
      wfh: true,
      office: true,
    });

  const [searchFilters, setSearchFilters] = useState<SearchFiltersState>({
    episode: true,
    title: true,
    description: true,
    words: true,
  });

  const handleEpisodeTypeFilterToggle = useCallback(
    ({ name, checked }: { name: string; checked: boolean }) => {
      setEpisodeTypeFilters(current => ({
        ...current,
        [name]: checked,
      }));
    },
    []
  );

  const handleSearchFilterToggle = useCallback(
    ({ name, checked }: { name: string; checked: boolean }) => {
      setSearchFilters(current => ({
        ...current,
        [name]: checked,
      }));
    },
    []
  );

  useEffect(() => {
    search(searchTerm, searchFilters);
    setPage(0);
  }, [search, searchTerm, searchFilters]);

  const handleSubmit = useCallback((e: FormEvent) => {
    preventDefault(e);
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = (formData.get('searchTerm') as string).trim();

    if (searchTerm.length === 0 || searchTerm.length > 2) {
      setSearchTerm(searchTerm);
    }
  }, []);

  if (!episodes) {
    return null;
  }

  const filteredEpisodes = episodes
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
  const totalPages = Math.ceil(filteredEpisodes.length / PAGE_SIZE);
  const episodesLength = episodesError ? 0 : filteredEpisodes.length;
  const presentersFull = presenters
    ? presenterFilters.map(n => presenters[n])
    : [];

  return (
    <Wrapper>
      <SearchBar
        placeholder="no such thing as a search bar"
        onSubmit={handleSubmit}
      />
      <FilterBar>
        <SearchFilters
          selected={searchFilters}
          onToggle={handleSearchFilterToggle}
        />
        <EpisodeTypeFilters
          selected={episodeTypeFilters}
          onToggle={handleEpisodeTypeFilterToggle}
        />
        <PresenterFilters
          selected={presenterFilters}
          onChange={setPresenterFilters}
        />
      </FilterBar>
      {!!total && (
        <Total
          presenters={presentersFull}
          searchTerm={searchTerm}
          error={!!episodesError}
          loading={episodesLoading}
          results={episodesLength}
          total={total}
        />
      )}
      {episodesError ? (
        <>
          <EmptyState
            title={episodesError.message}
            body="Sorry about that. A report has been filed. Please try a different search."
          />
          <PaginationSpacer />
        </>
      ) : (
        <>
          <EpisodesTable
            episodes={filteredEpisodes}
            page={page}
            loading={episodesLoading}
          />
          {totalPages > 1 && !episodesLoading ? (
            <Paginator
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : (
            <PaginationSpacer />
          )}
        </>
      )}
    </Wrapper>
  );
};
