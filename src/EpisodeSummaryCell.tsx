import { MouseEvent } from 'react';
import styled from 'styled-components';

const formatDate = (date: string) => {
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

const formatDuration = (duration: number) => {
  return `${Math.floor(duration / 60)} minutes`;
};

const StyledTd = styled.td<{ $isOpen: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  padding: 4vw 3vw ${({ $isOpen }) => ($isOpen ? 0 : 4)}vw 3vw;

  @media (max-width: 900px) {
    padding: 6vw 4.5vw ${({ $isOpen }) => ($isOpen ? 0 : 6)}vw 4.5vw;
  }
  @media (max-width: 650px) {
    padding: 8vw 6vw ${({ $isOpen }) => ($isOpen ? 0 : 8)}vw 6vw;
  }

  .episode-title {
    margin-top: 0;
    flex-grow: 1;
  }

  .episode-published-date {
    font-style: italic;
    margin-bottom: 1em;
  }

  .episode-description {
    text-align: justify;

    a {
      word-break: break-all;
    }

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

  .episode-duration {
    font-weight: 600;
    font-style: italic;
    margin-top: 1em;
  }

  .separator {
    text-align: center;
    margin: 1.8em 0;
  }

  &:hover,
  &:hover + td {
    background-color: #fff189;
  }
`;

const stopPropagation = (event: MouseEvent) => {
  if ((event.target as HTMLElement).nodeName === 'A') {
    event.stopPropagation();
  }
};

interface EpisodeSummaryCellProps {
  isOpen: boolean;
  onClick: () => void;
  episodeNum: number;
  title: string;
  pubDate: string;
  description: string;
  duration: number;
}

export const EpisodeSummaryCell = ({
  isOpen,
  onClick,
  episodeNum,
  title,
  pubDate,
  description,
  duration,
}: EpisodeSummaryCellProps) => {
  return (
    <StyledTd $isOpen={isOpen} onClick={onClick}>
      <h3 className="episode-title">
        <span>{episodeNum}</span>: {title}
      </h3>
      <div className="episode-published-date">{formatDate(pubDate)}</div>
      <span
        onClick={stopPropagation}
        className="episode-description"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <span className="episode-duration">{formatDuration(duration)}</span>
      {isOpen && <div className="separator">* * *</div>}
    </StyledTd>
  );
};
