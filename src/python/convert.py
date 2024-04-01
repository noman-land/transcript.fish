import database
import fetch
import utils
import whisper
from classes import RssEpisode
from datetime import datetime
from typing import Optional

def maybe_cleanup(rss_episode: RssEpisode, episode_num: Optional[int]):
    existing_episode = database.select_episode(rss_episode.episode_num)
    if existing_episode:
        new_episode_shorter = rss_episode.duration < existing_episode.duration
        if episode_num or new_episode_shorter:
            if new_episode_shorter:
                utils.log(existing_episode.episode_num, 'Shorter episode found')
            database.delete_transcription(existing_episode.episode_num)
            utils.delete_audio(existing_episode.episode_num)
            utils.log(existing_episode.episode_num, 'Redownloading and retranscribing')

def convert(episode_num: Optional[int]):
    transcribed = 0
    for rss_episode in fetch.get_rss_episodes(episode_num):
        start_time = datetime.now()
        maybe_cleanup(rss_episode, episode_num)
        fetch.download_audio(rss_episode)
        fetch.download_image(rss_episode)
        transcribed += whisper.transcribe(rss_episode, start_time)
    database.close(rebuild_fts=transcribed > 0)
