# transcript.fish

Unofficial No Such Thing As A Fish episode transcripts.

## Running webapp locally

1. Run `npm install`
2. Run `npm run dev`

## Download new episodes from the RSS feed, transcribe them, and add them to the database

**TODO:** Add instructions for creating database

1. Install deps
   - Run `pip install -r requirements.txt`
2. Download most recent episodes and transcribe them
   - Run `npm run convert`
3. Upload database to R2
   - Run `npm run syncdb`
4. Split database into chunks
   - Run `npm run splitdb`
5. Update episode number query param in [dbHooks.tsx](/src/dbHooks.tsx#L19) for cache busting purposes
6. Commit it all and PR new episode
