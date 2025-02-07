import re
from bs4 import BeautifulSoup

class RssEpisode:
    def __init__(self, episode):
        audio, *_ = filter(
            lambda link: link['type'] == 'audio/mpeg',
            episode['links']
        )
        self.episode_num = int(episode['itunes_episode'])
        # Cut the numbers off the front of the title
        # "   7: Episode Title" -> "Episode Title"
        # "2361: Episode Title" -> "Episode Title"
        self.title = re.sub(r'^\d{1,4}:\s', '', episode['title'])
        self.audio = str(audio['href'])
        self.link = str(episode['link'])
        self.image = str(episode['image']['href'])
        self.duration = int(episode['itunes_duration'])
        self.description = BeautifulSoup(getattr(episode, 'summary', ''), 'html.parser').get_text()
        self.pub_date = str(episode['published'])
        self.guid = str(episode['id'])

class DbEpisode:
    def __init__(self, episode: tuple[int, int]):
        self.episode_num = episode[0]
        self.duration = episode[1]
