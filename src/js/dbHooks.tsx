import { useCallback, useEffect, useState } from 'react';
import { Episode, Word } from './types';
import {
  searchEpisodeWords,
  selectEpisodeWords,
  selectEpisodes,
} from './database';

export const useDb = () => {
  const [episodes, setEpisodes] = useState<Episode[]>();
  const [episodeWords, setEpisodeWords] = useState<Word[]>();
  const [searchResults, setSearchResults] = useState<number[]>();

  useEffect(() => {
    selectEpisodes().then(setEpisodes);
  }, []);

  const getEpisode = useCallback((episode: number) => {
    selectEpisodeWords(episode).then(setEpisodeWords);
  }, []);

  const search = useCallback((searchTerm: string) => {
    searchEpisodeWords(searchTerm).then(setSearchResults);
  }, []);

  return { episodes, episodeWords, getEpisode, searchResults, search };
};
