import styled from 'styled-components';
import type { EpisodeTranscriptCellProps } from './types';
import { TimePrefixedWord } from './TimePrefixedWord';
import { useHighlightWords } from './transcriptHooks';
import { findMatches, makeRowKey } from './utils';

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

export const EpisodeTranscriptCell = ({
  words,
  episode,
  searchTerm,
}: EpisodeTranscriptCellProps) => {
  const shouldHighlight = useHighlightWords({
    words,
    episode,
  });
  const { matches, occurrences } = findMatches(words, searchTerm);
  return (
    <StyledTd>
      {searchTerm && (
        <p className="bold align-right">
          found {occurrences} utterance{occurrences === 1 ? '' : 's'} of "
          {searchTerm}"
        </p>
      )}
      <div className="episode-words">
        {words.map((word, i) => {
          return (
            <TimePrefixedWord
              key={makeRowKey(word)}
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
