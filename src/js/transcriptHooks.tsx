import { useContext } from 'react';
import { AudioContext } from './audio/AudioContext';
import { Colors } from './constants';
import { Word } from './types';

const punc = ['.', '?', '!'];

interface UseHighlightWordsProps {
  words: Word[];
  episode: number;
}

export const useHighlightWords = ({
  words,
  episode,
}: UseHighlightWordsProps) => {
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

  return maybeHighlight;
};
