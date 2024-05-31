import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Colors } from './constants';

const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;

  a {
    color: ${Colors.night};
  }
`;

export const NotFoundError = () => {
  return (
    <CenterWrapper>
      <h2>404 Not Found</h2>
      <p>
        Go back <Link to="/">home</Link>.
      </p>
    </CenterWrapper>
  );
};
