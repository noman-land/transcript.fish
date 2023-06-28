import { useCallback, useEffect, useRef, useState } from "react";
import { WorkerHttpvfs, createDbWorker } from "sql.js-httpvfs";
import { Episode } from "./EpisodesTable";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

const maxBytesToRead = 10 * 1024 * 1024;

const sort = (episodes: Episode[]) =>
  episodes.sort((a, b) => b.episode - a.episode);

export const useDb = () => {
  const workerRef = useRef<WorkerHttpvfs>();
  const [episodes, setEpisodes] = useState<Episode[]>();
  const [episodeWords, setEpisodeWords] = useState([]);

  useEffect(() => {
    createDbWorker(
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
    ).then((worker) => {
      workerRef.current = worker;
      workerRef.current.db
        .query(
          `select episode, title, pubDate, image, description, duration from episodes`
        )
        .then(
          (result) => {
            setEpisodes(sort(result as Episode[]));
          },
          (err) => console.error("Error selecting from db:", err)
        )
        .catch((err) =>
          console.error(
            "Something absolutely terrible and unexpected happened getting episodes from database.",
            err
          )
        );
    });
  }, []);

  const getEpisode = useCallback((episode: number) => {
    workerRef.current?.db
      .query("select count(*) from words where episode == ?", [episode])
      .then((value) => setEpisodeWords(value as []))
      .catch((err: Error) =>
        console.error(
          "Something absolutely terrible and unexpected happened getting episode words from database.",
          err
        )
      );
  }, []);

  return { episodes, episodeWords, getEpisode };
};
