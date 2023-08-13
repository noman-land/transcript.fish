import { styled } from 'styled-components';
import { HostIcon } from './HostIcon';
import { Host } from './types';

const hosts: { [k in Host]: number } = {
  dan: 12,
  james: 22,
  anna: 7,
  andy: 6,
};

export const Hosts = styled.div.attrs<{ $presenters: number[] }>(
  ({ $presenters }) => ({
    children: Object.entries(hosts).map(([name, id]) => (
      <HostIcon
        key={id}
        $host={name as Host}
        $absent={!$presenters.includes(id)}
      />
    )),
  })
)`
  margin-top: 1em;
`;
