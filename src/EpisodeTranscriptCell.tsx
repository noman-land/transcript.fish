import styled from 'styled-components';
import { Fragment } from 'react';
import type { Word } from './types';

const formatTimestamp = (duration: number) => {
  const minutes = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(duration % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const makeKey = (w: Word) => {
  return `${w.startTime}-${w.endTime}-${w.word}-${w.probability}`;
};

const StyledTd = styled.td`
  padding: 0 3vw 4vw 3vw;

  @media (max-width: 900px) {
    padding: 0 4.5vw 6vw 4.5vw;
  }
  @media (max-width: 650px) {
    padding: 0 6vw 8vw 6vw;
  }

  .episode-words {
    text-align: justify;
    margin: 0;
  }

  .timestamp {
    text-align: center;
    margin: 1rem 0;
    font-style: italic;

    &::before {
      content: '[';
    }

    &::after {
      content: ']';
    }
  }
`;

interface EpisodeTranscriptCellProps {
  episodeWords: Word[];
}

export const EpisodeTranscriptCell = ({
  episodeWords,
}: EpisodeTranscriptCellProps) => {
  return (
    <StyledTd>
      <div className="episode-words">
        {episodeWords.map((word, i) => (
          <Fragment key={`${i}-${word}`}>
            {i > 0 && i % 200 === 0 && (
              <h4 className="timestamp" aria-label="timestamp">
                {formatTimestamp(word.startTime)}
              </h4>
            )}
            <span key={makeKey(word)}>{word.word}</span>
          </Fragment>
        ))}
      </div>
    </StyledTd>
  );
};
