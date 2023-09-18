from pathlib import Path
import feedparser
import urllib.request
import utils

def download_episode_audio(episode):
    episode_num = utils.get_episode_num(episode)
    audio_url = utils.get_audio_url(episode)
    audio_path = utils.make_audio_file_path(episode_num)
    if Path(audio_path).exists():
        utils.log(episode_num, 'Already complete: audio download')
    else:
        utils.log(episode_num, f'Downloading: audio - {audio_url}')
        urllib.request.urlretrieve(audio_url, audio_path)

opener = urllib.request.build_opener()
opener.addheaders = [(
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
)]

def download_episode_image(episode):
    episode_num = utils.get_episode_num(episode)
    image_url = utils.get_image_url(episode)
    image_path = utils.make_image_file_path(episode_num, image_url)
    if Path(image_path).exists():
        utils.log(episode_num, 'Already complete: image download')
    else:
        utils.log(episode_num, f'Downloading: image - {image_url}')
        urllib.request.install_opener(opener)
        urllib.request.urlretrieve(image_url, image_path)

rss_feed_url = 'https://audioboom.com/channels/2399216.rss'
def get_rss_episodes():
    return filter(lambda e: utils.is_episode(e), reversed(feedparser.parse(rss_feed_url)['entries']))
