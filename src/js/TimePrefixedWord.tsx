import styled, { css } from 'styled-components';
import { formatTimestamp } from './utils';
import { Colors } from './constants';

export const TimePrefixedWord = styled.span<{
  $timestamp: number;
  $showPrefix: boolean;
  $found: boolean;
}>`
  padding: 4px 0;

  ${({ $found }) =>
    $found &&
    css`
      background: ${Colors.lightGreen};
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
