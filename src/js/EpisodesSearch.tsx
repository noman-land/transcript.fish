import styled from 'styled-components';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { debounce } from 'throttle-debounce';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { PAGE_SIZE } from './constants';
import { PaginationSpacer, Paginator } from './Paginator';
import { FiltersState } from './types';
import { FilterBar } from './FilterBar';
import { EmptyState } from './EmptyState';
import { SearchBar } from './SearchBar';
import { Total } from './Total';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const EpisodeSearch = () => {
  const { episodes, search, error, loading, total } = useDb();
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
  const episodesLength = error ? 0 : episodes.length;

  return (
    <Wrapper>
      <SearchBar placeholder="Search" onInput={handleSearch} />
      <FilterBar filters={selectedFilters} onToggle={handleFilterToggle} />
      {!!total && (
        <Total
          searchTerm={searchTerm}
          loading={loading}
          results={episodesLength}
          total={total}
        />
      )}
      {error ? (
        <>
          <EmptyState
            title={error.message}
            body="Sorry about that. A report has been filed. Please try a different search."
          />
          <PaginationSpacer />
        </>
      ) : (
        <>
          <EpisodesTable
            episodes={episodes}
            page={page}
            searchTerm={searchTerm}
          />
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
