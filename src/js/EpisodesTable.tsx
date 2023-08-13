import styled from 'styled-components';
import { EmptyState } from './EmptyState';
import { EpisodeRow } from './EpisodeRow';
import { Episode } from './types';
import { PAGE_SIZE } from './constants';

const StyledTable = styled.table`
  background-color: #f8e44f;
  border-collapse: collapse;
`;

interface EpisodesTableProps {
  episodes: Episode[];
  page: number;
}

export const EpisodesTable = ({ episodes, page }: EpisodesTableProps) => {
  return (
    <StyledTable>
      <tbody>
        {episodes.length ? (
          episodes
            .slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
            .map(episode => (
              <EpisodeRow episode={episode} key={episode.episode} />
            ))
        ) : (
          <tr>
            <td>
              <EmptyState
                title="No results found"
                body="Try doing another search."
              />
            </td>
          </tr>
        )}
      </tbody>
    </StyledTable>
  );
};
