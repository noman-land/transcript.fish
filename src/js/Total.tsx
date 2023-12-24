import styled from 'styled-components';

const StyledDiv = styled.div`
  align-self: flex-end;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
  flex-grow: 1;
  text-align: right;
`;

interface TotalProps {
  searchTerm: string;
  results: number;
  total: number;
}

export const Total = ({ searchTerm, results, total }: TotalProps) => {
  const isShowingAll = results === total && !searchTerm;
  const foundResults = isShowingAll ? 'showing all' : `found ${results} of`;

  return (
    <StyledDiv>
      {foundResults} {total} episodes
    </StyledDiv>
  );
};
