import database
import fetch
import whisper

for episode in fetch.get_rss_episodes():
    fetch.download_episode_audio(episode)
    fetch.download_episode_image(episode)
    whisper.transcribe(episode)

database.close()
