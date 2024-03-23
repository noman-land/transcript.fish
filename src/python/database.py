import re
import sqlite3
import utils

db_path = 'db/transcript.db'

con = sqlite3.connect(db_path)

def recreate_fts_table():
    cur = con.cursor()
    cur.execute('DROP TABLE IF EXISTS words_fts;')
    cur.execute('''
        CREATE VIRTUAL TABLE
            words_fts
        USING
            fts5 (episode, title, description, words);
    ''')
    cur.execute('''
        INSERT INTO
            words_fts (episode, title, description, words)
        SELECT
            w.episode,
            e.title,
            e.description,
            GROUP_CONCAT(w.word, "") AS words
        FROM
            words w,
            episodes e
        WHERE
            w.episode = e.episode
        GROUP BY
            w.episode;
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
        utils.get_duration(episode), # duration
        getattr(episode, 'summary', ''), # description
        episode['published'], # pubDate
        episode['id'], # guid
        word_count, # wordCount
        None, # presenter1
        None, # presenter2
        None, # presenter3
        None, # presenter4
        None, # presenter5
        None, # venue
        None, # live
        None, # compilation
        None # event
    )

def vacuum():
    cur = con.cursor()
    cur.execute('VACUUM;')
    cur = con.commit()

def select_episode(episode_num):
    select_word_count_sql = '''
        SELECT
            episode, duration
        FROM
            episodes
        WHERE
            episode = ?
    '''
    cur = con.cursor()
    return cur.execute(select_word_count_sql, [episode_num]).fetchone()

def select_word_count(episode_num):
    select_word_count_sql = '''
        SELECT
            COUNT(*)
        FROM
            words
        WHERE
            episode = ?
        GROUP BY
            episode
    '''
    cur = con.cursor()
    result = cur.execute(select_word_count_sql, [episode_num]).fetchone()
    word_count = result[0] if result and result[0] > 0 else 0
    return word_count

def delete_transcription(episode_num):
    delete_words_sql = '''
        DELETE FROM
            words
        WHERE
            episode = ?
    '''
    reset_word_count_sql = '''
        UPDATE
            episodes
        SET
            wordCount = 0
        WHERE
            episode = ?
    '''
    cur = con.cursor()
    cur.execute(delete_words_sql, [episode_num])
    cur.execute(reset_word_count_sql, [episode_num])

def insert_words(episode_num, words):
    cur = con.cursor()
    cur.executemany(f'INSERT INTO words VALUES (?, ?, ?, ?, {episode_num})', words)

def upsert_episode(episode, word_count):
    upsert_episode_sql = '''
        INSERT INTO
            episodes
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT
            (episode)
        DO UPDATE SET
            audio = excluded.audio
            duration = excluded.duration
            link = excluded.link
            pubDate = excluded.pubDate
            guid = excluded.guid
            wordCount = excluded.wordCount
    '''
    episode_row = make_episode_row(episode, word_count)
    cur = con.cursor()
    cur.execute(upsert_episode_sql, episode_row)

def commit():
    con.commit()

def close():
    con.close()
