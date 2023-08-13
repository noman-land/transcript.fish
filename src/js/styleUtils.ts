import { css, keyframes } from 'styled-components';

const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeIn = css`
  animation: ${fadeInKeyframes} 150ms ease-in-out forwards;
`;
