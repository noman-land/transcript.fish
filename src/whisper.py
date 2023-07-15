from faster_whisper import WhisperModel
from bs4 import BeautifulSoup
import database 
import utils

model_size = 'medium.en'

model = WhisperModel(
    model_size_or_path=model_size,
    compute_type='int8',
    local_files_only=True,
    num_workers=4,
    cpu_threads=8
)

def transcribe(episode):
    episode_num = utils.get_episode_num(episode)
    utils.log(episode_num, 'Starting transcription.')
    summary = BeautifulSoup(episode['summary'], 'html.parser').get_text()
    segments, _ = model.transcribe(
        utils.make_audio_file_path(episode_num),
        word_timestamps=True,
        initial_prompt=f'This is episode number {episode_num} of No Such Thing As A Fish, a weekly podcast in which QI researchers Dan Schreiber, James Harkin, Anna Ptaszynski, and Andrew Hunter Murray share the most bizarre, extraordinary and hilarious facts they have discovered over the last seven days. Here is the summary of this week\'s episode.\n\n"{summary}"\n\n'
    )
    word_count = 0
    for segment in segments:
        words = getattr(segment,'words', [])
        word_count += len(words)
        database.insert_words(episode_num, words)
    database.insert_episode(episode, word_count)
    utils.log(episode_num, f'Transcription complete with {word_count} words.')
