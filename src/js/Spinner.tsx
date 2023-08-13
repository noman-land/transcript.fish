import { keyframes, styled } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.span.attrs({
  children: (
    <span className="wrapper">
      <span className="dot">*</span>
    </span>
  ),
})`
  .wrapper {
    display: inline-block;
    position: relative;
    height: 0.4em;
    width: 0.8em;
    text-align: center;
    font-size: 1.5rem;
    .dot {
      animation: ${spin} 1s linear infinite;
      top: -6px;
      left: 4px;
      transform-origin: 7px 9px;
      position: absolute;
    }
  }
`;
