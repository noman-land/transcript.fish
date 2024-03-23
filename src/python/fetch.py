from pathlib import Path
import feedparser
import urllib.request
import utils

def download_episode_audio(episode):
    episode_num = utils.get_episode_num(episode)
    audio_url = utils.get_audio_url(episode)
    audio_path = utils.make_audio_file_path(episode_num)
    if Path(audio_path).exists():
        utils.log(episode_num, 'Already downloaded: audio')
    else:
        utils.create_folder(utils.AUDIO_PATH)
        utils.log(episode_num, 'Downloading: audio')
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
        utils.log(episode_num, 'Already downloaded: image')
    else:
        utils.create_folder(utils.IMAGE_PATH)
        utils.log(episode_num, 'Downloading: image')
        urllib.request.install_opener(opener)
        urllib.request.urlretrieve(image_url, image_path)

def make_episode_filter(episode_num: int | None):
    if episode_num:
        def filter_fn(episode):
            return utils.is_episode(episode) and (utils.get_episode_num(episode) == int(episode_num))
    else:
        def filter_fn(episode):
            return utils.is_episode(episode)
    return filter_fn

rss_feed_url = 'https://audioboom.com/channels/2399216.rss'

def get_rss_episodes(episode_num: int | None):
    return filter(
        make_episode_filter(episode_num),
        reversed(feedparser.parse(rss_feed_url)['entries'])
    )
