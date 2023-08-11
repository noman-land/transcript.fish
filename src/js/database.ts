import { createDbWorker } from 'sql.js-httpvfs';
import {
  Episode,
  SearchEpisodeWords,
  SearchEpisodeWordsResult,
  SelectEpisodeWords,
  Word,
} from './types';
import { mediaUrl } from './utils';

const response = await fetch(`${mediaUrl()}/db/latest.json`);
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
        configUrl: `${mediaUrl()}/db/${latest}/config.json`,
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

let worker = await createWorker();

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

const searchEpisodeWordsQuery = `
  SELECT
    episode
  FROM
    words_fts
  WHERE
    words_fts MATCH ?
`;

export const searchEpisodeWords: SearchEpisodeWords = async searchTerm => {
  return new Promise((resolve, reject) => {
    worker.db
      .query(searchEpisodeWordsQuery, [searchTerm])
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
