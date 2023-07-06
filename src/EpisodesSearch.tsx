import styled from 'styled-components';
import { FormEvent, useCallback, useState } from 'react';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
import { throttle } from 'throttle-debounce';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  input {
    border: 0;
    opacity: 0.5;
    padding: 1rem;
    font-size: 16px;

    &:focus {
      outline: 2px solid #d2bb3d;
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
        setSearch((target as HTMLInputElement).value);
      },
      { noLeading: true }
    ),
    []
  );

  if (!episodes) {
    return null;
  }

  const filteredEpisodes = episodes.filter(ep => {
    const lowercaseSearch = search.toLocaleLowerCase();
    return (
      ep.title.toLocaleLowerCase().includes(lowercaseSearch) ||
      ep.description.toLocaleLowerCase().includes(lowercaseSearch)
    );
  });

  return (
    <Wrapper>
      <input placeholder="Search" onInput={handleSearch} />
      <EpisodesTable episodes={filteredEpisodes} />
    </Wrapper>
  );
};
