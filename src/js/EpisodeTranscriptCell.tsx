import styled from 'styled-components';
import { Fragment } from 'react';
import type { Word } from './types';
import { Timestamp } from './Timestamp';

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
`;

export const EpisodeTranscriptCell = ({ words }: { words: Word[] }) => {
  return (
    <StyledTd>
      <div className="episode-words">
        {words.map((word, i) => (
          <Fragment key={`${i}-${word}`}>
            {i > 0 && i % 200 === 0 && <Timestamp value={word.startTime} />}
            <span key={makeKey(word)}>{word.word}</span>
          </Fragment>
        ))}
      </div>
    </StyledTd>
  );
};
