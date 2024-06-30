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
  searchTerm: string;
}

function findSubarrayIndex(a: Word[], b: string[]) {
  for (let i = 0; i <= a.length - b.length; i++) {
    let match = true;
    for (let j = 0; j < b.length; j++) {
      if (
        a[i + j].word.trim().toLocaleLowerCase() !== b[j].toLocaleLowerCase()
      ) {
        match = false;
        break;
      }
    }
    if (match) {
      return i;
    }
  }
  return -1;
}

export const EpisodeTranscriptCell = ({
  words,
  episode,
  searchTerm,
}: EpisodeTranscriptCellProps) => {
  const shouldHighlight = useHighlightWords({
    words,
    episode,
  });
  const searchWords = searchTerm.split(' ');
  const start = findSubarrayIndex(words, searchWords);
  return (
    <StyledTd>
      <div className="episode-words">
        {words.map((word, i) => {
          return (
            <TimePrefixedWord
              key={makeKey(word)}
              $timestamp={word.startTime}
              $showPrefix={i > 0 && i % 200 === 0}
              style={shouldHighlight(i)}
              $found={i >= start && i <= start + searchWords.length - 1}
            >
              {word.word}
            </TimePrefixedWord>
          );
        })}
      </div>
    </StyledTd>
  );
};
