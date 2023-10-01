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

const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeIn = css`
  opacity: 0;
  animation: ${fadeInKeyframes} 151ms ease-in-out forwards;
`;
