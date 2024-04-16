import styled from 'styled-components';
import { useOutletContext } from 'react-router';
import { EmptyState } from './EmptyState';
import { EpisodeRow } from './EpisodeRow';
import { Episode } from './types';
import { Colors, PAGE_SIZE } from './constants';
import { Spinner } from './Spinner';

interface EpisodesTableProps {
  episodes: Episode[];
  page: number;
  loading: boolean;
  expanded: boolean;
}

const StyledEpisodesTable = styled.table`
  tbody {
    background-color: ${Colors.citrineLight};
    border-collapse: collapse;
  }
`;

const StyledLoadingTable = styled.table`
  tbody,
  tr,
  td {
    display: flex;
    min-height: 200px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const LoadingTable = () => {
  return (
    <StyledLoadingTable>
      <tbody>
        <tr>
          <td>
            <Spinner $size="58px" />
          </td>
        </tr>
      </tbody>
    </StyledLoadingTable>
  );
};

const NoResultsTable = () => {
  return (
    <StyledEpisodesTable>
      <tbody>
        <tr>
          <td>
            <EmptyState
              title="No results found"
              body="Try doing another search."
            />
          </td>
        </tr>
      </tbody>
    </StyledEpisodesTable>
  );
};

export const EpisodesTable = () => {
  const { episodes, page, loading, expanded } =
    useOutletContext<EpisodesTableProps>();

  if (loading) {
    return <LoadingTable />;
  }

  if (!episodes.length) {
    return <NoResultsTable />;
  }

  return (
    <StyledEpisodesTable>
      <tbody>
        {episodes
          .slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
          .map(episode => (
            <EpisodeRow
              episode={episode}
              key={episode.episode}
              expanded={expanded}
            />
          ))}
      </tbody>
    </StyledEpisodesTable>
  );
};
