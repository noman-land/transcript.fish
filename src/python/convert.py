import database
import fetch
import whisper
import utils
from classes import Episode

def convert(episode_num_to_redo: int | None):
    transcribed = 0
    for episode in fetch.get_rss_episodes(episode_num_to_redo):
        (episode_num, duration) = database.select_episode(episode.episode_num)
        new_episode_is_shorter = episode.duration < duration
        if episode_num_to_redo or new_episode_is_shorter:
            if new_episode_is_shorter:
                utils.log(episode_num, 'Shorter episode found')
            utils.log(episode_num, 'Redownloading and retranscribing')
            utils.delete_audio(episode_num)
            database.delete_transcription(episode_num)
        fetch.download_episode_image(episode)
        fetch.download_episode_audio(episode)
        transcribed += whisper.transcribe(episode)
    if (transcribed > 0):
        database.recreate_fts_table()
        database.vacuum()
    database.close()
