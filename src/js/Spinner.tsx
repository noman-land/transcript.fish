import styled from 'styled-components';
import { spin } from './styleUtils';

export const Spinner = styled.span.attrs<{ $size?: string }>({
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
    width: 0.7em;
    text-align: center;
    font-size: ${({ $size = '1rem' }) => $size};

    .dot {
      ${spin}
      top: -8px;
      left: 0px;
      transform-origin: 7px 9px;
      position: absolute;
    }
  }
`;
