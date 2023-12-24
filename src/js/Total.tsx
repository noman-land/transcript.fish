import styled from 'styled-components';

const StyledDiv = styled.div`
  align-self: flex-end;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
  flex-grow: 1;
  text-align: right;
`;

export const Total = ({
  searchTerm,
  error,
  loading,
  results,
  total,
}: {
  searchTerm: string;
  error?: boolean;
  loading: boolean;
  results: number;
  total: number;
}) => {
  const totalText = <>{total} episodes</>;
  const isShowingAll = results === total && !searchTerm;
  const foundResults = isShowingAll ? (
    <>showing all {totalText}</>
  ) : (
    <>
      found {error ? '?' : results} of {totalText}
    </>
  );
  const maybeResults = loading ? <>searching...</> : foundResults;

  return <StyledDiv>{maybeResults}</StyledDiv>;
};
