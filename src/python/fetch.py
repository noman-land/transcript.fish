from pathlib import Path
import feedparser
import urllib.request
import utils
from classes import RssEpisode

def download_audio(episode: RssEpisode):
    audio_path = utils.make_audio_file_path(episode.episode_num)
    if Path(audio_path).exists():
        utils.log(episode.episode_num, 'Already downloaded: audio')
    else:
        utils.create_folder(utils.AUDIO_PATH)
        utils.log(episode.episode_num, 'Downloading: audio')
        urllib.request.urlretrieve(episode.audio, audio_path)

opener = urllib.request.build_opener()
opener.addheaders = [(
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
)]

def download_image(episode: RssEpisode):
    image_path = utils.make_image_file_path(episode.episode_num, episode.image)
    if Path(image_path).exists():
        utils.log(episode.episode_num, 'Already downloaded: image')
    else:
        utils.create_folder(utils.IMAGE_PATH)
        utils.log(episode.episode_num, 'Downloading: image')
        urllib.request.install_opener(opener)
        urllib.request.urlretrieve(episode.image, image_path)

rss_feed_url = 'https://audioboom.com/channels/2399216.rss'

def get_rss_episodes(episode_num: int | None):
    episodes_only = filter(
        utils.is_episode,
        reversed(feedparser.parse(rss_feed_url)['entries'])
    )
    episodes = map(RssEpisode, episodes_only)
    if not episode_num:
        return episodes
    return filter(lambda e: e.episode_num == int(episode_num), episodes)
