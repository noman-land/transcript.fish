import styled from 'styled-components';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { PAGE_SIZE } from './constants';
import { Paginator } from './Paginator';
import { FilterBar } from './filters/FilterBar';
import { EmptyState } from './EmptyState';
import { SearchBar } from './SearchBar';
import { Total } from './Total';
import { preventDefault } from './utils';
import { FiltersContext } from './filters/FiltersContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PaginationSpacer = styled.div`
  height: 116.2px;
`;

export const EpisodeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

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

  const {
    getFilteredEpisodes,
    episodeTypeFilters,
    presenterFilters,
    searchFilters,
  } = useContext(FiltersContext);

  useEffect(() => {
    search(searchTerm, searchFilters);
  }, [search, searchTerm, searchFilters]);

  useEffect(() => {
    setPage(0);
  }, [episodeTypeFilters, presenterFilters, searchTerm, searchFilters]);

  const handleSubmit = useCallback((e: FormEvent) => {
    preventDefault(e);
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = (formData.get('searchTerm') as string).trim();

    if (searchTerm.length === 0 || searchTerm.length > 2) {
      setSearchTerm(searchTerm);
    }
  }, []);

  const filteredEpisodes = getFilteredEpisodes(episodes);

  if (!filteredEpisodes) {
    return null;
  }

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
      <FilterBar />
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
