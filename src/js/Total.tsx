import { styled } from 'styled-components';
import { Spinner } from './Spinner';

export const StyledDiv = styled.div`
  position: relative;
  font-size: 90%;
  margin: 0.6rem 3vw;
  opacity: 0.6;
  max-height: 19px;
  bottom: 0;

  @media (max-width: 900px) {
    margin: 0.6rem 4.5vw;
  }

  @media (max-width: 650px) {
    margin: 0.6rem 6vw;
  }
`;

export const Total = ({
  loading,
  results,
  total,
}: {
  loading: boolean;
  results: number;
  total: number;
}) => (
  <StyledDiv>
    showing {loading ? <Spinner /> : results} of {total} episodes
  </StyledDiv>
);
