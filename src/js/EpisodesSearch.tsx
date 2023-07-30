import styled from 'styled-components';
import { FormEvent, useCallback, useState } from 'react';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { throttle } from 'throttle-debounce';
import { PAGE_SIZE } from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  input {
    border: 0;
    font-family: TTE, 'Courier New', Courier, monospace;
    opacity: 0.5;
    padding: 1rem;
    font-size: 1em;

    &:focus {
      outline: 2px solid #d2bb3d;
    }
  }

  .button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;

    .page-numbers {
      padding: 1rem 2rem;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      font-family: TTE, 'Courier New', Courier, monospace;
      font-size: 1em;
      padding: 1rem 2rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const EpisodeSearch = () => {
  const { episodes } = useDb();
  const [search, setSearch] = useState('');

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

  const totalPages = Math.ceil(episodes.length / PAGE_SIZE);

  return (
    <Wrapper>
      <input placeholder="Search" onInput={handleSearch} />
      <EpisodesTable episodes={filteredEpisodes} page={page} />
      <div className="button-wrapper">
        {page > 0 && <button onClick={prevPage}>{'< Prev'}</button>}
        <span className="page-numbers">
          page <span>{page + 1}</span> of <span>{totalPages}</span>
        </span>
        {page < totalPages - 1 && (
          <button onClick={nextPage}>{'Next >'}</button>
        )}
      </div>
    </Wrapper>
  );
};
