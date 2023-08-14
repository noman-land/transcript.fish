import { styled } from 'styled-components';

export const StyledDiv = styled.div`
  position: relative;
  text-align: left;
  font-size: 90%;
  margin: 0.6rem 3vw;
  opacity: 0.6;
  bottom: 0;

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
  const containingText = <>episodes containing "{searchTerm}"</>;
  const isShowingAll = results === total && !searchTerm;
  const foundResults = isShowingAll ? (
    <>showing all {total} episodes</>
  ) : (
    <>
      found {results} of {total} {containingText}
    </>
  );
  const maybeResults = loading ? (
    <>searching for {containingText}</>
  ) : (
    foundResults
  );

  return <StyledDiv>{maybeResults}</StyledDiv>;
};
