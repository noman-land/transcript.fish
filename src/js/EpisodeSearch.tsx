import styled from 'styled-components';
import { Outlet } from 'react-router';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { PAGE_SIZE } from './constants';
import { Paginator } from './Paginator';
import { FilterBar } from './filters/FilterBar';
import { EmptyState } from './EmptyState';
import { SearchBar } from './SearchBar';
import { Total } from './Total';
import { preventDefault } from './utils';
import { FiltersContext } from './filters/FiltersContext';
import { DatabaseContext } from './database/DatabaseContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ExpandAllWrapper = styled.div`
  display: flex;
  flex-grow: 1;

  button {
    display: inline-block;
    background: none;
    border: 0;
    font-size: 1em;
    padding: 0.6rem 2rem 1rem 0;
    margin-right: 3rem;
    cursor: pointer;
    white-space: nowrap;
  }
`;

const TotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 3vw;
  flex-grow: 1;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    margin: 0 4.5vw;
  }

  @media (max-width: 650px) {
    margin: 0 6vw;
  }
`;

const PaginationSpacer = styled.div`
  height: 116.2px;
`;

export const EpisodeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const {
    episodes: {
      data: episodes,
      search,
      error: episodesError,
      loading: episodesLoading,
      total: totalEpisodes,
    },
  } = useContext(DatabaseContext);

  const { getFilteredEpisodes, episodeTypeFilters, presenterFilters, searchFilters, venueFilters } =
    useContext(FiltersContext);

  useEffect(() => {
    search(searchTerm, searchFilters);
  }, [search, searchTerm, searchFilters]);

  useEffect(() => {
    setPage(0);
  }, [episodeTypeFilters, presenterFilters, searchTerm, searchFilters, venueFilters]);

  const handleSubmit = useCallback((e: FormEvent) => {
    preventDefault(e);
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = (formData.get('searchTerm') as string).trim();

    if (searchTerm.length === 0 || searchTerm.length > 2) {
      setSearchTerm(searchTerm);
    }
  }, []);

  const handleExpandAll = useCallback(() => {
    setExpanded(e => !e);
  }, []);

  const filteredEpisodes = getFilteredEpisodes(episodes);

  if (!filteredEpisodes) {
    return null;
  }

  const totalPages = Math.ceil(filteredEpisodes.length / PAGE_SIZE);
  const resultsCount = episodesError ? 0 : filteredEpisodes.length;
  const isShowingAll = resultsCount === totalEpisodes && !searchTerm;

  return (
    <Wrapper>
      <SearchBar placeholder="no such thing as a search bar" onSubmit={handleSubmit} />
      <FilterBar />
      {!!totalEpisodes && (
        <TotalWrapper>
          <ExpandAllWrapper>
            <button onClick={handleExpandAll}>
              {expanded ? '[-] collapse' : '[+] expand'} all
            </button>
          </ExpandAllWrapper>
          {!episodesLoading && !episodesError && (
            <Total isShowingAll={isShowingAll} resultsCount={resultsCount} total={totalEpisodes} />
          )}
        </TotalWrapper>
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
          <Outlet
            context={{
              episodes: filteredEpisodes,
              loading: episodesLoading,
              page,
              expanded,
              searchTerm,
            }}
          />
          {totalPages > 1 && !episodesLoading ? (
            <Paginator page={page} totalPages={totalPages} onPageChange={setPage} />
          ) : (
            <PaginationSpacer />
          )}
        </>
      )}
    </Wrapper>
  );
};
