from datetime import datetime
import os

def log(episode_num, msg):
    print(f'-- {now()} -- Episode {episode_num} -- {msg}')

def now():
    return datetime.now().strftime('%H:%M:%S')

def make_audio_file_path(episode_num):
    return f'public/audio/{episode_num}.mp3'

def make_image_file_path(episode_num, image_url):
    file_extension = os.path.splitext(image_url)[1]
    # file extension includes dot at the beginning
    return f'public/images/episodes/{episode_num}{file_extension}'

def get_episode_num(episode):
    return int(episode['itunes_episode'])

def is_audio(media):
    return media['medium'] == 'audio'

def get_audio_url(episode):
    audio, *_ = filter(is_audio, episode['media_content'])
    return audio['url']

def get_image_url(episode):
    return episode['image']['href']
