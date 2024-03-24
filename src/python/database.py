import sqlite3
from classes import Episode

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

def make_episode_row(episode: Episode, word_count: int):
    # "   7: Episode Title" -> "Episode Title"
    # "2361: Episode Title" -> "Episode Title"
    return (
        episode.episode_num, # episode
        episode.title, # title
        episode.audio, # audio
        episode.link, # link
        episode.image, # image
        episode.duration, # duration
        episode.description, # description
        episode.pub_date, # pubDate
        episode.guid, # guid
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

def select_episode(episode_num: int) -> tuple[int, int]:
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

def select_word_count(episode_num: int) -> int:
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

def delete_transcription(episode_num: int):
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

def insert_words(episode_num: int, words):
    cur = con.cursor()
    cur.executemany(f'INSERT INTO words VALUES (?, ?, ?, ?, {episode_num})', words)

def upsert_episode(episode: Episode, word_count: int):
    upsert_episode_sql = '''
        INSERT INTO
            episodes
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT
            (episode)
        DO UPDATE SET
            audio = excluded.audio,
            duration = excluded.duration,
            wordCount = excluded.wordCount
    '''
    episode_row = make_episode_row(episode, word_count)
    cur = con.cursor()
    cur.execute(upsert_episode_sql, episode_row)

def commit():
    con.commit()

def close():
    con.close()
