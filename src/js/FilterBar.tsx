import styled from 'styled-components';
import { useCallback } from 'react';
import { FilterBarProps } from './types';

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
      cursor: pointer;

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
            {name}
          </label>
        ))}
      </div>
    </StyledFilterBar>
  );
};
