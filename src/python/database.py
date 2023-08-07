import re
import sqlite3
import utils

con = sqlite3.connect('db/transcript.db')

def recreate_fts_table():
    cur = con.cursor()
    cur.execute('''
        DROP TABLE IF EXISTS words_fts;

        CREATE VIRTUAL TABLE words_fts USING FTS5 (episode, title, description, words);

        INSERT INTO
            words_fts (episode, title, description, words)
        SELECT
            words.episode,
            episodes.title,
            episodes.description,
            GROUP_CONCAT(words.word, "") AS words
        FROM
            words,
            episodes
        WHERE
            words.episode = episodes.episode
        GROUP BY
            words.episode;
    ''')
    con.commit()

def make_episode_row(episode, word_count):
    # "   7: Episode Title" -> "Episode Title"
    # "2361: Episode Title" -> "Episode Title"
    episode_title = re.sub(r'^\d{1,4}:\s', '', episode['title'])
    return (
        utils.get_episode_num(episode), # episode
        episode_title, # title
        utils.get_audio_url(episode), # audio
        episode['link'], # link
        utils.get_image_url(episode), # image
        int(episode['itunes_duration']), # duration
        episode['summary'], # description
        episode['published'], # pubDate
        episode['id'], # guid
        word_count, # wordCount 
    )

def select_word_count(episode_num):
    cur = con.cursor()
    result = cur.execute('SELECT COUNT(*) FROM words WHERE episode = ? GROUP BY episode', [episode_num]).fetchone()
    word_count = result[0] if result and result[0] > 0 else 0 
    return word_count

def insert_words(episode_num, words):
    cur = con.cursor()
    cur.executemany(f'INSERT INTO words VALUES (?, ?, ?, ?, {episode_num})', words)

def upsert_episode(episode, word_count):
    episode_row = make_episode_row(episode, word_count)
    cur = con.cursor()
    cur.execute('INSERT INTO episodes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (episode) DO UPDATE SET wordCount = excluded.wordCount', episode_row)

def vacuum():
    cur = con.cursor()
    cur.execute('VACUUM')
    con.commit()
    print('Database vacuumed.')

def commit():
    con.commit()

def close():
    con.close()
