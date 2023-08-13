import database
import fetch
import whisper

def convert():
    transcribed = 0
    for episode in fetch.get_rss_episodes():
        fetch.download_episode_audio(episode)
        fetch.download_episode_image(episode)
        transcribed += whisper.transcribe(episode)
    if (transcribed > 0):
        database.recreate_fts_table()
    database.close()
