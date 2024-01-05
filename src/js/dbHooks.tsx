import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Episode,
  Presenter,
  SearchFiltersState,
  SearchResults,
  Venue,
  Word,
} from './types';
import {
  resetDbWorker,
  selectEpisodes,
  searchEpisodeWords,
  selectEpisodeWords,
  selectPresenters,
  selectVenues,
} from './database';

const useEpisodes = () => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>();
  const [searchResults, setSearchResults] = useState<SearchResults>();

  const getEpisodes = useCallback(() => {
    setError(undefined);
    setLoading(true);
    selectEpisodes()
      .then(setEpisodes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const filteredEpisodes = useMemo(
    () =>
      searchResults
        ? (episodes || []).filter(({ episode }) => searchResults[episode])
        : episodes,
    [episodes, searchResults]
  );

  const search = useCallback(
    (searchTerm: string, selectedFilters: SearchFiltersState) => {
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

  return useMemo(
    () => ({
      total: episodes?.length,
      data: filteredEpisodes,
      error,
      loading,
      get: getEpisodes,
      search,
    }),
    [episodes, filteredEpisodes, error, loading, getEpisodes, search]
  );
};

type PresentersState = Record<number, Presenter>;

const usePresenters = () => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [presenters, setPresenters] = useState<PresentersState>();

  const getPresenters = useCallback(() => {
    setError(undefined);
    setLoading(true);
    selectPresenters()
      .then(result => {
        const reduced = result.reduce((accum, pres) => {
          accum[pres.id] = pres;
          return accum;
        }, {} as PresentersState);
        setPresenters(reduced);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setPresenters, setLoading, setError]);

  return useMemo(
    () => ({
      data: presenters,
      error,
      loading,
      get: getPresenters,
    }),
    [presenters, error, loading, getPresenters]
  );
};

type VenuesState = Record<number, Venue>;

const useVenues = () => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState<VenuesState>();

  const getVenues = useCallback(() => {
    setError(undefined);
    setLoading(true);
    selectVenues()
      .then(result => {
        const reduced = result.reduce((accum, pres) => {
          accum[pres.id] = pres;
          return accum;
        }, {} as VenuesState);
        setVenues(reduced);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setVenues, setLoading, setError]);

  return useMemo(
    () => ({
      data: venues,
      error,
      loading,
      get: getVenues,
    }),
    [venues, error, loading, getVenues]
  );
};

const useTranscript = () => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<Word[]>();

  const getTranscript = useCallback((episode: number) => {
    setError(undefined);
    setLoading(true);
    selectEpisodeWords(episode)
      .then(setTranscript)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return useMemo(
    () => ({
      data: transcript,
      error,
      loading,
      get: getTranscript,
    }),
    [transcript, error, loading, getTranscript]
  );
};

export const useDb = () => {
  const { get: getEpisodes, ...episodes } = useEpisodes();
  const { get: getPresenters, ...presenters } = usePresenters();
  const { get: getVenues, ...venues } = useVenues();
  const transcript = useTranscript();

  useEffect(() => {
    getPresenters();
    getEpisodes();
    getVenues();
  }, [getPresenters, getEpisodes, getVenues]);

  return {
    presenters,
    episodes,
    transcript,
    venues,
  };
};
