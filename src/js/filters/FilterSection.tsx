import styled from 'styled-components';
import { ReactNode } from 'react';

const FilterSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterSectionLabel = styled.span`
  text-align: left;
  margin: 0 1rem 0.6rem 0;
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
