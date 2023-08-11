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

const Tag = styled.span`
  background: black;
  color: white;
  padding: 0.4rem 0.6rem;
  margin-bottom: 1em;
  border-radius: 2px;

  & + & {
    margin-left: 1em;
  }
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
`;

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

  .episode-title-wrapper {
    display: flex;

    @media (max-width: 600px) {
      flex-direction: column-reverse;
    }
  }

  .episode-title {
    margin-top: 0;
    margin-right: 1em;
    flex-grow: 1;

    @media (max-width: 600px) {
      margin-right: 0;
    }
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
  live: boolean;
  compilation: boolean;
}

export const EpisodeSummaryCell = ({
  isOpen,
  onClick,
  episodeNum,
  title,
  pubDate,
  description,
  duration,
  live,
  compilation,
}: EpisodeSummaryCellProps) => {
  return (
    <StyledTd $isOpen={isOpen} onClick={onClick}>
      <div className="episode-title-wrapper">
        <h3 className="episode-title">
          <span>{episodeNum}</span>: {title}
        </h3>
        <TagWrapper>
          {compilation && <Tag>Compilation</Tag>}
          {live && <Tag>Live</Tag>}
        </TagWrapper>
      </div>
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
