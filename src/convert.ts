// import sqlite3 from 'sqlite3';
// import util from 'node:util';
// import whisper from 'whisper-node';

// interface Episode {
//   episode: string;
//   title: string;
//   audio: string;
//   pubDate: string;
//   path: string;
// }

// const db = new sqlite3.Database('db/transcript.db');

// const dbAll = async <Result>(...params: Parameters<typeof db.all>) =>
//   new Promise<Result[]>((resolve, reject) => {
//     db.all<Result>(...params, (err, rows) => {
//       if (err) {
//         return reject(err.message);
//       }
//       return resolve(rows);
//     });
//   });

// const dbRun = util.promisify(db.run);

// const SELECT_EPISODES =
//   'SELECT episode, title, audio, pubDate, path FROM episodes';

// const episodes = await dbAll<Episode>(SELECT_EPISODES);

// for await (const { pubDate, ...rest } of episodes.slice(-1)) {
//   const ep = {
//     ...rest,
//     pubDate: new Date(pubDate).getTime(),
//   };

//   // // Download audio files
//   // // Skip any that have already been downloaded
//   // try {
//   //   fs.readFileSync(path);
//   //   console.log('SKIPPED', ep);
//   // } catch (e) {
//   //   console.log('fetching', ep);
//   //   const result = await fetch(audio);
//   //   fs.writeFileSync(path, Buffer.from(await result.arrayBuffer()));
//   // }

//   // // Add paths to db
//   // const path = `audio/${episode}-${title}.mp3`;
//   // await dbRun('UPDATE episodes SET path=? WHERE episode=?', [path, episode]);

//   console.log(ep);

//   const transcription = await whisper(ep.path.replace('mp3', 'wav'), {
//     // modelName: 'base.en',
//     // modelPath: '../whisper.cpp/models/ggml-base.en.bin',
//     whisperOptions: {
//       timestamp_size: 1,
//     },
//   });

//   console.log(transcription);

//   // const data = execSync(
//   //   `cd $HOME/dev/whisper.cpp && ./main -t 10 -ml 1 -sow -f "$HOME/Desktop/test/${path.replace('mp3', 'wav')}"`,
//   //   { stdio: 'pipe' },
//   //   (err, stdout, stderr) => {
//   //     console.log('stdout', stdout);
//   //     stdout.on('data', (data) => {
//   //       console.log(`Received chunk ${data}`);
//   //     });
//   //   }
//   // );

//   // data.on('data', data => console.log('datatatatata', data));
// }

// db.close();
