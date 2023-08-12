import styled, { css } from 'styled-components';

const formatTimestamp = (duration: number) => {
  const minutes = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(duration % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

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
