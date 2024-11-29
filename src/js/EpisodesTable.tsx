import styled from 'styled-components';
import { useOutletContext } from 'react-router';
import { EmptyState } from './EmptyState';
import { EpisodeRow } from './EpisodeRow';
import type { Episode } from './types';
import { Colors, PAGE_SIZE } from './constants';
import { Spinner } from './Spinner';

interface EpisodesTableProps {
  episodes: Episode[];
  page: number;
  loading: boolean;
  expanded: boolean;
  searchTerm: string;
}

const StyledTable = styled.table`
  background-color: ${Colors.citrineLight};
  border-collapse: collapse;
`;

const LoaderWrapper = styled.div`
  display: flex;
  min-height: 200px;
  align-items: center;
  justify-content: center;
`;

export const EpisodesTable = () => {
  const { episodes, page, loading, expanded, searchTerm } =
    useOutletContext<EpisodesTableProps>();

  if (loading) {
    return (
      <LoaderWrapper>
        <Spinner $size="58px" />
      </LoaderWrapper>
    );
  }

  if (!episodes.length) {
    return (
      <EmptyState title="No results found" body="Try doing another search." />
    );
  }

  return (
    <StyledTable>
      <tbody>
        {episodes
          .slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
          .map(episode => (
            <EpisodeRow
              episode={episode}
              key={episode.episode}
              searchTerm={searchTerm}
              expanded={expanded}
            />
          ))}
      </tbody>
    </StyledTable>
  );
};
