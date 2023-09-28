import styled from 'styled-components';
import type { Word } from './types';
import { TimePrefixedWord } from './TimePrefixedWord';
import { useHighlightWords } from './transcriptHooks';

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

interface EpisodeTranscriptCellProps {
  words: Word[];
  episode: number;
}

export const EpisodeTranscriptCell = ({
  words,
  episode,
}: EpisodeTranscriptCellProps) => {
  const shouldHighlight = useHighlightWords({
    words,
    episode,
  });

  return (
    <StyledTd>
      <div className="episode-words">
        {words.map((word, i) => (
          <TimePrefixedWord
            key={makeKey(word)}
            $timestamp={word.startTime}
            $showPrefix={i > 0 && i % 200 === 0}
            style={shouldHighlight(i)}
          >
            {word.word}
          </TimePrefixedWord>
        ))}
      </div>
    </StyledTd>
  );
};
