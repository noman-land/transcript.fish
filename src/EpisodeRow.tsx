import styled from 'styled-components';
import { MouseEvent, useCallback, useState } from 'react';
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

const StyledTr = styled.tr<{ $isOpen: boolean }>`
  background-color: ${({ $isOpen }) => $isOpen && '#fff189'};
  display: block;
  position: relative;
  z-index: 0;

  &:not(:last-child) {
    border-bottom: 2px solid #d2bb3d;
  }

  &::after {
    content: ' ';
    display: flex;
    flex-direction: column;
    align-items: stretch;
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
`;

const TrWithBackground = styled(StyledTr)<{ $image: string }>`
  &::after {
    background-image: url(${({ $image }) => $image});
  }
`;

const StyledTd = styled.td`
  cursor: pointer;
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

  &:hover {
    background-color: #fff189;
  }
`;

export const EpisodeRow = ({
  episode: { image, episode, title, description, pubDate, duration },
}: {
  episode: Episode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { episodeWords, getEpisode } = useDb();

  const handleClick = useCallback(() => {
    if (!episodeWords) {
      getEpisode(episode);
    }

    setIsOpen(open => !open);
  }, [episode, episodeWords, getEpisode]);

  const stopPropagation = useCallback((event: MouseEvent) => {
    if ((event.target as HTMLElement).nodeName === 'A') {
      event.stopPropagation();
    }
  }, []);

  return (
    <TrWithBackground $isOpen={isOpen} $image={image} key={episode}>
      <StyledTd onClick={handleClick}>
        <h3 className="episode-title">
          <span>{episode}</span>: {title}
        </h3>
        <div className="episode-published-date">{formatDate(pubDate)}</div>
        <span
          onClick={stopPropagation}
          className="episode-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <span className="episode-duration">{formatDuration(duration)}</span>
      </StyledTd>
      {isOpen && episodeWords && (
        <td style={{ textAlign: 'left', padding: '0 3vw 4vw 3vw' }}>
          <p className="episode-words">
            {episodeWords.map(word => (
              <span key={makeKey(word)}>{word.word}</span>
            ))}
          </p>
        </td>
      )}
    </TrWithBackground>
  );
};
