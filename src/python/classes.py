import re
from bs4 import BeautifulSoup

class Episode:
    def __init__(self, episode):
        audio, *_ = filter(
            lambda media: media['medium'] == 'audio',
            episode['media_content']
        )
        self.episode_num = int(episode['itunes_episode'])
        self.title = re.sub(r'^\d{1,4}:\s', '', episode['title'])
        self.audio = str(audio['url'])
        self.link = str(episode['link'])
        self.image = str(episode['image']['href'])
        self.duration = int(episode['itunes_duration'])
        self.description = BeautifulSoup(getattr(episode, 'summary', ''), 'html.parser').get_text()
        self.pub_date: str = episode['published']
        self.guid: str = episode['id']
        self.presenter1 = None
        self.presenter2 = None
        self.presenter3 = None
        self.presenter4 = None
        self.presenter5 = None
        self.venue = None
        self.live = None
        self.compilation = None
        self.event = None
