import styled, { css } from 'styled-components';
import { formatTimestamp } from './utils';

export const TimePrefixedWord = styled.span<{
  $timestamp: number;
  $showPrefix: boolean;
}>`
  ${({ $showPrefix, $timestamp }) =>
    $showPrefix &&
    css`
      &::before {
        display: block;
        text-align: center;
        margin: 1rem 0;
        font-style: italic;
        content: '[${formatTimestamp($timestamp)}]';
      }
    `};
`;
