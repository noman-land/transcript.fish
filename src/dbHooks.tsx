import { useCallback, useEffect, useState } from 'react';
import { createDbWorker } from 'sql.js-httpvfs';
import { Episode, Word } from './types';

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
);
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url);

const maxBytesToRead = 10 * 1024 * 1024;

const worker = await createDbWorker(
  [
    {
      from: 'jsonconfig',
      configUrl: '/db/config.json?t=1688688351269',
    },
  ],
  workerUrl.toString(),
  wasmUrl.toString(),
  maxBytesToRead // optional, defaults to Infinity
);

export const useDb = () => {
  const [episodes, setEpisodes] = useState<Episode[]>();
  const [episodeWords, setEpisodeWords] = useState<Word[]>();

  useEffect(() => {
    worker.db
      .query(
        'SELECT episode, title, pubDate, image, description, duration FROM episodes ORDER BY episode DESC'
      )
      .then(
        result => {
          setEpisodes(result as Episode[]);
        },
        err => console.error('Error selecting from db:', err)
      )
      .catch(err =>
        console.error(
          'Something unexpected happened getting episodes from database.',
          err
        )
      );
  }, []);

  const getEpisode = useCallback((episode: number) => {
    worker.db
      .query(
        'SELECT startTime, endTime, word, probability FROM words WHERE episode = ? ORDER BY startTime',
        [episode]
      )
      .then(value => setEpisodeWords(value as []))
      .catch((err: Error) =>
        console.error(
          'Something unexpected happened getting episode words from database.',
          err
        )
      );
  }, []);

  return { episodes, episodeWords, getEpisode };
};
