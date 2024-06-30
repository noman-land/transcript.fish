import { useCallback, useContext } from 'react';
import { FilterSection } from './FilterSection';
import { EpisodeType, EpisodeTypeFilterLabels, SelectedOption } from '../types';
import styled from 'styled-components';
import { FiltersContext } from './FiltersContext';

const Wrapper = styled.div`
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
  office: 'qi offices',
  wfh: 'wfh',
  compilation: 'compilation',
};

export const EpisodeTypeFilters = () => {
  const { episodeTypeFilters, handleEpisodeTypeFilterToggle } =
    useContext(FiltersContext);

  const handleToggle = useCallback(
    ({ target }: { target: SelectedOption<string> }) => {
      handleEpisodeTypeFilterToggle(target as SelectedOption<EpisodeType>);
    },
    [handleEpisodeTypeFilterToggle]
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
              checked={episodeTypeFilters[name as EpisodeType]}
            />
            {label}
          </label>
        ))}
      </Wrapper>
    </FilterSection>
  );
};
