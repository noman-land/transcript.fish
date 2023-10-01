import { css, keyframes } from 'styled-components';

const spinKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const spin = css`
  animation: ${spinKeyframes} 500ms linear infinite;
`;
