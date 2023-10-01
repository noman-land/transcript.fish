import styled from 'styled-components';
import { SearchFilters } from './SearchFilters';
import { EpisodeTypeFilters } from './EpisodeTypeFilters';
import { PresenterFilters } from './PresenterFilters';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: wrap;
  margin: 1.8rem 3vw 0 0;

  @media (max-width: 900px) {
    margin: 1.8rem 4.5vw 0 0;
  }

  @media (max-width: 650px) {
    margin: 1.8rem 6vw 0 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterBar = () => (
  <StyledWrapper>
    <SearchFilters />
    <EpisodeTypeFilters />
    <PresenterFilters />
  </StyledWrapper>
);
