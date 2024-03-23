import database
import fetch
import whisper
import utils

def convert(episode_num_to_redo: int | None):
    transcribed = 0
    for episode in fetch.get_rss_episodes(episode_num_to_redo):
        (episode_num, duration) = database.select_episode(utils.get_episode_num(episode))
        if episode_num_to_redo or utils.get_duration(episode) < duration:
            utils.log(episode_num, 'Shorter episode found: Redownloading and retranscribing')
            utils.delete_audio(episode_num)
            database.delete_transcription(episode_num)
        fetch.download_episode_image(episode)
        fetch.download_episode_audio(episode)
        transcribed += whisper.transcribe(episode)
    if (transcribed > 0):
        database.recreate_fts_table()
        database.vacuum()
    database.close()
