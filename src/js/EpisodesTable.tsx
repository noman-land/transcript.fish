import styled from 'styled-components';
import { EmptyState } from './EmptyState';
import { EpisodeRow } from './EpisodeRow';
import { Episode } from './types';
import { Colors, PAGE_SIZE } from './constants';
import { Spinner } from './Spinner';

const StyledEpisodesTbody = styled.tbody`
  background-color: ${Colors.citrineLight};
  border-collapse: collapse;
`;

interface EpisodesTableProps {
  episodes: Episode[];
  page: number;
  loading: boolean;
}

const StyledTbody = styled.tbody`
  &,
  tr,
  td {
    display: flex;
    min-height: 200px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const Loading = () => {
  return (
    <StyledTbody>
      <tr>
        <td>
          <Spinner $size="58px" />
        </td>
      </tr>
    </StyledTbody>
  );
};

export const EpisodesTable = ({
  episodes,
  page,
  loading,
}: EpisodesTableProps) => {
  return (
    <table>
      {loading ? (
        <Loading />
      ) : (
        <StyledEpisodesTbody>
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
        </StyledEpisodesTbody>
      )}
    </table>
  );
};
