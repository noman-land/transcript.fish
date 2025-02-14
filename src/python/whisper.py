import database
import utils
from classes import RssEpisode
from datetime import datetime
from faster_whisper import WhisperModel

model_size = 'large-v3-turbo'

model = WhisperModel(
    model_size_or_path=model_size,
    compute_type='int8',
    # Change this to False when running for the first time with a new model
    local_files_only=True,
    num_workers=4,
    cpu_threads=8
)

def get_transcription_segments(episode: RssEpisode):
    segments, _ = model.transcribe(
        utils.make_audio_file_path(episode.episode_num),
        language='en',
        word_timestamps=True,
        initial_prompt=f'This is episode number {episode.episode_num} of No Such Thing As A Fish, a weekly podcast in which QI researchers Dan Schreiber, James Harkin, Anna Ptaszynski, and Andrew Hunter Murray share the most bizarre, extraordinary, and hilarious facts they have discovered over the last seven days. Here is the description of this week\'s episode.\n\n"{episode.description}"\n\n'
    )
    return segments

def transcribe(episode: RssEpisode, start_time: datetime):
    saved_word_count = database.select_word_count(episode.episode_num)
    if saved_word_count > 0:
        utils.log(episode.episode_num, f'Already transcribed: {saved_word_count} words')
        return 0

    utils.log(episode.episode_num, 'Starting: transcription')
    word_count = 0
    for segment in get_transcription_segments(episode):
        words = getattr(segment, 'words', [])
        word_count += len(words)
        database.insert_words(episode.episode_num, words)
        utils.show_progress(episode, segment.end, start_time)
    database.upsert_episode(episode, word_count)
    database.commit()
    utils.log(episode.episode_num, f'Transcribed: {word_count} total words')
    return 1
