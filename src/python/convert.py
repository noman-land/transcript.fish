import database
import fetch
import whisper
import utils
from typing import Optional

def convert(episode_num: Optional[int]):
    transcribed = 0
    for rss_episode in fetch.get_rss_episodes(episode_num):
        db_episode = database.select_episode(rss_episode.episode_num)
        new_episode_is_shorter = rss_episode.duration < db_episode.duration
        if episode_num or new_episode_is_shorter:
            if new_episode_is_shorter:
                utils.log(db_episode.episode_num, 'Shorter episode found')
            utils.delete_audio(db_episode.episode_num)
            database.delete_transcription(db_episode.episode_num)
            utils.log(db_episode.episode_num, 'Redownloading and retranscribing')
        fetch.download_audio(rss_episode)
        fetch.download_image(rss_episode)
        transcribed += whisper.transcribe(rss_episode)
    database.close(transcribed > 0)
