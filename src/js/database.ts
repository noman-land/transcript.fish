import { createDbWorker } from 'sql.js-httpvfs';
import {
  Episode,
  Presenter,
  SearchEpisodeWords,
  SearchEpisodeWordsResult,
  SelectEpisodeWords,
  SearchFiltersState,
  Word,
} from './types';
import { mediaUrl } from './utils';

const response = await fetch(mediaUrl.db(`latest.json?t=${Date.now()}`));
const { latest } = await response.json();

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
);
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url);

const createWorker = async () =>
  await createDbWorker(
    [
      {
        from: 'jsonconfig',
        configUrl: mediaUrl.db(`${latest}/config.json`),
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

let worker = await createWorker();

const selectPresentersQuery = `
  SELECT
    *
  FROM
    presenters
  ORDER BY
    id
`;

type SelectPresenters = () => Promise<Presenter[]>;

export const selectPresenters: SelectPresenters = () => {
  return new Promise((resolve, reject) => {
    worker.db
      .query(selectPresentersQuery)
      .then(presenters => resolve(presenters as Presenter[]), reject)
      .catch((err: Error) =>
        console.error(
          'Something unexpected happened while getting presenters from database.',
          err
        )
      );
  });
};

const selectEpisodesQuery = `
  SELECT
    episode,
    title,
    pubDate,
    image,
    description,
    duration,
    presenter1,
    presenter2,
    presenter3,
    presenter4,
    presenter5,
    venue,
    live,
    compilation
  FROM
    episodes
  ORDER BY
    episode
`;

type SelectEpisodes = () => Promise<Episode[]>;

export const selectEpisodes: SelectEpisodes = () => {
  return new Promise((resolve, reject) => {
    worker.db
      .query(selectEpisodesQuery)
      .then(episodes => resolve(episodes.reverse() as Episode[]), reject)
      .catch((err: Error) =>
        console.error(
          'Something unexpected happened while getting episodes from database.',
          err
        )
      );
  });
};

const selectEpisodeQuery = `
  SELECT
    startTime, endTime, word, probability
  FROM
    words
  WHERE
    episode = ?
  ORDER BY
    startTime
`;

export const selectEpisodeWords: SelectEpisodeWords = async episode => {
  return new Promise((resolve, reject) => {
    worker.db
      .query(selectEpisodeQuery, [episode])
      .then(value => resolve(value as Word[]), reject)
      .catch((err: Error) =>
        console.error(
          'Something unexpected happened while getting episode transcript from database.',
          err
        )
      );
  });
};

const searchEpisodeWordsQuery = (searchTerm: string) => `
  SELECT
    episode
  FROM
    words_fts
  WHERE
    words_fts MATCH '${searchTerm}'
`;

const makeSearchFilters = (searchTerm: string, filters: SearchFiltersState) => {
  return Object.entries(filters)
    .filter(([, enabled]) => enabled)
    .map(([column]) => `${column}:"${searchTerm}"`)
    .join(' OR ');
};

export const searchEpisodeWords: SearchEpisodeWords = async (
  searchTerm,
  filters
) => {
  const filtersQuery = makeSearchFilters(searchTerm, filters);
  if (!filtersQuery) {
    return Promise.resolve([]);
  }
  const query = searchEpisodeWordsQuery(filtersQuery);
  return new Promise((resolve, reject) => {
    worker.db
      .query(query)
      .then(episodes => resolve(episodes as SearchEpisodeWordsResult[]), reject)
      .catch((err: Error) => {
        console.error(
          'Something unexpected happened while searching the database.\n\n',
          err
        );
      });
  });
};

export const resetDbWorker = async () => {
  worker = await createWorker();
};
