import { styled } from 'styled-components';
import { Spinner } from './Spinner';

export const StyledDiv = styled.div`
  position: relative;
  text-align: left;
  font-size: 90%;
  margin: 0.6rem 3vw;
  opacity: 0.6;
  bottom: 0;

  .results {
    display: inline-block;
    max-height: 19px;
  }

  @media (max-width: 900px) {
    margin: 0.6rem 4.5vw;
  }

  @media (max-width: 650px) {
    margin: 0.6rem 6vw;
  }
`;

export const Total = ({
  searchTerm,
  loading,
  results,
  total,
}: {
  searchTerm: string;
  loading: boolean;
  results: number;
  total: number;
}) => {
  const showingAll = results === total;
  return (
    <StyledDiv>
      {showingAll && !loading ? (
        <>showing all </>
      ) : (
        <>
          found{' '}
          <span className="results">{loading ? <Spinner /> : results}</span> of{' '}
        </>
      )}
      <>
        {total} episodes {searchTerm && `containing "${searchTerm}"`}
      </>
    </StyledDiv>
  );
};
