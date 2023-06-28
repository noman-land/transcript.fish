import { styled } from "styled-components";
import { EmptyStateRow } from "./EmptyStateRow";
import { EpisodeRow } from "./EpisodeRow";

export interface Episode {
  image: string;
  description: string;
  duration: number;
  episode: number;
  title: string;
  pubDate: string;
}

const StyledTable = styled.table`
  background-color: #f8e44f;
  border-collapse: collapse;

  & .description {
    // Some descriptions end in <br> tags
    // which add unwanted line breaks
    & > :last-child > br:last-child {
      display: none;
    }

    // Some descriptions are wrapped in a <p>
    // which adds unwanted margin
    & > p {
      margin: 0;
    }
  }

  & tr {
    position: relative;
    z-index: 0;

    &:not(:last-child) {
      border-bottom: 2px solid #d2bb3d;
    }

    &:hover {
      background-color: #fff189;
    }

    &::after {
      content: " ";
      display: inline-block;
      height: 100%;
      width: 100%;
      opacity: 0.08;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: -1;
    }
  }
`;

export const EpisodesTable = ({ episodes }: { episodes: Episode[] }) => {
  return (
    <StyledTable>
      <tbody>
        {episodes.length ? (
          episodes.map((episode: Episode) => <EpisodeRow episode={episode} />)
        ) : (
          <EmptyStateRow />
        )}
      </tbody>
    </StyledTable>
  );
};
