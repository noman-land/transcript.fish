import { createDbWorker } from 'sql.js-httpvfs';
import { Episode, Word } from './types';
import { mediaUrl } from './utils';

const response = await fetch(`${mediaUrl()}/db/latest.json`);
const { latest } = await response.json();

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
);
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url);

const worker = await createDbWorker(
  [
    {
      from: 'jsonconfig',
      configUrl: `${mediaUrl()}/db/${latest}/config.json`,
    },
  ],
  workerUrl.toString(),
  wasmUrl.toString()
);

const selectEpisodesQuery = `
  SELECT
    episode, title, pubDate, image, description, duration
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

type SelectEpisode = (episode: number) => Promise<Word[]>;

export const selectEpisodeWords: SelectEpisode = async episode => {
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
    words MATCH "${searchTerm}"
`;

type SearchEpisodeWords = (searchTerm: string) => Promise<number[]>;

export const searchEpisodeWords: SearchEpisodeWords = async searchTerm => {
  return new Promise((resolve, reject) => {
    worker.db
      .query(searchEpisodeWordsQuery(searchTerm))
      .then(episodes => resolve(episodes.reverse() as number[]), reject)
      .catch((err: Error) => {
        console.error(
          'Something unexpected happened while searching the database.\n\n',
          err
        );
      });
  });
};
