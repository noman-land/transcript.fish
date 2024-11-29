import styled, { css } from 'styled-components';
import { mediaUrl } from './utils';
import type { Host } from './types';
import { Colors } from './constants';

interface HostIconProps {
  $host: Host;
  $absent: boolean;
}

export const HostIcon = styled.img.attrs<HostIconProps>(({ $host }) => ({
  title: $host[0].toUpperCase() + $host.substring(1),
  alt: $host,
  src: mediaUrl.images(`hosts/${$host}.png`),
}))<HostIconProps>`
  width: 36px;
  height: 36px;
  filter: grayscale(30%);
  border: 1px solid ${Colors.vom};
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
