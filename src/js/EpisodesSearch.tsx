import styled from 'styled-components';
import { FormEvent, useCallback, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { EpisodesTable } from './EpisodesTable';
import { useDb } from './dbHooks';
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

type Field = 'episode' | 'title' | 'description';

type Filters = {
  [k in Field]: boolean;
};

const StyledFilterBar = styled.div`
  display: flex;
  padding: 1rem 2vw;
  align-items: center;

  @media (max-width: 1280px) {
    padding: 1rem 3vw;
  }
  @media (max-width: 900px) {
    padding: 1rem 4.5vw;
  }
  @media (max-width: 650px) {
    padding: 1rem 6vw;
    flex-direction: column;
    align-items: start;
  }

  .filters-label {
    font-style: bold;
    margin-right: 1.4rem;

    @media (max-width: 650px) {
      margin-right: 0;
      margin-bottom: 0.6rem;
    }
  }

  .filters {
    display: flex;
    align-items: center;

    @media (max-width: 420px) {
      flex-direction: column;
      align-items: start;
    }

    label {
      margin-right: 1.6rem;
      display: flex;
      align-items: center;

      @media (max-width: 420px) {
        margin-right: 0;
      }
    }

    input {
      margin-left: 0;
      margin-right: 0.3rem;
      height: 1.2rem;
      width: 1.2rem;
    }
  }
`;

interface FilterBarProps {
  filters: Filters;
  onToggle: (args: { name: string; checked: boolean }) => void;
}

const FilterBar = ({ filters, onToggle }: FilterBarProps) => {
  const handleToggle = useCallback(
    ({ target: { name, checked } }: { target: HTMLInputElement }) => {
      onToggle({ name, checked });
    },
    [onToggle]
  );

  return (
    <StyledFilterBar>
      <span className="filters-label bold">Search filters:</span>
      <div className="filters">
        {Object.entries(filters).map(([name, checked]) => (
          <label key={name}>
            <input
              onChange={handleToggle}
              type="checkbox"
              name={name}
              checked={checked}
            />
            {name}
          </label>
        ))}
      </div>
    </StyledFilterBar>
  );
};

export const EpisodeSearch = () => {
  const { episodes } = useDb();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
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

  const filteredEpisodes = episodes.filter(ep => {
    const lowercaseSearch = searchTerm.toLocaleLowerCase();
    return (
      ep.title.toLocaleLowerCase().includes(lowercaseSearch) ||
      ep.description.toLocaleLowerCase().includes(lowercaseSearch) ||
      String(ep.episode).includes(lowercaseSearch)
    );
  });

  const totalPages = Math.ceil(filteredEpisodes.length / PAGE_SIZE);

  return (
    <Wrapper>
      <input
        className="search-bar"
        placeholder="Search"
        onInput={handleSearch}
      />
      <FilterBar filters={filters} onToggle={handleFilterToggle} />
      <EpisodesTable episodes={filteredEpisodes} page={page} />
      {totalPages > 1 ? (
        <Paginator page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : (
        <div style={{ height: 116.2 }} />
      )}
    </Wrapper>
  );
};
