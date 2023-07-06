import styled from 'styled-components';
import { useCallback } from 'react';
import { useDb } from './dbHooks';
import { Episode, Word } from './types';

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

const makeKey = (w: Word) => {
  return `${w.startTime}-${w.endTime}-${w.word}-${w.probability}`;
};

const StyledTr = styled.tr<{ $image: string }>`
  display: block;
  position: relative;
  z-index: 0;

  &:not(:last-child) {
    border-bottom: 2px solid #d2bb3d;
  }

  &:hover {
    background-color: #fff189;
  }

  &::after {
    content: ' ';
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

    ${({ $image }) => `
      background-image: url(${$image});
    `}
  }
`;

const StyledTd = styled.td`
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  padding: 4vw 3vw;

  .episode-title {
    margin-top: 0;
    flex-grow: 1;
  }

  .episode-published-date {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    opacity: 0.5;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .episode-description {
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
    opacity: 0.5;
    font-weight: 600;
    margin-top: 16px;
  }

  .episode-words {
    margin-bottom: 0;
  }
`;

export const EpisodeRow = ({
  episode: { image, episode, title, description, pubDate, duration },
}: {
  episode: Episode;
}) => {
  const { episodeWords, getEpisode } = useDb();

  const handleClick = useCallback(() => {
    getEpisode(episode);
  }, [episode, getEpisode]);

  return (
    <StyledTr $image={image} key={episode}>
      <StyledTd onClick={handleClick}>
        <h3 className="episode-title">
          <span>{episode}</span>: {title}
        </h3>
        <div className="episode-published-date">{formatDate(pubDate)}</div>
        <span
          className="episode-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <span className="episode-duration">{formatDuration(duration)}</span>
        {episodeWords && (
          <p className="episode-words">
            {episodeWords.map(word => (
              <span key={makeKey(word)}>{word.word}</span>
            ))}
          </p>
        )}
      </StyledTd>
    </StyledTr>
  );
};
