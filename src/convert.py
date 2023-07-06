from faster_whisper import WhisperModel
from pathlib import Path
import datetime
import feedparser
import glob
import json
import re
import sqlite3
import sys
import urllib.request

model = WhisperModel(
    model_size_or_path='base.en',
    compute_type='int8',
    local_files_only=True,
    num_workers=4,
    cpu_threads=8
)

def log(n):
    sys.stdout.write(json.dumps(n))

def now():
    return datetime.datetime.now().strftime('%H:%M:%S')

def download_file(url, path):
    if Path(path).exists():
        print(f'Already downloaded episode {path}. Skipping.')
    else:
        print(f'Downloading episode at {url}.')
        urllib.request.urlretrieve(url, path)

def get_rss_episodes():
    return feedparser.parse('https://audioboom.com/channels/2399216.rss')['entries']

def get_last_episode_num():
    cur = con.cursor()
    result = cur.execute('SELECT episode FROM episodes ORDER BY episode DESC LIMIT 1').fetchone()
    if result:
        return result[0]
    else:
        return 0
    
def is_new_episode(ep, last_episode_num):
    if hasattr(ep, 'itunes_episode'):
        return int(ep['itunes_episode']) > last_episode_num

def get_new_episodes():
    last_episode_num = get_last_episode_num()
    # Oldest first
    rss_eps = reversed(get_rss_episodes())
    new_eps = list(filter(lambda ep: is_new_episode(ep, last_episode_num), rss_eps))
    print(f'{len(new_eps)} new episodes since {last_episode_num}.')
    return new_eps

def is_audio(media):
    return media['medium'] == 'audio'

def get_audio_url(media_content):
    audio, *_ = filter(is_audio, media_content)
    return audio['url']

def make_episode_row(episode):
    episode_num = int(episode['itunes_episode'])
    # "7: Episode Title" -> "Episode Title"
    # "2361: Episode Title" -> "Episode Title"
    episode_title = re.sub(r'^\d{1,4}:\s', '', episode['title'])
    return (
        episode_num, # episode
        episode_title, # title
        get_audio_url(episode['media_content']), # audio
        episode['link'], # link
        episode['image']['href'], # image
        int(episode['itunes_duration']), # duration
        episode['summary'], # description
        episode['published'], # pubDate
        episode['id'], # guid
        f'audio/{episode_num}-{episode_title}.mp3', # path
        0, # wordCount
    )

def save_episodes(episodes):
    cur = con.cursor()
    for episode in episodes:
        episode_row = make_episode_row(episode)
        (episode_num, _, audio_url, *_, path, _) = episode_row
        download_file(audio_url, path)
        cur.execute('INSERT INTO episodes VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', episode_row)
        transcribe_file(episode_num)

def save_words(segments, episode_num):
    cur = con.cursor()
    for segment in segments:
        cur.executemany(f'INSERT INTO words VALUES(?, ?, ?, ?, {episode_num})', segment.words)

def transcribe_file(episode_num):
    print(f'Start of episode {episode_num} transcription: {now()}')
    
    filepath = glob.glob(f'audio/{episode_num}-*.mp3')[0]
    segments, _ = model.transcribe(filepath, word_timestamps=True)
    save_words(segments, episode_num)
    print(f'  End of episode {episode_num} transcription: {now()}')

con = sqlite3.connect('data/transcript.db')

save_episodes(get_new_episodes())

con.commit()
con.close()
