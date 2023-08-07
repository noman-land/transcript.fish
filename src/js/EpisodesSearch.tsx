import styled from 'styled-components';
import { FormEvent, useCallback, useState } from 'react';
import { debounce } from 'throttle-debounce';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { PAGE_SIZE } from './constants';
import { Paginator } from './Paginator';
import { FiltersState } from './types';
import { FilterBar } from './FilterBar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .search-bar {
    border: 0;
    font-family: TTE, 'Courier New', Courier, monospace;
    opacity: 0.5;
    padding: 1rem;
    font-size: 1em;

    &:focus {
      outline: 2px solid #d2bb3d;
    }
  }
`;

export const EpisodeSearch = () => {
  const { episodes, search, error } = useDb();
  const [setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [selectedFilters, setFilters] = useState<FiltersState>({
    episode: true,
    title: true,
    description: true,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(
      400,
      ({ target }: FormEvent) => {
        const { value } = target as HTMLInputElement;
        setSearchTerm(value);
        if (value.length === 0 || value.length > 2) {
          search(value);
          setPage(0);
        }
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
        <div>{error.message}</div>
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
            <div style={{ height: 116.2 }} />
          )}
        </>
      )}
    </Wrapper>
  );
};
