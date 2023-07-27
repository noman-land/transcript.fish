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

const selectEpisodesQuery = `
  SELECT 
    episode, title, pubDate, image, description, duration 
  FROM 
    episodes   
  ORDER BY 
    episode DESC
`;

export const selectEpisodes = (): Promise<Episode[]> => {
  return new Promise((resolve, reject) => {
    worker.db
      .query(selectEpisodesQuery)
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
  ORDER BY 
    startTime
`;

export const selectEpisode = (episode: number): Promise<Word[]> => {
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
