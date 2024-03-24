import database
import fetch
import whisper
import utils

def convert(episode_num_to_redo: int | None):
    transcribed = 0
    for rss_episode in fetch.get_rss_episodes(episode_num_to_redo):
        db_episode = database.select_episode(rss_episode.episode_num)
        new_episode_is_shorter = rss_episode.duration < db_episode.duration
        if episode_num_to_redo or new_episode_is_shorter:
            if new_episode_is_shorter:
                utils.log(db_episode.episode_num, 'Shorter episode found')
            utils.delete_audio(db_episode.episode_num)
            database.delete_transcription(db_episode.episode_num)
            utils.log(db_episode.episode_num, 'Redownloading and retranscribing')
        fetch.download_audio(rss_episode)
        fetch.download_image(rss_episode)
        transcribed += whisper.transcribe(rss_episode)
    if (transcribed > 0):
        database.recreate_fts_table()
        database.vacuum()
    database.close()
