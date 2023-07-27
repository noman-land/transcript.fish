import { useCallback, useEffect, useState } from 'react';
import { Episode, Word } from './types';
import { selectEpisode, selectEpisodes } from './database';

export const useDb = () => {
  const [episodes, setEpisodes] = useState<Episode[]>();
  const [episodeWords, setEpisodeWords] = useState<Word[]>();

  useEffect(() => {
    selectEpisodes().then(setEpisodes);
  }, []);

  const getEpisode = useCallback((episode: number) => {
    selectEpisode(episode).then(setEpisodeWords);
  }, []);

  return { episodes, episodeWords, getEpisode };
};
