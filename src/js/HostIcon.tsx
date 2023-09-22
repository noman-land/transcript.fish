import { css, styled } from 'styled-components';
import { mediaUrl } from './utils';
import { Host } from './types';

export const HostIcon = styled.img.attrs<{
  $host: Host;
  $absent: boolean;
}>(({ $host }) => ({
  title: $host[0].toUpperCase() + $host.substring(1),
  alt: $host,
  src: mediaUrl.images(`hosts/${$host}.png`),
}))`
  width: 36px;
  height: 36px;
  filter: grayscale(30%);
  border: 1px solid #6a6015;
  border-radius: 50%;

  & + & {
    margin-left: 1rem;
  }

  ${({ $absent }) =>
    $absent &&
    css`
      filter: grayscale(100%);
      opacity: 0.5;
      border: 1px solid transparent;
    `}
`;
