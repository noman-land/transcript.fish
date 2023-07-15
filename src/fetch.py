from pathlib import Path
import database
import feedparser
import urllib.request
import utils

def download_audio(episode):
    episode_num = utils.get_episode_num(episode)
    audio_url = utils.get_audio_url(episode)
    audio_path = utils.make_audio_file_path(episode_num)
    if Path(audio_path).exists():
        utils.log(episode_num, 'Already downloaded. Skipping.')
    else:
        utils.log(episode_num, f'Downloading at {audio_url}.')
        urllib.request.urlretrieve(audio_url, audio_path)

def get_rss_episodes():
    return feedparser.parse('https://audioboom.com/channels/2399216.rss').entries

def get_new_episodes():
    (last_episode_num, pub_date) = database.get_last_episode()
    date = utils.format_pub_date(pub_date)
    # Oldest first
    rss_eps = reversed(get_rss_episodes())
    new_eps = list(filter(lambda ep: utils.is_new_episode(ep, last_episode_num), rss_eps))
    print(f'-- Found {len(new_eps)} new episodes since Episode {last_episode_num} from {date}. Moving on to transcription.')
    return new_eps
