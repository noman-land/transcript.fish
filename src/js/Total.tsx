import styled from 'styled-components';
import { Presenter } from './types';
import { formatName } from './utils';

const StyledDiv = styled.div`
  position: relative;
  text-align: left;
  font-size: 90%;
  opacity: 0.6;
  bottom: 0;
`;

export const Total = ({
  searchTerm,
  presenters,
  error,
  loading,
  results,
  total,
}: {
  searchTerm: string;
  presenters: Presenter[];
  error?: boolean;
  loading: boolean;
  results: number;
  total: number;
}) => {
  const presentersText = presenters.map((p, i, list) => {
    const separator = i < list.length - 1 ? ', ' : ' or ';
    return `${i > 0 ? separator : ''}${formatName(p)}`;
  });
  const totalText = <>{total} episodes</>;
  const containingText = searchTerm && <>containing "{searchTerm}"</>;
  const isShowingAll = results === total && !searchTerm;
  const foundResults = isShowingAll ? (
    <>showing all {totalText}</>
  ) : (
    <>
      <>
        found {error ? '?' : results} of {totalText} {containingText}
      </>
      {presenters.length > 0 && <> with {presentersText} presenting</>}
    </>
  );
  const maybeResults = loading ? (
    <>searching for {containingText}</>
  ) : (
    foundResults
  );

  return <StyledDiv>{maybeResults}</StyledDiv>;
};
