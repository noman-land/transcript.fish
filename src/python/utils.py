import os
from classes import RssEpisode
from datetime import datetime, timedelta
from typing import Optional

AUDIO_PATH = 'audio'
IMAGE_PATH = 'images/episodes'

def log(episode_num: int, *msg: str, end: Optional[str] = None):
    print(f'[ Episode {episode_num} ]', *msg, end=end)

def show_progress(episode: RssEpisode, progress: float, start_time: datetime):
    percent_complete = int(progress / episode.duration * 1000) / 10
    elapsed_seconds = (datetime.now() - start_time).seconds
    elapsed = str(timedelta(seconds=(elapsed_seconds)))
    remaining = str(timedelta(seconds=int((progress / percent_complete * 100) - progress)))
    log(episode.episode_num, f'Transcribing ({percent_complete}%): {elapsed} elapsed. ETA: {remaining}', end='\r')

def maybe_create_folder(folder_path: str):
    # Check if the folder exists, and if not, create it
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f'-- Created folder {folder_path}')

def make_audio_file_path(episode_num: int):
    return f'{AUDIO_PATH}/{episode_num}.mp3'

def make_image_file_path(episode_num: int, image_url: str):
    file_extension = os.path.splitext(image_url)[1]
    # file extension includes dot at the beginning
    return f'{IMAGE_PATH}/{episode_num}{file_extension}'

def delete_audio(episode_num: int):
    try:
        os.remove(make_audio_file_path(episode_num))
        log(episode_num, 'Deleted: audio')
    except OSError as e:
        log(episode_num, f'Error deleting {e.filename}: {e.strerror}')

def is_episode(episode):
    return True if getattr(episode, 'itunes_episode', None) else False
