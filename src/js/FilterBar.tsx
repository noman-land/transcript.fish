import styled from 'styled-components';
import { useCallback } from 'react';
import { FilterBarProps, FilterLabels, SearchField } from './types';

const StyledFilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 1rem 3vw 0 0;

  @media (max-width: 900px) {
    margin: 1rem 4.5vw 0 0;
  }
  @media (max-width: 650px) {
    margin: 1rem 6vw 0 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: start;
  }

  .filters-label {
    font-style: bold;
    white-space: nowrap;
    margin: 0 0 1rem 3vw;

    @media (max-width: 900px) {
      margin: 0 0 1rem 4.5vw;
    }
    @media (max-width: 650px) {
      margin: 0 0 1rem 6vw;
    }
  }

  .filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex-grow: 1;
    margin: 0 0 1rem 3vw;

    @media (max-width: 900px) {
      margin: 0 0 1rem 4.5vw;
    }

    @media (max-width: 650px) {
      margin: 0 0 1rem 6vw;
    }

    @media (max-width: 420px) {
      flex-direction: column;
      align-items: start;
    }

    label {
      margin-right: 1.6rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      white-space: nowrap;

      @media (max-width: 420px) {
        margin-right: 0;
      }
    }

    input {
      margin-left: 0;
      margin-right: 0.3rem;
      height: 1.2rem;
      width: 1.2rem;
      cursor: pointer;
    }
  }
`;

const filterLabels: FilterLabels = {
  description: 'description',
  episode: 'episode number',
  title: 'title',
  words: 'transcript',
};

export const FilterBar = ({ filters, onToggle }: FilterBarProps) => {
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
            {filterLabels[name as SearchField]}
          </label>
        ))}
      </div>
    </StyledFilterBar>
  );
};
