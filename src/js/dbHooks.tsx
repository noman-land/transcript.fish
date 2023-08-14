import { useCallback, useEffect, useMemo, useState } from 'react';
import { Episode, FiltersState, SearchResults, Word } from './types';
import {
  searchEpisodeWords,
  selectEpisodeWords,
  selectEpisodes,
  resetDbWorker,
} from './database';

export const useDb = () => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>();
  const [episodeWords, setEpisodeWords] = useState<Word[]>();
  const [searchResults, setSearchResults] = useState<SearchResults>();

  useEffect(() => {
    setError(undefined);
    selectEpisodes()
      .then(setEpisodes)
      .catch(setError)
      .finally(() => setLoading);
  }, []);

  const getEpisode = useCallback((episode: number) => {
    setError(undefined);
    setLoading(true);
    selectEpisodeWords(episode)
      .then(setEpisodeWords)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const search = useCallback(
    (searchTerm: string, selectedFilters: FiltersState) => {
      setError(undefined);
      if (!searchTerm) {
        setSearchResults(undefined);
        return;
      }
      setLoading(true);
      searchEpisodeWords(searchTerm, selectedFilters)
        .then(results => {
          const normalized = results.reduce<SearchResults>(
            (accum, { episode }) => {
              accum[episode] = true;
              return accum;
            },
            {}
          );
          setSearchResults(normalized);
        })
        .catch(async (e: Error) => {
          console.error(e);

          if (e.message.includes('doXHR failed (bug)!')) {
            setError(new Error('Problem while searching', { cause: e }));
            return await resetDbWorker();
          }

          if (e.message.includes('recursively defined fts5 content table')) {
            setError(new Error('Problem while searching', { cause: e }));
            return await resetDbWorker();
          }

          if (e.message.includes('syntax error near')) {
            setError(new Error(e.message, { cause: e }));
            return;
          }

          setError(e);
        })
        .finally(() => setLoading(false));
    },
    []
  );

  const filteredEpisodes = useMemo(
    () =>
      searchResults
        ? (episodes || []).filter(({ episode }) => searchResults[episode])
        : episodes,
    [episodes, searchResults]
  );

  return {
    episodes: filteredEpisodes,
    total: episodes?.length,
    episodeWords,
    error,
    loading,
    getEpisode,
    search,
  };
};
