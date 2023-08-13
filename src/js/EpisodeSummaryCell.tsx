import { MouseEvent } from 'react';
import styled from 'styled-components';
import { Tag, TagWrapper } from './Tag';
import { HostIcon } from './HostIcon';
import { Episode } from './types';

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

  .title-wrapper {
    display: flex;

    @media (max-width: 700px) {
      flex-direction: column-reverse;
    }
  }

  .title {
    margin-top: 0;
    margin-right: 1em;
    flex-grow: 1;

    @media (max-width: 700px) {
      margin-right: 0;
    }
  }

  .published-date {
    font-style: italic;
    margin-bottom: 1em;
  }

  .description {
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

  .duration {
    font-weight: 600;
    font-style: italic;
    margin-top: 1em;
  }

  .hosts {
    margin-top: 1em;
  }

  .separator {
    text-align: center;
    margin: 1.8em 0;
  }

  &:hover {
    background-color: #fff189;

    .title {
      text-decoration: underline;
    }

    & + td {
      background-color: #fff189;
    }
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
  episode: Episode;
}

export const EpisodeSummaryCell = ({
  isOpen,
  onClick,
  episode: {
    episode: episodeNum,
    duration,
    title,
    live,
    compilation,
    pubDate,
    description,
    presenter1,
    presenter2,
    presenter3,
    presenter4,
  },
}: EpisodeSummaryCellProps) => {
  const presenters = [presenter1, presenter2, presenter3, presenter4];
  return (
    <StyledTd $isOpen={isOpen} onClick={onClick}>
      <div className="title-wrapper">
        <h3 className="title">
          <span>{episodeNum}</span>: {title}
        </h3>
        <TagWrapper>
          {!!live && <Tag>Live</Tag>}
          {!!compilation && <Tag>Compilation</Tag>}
        </TagWrapper>
      </div>
      <div className="published-date">{formatDate(pubDate)}</div>
      <span
        onClick={stopPropagation}
        className="description"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="hosts">
        <HostIcon $host="dan" $absent={!presenters.includes(12)} />
        <HostIcon $host="james" $absent={!presenters.includes(22)} />
        <HostIcon $host="anna" $absent={!presenters.includes(7)} />
        <HostIcon $host="andy" $absent={!presenters.includes(6)} />
      </div>
      <span className="duration">{formatDuration(duration)}</span>
      {isOpen && <div className="separator">* * *</div>}
    </StyledTd>
  );
};
