import database
import fetch
import utils
import whisper

for episode in fetch.get_new_episodes():
    fetch.download_audio(episode)
    episode_num = utils.get_episode_num(episode)
    saved_word_count = database.select_word_count(episode_num)
    if saved_word_count > 0:
        utils.log(episode_num, f'Already transcribed with {saved_word_count} words. Skipping.')
    else:
        whisper.transcribe(episode)
        database.commit()

database.close()
