import styled from 'styled-components';
import { bold } from '../styleUtils';
import { ReactNode } from 'react';

const FilterSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 0 1.8rem 3vw;

  @media (max-width: 900px) {
    margin: 0 0 1.8rem 4.5vw;
  }

  @media (max-width: 650px) {
    margin: 0 0 1.8rem 6vw;
  }

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterSectionLabel = styled.span`
  margin: 0 1rem 0.6rem 0;
  ${bold}
`;

export const FilterSection = ({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) => {
  return (
    <FilterSectionWrapper>
      <FilterSectionLabel className="bold">{label}</FilterSectionLabel>
      {children}
    </FilterSectionWrapper>
  );
};
