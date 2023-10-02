import database
import fetch
import whisper
import utils

def convert():
    transcribed = 0
    utils.create_file_path(utils.IMAGE_PATH)
    utils.create_file_path(utils.AUDIO_PATH)

    for episode in fetch.get_rss_episodes():
        fetch.download_episode_image(episode)
        fetch.download_episode_audio(episode)
        transcribed += whisper.transcribe(episode)
    if (transcribed > 0):
        database.recreate_fts_table()
        database.vacuum()
    database.close()
