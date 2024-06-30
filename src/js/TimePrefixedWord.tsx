import styled, { css } from 'styled-components';
import { formatTimestamp } from './utils';

export const TimePrefixedWord = styled.span<{
  $timestamp: number;
  $showPrefix: boolean;
  $found: boolean;
}>`
  padding: 4px 0;

  ${({ $found }) =>
    $found &&
    css`
      background: green;
    `}

  ${({ $showPrefix, $timestamp }) =>
    $showPrefix &&
    css`
      &::before {
        display: block;
        text-align: center;
        margin: 1rem 0;
        content: '[${formatTimestamp($timestamp)}]';
      }
    `};
`;
