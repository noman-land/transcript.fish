import { useCallback } from 'react';
import styled from 'styled-components';
import {
  SearchFilterLabels,
  SearchField,
  SearchFiltersProps,
  SelectedOption,
} from '../types';
import { FilterSection } from './FilterSection';

export const FilterWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;

  label {
    margin-right: 1.6rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
  }

  input {
    margin-left: 0;
    margin-right: 0.3rem;
    height: 1.2rem;
    width: 1.2rem;
    cursor: pointer;
  }
`;

const filterLabels: SearchFilterLabels = {
  episode: 'episode number',
  title: 'title',
  description: 'description',
  words: 'transcript',
};

export const SearchFilters = ({ selected, onToggle }: SearchFiltersProps) => {
  const handleToggle = useCallback(
    ({ target }: { target: SelectedOption }) => {
      onToggle(target);
    },
    [onToggle]
  );
  return (
    <FilterSection label="Search filters:">
      <FilterWrapper>
        {Object.entries(filterLabels).map(([name, label]) => (
          <label key={name}>
            <input
              onChange={handleToggle}
              type="checkbox"
              name={name}
              checked={selected[name as SearchField]}
            />
            {label}
          </label>
        ))}
      </FilterWrapper>
    </FilterSection>
  );
};
