# transcript.fish

Unofficial No Such Thing As A Fish episode transcripts.

## Running webapp locally

1. Run `npm install`
2. Run `npm run dev`

## Download episodes from the RSS feed, transcribe them, and add them to the database

**TODO:** Add instructions for creating database

1. Install deps

   - Run `pip install -r requirements.txt`

2. Download most recent episodes and transcribe them

   - Change line 11 of whisper.py to `local_files_only=False`

   - (Optional): Change line 5 of whisper.py `model_size = 'large-v2'` to your preferred model, see note below for details, [see available models.](https://huggingface.co/guillaumekln)

   - Run `npm run convert` (this is idempotent and will go through _all episodes_)

     **NOTE**: By default this uses the `medium.en` Whisper model. On an M1 Mac with 64GB of RAM this transcribes at about `1.4x` speed. This means an hour long episode gets transcribed in about 42 minutes.

     So, as of 25 July 2023:

     ```sql
     select sum(duration) from episodes
     -- 1292175
     ```

     ```text
        1,292,175.0 seconds
     ÷         60.0 seconds
     ÷         60.0 minutes
     ÷         24.0 hours
     -----------------------
     =         15.0 days
     ÷          1.4 speed
     -----------------------
     =         10.7 days
     ```

     The good news is changing to the `small.en` or the `tiny.en` increases this speed dramatically but the accuracy goes down slightly. `small.en` transcribes at about `3x` speed, for example.

     The other good news is you can kill the script (`Ctrl + C`) and restart it at any time and it will pick back up after the last fully transcribed episode.

     **NOTE:** This script also [downloads](/src/python/convert.py#L8-L9) all the audio files for the episodes as well as each episode's album art. As of 25 July 2023 this amounts to 487 episodes, ~20GB audio, ~130MB images.

3. Split database into chunks

   - Run `npm run split:db`

4. (Optional) Sync database, audio, images, and fonts to (Cloudflare) R2. Needs [`rclone`](https://rclone.org/) and [`jq`](https://jqlang.github.io/jq/) installed.

   - Run `npm run sync`
