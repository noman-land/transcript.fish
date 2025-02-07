# transcript.fish

Unofficial No Such Thing As A Fish episode transcripts.

## Running web app locally

### Install js dependencies

Run `npm install`

### Start dev server

Run `npm start`

### Load locally running app

Open [`http://localhost:5173/?deployed=true`](http://localhost:5173/?deployed=true) to load all assets from remote hosts. (Try this first)

OR

Open [`http://localhost:5173/`](http://localhost:5173/) to use local assets.

## To download episodes from the RSS feed, transcribe them, and add them to the database

**TODO:** Add instructions for creating database with [migrations.sql](./db/migrations.sql)

### Create virtual env

Run `python -m venv venv`

### Activate virtual env

Run `source venv`

### Install python dependencies

Run `pip install -r requirements.txt`

### Download and transcribe a specific episode by number

Run `npm run convert 146`

### Download and transcribe all untranscribed episodes

Run `npm run convert`

**Warning**: This will take a long time

**NOTE** The first time this script is run, it needs to download the Whisper model, which requires [`local_files_only`](./src/python/whisper.py#L13) to be temporarily set to `False`. After this, the option can be changed back to `True`.

### Changing whisper model size for faster but less accurate performance

In `whisper.py` change [`model_size`](./src/python/whisper.py#L7) to your preferred model. See [available models.](https://huggingface.co/guillaumekln)

**NOTE**: By default this uses the `large-v2` Whisper model. On an M1 Mac with 64GB of RAM this transcribes at about `1x` speed. This means an hour long episode gets transcribed in about an hour.

So, as of 8 February 2025:

```sql
select sum(duration) from episodes
-- 1555237
```

```text
   1,555,237.0 seconds
÷         60.0 seconds
÷         60.0 minutes
÷         24.0 hours
-----------------------
=         18.0 days
```

The good news is changing to the `medium.en`, `small.en`, or `tiny.en` model increases this speed dramatically but the accuracy goes down. `small.en` transcribes at about `3x` speed, for example.

The other good news is that the convert script is idempotent in that you can kill the script (`Ctrl + C`) and restart it at any time and it will pick back up after the last fully transcribed episode. You can safely run this script over and over without creating any duplicates.

**NOTE:** This script also [downloads](/src/python/convert.py#L25) all the audio files for the episodes as well as each episode's album art. As of 8 February 2025 this amounts to 569 episodes, ~24.2GB audio, ~190MB images.

### 3. Split database into chunks

Run `npm run split`

## Deploying

### 1. Sync database, audio, images, and fonts to (Cloudflare) R2

Needs [`rclone`](https://rclone.org/) and [`jq`](https://jqlang.github.io/jq/) installed.

Run `npm run sync`
