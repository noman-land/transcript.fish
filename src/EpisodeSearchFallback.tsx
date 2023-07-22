import { useCallback, useEffect } from 'react';
import { styled } from 'styled-components';

const StyledDiv = styled.div`
  text-align: center;
  margin: 0 6vw 6vw 6vw;
`;

export const EpisodeSearchFallback = ({ error }: { error: Error }) => {
  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    console.warn('Error boundary triggered:\n\n', error);
  }, [error]);

  return (
    <StyledDiv>
      <h3>Something went wrong.</h3>
      <div>
        Please{' '}
        <a href="" onClick={reload}>
          reload page
        </a>
        .
      </div>
    </StyledDiv>
  );
};
