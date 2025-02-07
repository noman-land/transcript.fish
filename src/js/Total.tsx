import styled from 'styled-components';

const StyledDiv = styled.div`
  align-self: flex-end;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
  flex-grow: 1;
  text-align: right;
`;

interface TotalProps {
  isShowingAll: boolean;
  resultsCount: number;
  total: number;
}

export const Total = ({ isShowingAll, resultsCount, total }: TotalProps) => {
  const foundResults = isShowingAll ? 'showing all' : `found ${resultsCount} of`;
  return (
    <StyledDiv>
      {foundResults} {total} episodes
    </StyledDiv>
  );
};
