import styled from 'styled-components';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { debounce } from 'throttle-debounce';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { PAGE_SIZE } from './constants';
import { Paginator } from './Paginator';
import { FiltersState } from './types';
import { FilterBar } from './FilterBar';
import { EmptyState } from './EmptyState';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .search-bar {
    background: #efe284;
    border: 0;
    font-family: TTE, 'Courier New', Courier, monospace;
    padding: 1em 3vw;
    font-size: 1em;

    @media (max-width: 900px) {
      padding: 1em 4.5vw;
    }
    @media (max-width: 650px) {
      padding: 1em 6vw;
    }
    @media (max-width: 500px) {
      padding: 1em 6vw;
    }

    &:focus {
      outline: 2px solid #d2bb3d;
    }
  }
`;

const PaginationSpacer = () => <div style={{ height: 116.2 }} />;

export const EpisodeSearch = () => {
  const { episodes, search, error } = useDb();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [selectedFilters, setFilters] = useState<FiltersState>({
    episode: true,
    title: true,
    description: true,
    words: true,
  });

  const handleFilterToggle = useCallback(
    ({ name, checked }: { name: string; checked: boolean }) => {
      setFilters(current => ({
        ...current,
        [name]: checked,
      }));
    },
    []
  );

  useEffect(() => {
    if (searchTerm.length === 0 || searchTerm.length > 2) {
      search(searchTerm, selectedFilters);
      setPage(0);
    }
  }, [search, searchTerm, selectedFilters]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(
      400,
      ({ target }: FormEvent) => {
        const { value } = target as HTMLInputElement;
        setSearchTerm(value);
      },
      { atBegin: false }
    ),
    []
  );

  if (!episodes) {
    return null;
  }

  const totalPages = Math.ceil(episodes.length / PAGE_SIZE);

  return (
    <Wrapper>
      <input
        className="search-bar"
        placeholder="Search"
        onInput={handleSearch}
      />
      <FilterBar filters={selectedFilters} onToggle={handleFilterToggle} />
      {error ? (
        <>
          <EmptyState title={error.message} body="Please try again." />
          <PaginationSpacer />
        </>
      ) : (
        <>
          <EpisodesTable episodes={episodes} page={page} />
          {totalPages > 1 ? (
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
