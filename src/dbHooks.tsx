import { useCallback, useEffect, useState } from "react";
import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

const maxBytesToRead = 10 * 1024 * 1024;

const worker = await createDbWorker(
  [
    {
      from: "inline",
      config: {
        requestChunkSize: 4 * 1024,
        serverMode: "full",
        url: "https://media.transcript.fish/transcript.db",
      },
    },
  ],
  workerUrl.toString(),
  wasmUrl.toString(),
  maxBytesToRead // optional, defaults to Infinity
);

export const useDb = () => {
  const [episodes, setEpisodes] = useState([]);
  const [episodeWords, setEpisodeWords] = useState([]);

  const getEpisode = useCallback((episode: number) => {
    worker.db
      .query("select count(*) from words where episode == ?", [episode])
      .then((value) => setEpisodeWords(value as []))
      .catch((err) =>
        console.error(
          "Something absolutely terrible and unexpected happened getting episode words from database.",
          err
        )
      );
  }, []);

  useEffect(() => {
    worker.db
      .query(
        `select episode, title, pubDate, image, description, duration from episodes`
      )
      .then(
        (value) => setEpisodes(value as []),
        (err) => console.error("Error selecting from db:", err)
      )
      .catch((err) =>
        console.error(
          "Something absolutely terrible and unexpected happened getting episodes from database.",
          err
        )
      );
  }, []);
  return { episodes, episodeWords, getEpisode };
};
