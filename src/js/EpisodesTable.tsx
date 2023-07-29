import styled from 'styled-components';
import { EmptyStateRow } from './EmptyStateRow';
import { EpisodeRow } from './EpisodeRow';
import { Episode } from './types';

const StyledTable = styled.table`
  background-color: #f8e44f;
  border-collapse: collapse;
`;

export const EpisodesTable = ({ episodes }: { episodes: Episode[] }) => {
  return (
    <StyledTable>
      <tbody>
        {episodes.length ? (
          episodes.map(episode => (
            <EpisodeRow episode={episode} key={episode.episode} />
          ))
        ) : (
          <EmptyStateRow />
        )}
      </tbody>
    </StyledTable>
  );
};
