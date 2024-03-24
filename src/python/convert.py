import database
import fetch
import whisper
import utils

def convert(episode_num: int | None):
    transcribed = 0
    for rss_episode in fetch.get_rss_episodes(episode_num):
        db_episode = database.select_episode(rss_episode.episode_num)
        new_episode_is_shorter = rss_episode.duration < db_episode.duration
        if episode_num or new_episode_is_shorter:
            if new_episode_is_shorter:
                utils.log(db_episode.episode_num, 'Shorter episode found')
            utils.delete_old_episode(db_episode)
        fetch.download_audio(rss_episode)
        fetch.download_image(rss_episode)
        transcribed += whisper.transcribe(rss_episode)
    database.clean_up(transcribed)
