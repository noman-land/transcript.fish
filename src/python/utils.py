from datetime import datetime
import os
from bs4 import BeautifulSoup

AUDIO_PATH = "audio"
IMAGE_PATH = "images/episodes"

def log(episode_num, *msg):
    print(f'-- {now()} [ Episode {episode_num} ]', *msg)

def now():
    return datetime.now().strftime('%H:%M:%S')

def create_folder(folder_path):
    # Check if the folder exists, and if not, create it
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f'-- {now()} Created folder {folder_path}')

def make_audio_file_path(episode_num):
    return f'{AUDIO_PATH}/{episode_num}.mp3'

def make_image_file_path(episode_num, image_url):
    file_extension = os.path.splitext(image_url)[1]
    # file extension includes dot at the beginning
    return f'{IMAGE_PATH}/{episode_num}{file_extension}'

def delete_audio(episode_num):
    make_audio_file_path(episode_num)
    try:
        os.remove(make_audio_file_path(episode_num))
        log(episode_num, "Deleted: audio")
    except OSError as e:
        log(episode_num, "Error deleting %s: %s" % (e.filename, e.strerror))

def get_episode_num(episode):
    return int(episode['itunes_episode'])

def is_episode(episode):
    return True if getattr(episode,'itunes_episode', None) else False

def is_audio(media):
    return media['medium'] == 'audio'

def get_audio_url(episode):
    audio, *_ = filter(is_audio, episode['media_content'])
    return audio['url']

def get_image_url(episode):
    return episode['image']['href']

def get_duration(episode):
    return int(episode['itunes_duration'])

def strip_html(htmlString):
    return BeautifulSoup(htmlString, 'html.parser').get_text()
