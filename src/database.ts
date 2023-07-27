import { createDbWorker } from 'sql.js-httpvfs';
import { Episode, Word } from './types';

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
);
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url);

const maxBytesToRead = 10 * 1024 * 1024;

const CACHE_BUST_PARAM = '488b';

const worker = await createDbWorker(
  [
    {
      from: 'jsonconfig',
      configUrl: `https://media.transcript.fish/db/config.json?ep=${CACHE_BUST_PARAM}`,
    },
  ],
  workerUrl.toString(),
  wasmUrl.toString(),
  maxBytesToRead // optional, defaults to Infinity
);

window.sql = worker.db.query;

const selectEpisodesQuery = `
  SELECT 
    episode, title, pubDate, image, description, duration 
  FROM 
    episodes 
  WHERE
    episode > ?
  ORDER BY 
    episode DESC
  LIMIT ?
`;

type SelectEpisodes = (pagination?: {
  episode?: number;
  limit?: number;
}) => Promise<Episode[]>;

export const selectEpisodes: SelectEpisodes = ({
  episode = 0,
  limit = 20,
} = {}) => {
  return new Promise((resolve, reject) => {
    worker.db
      .query(selectEpisodesQuery, [episode, limit])
      .then(result => resolve(result as Episode[]), reject)
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
  AND
    startTime > ?
  ORDER BY 
    startTime
  LIMIT ?
`;

type SelectEpisode = (pagination: {
  episode: number;
  startTime?: number;
  limit?: number;
}) => Promise<Word[]>;

export const selectEpisode: SelectEpisode = ({
  episode,
  startTime = 0,
  limit = 200,
}) => {
  return new Promise((resolve, reject) => {
    worker.db
      .query(selectEpisodeQuery, [episode, startTime, limit])
      .then(value => resolve(value as Word[]), reject)
      .catch((err: Error) =>
        console.error(
          'Something unexpected happened while getting episode transcript from database.',
          err
        )
      );
  });
};
