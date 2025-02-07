import styled from 'styled-components';
import { HostIcon } from './HostIcon';
import type { Host } from './types';
import { hosts } from './constants';

interface HostsProps {
  $presenters: number[];
}

export const Hosts = styled.div.attrs<HostsProps>(({ $presenters }) => ({
  children: Object.entries(hosts).map(([name, id]) => (
    <HostIcon key={id} $host={name as Host} $absent={!$presenters.includes(id)} />
  )),
}))<HostsProps>`
  margin-top: 1em;
`;
