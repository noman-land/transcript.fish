import { useCallback, useEffect, useState } from 'react';
import { createDbWorker } from 'sql.js-httpvfs';
import { Episode, Word } from './types';

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
);
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url);

const maxBytesToRead = 10 * 1024 * 1024;

const response = await fetch('https://media.transcript.fish/db/latest.json');
const { latest } = await response.json();

const worker = await createDbWorker(
  [
    {
      from: 'jsonconfig',
      configUrl: `https://media.transcript.fish/db/${latest}/config.json`,
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
        'SELECT episode, title, pubDate, image, description, duration FROM episodes ORDER BY episode'
      )
      .then(
        result => setEpisodes(result.reverse() as Episode[]),
        err => console.error('Error selecting from db:', err)
      )
      .catch((err: Error) =>
        console.error(
          'Something unexpected happened while getting episodes from database.',
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
      .then(
        value => setEpisodeWords(value as Word[]),
        err => console.error('Error selecting from db:', err)
      )
      .catch((err: Error) =>
        console.error(
          'Something unexpected happened while getting episode transcript from database.',
          err
        )
      );
  }, []);

  return { episodes, episodeWords, getEpisode };
};
