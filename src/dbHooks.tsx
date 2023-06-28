import { useEffect, useState } from "react";
import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

const maxBytesToRead = 10 * 1024 * 1024;

export const useDb = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    createDbWorker(
      [
        {
          from: "inline",
          config: {
            requestChunkSize: 4096,
            serverMode: "full",
            url: "https://media.transcript.fish/transcript.db",
          },
        },
      ],
      workerUrl.toString(),
      wasmUrl.toString(),
      maxBytesToRead // optional, defaults to Infinity
    )
      .then(
        (worker) => {
          return worker.db
            .query(`select episode, title, pubDate from episodes`)
            .then((value) => setRows(value as []))
            .catch(console.error);
        },
        (err) => {
          console.error("Error creating db worker (createDbWorker):", err);
          throw err;
        }
      )
      .then(
        (result) => console.log("Success selecting from db:", result),
        (err) => console.error("Error selecting from db:", err)
      )
      .catch((err) =>
        console.error(
          "Something absolutely terrible and uneexpected happened:",
          err
        )
      );
  }, []);
  return rows;
};
