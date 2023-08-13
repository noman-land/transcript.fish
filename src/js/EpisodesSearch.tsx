import styled from 'styled-components';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { PAGE_SIZE } from './constants';
import { PaginationSpacer, Paginator } from './Paginator';
import { FiltersState } from './types';
import { FilterBar } from './FilterBar';
import { EmptyState } from './EmptyState';
import { SearchBar } from './SearchBar';
import { Total } from './Total';
import { preventDefault } from './utils';
import { fadeIn } from './styleUtils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  opacity: 0;
  ${fadeIn}
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
    search(searchTerm, selectedFilters);
    setPage(0);
  }, [search, searchTerm, selectedFilters]);

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

  const totalPages = Math.ceil(episodes.length / PAGE_SIZE);
  const episodesLength = error ? 0 : episodes.length;

  return (
    <Wrapper>
      <SearchBar
        placeholder="no such thing as a search bar"
        onSubmit={handleSubmit}
      />
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
