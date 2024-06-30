import styled from 'styled-components';
import { useState } from 'react';
import { SearchFilters } from './SearchFilters';
import { EpisodeTypeFilters } from './EpisodeTypeFilters';
import { PresenterFilters } from './PresenterFilters';
import { FiltersToggle } from './FiltersToggle';
import { VenueFilters } from './VenueFilters';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: wrap;
  margin: 0 3vw;

  @media (max-width: 900px) {
    margin: 0 4.5vw;
  }

  @media (max-width: 650px) {
    margin: 0 6vw;
  }
`;

const FiltersWrapper = styled.div`
  margin-left: 2.4rem;
  margin-bottom: 1rem;

  & > :first-child {
    margin-top: 1rem;
  }

  & > :not(:first-child) {
    margin-top: 1.8rem;
  }
`;

export const FilterBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <StyledWrapper>
      <FiltersToggle isOpen={isOpen} onToggle={() => setIsOpen(o => !o)} />
      {isOpen && (
        <FiltersWrapper>
          <SearchFilters />
          <EpisodeTypeFilters />
          <PresenterFilters />
          <VenueFilters />
        </FiltersWrapper>
      )}
    </StyledWrapper>
  );
};
