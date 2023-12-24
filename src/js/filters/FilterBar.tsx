import styled from 'styled-components';
import { SearchFilters } from './SearchFilters';
import { EpisodeTypeFilters } from './EpisodeTypeFilters';
import { PresenterFilters } from './PresenterFilters';
import { FiltersToggle } from './FiltersToggle';
import { useState } from 'react';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: wrap;
  margin: 0 3vw;

  .filters {
    margin-left: 2.4rem;
    margin-bottom: 1rem;
  }

  .filters > :first-child {
    margin-top: 1rem;
  }

  .filters > *:not(:first-child) {
    margin-top: 1.8rem;
  }

  @media (max-width: 900px) {
    margin: 0 4.5vw;
  }

  @media (max-width: 650px) {
    margin: 0 6vw;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <StyledWrapper>
      <FiltersToggle isOpen={isOpen} onToggle={() => setIsOpen(o => !o)} />
      {isOpen && (
        <div className="filters">
          <SearchFilters />
          <EpisodeTypeFilters />
          <PresenterFilters />
        </div>
      )}
    </StyledWrapper>
  );
};
