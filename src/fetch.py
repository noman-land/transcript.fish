from pathlib import Path
import feedparser
import urllib.request
import utils

def download_episode_audio(episode):
    episode_num = utils.get_episode_num(episode)
    audio_url = utils.get_audio_url(episode)
    audio_path = utils.make_audio_file_path(episode_num)
    if Path(audio_path).exists():
        utils.log(episode_num, 'Already downloaded audio. Skipping.')
    else:
        utils.log(episode_num, f'Downloading audio at {audio_url}.')
        urllib.request.urlretrieve(audio_url, audio_path)

def download_episode_image(episode):
    episode_num = utils.get_episode_num(episode)
    image_url = utils.get_image_url(episode)
    image_path = utils.make_image_file_path(episode_num, image_url)
    if Path(image_path).exists():
        utils.log(episode_num, 'Already downloaded image. Skipping.')
    else:
        utils.log(episode_num, f'Downloading image at {image_url}.')
        urllib.request.urlretrieve(image_url, image_path)

def get_rss_episodes():
    return reversed(feedparser.parse('https://audioboom.com/channels/2399216.rss')['entries'])

