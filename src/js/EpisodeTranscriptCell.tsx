import { useContext } from 'react';
import styled from 'styled-components';
import type { Word } from './types';
import { TimePrefixedWord } from './TimePrefixedWord';
import { AudioContext } from './audio/AudioContext';
import { Colors } from './constants';

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

const punc = ['.', '?', '!'];

export const EpisodeTranscriptCell = ({
  words,
  episode,
}: {
  words: Word[];
  episode: number;
}) => {
  const { currentTime, playingEpisode } = useContext(AudioContext);
  const currentWordIndex = words.findIndex((word, i, list) => {
    return (
      currentTime >= word.startTime &&
      (currentTime <= list[i + 1]?.endTime ?? Infinity)
    );
  });

  const endOfSentenceIndex =
    words
      .slice(currentWordIndex)
      .findIndex(w => punc.some(p => w.word.endsWith(p))) + currentWordIndex;

  const maybeHighlight = (i: number) => {
    if (
      episode === playingEpisode &&
      i >= currentWordIndex &&
      i <= endOfSentenceIndex
    ) {
      return { background: Colors.lightPurple };
    }
  };

  return (
    <StyledTd>
      <div className="episode-words">
        {words.map((word, i) => (
          <TimePrefixedWord
            key={makeKey(word)}
            $timestamp={word.startTime}
            $showPrefix={i > 0 && i % 200 === 0}
            style={maybeHighlight(i)}
          >
            {word.word}
          </TimePrefixedWord>
        ))}
      </div>
    </StyledTd>
  );
};
