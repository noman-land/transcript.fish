import { useCallback } from 'react';
import { FilterSection } from './FilterSection';
import {
  EpisodeType,
  EpisodeTypeFilterLabels,
  EpisodeTypeFiltersProps,
  SelectedOption,
} from '../types';
import styled from 'styled-components';

export const Wrapper = styled.div`
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

const filterLabels: EpisodeTypeFilterLabels = {
  live: 'live',
  compilation: 'compilation',
  wfh: 'wfh',
  office: 'qi offices',
};

export const EpisodeTypeFilters = ({
  selected,
  onToggle,
}: EpisodeTypeFiltersProps) => {
  const handleToggle = useCallback(
    ({ target }: { target: SelectedOption }) => {
      onToggle(target);
    },
    [onToggle]
  );
  return (
    <FilterSection label="Episode type filters:">
      <Wrapper>
        {Object.entries(filterLabels).map(([name, label]) => (
          <label key={name}>
            <input
              onChange={handleToggle}
              type="checkbox"
              name={name}
              checked={selected[name as EpisodeType]}
            />
            {label}
          </label>
        ))}
      </Wrapper>
    </FilterSection>
  );
};
