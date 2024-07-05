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

type Matches = Record<number, boolean> & Record<'length', number>;

/**
 * I have an array of word[] and an array of searchWord[]
 * I need to find all the instances of the entire searchWord[] array inside the word[] array
 * The return value should be an array of indices of word[] that correspond to the start of all the instances of searchWord[].
 *
 * Example:
 *
 * const words = ['what', 'the', 'hell', 'also', 'what', 'the', 'hell'];
 * const searchWords = ['what', 'the', 'hell'];
 * const matches = findMatches(words, searchWords);
 * // matches === { 0: true, 4: true, length: 3 };
 */
function findMatches(words: Word[], searchTerm: string) {
  const searchWords = searchTerm.split(' ');
  return words.reduce(
    (acc, _, i) => {
      const matches: Matches = { length: 0 };
      let j = 0;
      while (
        j < searchWords.length &&
        words[i + j].word.trim().toLowerCase() === searchWords[j].toLowerCase()
      ) {
        matches[i + j] = true;
        matches.length++;
        j++;
      }
      return matches.length === searchWords.length
        ? { ...acc, ...matches }
        : acc;
    },
    { length: searchWords.length } as Matches
  );
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
  const matches = findMatches(words, searchTerm);
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
              $found={matches[i]}
            >
              {word.word}
            </TimePrefixedWord>
          );
        })}
      </div>
    </StyledTd>
  );
};
