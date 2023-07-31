import styled from 'styled-components';
import { FormEvent, useCallback, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { PAGE_SIZE } from './constants';
import { Paginator } from './Paginator';
import { SearchFunctions, FiltersState, SearchField } from './types';
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

const searchFns: SearchFunctions = {
  episode: (ep, searchTerm) =>
    String(ep.episode).includes(searchTerm.toLowerCase()),
  title: (ep, searchTerm) =>
    ep.title.toLocaleLowerCase().includes(searchTerm.toLowerCase()),
  description: (ep, searchTerm) =>
    ep.description.toLocaleLowerCase().includes(searchTerm.toLowerCase()),
};

export const EpisodeSearch = () => {
  const { episodes } = useDb();
  const [searchTerm, setSearchTerm] = useState('');
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
    throttle(
      100,
      ({ target }: FormEvent) => {
        setSearchTerm((target as HTMLInputElement).value);
        setPage(0);
      },
      { noLeading: true }
    ),
    []
  );

  if (!episodes) {
    return null;
  }

  const filteredEpisodes = episodes.filter(episode => {
    return Object.entries(searchFns)
      .filter(([name]) => selectedFilters[name as SearchField])
      .some(([, search]) => search(episode, searchTerm));
  });

  const totalPages = Math.ceil(filteredEpisodes.length / PAGE_SIZE);

  return (
    <Wrapper>
      <input
        className="search-bar"
        placeholder="Search"
        onInput={handleSearch}
      />
      <FilterBar filters={selectedFilters} onToggle={handleFilterToggle} />
      <EpisodesTable episodes={filteredEpisodes} page={page} />
      {totalPages > 1 ? (
        <Paginator page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : (
        <div style={{ height: 116.2 }} />
      )}
    </Wrapper>
  );
};
