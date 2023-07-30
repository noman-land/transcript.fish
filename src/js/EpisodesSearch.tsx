import styled from 'styled-components';
import { FormEvent, useCallback, useState } from 'react';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { throttle } from 'throttle-debounce';
import { PAGE_SIZE } from './constants';
import { Paginator } from './Paginator';

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
  const { episodes } = useDb();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

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

  const filteredEpisodes = episodes.filter(ep => {
    const lowercaseSearch = searchTerm.toLocaleLowerCase();
    return (
      ep.title.toLocaleLowerCase().includes(lowercaseSearch) ||
      ep.description.toLocaleLowerCase().includes(lowercaseSearch) ||
      String(ep.episode).includes(lowercaseSearch)
    );
  });

  return (
    <Wrapper>
      <input
        className="search-bar"
        placeholder="Search"
        onInput={handleSearch}
      />
      <EpisodesTable episodes={filteredEpisodes} page={page} />
      <Paginator
        page={page}
        totalPages={Math.ceil(filteredEpisodes.length / PAGE_SIZE)}
        onPageChange={setPage}
      />
    </Wrapper>
  );
};
